import Image from "next/image";
import Link from "next/link";
import { getProductByUrlKey, type Product } from "@/lib/getProducts";
import {
  getCatalogCategoryLabel,
  normalizeRequestedCategoryId,
} from "@/lib/catalogCategories";

type CompareItem = {
  productUrlKey: string;
  product: Product;
  categoryId: string;
};

function toText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function toList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function parseItemKeys(rawItems: string | string[] | undefined): string[] {
  const joined = Array.isArray(rawItems) ? rawItems.join(",") : rawItems || "";
  return Array.from(
    new Set(
      joined
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, 4);
}

function resolveCategoryId(product: Product): string {
  return normalizeRequestedCategoryId(product.category_id) || "products";
}

function specValue(item: CompareItem, key: string): string {
  const metadata =
    item.product.metadata && typeof item.product.metadata === "object"
      ? (item.product.metadata as Record<string, unknown>)
      : {};
  const specs =
    item.product.specs && typeof item.product.specs === "object" && !Array.isArray(item.product.specs)
      ? (item.product.specs as Record<string, unknown>)
      : {};

  if (key === "category") {
    return getCatalogCategoryLabel(item.categoryId, item.categoryId);
  }
  if (key === "series") {
    return item.product.series_name || "Standard series";
  }
  if (key === "dimensions") {
    return (
      toText(specs.dimensions) ||
      toText(specs.dimension) ||
      "Dimensions available on request"
    );
  }
  if (key === "materials") {
    const specMaterials = toList(specs.materials);
    const metadataMaterials = Array.isArray(metadata.material)
      ? metadata.material.map((m) => String(m))
      : [];
    const materials = specMaterials.length > 0 ? specMaterials : metadataMaterials;
    return materials.length > 0 ? materials.slice(0, 3).join(", ") : "Material options available";
  }
  if (key === "warranty") {
    const warrantyYears =
      typeof metadata.warrantyYears === "number" ? metadata.warrantyYears : null;
    return warrantyYears ? `${warrantyYears}-Year warranty` : "Warranty by model";
  }
  if (key === "certification") {
    return metadata.bifmaCertified ? "BIFMA certified" : "Certification by model";
  }
  if (key === "sustainability") {
    const score =
      typeof metadata.sustainabilityScore === "number"
        ? metadata.sustainabilityScore
        : typeof specs.sustainability_score === "number"
          ? specs.sustainability_score
          : null;
    return typeof score === "number" ? `Eco score ${score}/10` : "Sustainability data on request";
  }
  if (key === "features") {
    const features = toList(specs.features);
    return features.length > 0 ? features.slice(0, 3).join(", ") : "Feature details on request";
  }
  return "-";
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const keys = parseItemKeys(resolvedSearchParams.items);

  const items = (
    await Promise.all(
      keys.map(async (key) => {
        const product = await getProductByUrlKey(key);
        if (!product) return null;
        const categoryId = resolveCategoryId(product);
        return { productUrlKey: key, product, categoryId } satisfies CompareItem;
      }),
    )
  ).filter((item): item is CompareItem => Boolean(item));

  const compareRows = [
    { key: "category", label: "Category" },
    { key: "series", label: "Series" },
    { key: "dimensions", label: "Dimensions" },
    { key: "materials", label: "Materials" },
    { key: "warranty", label: "Warranty" },
    { key: "certification", label: "Certification" },
    { key: "sustainability", label: "Sustainability" },
    { key: "features", label: "Key features" },
  ] as const;

  return (
    <section className="min-h-screen bg-white pt-24">
      <div className="container px-6 py-14 2xl:px-0">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="typ-label mb-3 text-neutral-700">Product comparison</p>
            <h1 className="typ-section text-neutral-950">Compare workstation and storage options</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/planning" className="btn-outline">
              Open workspace planner
            </Link>
            <Link href="/contact" className="btn-primary">
              Request quote
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-8">
            <p className="text-lg text-neutral-800">
              No products selected yet. Add products to compare from category listings or product pages.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/products/workstations" className="btn-outline">
                Browse workstations
              </Link>
              <Link href="/products/storages" className="btn-outline">
                Browse storages
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-300">
            <table className="min-w-[760px] w-full border-collapse bg-white">
              <thead>
                <tr>
                  <th className="w-56 border-b border-neutral-300 bg-neutral-50 px-4 py-4 text-left text-sm font-semibold text-neutral-800">
                    Specification
                  </th>
                  {items.map((item) => {
                    const image =
                      item.product.images?.[0] ||
                      item.product.flagship_image ||
                      "/images/fallback/category.webp";
                    const productHref = `/products/${item.categoryId}/${item.product.slug}`;
                    return (
                      <th
                        key={item.product.id}
                        className="border-b border-l border-neutral-300 px-4 py-4 text-left align-top"
                      >
                        <Link href={productHref} className="block">
                          <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-md border border-neutral-300 bg-neutral-50">
                            <Image
                              src={image}
                              alt={item.product.name}
                              fill
                              sizes="(max-width: 1024px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold text-neutral-950">{item.product.name}</p>
                        </Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.key}>
                    <td className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800">
                      {row.label}
                    </td>
                    {items.map((item) => (
                      <td
                        key={`${item.product.id}-${row.key}`}
                        className="border-l border-t border-neutral-200 px-4 py-3 text-sm text-neutral-800"
                      >
                        {specValue(item, row.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
