"use client";

import type {
  CompatCategory as Category,
  CompatProduct as Product,
} from "@/lib/getProducts";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search as SearchIcon,
  X,
  SlidersHorizontal,
  Filter,
  ShoppingCart,
  GitCompareArrows,
} from "lucide-react";
import {
  useState,
  useMemo,
  useCallback,
  Suspense,
  useEffect,
  useRef,
} from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useQuoteCart } from "@/lib/store/quoteCart";
import { useProductCompare } from "@/lib/store/productCompare";
import { CompareDock } from "@/components/products/CompareDock";
import {
  buildFilterParams,
  buildFilterUrl,
  countActiveFilters,
  parseFiltersFromSearchParams,
  type ActiveFilters,
  type SortOption,
} from "@/lib/productFilters";
import {
  buildCatalogAltText,
  dedupeCatalogProducts,
  getCatalogPrimaryImage,
  uniqueSortedTextValues,
} from "@/lib/catalogPresentation";
import { sanitizeDisplayText } from "@/lib/displayText";
import { CATEGORY_ROUTE_COPY } from "@/data/site/routeCopy";
import { ActiveFilterChips, FilterSidebar, type FilterSidebarOptions } from "@/components/products/filter/FilterSidebar";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface FlatProduct extends Product {
  seriesId: string;
  seriesName: string;
  altText?: string;
}

const IMAGE_PLACEHOLDER_PATTERNS = [
  /assets_placeholder/i,
  /fallback\/category\.webp$/i,
  /\.svg$/i,
];

function isUsableImagePath(path: string): boolean {
  const value = path.trim();
  if (!value) return false;
  if (IMAGE_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value))) {
    return false;
  }
  return true;
}

function buildImageCandidates(product: Pick<FlatProduct, "images" | "flagshipImage">): string[] {
  const raw = [
    getCatalogPrimaryImage(product),
    ...(Array.isArray(product.images) ? product.images.map((image) => String(image || "").trim()) : []),
  ].filter(Boolean);

  const unique = Array.from(new Set(raw));
  const preferred = unique.filter(isUsableImagePath);
  return preferred.length > 0 ? preferred : unique;
}

function toTextList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean);
}

function toInlineSpec(value: string, max = 72): string {
  const normalized = sanitizeDisplayText(value);
  if (!normalized) return "";
  return normalized.length > max ? `${normalized.slice(0, max)}...` : normalized;
}

function getDisplayDimensions(product: FlatProduct): string {
  const detailed = typeof product.detailedInfo?.dimensions === "string"
    ? product.detailedInfo.dimensions
    : "";
  if (detailed.trim()) return toInlineSpec(detailed, 68);

  const specs = product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
    ? (product.specs as Record<string, unknown>)
    : {};
  return toInlineSpec(typeof specs.dimensions === "string" ? specs.dimensions : "", 68);
}

function getDisplayMaterials(product: FlatProduct): string {
  const detailed = toTextList(product.detailedInfo?.materials);
  if (detailed.length > 0) return toInlineSpec(detailed.slice(0, 2).join(", "), 68);

  const specs = product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
    ? (product.specs as Record<string, unknown>)
    : {};
  const fallback = toTextList(specs.materials);
  return toInlineSpec(fallback.slice(0, 2).join(", "), 68);
}

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface FilterResponse {
  products: FlatProduct[];
  total: number;
  facets: {
    series: string[];
    subcategory: string[];
    material: string[];
    priceRange: string[];
    ecoMin: { min: number; max: number };
    featureAvailability: {
      hasHeadrest: boolean;
      isHeightAdjustable: boolean;
      bifmaCertified: boolean;
      isStackable: boolean;
    };
  };
  meta: {
    categoryId: string;
    catalogTotal: number;
  };
}

function fallbackAltText(productName: string, categoryName: string): string {
  return sanitizeDisplayText(`${productName} ${categoryName}`).slice(0, 140);
}

