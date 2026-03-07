import { supabase } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { ProductViewer } from "./ProductViewer";
import type { Metadata } from "next";
import { Suspense } from "react";
import type { Product, CompatProduct, ProductVariant } from "@/lib/getProducts";
import {
  classifyToRequestedCategory,
  normalizeRequestedCategoryId,
} from "@/lib/catalogCategories";
import { fetchWithSupabaseRetry } from "@/lib/supabaseSafe";
import { normalizeAssetList, normalizeAssetPath } from "@/lib/assetPaths";
import {
  fetchProductImagesMap,
  fetchProductSpecsMap,
} from "@/lib/productDataTables";
import { resolveProductByUrlKey } from "@/lib/productSlugResolver";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ourwebsitecopy2026-02-21.vercel.app");

type CategoryResolutionRow = {
  id?: string;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  category_id?: string | null;
  series_name?: string | null;
  metadata?: Product["metadata"] | null;
  images?: string[] | null;
  flagship_image?: string | null;
};

function resolveRequestedCategoryId(
  row: CategoryResolutionRow,
  fallbackCategoryId?: string,
): string {
  const rawCategoryId = row.category_id || fallbackCategoryId || "";
  const normalized = normalizeRequestedCategoryId(rawCategoryId);
  if (normalized) return normalized;

  return classifyToRequestedCategory({
    baseCategoryId: rawCategoryId,
    seriesName: row.series_name || "",
    product: {
      id: row.id || row.slug || rawCategoryId,
      slug: row.slug || "",
      name: row.name || "",
      description: row.description || "",
      flagshipImage: row.flagship_image || "",
      sceneImages: [],
      variants: [],
      detailedInfo: {
        overview: "",
        features: [],
        dimensions: "",
        materials: [],
      },
      metadata: row.metadata || {},
      images: Array.isArray(row.images) ? row.images : [],
    },
  });
}

export async function generateStaticParams() {
  const data = await fetchWithSupabaseRetry<CategoryResolutionRow[]>(
    "product-static-params",
    async () =>
      supabase
        .from("products")
        .select(
          "id, slug, category_id, name, description, metadata, series_name, images, flagship_image",
        ),
    [],
  );

  const seen = new Set<string>();
  const params: Array<{ category: string; product: string }> = [];
  for (const row of data ?? []) {
    if (!row.slug) continue;
    const category = resolveRequestedCategoryId(row);
    const key = `${category}::${row.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ category, product: row.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { category: categoryId, product: productUrlKey } = await params;

  const productResolution = await resolveProductByUrlKey<CategoryResolutionRow>(
    productUrlKey,
    "id, slug, name, description, category_id, metadata, series_name, images, flagship_image",
  );
  const product = productResolution.row;

  if (!product) return {};
  const resolvedCategoryId = resolveRequestedCategoryId(
    product as CategoryResolutionRow,
    categoryId,
  );

  const title = `${product.name} | One and Only Furniture`;
  const description =
    product.description ||
    `${product.name} — premium office furniture from One and Only Furniture.`;
  const images = Array.isArray(product.images) ? product.images : [];
  const image =
    normalizeAssetPath(images.length > 0 ? images[0] : null) ||
    normalizeAssetPath(product.flagship_image) ||
    "/images/fallback/category.webp";
  const canonicalProductUrlKey = productResolution.canonicalSlug || productUrlKey;
  const url = `${BASE_URL}/products/${resolvedCategoryId}/${canonicalProductUrlKey}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 800, height: 800, alt: product.name ?? "Product image" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function ProductLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-4xl px-6">
        <div className="h-96 bg-neutral-100 rounded" />
        <div className="h-8 bg-neutral-100 rounded w-1/3" />
        <div className="h-4 bg-neutral-100 rounded w-2/3" />
      </div>
    </div>
  );
}

