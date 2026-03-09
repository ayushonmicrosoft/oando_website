import { getCatalog } from "@/lib/getProducts";
import type { CompatCategory } from "@/lib/getProducts";
import { notFound, redirect } from "next/navigation";
import { Hero } from "@/components/home/Hero";
import { FilterGrid } from "./FilterGrid";
import { supabase } from "@/lib/db";
import { fetchWithSupabaseRetry } from "@/lib/supabaseSafe";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Catalog_CATEGORY_ORDER,
  buildRequestedCategoryCatalog,
  getCatalogCategoryDescription,
  getCatalogCategoryLabel,
  normalizeRequestedCategoryId,
} from "@/lib/catalogCategories";
import { SITE_URL } from "@/lib/siteUrl";

const BASE_URL = SITE_URL;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryId } = await params;
  const canonicalCategoryId = normalizeRequestedCategoryId(categoryId) || categoryId;
  const requestedCatalog = buildRequestedCategoryCatalog(await getCatalog());
  const category = requestedCatalog.find(
    (c: CompatCategory) => c.id === canonicalCategoryId,
  );
  if (!category) return {};
  const displayName = getCatalogCategoryLabel(canonicalCategoryId, category.name);
  const displayDescription = getCatalogCategoryDescription(
    canonicalCategoryId,
    category.description,
  );
  const title = `${displayName} | One and Only Furniture`;
  const description = `${displayDescription} Browse our full range of ${displayName.toLowerCase()} in Patna, Bihar.`;
  const url = `${BASE_URL}/products/${canonicalCategoryId}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export async function generateStaticParams() {
  const data = await fetchWithSupabaseRetry<Array<{ category_id: string | null }>>(
    "category-static-params",
    async () => supabase.from("products").select("category_id"),
    [],
  );
  const categoryIds = [
    ...new Set(
      (data ?? [])
        .map((p) => (p.category_id ? normalizeRequestedCategoryId(p.category_id) : null))
        .filter(Boolean),
    ),
  ] as string[];
  const merged = [...new Set([...Catalog_CATEGORY_ORDER, ...categoryIds])];
  return merged.map((category) => ({ category }));
}

// Loading skeleton for the grid while Supabase data resolves
function GridSkeleton() {
  return (
    <div className="container-wide py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-neutral-100 rounded-sm aspect-4/3"
          />
        ))}
      </div>
    </div>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryId } = await params;
  const canonicalCategoryId = normalizeRequestedCategoryId(categoryId);
  if (!canonicalCategoryId) {
    notFound();
  }
  if (canonicalCategoryId !== categoryId) {
    redirect(`/products/${canonicalCategoryId}`);
  }
  const requestedCatalog = buildRequestedCategoryCatalog(await getCatalog());
  const category = requestedCatalog.find(
    (c: CompatCategory) => c.id === canonicalCategoryId,
  );

  if (requestedCatalog.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
        <h1 className="text-2xl font-light mb-4 text-neutral-900">
          Products temporarily unavailable
        </h1>
        <p className="max-w-md text-neutral-500 mb-8">
          We&apos;re refreshing our catalog. Please try again in a moment.
        </p>
      </div>
    );
  }

  if (!category) {
    notFound();
  }
  const normalizedCategory: CompatCategory = {
    ...category,
    name: getCatalogCategoryLabel(canonicalCategoryId, category.name),
    description: getCatalogCategoryDescription(canonicalCategoryId, category.description),
  };

  const firstProductWithImage = normalizedCategory.series
    .flatMap((series) => series.products)
    .find((product) => product.images?.[0] || product.flagshipImage);
  const heroImage =
    firstProductWithImage?.images?.[0] ||
    firstProductWithImage?.flagshipImage ||
    "/images/hero/hero-1.webp";

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={normalizedCategory.name}
        subtitle={normalizedCategory.description}
        showButton={false}
        backgroundImage={heroImage}
      />
      <Suspense fallback={<GridSkeleton />}>
        <FilterGrid category={normalizedCategory} categoryId={canonicalCategoryId} />
      </Suspense>
    </div>
  );
}