function getProductRouteKey(product: Pick<FlatProduct, "slug" | "id">): string {
  const slugValue = typeof product.slug === "string" ? product.slug.trim() : "";
  if (slugValue) return slugValue;
  const idValue = typeof product.id === "string" ? product.id.trim() : "";
  return idValue;
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function flattenCategoryProducts(category: Category): FlatProduct[] {
  const flattened = category.series.flatMap((series) =>
    series.products.map((product) => ({
      ...product,
      seriesId: series.id,
      seriesName: series.name,
      altText: buildCatalogAltText(
        product,
        category.name,
        (product as unknown as { altText?: string; alt_text?: string }).altText ||
          (product as unknown as { altText?: string; alt_text?: string }).alt_text,
      ) || fallbackAltText(product.name, category.name),
    })),
  );
  return dedupeCatalogProducts(flattened);
}

function buildFallbackFacets(
  categoryId: string,
  products: FlatProduct[],
): FilterResponse["facets"] {
  const ecoScores = products
    .map((product) => product.metadata?.sustainabilityScore)
    .filter((score): score is number => typeof score === "number");
  const total = products.length;
  const hasHeadrestCount = products.filter((product) => product.metadata?.hasHeadrest).length;
  const heightAdjCount = products.filter(
    (product) => product.metadata?.isHeightAdjustable,
  ).length;
  const bifmaCount = products.filter((product) => product.metadata?.bifmaCertified).length;
  const stackableCount = products.filter((product) => product.metadata?.isStackable).length;

  return {
    series:
      categoryId === "seating"
        ? []
        : uniqueSortedTextValues(products.map((product) => product.seriesName)),
    subcategory: uniqueSortedTextValues(
      products.map((product) => product.metadata?.subcategory || ""),
    ),
    material: uniqueSortedTextValues(
      products.flatMap((product) => product.metadata?.material || []),
    ),
    priceRange: uniqueSortedTextValues(
      products.map((product) => product.metadata?.priceRange || ""),
    ),
    ecoMin: {
      min: ecoScores.length > 0 ? Math.min(...ecoScores) : 0,
      max: ecoScores.length > 0 ? Math.max(...ecoScores) : 10,
    },
    featureAvailability: {
      hasHeadrest: hasHeadrestCount > 0 && hasHeadrestCount < total,
      isHeightAdjustable: heightAdjCount > 0 && heightAdjCount < total,
      bifmaCertified: bifmaCount > 0 && bifmaCount < total,
      isStackable: stackableCount > 0 && stackableCount < total,
    },
  };
}

// â”€â”€â”€ Accordion Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PRICE_MAP: Record<string, string> = {
  budget: "Rs. 4,999",
  mid: "Rs. 14,999",
  premium: "Rs. 34,999",
  luxury: "Rs. 74,999",
};

type PlanningPreset = {
  id: string;
  label: string;
  description: string;
  build: (options: FilterResponse["facets"], categoryId: string) => Partial<ActiveFilters>;
};

function pickFirstMatching(values: string[], matcher: RegExp): string | null {
  return values.find((value) => matcher.test(value)) ?? null;
}

function getPlanningPresets(categoryId: string): PlanningPreset[] {
  const presets: PlanningPreset[] = [
    {
      id: "sustainable",
      label: "Sustainable picks",
      description: "Prioritise higher eco-score products.",
      build: () => ({ ecoMin: 7 }),
    },
    {
      id: "budget",
      label: "Budget conscious",
      description: "Lean toward lower budget bands where available.",
      build: (options) => ({
        priceRange: options.priceRange.includes("budget") ? ["budget"] : [],
      }),
    },
  ];

  if (categoryId === "workstations") {
    return [
      {
        id: "density",
        label: "High density",
        description: "Bias toward desking-oriented systems and denser planning.",
        build: (options) => ({
          series: pickFirstMatching(options.series, /desk|bench/i) ?? "all",
        }),
      },
      {
        id: "privacy",
        label: "Privacy led",
        description: "Bias toward panel systems and stronger zoning.",
        build: (options) => ({
          series: pickFirstMatching(options.series, /panel/i) ?? "all",
        }),
      },
      {
        id: "ergonomics",
        label: "Premium ergonomic",
        description: "Bias toward height-adjustable systems.",
        build: (options) => ({
          series: pickFirstMatching(options.series, /height|adjust/i) ?? "all",
        }),
      },
      ...presets,
    ];
  }

  if (categoryId === "storages") {
    return [
      {
        id: "compact-storage",
        label: "Compact storage",
        description: "Focus on denser storage-oriented solutions.",
        build: (options) => ({
          subcategory: pickFirstMatching(options.subcategory, /locker|compactor|storage/i)
            ? [pickFirstMatching(options.subcategory, /locker|compactor|storage/i) as string]
            : [],
        }),
      },
      {
        id: "low-maintenance",
        label: "Low-maintenance",
        description: "Bias toward durable material options.",
        build: (options) => ({
          material: pickFirstMatching(options.material, /steel|metal|crca/i)
            ? [pickFirstMatching(options.material, /steel|metal|crca/i) as string]
            : [],
        }),
      },
      ...presets,
    ];
  }

  return presets;
}

