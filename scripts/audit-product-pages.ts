import { config } from "dotenv";
import { resolve } from "path";
import { mkdirSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  flagship_image?: string | null;
  images?: Array<string | null | undefined> | null;
};

type PageAuditResult = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  pageUrl: string;
  pageStatus: number;
  hasNameInPage: boolean;
  hasDimensionsLabel: boolean;
  hasMaterialsLabel: boolean;
  imageChecks: Array<{ url: string; status: number }>;
  issues: string[];
};

const BASE_URL = process.env.AUDIT_BASE_URL?.trim() || "http://localhost:3000";
const CONCURRENCY = 8;

function normalizeAssetPath(path: string | null | undefined): string {
  if (!path) return "";
  let normalized = String(path).trim();
  if (!normalized) return "";
  if (normalized.includes("/images/afc/")) {
    normalized = normalized.replace("/images/afc/", "/images/catalog/");
  }
  if (normalized.includes("/products/afc/")) {
    normalized = normalized.replace("/products/afc/", "/products/catalog/");
  }
  return normalized;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function buildImageCandidates(row: ProductRow): string[] {
  const source = [
    normalizeAssetPath(row.flagship_image),
    ...(Array.isArray(row.images) ? row.images.map((value) => normalizeAssetPath(value ?? "")) : []),
  ]
    .map((value) => value.trim())
    .filter(Boolean);
  return unique(source).slice(0, 4);
}

function includesIgnoreCase(text: string, needle: string): boolean {
  return text.toLowerCase().includes(needle.toLowerCase());
}

async function fetchStatus(url: string): Promise<number> {
  try {
    const response = await fetch(url, { method: "GET", redirect: "manual", cache: "no-store" });
    return response.status;
  } catch {
    return 0;
  }
}

async function auditProductPage(row: ProductRow): Promise<PageAuditResult> {
  const encodedCategory = encodeURIComponent(row.category_id);
  const encodedSlug = encodeURIComponent(row.slug);
  const pageUrl = `${BASE_URL}/products/${encodedCategory}/${encodedSlug}/`;
  const issues: string[] = [];

  let pageStatus = 0;
  let html = "";
  try {
    const response = await fetch(pageUrl, { method: "GET", redirect: "follow", cache: "no-store" });
    pageStatus = response.status;
    html = await response.text();
  } catch {
    pageStatus = 0;
  }

  if (pageStatus !== 200) {
    issues.push(`page_status_${pageStatus || "unreachable"}`);
  }

  const hasNameInPage = html.length > 0 && includesIgnoreCase(html, row.name);
  if (!hasNameInPage) {
    issues.push("name_not_found_in_html");
  }

  const hasDimensionsLabel = includesIgnoreCase(html, "Dimensions");
  if (!hasDimensionsLabel) {
    issues.push("dimensions_label_missing");
  }

  const hasMaterialsLabel =
    includesIgnoreCase(html, "Materials") || includesIgnoreCase(html, "Material");
  if (!hasMaterialsLabel) {
    issues.push("materials_label_missing");
  }

  const imageCandidates = buildImageCandidates(row).filter((value) => value.startsWith("/"));
  if (imageCandidates.length === 0) {
    issues.push("no_image_candidates");
  }

  const imageChecks: Array<{ url: string; status: number }> = [];
  for (const path of imageCandidates) {
    const status = await fetchStatus(`${BASE_URL}${path}`);
    imageChecks.push({ url: path, status });
  }

  if (imageChecks.length > 0 && imageChecks.every((entry) => entry.status < 200 || entry.status >= 400)) {
    issues.push("all_image_candidates_broken");
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categoryId: row.category_id,
    pageUrl,
    pageStatus,
    hasNameInPage,
    hasDimensionsLabel,
    hasMaterialsLabel,
    imageChecks,
    issues,
  };
}

async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function runWorker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current]);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => runWorker()));
  return results;
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRole) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,category_id,flagship_image,images")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  const rows = (data || []) as ProductRow[];
  const validRows = rows.filter((row) => row.slug && row.category_id);

  const results = await runWithConcurrency(validRows, auditProductPage, CONCURRENCY);

  const failures = results.filter((result) => result.issues.length > 0);
  const issueCounts = new Map<string, number>();
  for (const result of failures) {
    for (const issue of result.issues) {
      issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
    }
  }

  const summary = {
    auditedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalProducts: validRows.length,
    passed: results.length - failures.length,
    failed: failures.length,
    issueCounts: Array.from(issueCounts.entries())
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count),
  };

  const report = {
    summary,
    failures,
  };

  mkdirSync(resolve(process.cwd(), "docs", "audit"), { recursive: true });
  writeFileSync(
    resolve(process.cwd(), "docs", "audit", "product-page-audit-report.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  const markdown = [
    "# Product Page Audit Report",
    "",
    `- Audited at: ${summary.auditedAt}`,
    `- Base URL: ${summary.baseUrl}`,
    `- Total products: ${summary.totalProducts}`,
    `- Passed: ${summary.passed}`,
    `- Failed: ${summary.failed}`,
    "",
    "## Issue counts",
    ...summary.issueCounts.map((entry) => `- ${entry.issue}: ${entry.count}`),
    "",
    "## Failed pages (first 50)",
    ...failures.slice(0, 50).map((entry) => `- ${entry.categoryId}/${entry.slug}: ${entry.issues.join(", ")}`),
    "",
  ].join("\n");

  writeFileSync(
    resolve(process.cwd(), "docs", "audit", "product-page-audit-report.md"),
    markdown,
    "utf8",
  );

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
