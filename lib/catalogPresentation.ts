import type { CompatProduct } from "@/lib/getProducts";
import { sanitizeDisplayText } from "@/lib/displayText";
import { normalizeOptionValue } from "@/lib/productFilters";

type CatalogLikeProduct = Pick<
  CompatProduct,
  "slug" | "name" | "images" | "flagshipImage" | "metadata"
>;

export function buildCatalogAltText(
  product: CompatProduct,
  categoryLabel: string,
  explicitAlt?: string,
): string {
  const metadata = (product.metadata || {}) as Record<string, unknown>;
  const aiAltText =
    (typeof metadata.ai_alt_text === "string" && metadata.ai_alt_text) ||
    (typeof metadata.aiAltText === "string" && metadata.aiAltText) ||
    "";
  const fallback = `${product.name} ${categoryLabel}`.replace(/\s+/g, " ").trim();
  return sanitizeDisplayText(explicitAlt || aiAltText || fallback).slice(0, 140);
}

export function getCatalogPrimaryImage(
  product: Pick<CatalogLikeProduct, "images" | "flagshipImage">,
): string {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return String(product.images[0] || "").trim();
  }
  return String(product.flagshipImage || "").trim();
}

function dedupePriority(product: CatalogLikeProduct): number {
  const slug = String(product.slug || "").trim();
  let score = 0;
  if (slug.startsWith("oando-")) score += 4;
  if (slug.includes("--")) score += 2;
  if (product.metadata?.source === "oando.co.in") score += 1;
  return score;
}

function dedupeKey(product: CatalogLikeProduct): string {
  const normalizedName = normalizeOptionValue(product.name);
  const normalizedSubcategory = normalizeOptionValue(product.metadata?.subcategory || "");
  const normalizedImage = normalizeOptionValue(getCatalogPrimaryImage(product));
  return `${normalizedName}|${normalizedSubcategory}|${normalizedImage}`;
}

export function dedupeCatalogProducts<T extends CatalogLikeProduct>(products: T[]): T[] {
  const bestByKey = new Map<string, T>();

  for (const product of products) {
    const key = dedupeKey(product);
    const existing = bestByKey.get(key);
    if (!existing || dedupePriority(product) > dedupePriority(existing)) {
      bestByKey.set(key, product);
    }
  }

  return Array.from(bestByKey.values());
}

export function uniqueSortedTextValues(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));
}
