from __future__ import annotations

import argparse
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
BACKUP_DIR = ROOT / "docs" / "migrations" / "backups"
OUT_DIR = ROOT / "docs" / "ops"


CATEGORY_SPEC_PROFILES: dict[str, dict[str, list[str]]] = {
    "seating": {
        "required": ["dimensions", "materials", "features"],
        "recommended": ["mechanism", "ergonomics", "warranty"],
    },
    "tables": {
        "required": ["dimensions", "materials", "features"],
        "recommended": ["top_finish", "base_type", "cable_management"],
    },
    "workstations": {
        "required": ["dimensions", "materials", "features"],
        "recommended": ["module_type", "wire_manager", "partition"],
    },
    "soft-seating": {
        "required": ["dimensions", "materials", "features"],
        "recommended": ["upholstery", "foam_density", "use_case"],
    },
    "storages": {
        "required": ["dimensions", "materials", "features"],
        "recommended": ["lock_type", "shelf_config", "load_rating"],
    },
    "education": {
        "required": ["dimensions", "materials", "features"],
        "recommended": ["stackable", "anti_skid", "edge_protection"],
    },
}


def parse_dotenv(filepath: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    if not filepath.exists():
        return env
    for raw in filepath.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        env[key] = value
    return env


def env_get(key: str, fallback: dict[str, str]) -> str:
    return os.environ.get(key, "").strip() or fallback.get(key, "").strip()


def api_get_json(url: str, service_key: str) -> Any:
    req = Request(
        url,
        headers={
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Accept": "application/json",
        },
    )
    with urlopen(req, timeout=30) as resp:
        payload = resp.read().decode("utf-8")
        return json.loads(payload)


def safe_obj(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def as_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(v).strip() for v in value if str(v).strip()]


def load_latest_backup_overrides() -> dict[str, dict[str, Any]]:
    if not BACKUP_DIR.exists():
        return {}

    by_slug: dict[str, dict[str, Any]] = {}
    for file in sorted(BACKUP_DIR.glob("*.json")):
        try:
            payload = json.loads(file.read_text(encoding="utf-8"))
        except Exception:
            continue

        created_at = str(payload.get("createdAt") or "")
        records = payload.get("records")
        if not isinstance(records, list):
            continue

        for rec in records:
            slug = str(rec.get("slug") or "").strip()
            if not slug:
                continue
            new_metadata = safe_obj(rec.get("newMetadata"))
            if not new_metadata:
                continue
            current = by_slug.get(slug)
            if current is None or created_at > current.get("createdAt", ""):
                by_slug[slug] = {
                    "sourceFile": file.name,
                    "createdAt": created_at,
                    "newMetadata": new_metadata,
                }
    return by_slug


def fetch_product_by_slug(base_url: str, service_key: str, slug: str) -> dict[str, Any] | None:
    encoded_slug = quote(slug, safe="")
    endpoint = (
        f"{base_url}/rest/v1/products"
        "?select=id,name,slug,category_id,metadata,specs,flagship_image,images,scene_images"
        f"&slug=eq.{encoded_slug}"
        "&limit=1"
    )
    try:
        data = api_get_json(endpoint, service_key)
    except (HTTPError, URLError, TimeoutError):
        return None
    if isinstance(data, list) and data:
        return data[0]
    return None


def build_specs_check(category_id: str, specs: dict[str, Any]) -> dict[str, Any]:
    profile = CATEGORY_SPEC_PROFILES.get(category_id.lower(), CATEGORY_SPEC_PROFILES["seating"])
    dimensions = str(specs.get("dimensions") or "").strip()
    materials = as_list(specs.get("materials"))
    features = as_list(specs.get("features"))

    checks = {
        "dimensions": bool(dimensions),
        "materials": len(materials) > 0,
        "features": len(features) > 0,
    }
    profile_pass = all(checks.get(k, False) for k in profile["required"])
    missing_required = [k for k in profile["required"] if not checks.get(k, False)]

    return {
        "requiredProfile": profile["required"],
        "recommendedProfile": profile["recommended"],
        "dimensionsValue": dimensions or None,
        "materialsCount": len(materials),
        "featuresCount": len(features),
        "missingRequired": missing_required,
        "profilePass": profile_pass,
    }


def metadata_diff(current: dict[str, Any], proposed: dict[str, Any]) -> dict[str, dict[str, Any]]:
    keys = ["category", "subcategory", "subcategory_slug", "bifmaCertified", "warrantyYears", "ai_alt_text"]
    diff: dict[str, dict[str, Any]] = {}
    for key in keys:
        left = current.get(key)
        right = proposed.get(key)
        if left != right:
            diff[key] = {"from": left, "to": right}
    return diff


def build_sql_preview(results: list[dict[str, Any]]) -> str:
    lines = [
        "-- DRY-RUN PREVIEW ONLY (do not execute blindly)",
        f"-- generated_at: {datetime.now().isoformat(timespec='seconds')}",
        "",
    ]
    for r in results:
        if not r["metadataDiff"]:
            continue
        slug = r["slug"].replace("'", "''")
        meta_json = json.dumps(r["proposedMetadata"], ensure_ascii=False).replace("'", "''")
        lines.append(
            "UPDATE products\n"
            f"SET metadata = '{meta_json}'::jsonb\n"
            f"WHERE slug = '{slug}';\n"
        )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Pilot reconcile (dry-run) using AFC backups + current Supabase rows")
    parser.add_argument(
        "--slugs",
        nargs="+",
        default=["oando-seating--fluid-x", "oando-tables--apex", "oando-workstations--adaptable"],
        help="Product slugs to evaluate",
    )
    args = parser.parse_args()

    env_file = parse_dotenv(ROOT / ".env.local")
    supabase_url = env_get("NEXT_PUBLIC_SUPABASE_URL", env_file)
    service_key = env_get("SUPABASE_SERVICE_ROLE_KEY", env_file) or env_get("NEXT_PUBLIC_SUPABASE_ANON_KEY", env_file)

    if not supabase_url or not service_key:
        raise SystemExit("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment/.env.local")

    overrides = load_latest_backup_overrides()
    results: list[dict[str, Any]] = []
    missing: list[str] = []

    for slug in args.slugs:
        row = fetch_product_by_slug(supabase_url, service_key, slug)
        if row is None:
            missing.append(slug)
            continue
        current_metadata = safe_obj(row.get("metadata"))
        current_specs = safe_obj(row.get("specs"))
        override = overrides.get(slug)
        proposed_metadata = {**current_metadata, **safe_obj(override.get("newMetadata") if override else {})}
        diff = metadata_diff(current_metadata, proposed_metadata)

        result = {
            "slug": slug,
            "name": row.get("name"),
            "category_id": row.get("category_id"),
            "overrideApplied": bool(override),
            "overrideSource": override.get("sourceFile") if override else None,
            "metadataDiff": diff,
            "currentMetadata": current_metadata,
            "proposedMetadata": proposed_metadata,
            "specsCheck": build_specs_check(str(row.get("category_id") or ""), current_specs),
            "mediaCheck": {
                "flagship_image": row.get("flagship_image"),
                "images_count": len(as_list(row.get("images"))),
                "scene_images_count": len(as_list(row.get("scene_images"))),
            },
        }
        results.append(result)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    out_json = OUT_DIR / f"pilot-reconcile-{stamp}.json"
    out_sql = OUT_DIR / f"pilot-reconcile-{stamp}.sql"
    out_md = OUT_DIR / f"pilot-reconcile-{stamp}.md"

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "mode": "dry-run",
        "slugs": args.slugs,
        "found": len(results),
        "missing": missing,
        "results": results,
    }
    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    out_sql.write_text(build_sql_preview(results), encoding="utf-8")

    md_lines = [
        "# Pilot Reconcile Report (Dry-Run)",
        "",
        f"- generated_at: `{payload['generatedAt']}`",
        f"- requested_slugs: `{len(args.slugs)}`",
        f"- found: `{len(results)}`",
        f"- missing: `{len(missing)}`",
        "",
        "## Missing Slugs",
    ]
    if missing:
        md_lines.extend([f"- `{m}`" for m in missing])
    else:
        md_lines.append("- none")
    md_lines.append("")
    md_lines.append("## Product Results")
    for item in results:
        md_lines.append(
            f"- `{item['slug']}` | category `{item['category_id']}` | "
            f"override `{item['overrideApplied']}` | profilePass `{item['specsCheck']['profilePass']}` | "
            f"metadataDiffKeys `{list(item['metadataDiff'].keys())}`"
        )
    out_md.write_text("\n".join(md_lines), encoding="utf-8")

    print(str(out_json))
    print(str(out_sql))
    print(str(out_md))


if __name__ == "__main__":
    main()