async function ProductContent({
  categoryId,
  productUrlKey,
  fromQuery,
}: {
  categoryId: string;
  productUrlKey: string;
  fromQuery?: string;
}) {
  const productResolution = await resolveProductByUrlKey<Product>(productUrlKey, "*");
  const rawProduct = productResolution.row;
  const canonicalProductUrlKey = productResolution.canonicalSlug || productUrlKey;
  const needsSlugRedirect =
    productResolution.resolvedViaAlias && canonicalProductUrlKey !== productUrlKey;

  if (!rawProduct) {
    notFound();
  }

  const p = rawProduct as Product & {
    alt_text?: string;
    metadata?: (Product["metadata"] & { ai_alt_text?: string }) | null;
    scene_images?: string[] | null;
    detailed_info?: {
      overview?: string;
      features?: string[];
      dimensions?: string;
      materials?: string[];
    } | null;
    variants?: unknown;
  };
  const [specsMap, imagesMap] = await Promise.all([
    fetchProductSpecsMap([p.id]),
    fetchProductImagesMap([p.id]),
  ]);

  const tableSpecs = specsMap.get(p.id);
  const mergedSpecs =
    tableSpecs && Object.keys(tableSpecs).length > 0 ? tableSpecs : p.specs || {};
  const specsFeatures = Array.isArray((mergedSpecs as { features?: unknown }).features)
    ? ((mergedSpecs as { features?: unknown[] }).features ?? [])
        .map((value) => String(value).trim())
        .filter(Boolean)
    : [];
  const specsDimensions =
    typeof (mergedSpecs as { dimensions?: unknown }).dimensions === "string"
      ? String((mergedSpecs as { dimensions?: string }).dimensions).trim()
      : "";
  const specsMaterials = Array.isArray((mergedSpecs as { materials?: unknown }).materials)
    ? ((mergedSpecs as { materials?: unknown[] }).materials ?? [])
        .map((value) => String(value).trim())
        .filter(Boolean)
    : [];
  const imageBundle = imagesMap.get(p.id);
  const mergedFlagship =
    imageBundle?.flagshipImage || normalizeAssetPath(p.flagship_image);
  const mergedImages =
    imageBundle?.images && imageBundle.images.length > 0
      ? imageBundle.images
      : normalizeAssetList(p.images);
  const mergedSceneImages =
    imageBundle?.sceneImages && imageBundle.sceneImages.length > 0
      ? imageBundle.sceneImages
      : Array.isArray(p.scene_images)
        ? normalizeAssetList(p.scene_images)
        : [];

  const resolvedCategoryId = resolveRequestedCategoryId(
    p as CategoryResolutionRow,
    categoryId,
  );
  if (categoryId !== resolvedCategoryId || needsSlugRedirect) {
    const base = `/products/${resolvedCategoryId}/${canonicalProductUrlKey}`;
    redirect(fromQuery ? `${base}?${fromQuery}` : base);
  }
  const aiOverview = p.alt_text || p.metadata?.ai_alt_text || p.description || "";
  const deterministicAlt =
    p.alt_text ||
    p.metadata?.ai_alt_text ||
    `${p.name} ${resolvedCategoryId.replace(/-/g, " ")}`.replace(/\s+/g, " ").trim();
  const variantList: ProductVariant[] = Array.isArray(p.variants)
    ? p.variants
        .map((variant, idx) => {
          const v = variant as {
            id?: string;
            variantName?: string;
            galleryImages?: string[];
            threeDModelUrl?: string;
          };
          return {
            id: v.id || `variant-${idx + 1}`,
            variantName: v.variantName || `Option ${idx + 1}`,
            galleryImages: normalizeAssetList(v.galleryImages),
            threeDModelUrl: normalizeAssetPath(v.threeDModelUrl) || undefined,
          };
        })
        .filter((variant) => variant.galleryImages.length > 0 || variant.threeDModelUrl)
    : [];

  const compatProduct: CompatProduct = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description || "",
    flagshipImage: mergedFlagship,
    sceneImages: mergedSceneImages,
    images: mergedImages,
    threeDModelUrl: normalizeAssetPath(
      variantList.find((v) => v.threeDModelUrl)?.threeDModelUrl || p["3d_model"],
    ),
    variants: variantList,
    detailedInfo: {
      overview: p.detailed_info?.overview || aiOverview,
      features: p.detailed_info?.features?.filter(Boolean) ||
        (specsFeatures.length > 0 ? specsFeatures : undefined) ||
        p.features?.filter(Boolean) ||
        [],
      dimensions: p.detailed_info?.dimensions || specsDimensions || "",
      materials:
        p.detailed_info?.materials?.filter(Boolean) ||
        (specsMaterials.length > 0 ? specsMaterials : undefined) ||
        [],
    },
    metadata: p.metadata || {},
    altText: deterministicAlt,
    specs: mergedSpecs,
  };

  const categoryRoute = fromQuery
    ? `/products/${resolvedCategoryId}?${fromQuery}`
    : `/products/${resolvedCategoryId}`;

  const url = `${BASE_URL}/products/${resolvedCategoryId}/${canonicalProductUrlKey}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: aiOverview,
    image: mergedImages.length > 0 ? mergedImages : [mergedFlagship],
    url,
    brand: { "@type": "Brand", name: "One and Only Furniture" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      seller: { "@type": "Organization", name: "One and Only Furniture" },
    },
    category: resolvedCategoryId,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductViewer
        product={compatProduct}
        seriesName={p.series_name}
        categoryRoute={categoryRoute}
        categoryId={resolvedCategoryId}
      />
    </>
  );
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; product: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: categoryId, product: productUrlKey } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawFrom = resolvedSearchParams.from;
  const fromQuery = Array.isArray(rawFrom) ? rawFrom[0] : rawFrom;
  const safeFromQuery =
    typeof fromQuery === "string" && fromQuery.length > 0
      ? fromQuery.slice(0, 1500)
      : undefined;

  return (
    <Suspense fallback={<ProductLoadingSkeleton />}>
      <ProductContent
        categoryId={categoryId}
        productUrlKey={productUrlKey}
        fromQuery={safeFromQuery}
      />
    </Suspense>
  );
}