function getCardPlannerHref(categoryId: string, product: FlatProduct): string {
  const params = new URLSearchParams();

  if (categoryId === "storages") {
    params.set("type", "storages");
    params.set("goal", "storage");
    params.set("roomWidth", "9000");
    params.set("roomLength", "12000");
    params.set("roomClearance", "450");
    return `/planning?${params.toString()}`;
  }

  if (categoryId === "workstations") {
    const seriesName = sanitizeDisplayText(product.seriesName || product.name);
    const productName = sanitizeDisplayText(product.name);
    const series =
      /height|adjust|sit-stand/i.test(seriesName) || /height|adjust|sit-stand/i.test(productName)
        ? "Height Adjustable Series"
        : /panel/i.test(seriesName) || /panel/i.test(productName)
          ? "Panel Series"
          : "Desking Series";
    const layout = /operations|team|bench|cluster/i.test(product.description || "") ? "cluster-6" : "double-bank";
    const goal = series === "Height Adjustable Series" ? "ergonomics" : /privacy|focus|director|executive/i.test(product.description || "") ? "privacy" : "density";

    params.set("type", "workstations");
    params.set("series", series);
    params.set("layout", layout);
    params.set("goal", goal);
    params.set("roomWidth", "12000");
    params.set("roomLength", "18000");
    params.set("roomClearance", "450");
    return `/planning?${params.toString()}`;
  }

  return "/planning";
}

