import { supabase } from "@/lib/db";
import { summarizeSupabaseError } from "@/lib/supabaseSafe";

type SupabaseErrorLike = {
  code?: string | null;
  message?: string | null;
} | null;

type ProductSlugAliasRow = {
  alias_slug?: string | null;
  canonical_slug?: string | null;
};

export type ProductSlugResolution<T> = {
  row: T | null;
  requestedSlug: string;
  canonicalSlug: string;
  resolvedViaAlias: boolean;
  aliasSlug: string | null;
};

function normalizeProductUrlKey(value: string): string {
  return String(value || "").trim().toLowerCase();
}

function isNoRowsError(error: SupabaseErrorLike): boolean {
  const code = String(error?.code || "");
  if (code === "PGRST116") return true;
  const msg = String(error?.message || "").toLowerCase();
  return msg.includes("no rows") || msg.includes("not found");
}

function isMissingAliasTableError(error: SupabaseErrorLike): boolean {
  const code = String(error?.code || "");
  if (code === "42P01") return true;
  const msg = String(error?.message || "").toLowerCase();
  if (msg.includes("schema cache") && msg.includes("product_slug_aliases")) return true;
  return msg.includes("relation") && msg.includes("product_slug_aliases") && msg.includes("does not exist");
}

async function fetchProductBySlug<T>(slug: string, selectClause: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("products")
    .select(selectClause)
    .eq("slug", slug)
    .single();

  if (error) {
    if (!isNoRowsError(error)) {
      console.error(`[slug-resolver] product lookup failed for "${slug}": ${summarizeSupabaseError(error)}`);
    }
    return null;
  }
  return (data as T) ?? null;
}

async function fetchAliasMapping(slug: string): Promise<ProductSlugAliasRow | null> {
  const { data, error } = await supabase
    .from("product_slug_aliases")
    .select("alias_slug, canonical_slug")
    .eq("alias_slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (isNoRowsError(error) || isMissingAliasTableError(error)) return null;
    console.error(`[slug-resolver] alias lookup failed for "${slug}": ${summarizeSupabaseError(error)}`);
    return null;
  }
  return (data as ProductSlugAliasRow) ?? null;
}

export async function resolveProductByUrlKey<T>(
  requestedUrlKey: string,
  selectClause = "*",
): Promise<ProductSlugResolution<T>> {
  const requestedSlug = normalizeProductUrlKey(requestedUrlKey);
  if (!requestedSlug) {
    return {
      row: null,
      requestedSlug: "",
      canonicalSlug: "",
      resolvedViaAlias: false,
      aliasSlug: null,
    };
  }

  // Alias-first so legacy rows can be overridden to the intended canonical slug.
  const aliasRow = await fetchAliasMapping(requestedSlug);
  const aliasCanonical = String(aliasRow?.canonical_slug || "").trim().toLowerCase();
  if (aliasCanonical && aliasCanonical !== requestedSlug) {
    const aliasedProduct = await fetchProductBySlug<T>(aliasCanonical, selectClause);
    if (aliasedProduct) {
      return {
        row: aliasedProduct,
        requestedSlug,
        canonicalSlug: aliasCanonical,
        resolvedViaAlias: true,
        aliasSlug: requestedSlug,
      };
    }
  }

  const directProduct = await fetchProductBySlug<T>(requestedSlug, selectClause);
  if (!directProduct) {
    return {
      row: null,
      requestedSlug,
      canonicalSlug: requestedSlug,
      resolvedViaAlias: false,
      aliasSlug: null,
    };
  }

  return {
    row: directProduct,
    requestedSlug,
    canonicalSlug: requestedSlug,
    resolvedViaAlias: false,
    aliasSlug: null,
  };
}
