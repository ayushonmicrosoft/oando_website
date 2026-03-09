from __future__ import annotations

import json
import os
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "ops"


def parse_dotenv(filepath: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    if not filepath.exists():
        return env
    for raw in filepath.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def env_get(key: str, fallback: dict[str, str]) -> str:
    return os.environ.get(key, "").strip() or fallback.get(key, "").strip()


def normalize_name(value: str) -> str:
    lowered = "".join(ch.lower() if ch.isalnum() else "-" for ch in value.strip())
    normalized = "-".join(part for part in lowered.split("-") if part)
    return normalized


def to_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    return []


def score_product(row: dict[str, Any]) -> int:
    slug = str(row.get("slug") or "")
    metadata = row.get("metadata") if isinstance(row.get("metadata"), dict) else {}
    images = to_list(row.get("images"))
    flagship = str(row.get("flagship_image") or "").strip()

    score = 0
    if slug.startswith("oando-"):
        score += 30
    if "--" in slug:
        score += 10
    if metadata.get("source") == "oando.co.in":
        score += 5
    if flagship:
        score += 10
    if images:
        score += 10
    score += min(len(slug), 40) // 4
    return score


def sql_quote(value: str) -> str:
    return value.replace("'", "''")


def main() -> None:
    env_file = parse_dotenv(ROOT / ".env.local")
    supabase_url = env_get("NEXT_PUBLIC_SUPABASE_URL", env_file)
    service_key = env_get("SUPABASE_SERVICE_ROLE_KEY", env_file) or env_get("NEXT_PUBLIC_SUPABASE_ANON_KEY", env_file)
    if not supabase_url or not service_key:
        raise SystemExit("Missing Supabase credentials in .env.local")

    endpoint = (
        f"{supabase_url}/rest/v1/products"
        "?select=id,name,slug,category_id,metadata,flagship_image,images"
        "&order=category_id.asc,name.asc"
    )
    req = Request(
        endpoint,
        headers={
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Accept": "application/json",
        },
    )
    with urlopen(req, timeout=60) as resp:
        rows = json.loads(resp.read().decode("utf-8"))

    grouped: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        category_id = str(row.get("category_id") or "").strip()
        name_key = normalize_name(str(row.get("name") or ""))
        if not category_id or not name_key:
            continue
        grouped[(category_id, name_key)].append(row)

    duplicate_groups: list[dict[str, Any]] = []
    auto_aliases: list[dict[str, str]] = []
    review_only: list[dict[str, str]] = []

    for (category_id, name_key), items in grouped.items():
        if len(items) < 2:
            continue

        ranked = sorted(items, key=score_product, reverse=True)
        canonical = ranked[0]
        canonical_slug = str(canonical.get("slug") or "").strip()
        canonical_subcategory = str((canonical.get("metadata") or {}).get("subcategory") or "").strip().lower()
        canonical_images = len(to_list(canonical.get("images"))) + (1 if str(canonical.get("flagship_image") or "").strip() else 0)

        members = []
        for row in ranked:
            slug = str(row.get("slug") or "").strip()
            subcategory = str((row.get("metadata") or {}).get("subcategory") or "").strip()
            image_count = len(to_list(row.get("images"))) + (1 if str(row.get("flagship_image") or "").strip() else 0)
            members.append(
                {
                    "slug": slug,
                    "name": row.get("name"),
                    "subcategory": subcategory,
                    "imageCount": image_count,
                    "score": score_product(row),
                }
            )

            if slug == canonical_slug:
                continue

            # Conservative auto-alias rule:
            # 1) canonical is oando-prefixed
            # 2) alias slug is legacy/non-oando
            # 3) same subcategory
            # 4) canonical has materially higher confidence score
            same_subcategory = canonical_subcategory == subcategory.strip().lower()
            alias_looks_legacy = not slug.startswith("oando-")
            canonical_looks_new = canonical_slug.startswith("oando-")
            score_gap = score_product(canonical) - score_product(row)

            if canonical_looks_new and alias_looks_legacy and same_subcategory and score_gap >= 15 and canonical_images > 0:
                auto_aliases.append(
                    {
                        "alias_slug": slug,
                        "canonical_slug": canonical_slug,
                        "reason": "auto-detected: duplicate name/subcategory with stronger canonical confidence",
                    }
                )
            else:
                review_only.append(
                    {
                        "category_id": category_id,
                        "name_key": name_key,
                        "candidate_slug": slug,
                        "suggested_canonical_slug": canonical_slug,
                    }
                )

        duplicate_groups.append(
            {
                "category_id": category_id,
                "name_key": name_key,
                "canonical_slug": canonical_slug,
                "members": members,
            }
        )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    out_json = OUT_DIR / f"slug-alias-plan-{stamp}.json"
    out_sql = OUT_DIR / f"slug-alias-plan-{stamp}.sql"
    out_md = OUT_DIR / f"slug-alias-plan-{stamp}.md"

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "totalProducts": len(rows),
        "duplicateGroups": duplicate_groups,
        "autoAliasCount": len(auto_aliases),
        "autoAliases": auto_aliases,
        "reviewOnlyCount": len(review_only),
        "reviewOnly": review_only,
    }
    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    sql_lines = [
        "-- Slug alias plan (review before execution)",
        f"-- generated_at: {payload['generatedAt']}",
        "",
    ]
    if not auto_aliases:
        sql_lines.append("-- No safe auto-alias candidates found.")
    else:
        for row in auto_aliases:
            alias_slug = sql_quote(row["alias_slug"])
            canonical_slug = sql_quote(row["canonical_slug"])
            reason = sql_quote(row["reason"])
            sql_lines.append(
                "insert into public.product_slug_aliases (alias_slug, canonical_slug, reason, is_active)\n"
                f"values ('{alias_slug}', '{canonical_slug}', '{reason}', true)\n"
                "on conflict (alias_slug) where is_active\n"
                "do update set canonical_slug = excluded.canonical_slug, reason = excluded.reason, updated_at = now();\n"
            )
    out_sql.write_text("\n".join(sql_lines), encoding="utf-8")

    md_lines = [
        "# Slug Alias Plan",
        "",
        f"- generated_at: `{payload['generatedAt']}`",
        f"- total_products: `{len(rows)}`",
        f"- duplicate_groups: `{len(duplicate_groups)}`",
        f"- auto_aliases: `{len(auto_aliases)}`",
        f"- review_only: `{len(review_only)}`",
        "",
        "## Auto Alias Candidates",
    ]
    if auto_aliases:
        for row in auto_aliases:
            md_lines.append(f"- `{row['alias_slug']}` -> `{row['canonical_slug']}` ({row['reason']})")
    else:
        md_lines.append("- none")
    md_lines.append("")
    md_lines.append("## Review Required")
    if review_only:
        for row in review_only[:50]:
            md_lines.append(
                f"- `{row['category_id']}` `{row['name_key']}`: `{row['candidate_slug']}` -> `{row['suggested_canonical_slug']}`"
            )
        if len(review_only) > 50:
            md_lines.append(f"- ... and {len(review_only) - 50} more")
    else:
        md_lines.append("- none")
    out_md.write_text("\n".join(md_lines), encoding="utf-8")

    print(out_json)
    print(out_sql)
    print(out_md)


if __name__ == "__main__":
    main()