function ProductCard({
  product,
  categoryId,
  categoryName,
  contextQueryString,
}: {
  product: FlatProduct;
  categoryId: string;
  categoryName: string;
  contextQueryString: string;
}) {
  const addItem = useQuoteCart((state) => state.addItem);
  const compareItems = useProductCompare((state) => state.items);
  const toggleCompareItem = useProductCompare((state) => state.toggleItem);
  const imageCandidates = buildImageCandidates(product);
  const [imgIndex, setImgIndex] = useState(0);
  const imgSrc = imageCandidates[imgIndex] || imageCandidates[0] || "/images/fallback/category.webp";
  const displayName = sanitizeDisplayText(product.name);
  const ecoScore = product.metadata?.sustainabilityScore || 0;
  const routeKey = getProductRouteKey(product);
  const compareId = `compare-${categoryId}-${routeKey}`;
  const inCompare = compareItems.some((item) => item.id === compareId);
  const baseHref = `/products/${categoryId}/${routeKey}`;
  const productHref = contextQueryString
    ? `${baseHref}?from=${encodeURIComponent(contextQueryString)}`
    : baseHref;
  const imageAlt =
    product.altText ||
    (product.metadata as Record<string, unknown> | undefined)?.ai_alt_text?.toString() ||
    (product.metadata as Record<string, unknown> | undefined)?.aiAltText?.toString() ||
    fallbackAltText(displayName, categoryName);
  const subcategory = toInlineSpec(
    String(product.metadata?.subcategory || product.metadata?.category || "General"),
    40,
  );
  const dimensions = getDisplayDimensions(product) || "Specs available on request";
  const materials = getDisplayMaterials(product) || "Material options available";
  const isConfigurableCategory = categoryId === "workstations" || categoryId === "storages";
  const plannerHref = getCardPlannerHref(categoryId, product);
  const plannerLabel = isConfigurableCategory ? "Plan this system" : "Get planning help";

  return (
    <article className="catalog-card group">
      <button
        type="button"
        onClick={() =>
          toggleCompareItem({
            id: compareId,
            productUrlKey: routeKey,
            categoryId,
            name: displayName,
            image: imgSrc,
            href: productHref,
          })
        }
        aria-label={inCompare ? "Remove from compare" : "Add to compare"}
        className={clsx(
          "catalog-card__compare",
          inCompare
            ? "catalog-card__compare--active"
            : "catalog-card__compare--idle",
        )}
      >
        <GitCompareArrows className="h-3 w-3" />
        {inCompare ? "Compared" : "Compare"}
      </button>

      <Link href={productHref} className="block">
        <div className="catalog-card__media">
          <Image
            src={imgSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 sm:p-5 transition-transform duration-500 group-hover:scale-[1.02]"
            onError={() =>
              setImgIndex((current) =>
                current + 1 < imageCandidates.length ? current + 1 : current,
              )
            }
          />
          <div className="catalog-card__badge-row">
            {product.metadata?.bifmaCertified ? (
              <span className="catalog-card__badge">BIFMA</span>
            ) : null}
            {ecoScore > 0 ? (
              <span className="catalog-card__badge">Eco {ecoScore}/10</span>
            ) : null}
          </div>
        </div>
        <div className="catalog-card__body">
          <div className="space-y-2">
            <p className="catalog-card__eyebrow">
              {subcategory}
            </p>
            <h3 className="catalog-card__title">
              {displayName}
            </h3>
            <p className="catalog-card__description line-clamp-2">
              {sanitizeDisplayText(product.description || "Configured for professional workspaces.")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="typ-label text-neutral-400">
            {sanitizeDisplayText(product.seriesName)}
            </p>
            {product.metadata?.priceRange ? (
              <p className="text-sm text-primary">
                Starting from {PRICE_MAP[product.metadata.priceRange.toLowerCase()] || "Contact for price"}
              </p>
            ) : null}
          </div>
          <div className="catalog-card__meta">
            <p className="catalog-card__meta-row">
              <span className="catalog-card__meta-label">Dimensions</span>
              <span className="line-clamp-1">{dimensions}</span>
            </p>
            <p className="catalog-card__meta-row">
              <span className="catalog-card__meta-label">Materials</span>
              <span className="line-clamp-1">{materials}</span>
            </p>
          </div>
          <div className="catalog-card__actions">
            <div className="grid gap-2">
              <span className="btn-primary text-center text-xs">View Product</span>
              <span className="btn-outline text-center text-xs">{plannerLabel}</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="grid gap-2 px-5 pb-5 pt-0">
        <Link href={plannerHref} className="btn-primary w-full text-xs">
          {plannerLabel}
        </Link>
        <button
          type="button"
          onClick={() =>
            addItem({
              id: `quote-${product.slug || product.id}`,
              name: displayName,
              image: imgSrc,
              href: productHref,
              qty: 1,
            })
          }
          className="btn-outline w-full text-xs"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Quote
        </button>
      </div>
    </article>
  );
}

// â”€â”€â”€ Active Filter Chips â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AdvancedFilterGridInner({
  category,
  categoryId,
}: {
  category: Category;
  categoryId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") ?? "");
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerOpenButtonRef = useRef<HTMLButtonElement>(null);
  const wasDrawerOpenRef = useRef(false);

  const filters = useMemo(
    () => parseFiltersFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const isSeriesEnabled = categoryId !== "seating";
  const effectiveFilters = useMemo(
    () => (isSeriesEnabled ? filters : { ...filters, series: "all" }),
    [filters, isSeriesEnabled],
  );
  const debouncedSearch = useDebouncedValue(searchInput, 250);

  const updateFilters = useCallback(
    (next: Partial<ActiveFilters>, options?: { replace?: boolean }) => {
      const updated = { ...filters, ...next } as ActiveFilters;
      const nextUrl = buildFilterUrl(pathname, updated);
      if (options?.replace) {
        router.replace(nextUrl, { scroll: false });
        return;
      }
      router.push(nextUrl, { scroll: false });
    },
    [filters, pathname, router],
  );

  useEffect(() => {
    if (debouncedSearch === filters.query) return;
    updateFilters({ query: debouncedSearch }, { replace: true });
  }, [debouncedSearch, filters.query, updateFilters]);

  useEffect(() => {
    if (isSeriesEnabled || filters.series === "all") return;
    updateFilters({ series: "all" }, { replace: true });
  }, [filters.series, isSeriesEnabled, updateFilters]);

  const fallbackProducts = useMemo(() => flattenCategoryProducts(category), [category]);
  const fallbackFacets = useMemo(
    () => buildFallbackFacets(categoryId, fallbackProducts),
    [categoryId, fallbackProducts],
  );

  const filterQueryString = useMemo(
    () => buildFilterParams(effectiveFilters).toString(),
    [effectiveFilters],
  );
  const hasFilterQuery = filterQueryString.length > 0;

  const apiQueryString = useMemo(() => {
    const params = new URLSearchParams(filterQueryString);
    params.set("category", categoryId);
    return params.toString();
  }, [categoryId, filterQueryString]);

  const { data, isLoading, isFetching, error } = useQuery<FilterResponse>({
    queryKey: ["category-products", categoryId, apiQueryString],
    queryFn: async () => {
      const response = await fetch(`/api/products/filter/?${apiQueryString}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Filter request failed: ${response.status}`);
      return (await response.json()) as FilterResponse;
    },
    placeholderData: (previous) => previous,
    staleTime: 30_000,
    gcTime: 300_000,
  });

  const shouldUseFallbackData = !hasFilterQuery || Boolean(data) || Boolean(error);
  const filteredProducts = useMemo(
    () =>
      shouldUseFallbackData
        ? (data?.products ?? fallbackProducts)
        : [],
    [data?.products, fallbackProducts, shouldUseFallbackData],
  );
  const navigableProducts = useMemo(
    () => filteredProducts.filter((product) => getProductRouteKey(product).length > 0),
    [filteredProducts],
  );
  const options = shouldUseFallbackData ? (data?.facets ?? fallbackFacets) : fallbackFacets;
  const allProducts = shouldUseFallbackData
    ? (data?.meta.catalogTotal ?? fallbackProducts.length)
    : fallbackProducts.length;
  const isInitialFilteredLoad = isLoading && hasFilterQuery && !data && !error;

  const showFeatureFilters =
    categoryId === "seating" &&
    (options.featureAvailability.hasHeadrest ||
      options.featureAvailability.isHeightAdjustable ||
      options.featureAvailability.bifmaCertified ||
      options.featureAvailability.isStackable);
  const planningPresets = useMemo(() => getPlanningPresets(categoryId), [categoryId]);
  const plannerHref =
    categoryId === "storages"
      ? "/planning?type=storages&goal=storage&roomWidth=9000&roomLength=12000&roomClearance=450"
      : categoryId === "workstations"
        ? "/planning?type=workstations&goal=density&roomWidth=12000&roomLength=18000&roomClearance=450"
        : "/planning";

  const toggleArray = useCallback(
    (
      key: "subcategory" | "priceRange" | "material",
      value: string,
    ) => {
      const current = filters[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateFilters({ [key]: next });
    },
    [filters, updateFilters],
  );

  const removeChip = useCallback(
    (key: string, value?: string | number) => {
      if (
        key === "subcategory" ||
        key === "priceRange" ||
        key === "material"
      ) {
        const current = filters[key] as string[];
        updateFilters({ [key]: current.filter((v) => v !== value) });
      } else if (
        key === "hasHeadrest" ||
        key === "isHeightAdjustable" ||
        key === "bifmaCertified" ||
        key === "isStackable"
      ) {
        updateFilters({ [key]: false });
      } else if (key === "series") {
        updateFilters({ series: "all" });
      } else if (key === "ecoMin") {
        updateFilters({ ecoMin: null });
      }
    },
    [filters, updateFilters],
  );

  const clearAll = useCallback(() => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  }, [router, pathname]);
  const applyPreset = useCallback(
    (preset: PlanningPreset) => {
      const next = preset.build(options, categoryId);
      setSearchInput(next.query ?? "");
      updateFilters({
        query: "",
        series: "all",
        subcategory: [],
        priceRange: [],
        material: [],
        ecoMin: null,
        hasHeadrest: false,
        isHeightAdjustable: false,
        bifmaCertified: false,
        isStackable: false,
        ...next,
        sort: next.sort ?? filters.sort,
      });
    },
    [categoryId, filters.sort, options, updateFilters],
  );

  const activeCount = countActiveFilters(effectiveFilters);

  const sidebarOptions: FilterSidebarOptions = options;

  const sidebarContent = (
    <FilterSidebar
      activeCount={activeCount}
      filters={filters}
      options={sidebarOptions}
      showFeatureFilters={showFeatureFilters}
      onClearAll={clearAll}
      onUpdateFilters={updateFilters}
      onToggleArray={toggleArray}
    />
  );

  useEffect(() => {
    if (!drawerOpen) {
      if (wasDrawerOpenRef.current) drawerOpenButtonRef.current?.focus();
      wasDrawerOpenRef.current = false;
      return;
    }

    wasDrawerOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      if (!drawerRef.current) return;
      const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
        "button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      firstFocusable?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (!drawerRef.current) return;
      if (event.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  return (
    <section
      className="w-full bg-white"
      aria-label={`${category.name} product catalog`}
    >
      <div className="border-b border-neutral-200 bg-white">
        <div className="container-wide py-6">
          <div className="py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="typ-eyebrow mb-2">Planning entry</p>
                <h2 className="typ-section mb-2 text-neutral-950">
                  {CATEGORY_ROUTE_COPY.plannerEntry.title}
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
                  {CATEGORY_ROUTE_COPY.plannerEntry.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href={plannerHref} className="btn-primary justify-center">
                  {CATEGORY_ROUTE_COPY.plannerEntry.primaryCta}
                </Link>
                <Link href="/contact" className="btn-outline justify-center">
                  {CATEGORY_ROUTE_COPY.plannerEntry.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Top Toolbar â”€â”€ */}
      <div className="sticky top-16 z-20 w-full border-b border-neutral-200 bg-white/92 backdrop-blur">
        <div className="container-wide py-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {planningPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Mobile filter button */}
            <button
              ref={drawerOpenButtonRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-700 transition-colors hover:border-neutral-400 lg:hidden"
              aria-label="Open filters"
              aria-expanded={drawerOpen}
              aria-controls="mobile-filter-drawer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {CATEGORY_ROUTE_COPY.filterLabels.filters}
              {activeCount > 0 && (
                <span className="bg-neutral-900 text-white text-[9px] font-normal rounded-full px-1.5 py-0.5 leading-none">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="relative flex-1 w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={`Search ${category.name.toLowerCase()}...`}
                aria-label={`Search ${category.name}`}
                className="h-10 w-full rounded-full border border-neutral-200 bg-white pl-9 pr-8 text-sm transition-colors focus:border-primary focus:outline-none"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 text-neutral-400 hover:text-neutral-800" />
                </button>
              )}
            </div>

            {/* Count + Sort */}
            <div className="flex items-center gap-3 shrink-0">
              <span
                aria-live="polite"
                aria-atomic="true"
                className="text-xs text-neutral-500 font-medium whitespace-nowrap"
              >
                {isInitialFilteredLoad
                  ? "Filtering products..."
                  : `${navigableProducts.length} / ${allProducts} products`}
              </span>
              <select
                aria-label="Sort products"
                className="h-10 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:border-neutral-800 focus:outline-none"
                value={filters.sort}
                onChange={(e) =>
                  updateFilters({ sort: e.target.value as SortOption })
                }
              >
                <option value="az">{CATEGORY_ROUTE_COPY.filterLabels.sortAz}</option>
                <option value="za">{CATEGORY_ROUTE_COPY.filterLabels.sortZa}</option>
                <option value="ecoDesc">{CATEGORY_ROUTE_COPY.filterLabels.sortEcoDesc}</option>
                <option value="ecoAsc">{CATEGORY_ROUTE_COPY.filterLabels.sortEcoAsc}</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          <ActiveFilterChips
            filters={effectiveFilters}
            onRemove={removeChip}
            onClearAll={clearAll}
            total={activeCount}
          />
          {isFetching && (
            <p className="pt-2 text-xs text-neutral-400">Refreshing products...</p>
          )}
          {error && (
            <p className="pt-2 text-xs text-red-600">
              Live filter sync failed. Showing fallback product set.
            </p>
          )}
        </div>
      </div>

      {/* â”€â”€ Main layout â”€â”€ */}
      <div className="container-wide flex gap-8 py-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 self-start sticky top-32">
          {sidebarContent}
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {isLoading && filteredProducts.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="h-96 rounded-sm border border-neutral-100 bg-white animate-pulse"
                />
              ))}
            </div>
          ) : navigableProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-neutral-200 bg-neutral-50 px-6 py-24 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <SearchIcon className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="mb-1 text-base font-normal text-neutral-700">
                {CATEGORY_ROUTE_COPY.emptyState.title}
              </p>
              <p className="text-sm text-neutral-400 mb-4">
                {CATEGORY_ROUTE_COPY.emptyState.description}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={clearAll}
                  className="btn-outline"
                >
                  {CATEGORY_ROUTE_COPY.emptyState.clearCta}
                </button>
                <Link href={plannerHref} className="btn-primary">
                  {CATEGORY_ROUTE_COPY.emptyState.plannerCta}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {navigableProducts.map((product) => (
                <div
                  key={getProductRouteKey(product)}
                  className="transition-all duration-300 animate-fadein"
                >
                  <ProductCard
                    product={product}
                    categoryId={categoryId}
                    categoryName={category.name}
                    contextQueryString={filterQueryString}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* â”€â”€ Mobile Drawer â”€â”€ */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Panel */}
          <div
            ref={drawerRef}
            id="mobile-filter-drawer"
            tabIndex={-1}
            className="fixed inset-y-0 left-0 z-65 flex w-[88vw] max-w-sm flex-col overflow-y-auto bg-neutral-50 shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200 bg-white">
              <span className="text-sm font-normal text-neutral-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {CATEGORY_ROUTE_COPY.filterLabels.filters}
                {activeCount > 0 && (
                  <span className="bg-neutral-900 text-white text-[9px] font-normal rounded-full px-1.5 py-0.5 leading-none">
                    {activeCount}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="min-h-11 min-w-11 inline-flex items-center justify-center"
              >
                <X className="w-5 h-5 text-neutral-500 hover:text-neutral-900" />
              </button>
            </div>
            <div className="p-4">{sidebarContent}</div>
            <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-4 flex gap-2">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearAll();
                    setDrawerOpen(false);
                  }}
                  className="flex-1 h-11 border border-neutral-200 text-sm text-neutral-700 rounded-sm hover:bg-neutral-50 transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 h-11 rounded-sm bg-neutral-900 text-sm font-normal text-white transition-colors hover:bg-neutral-700"
              >
                View {navigableProducts.length} results
              </button>
            </div>
          </div>
        </>
      )}
      <CompareDock />
    </section>
  );
}

// â”€â”€â”€ Exported wrapper (Suspense for useSearchParams) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function FilterGrid({
  category,
  categoryId,
}: {
  category: Category;
  categoryId: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-64 flex items-center justify-center text-neutral-400 text-sm">
          Loading products...
        </div>
      }
    >
      <AdvancedFilterGridInner category={category} categoryId={categoryId} />
    </Suspense>
  );
}
