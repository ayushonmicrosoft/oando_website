"use client";

import { useState, useEffect } from "react";
import type {
  CompatProduct as Product,
  ProductVariant,
} from "@/lib/getProducts";
import {
  ArrowLeft,
  ChevronRight,
  Twitter,
  Facebook,
  ShieldCheck,
  Award,
  ThumbsUp,
  Share2,
  ShoppingCart,
  GitCompareArrows,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import ThreeViewer from "@/components/ThreeViewer";
import { Reviews } from "@/components/Reviews";
import { ProductGallery } from "@/components/ProductGallery";
import { useQuoteCart } from "@/lib/store/quoteCart";
import { useProductCompare } from "@/lib/store/productCompare";
import { CompareDock } from "@/components/products/CompareDock";
import { sanitizeDisplayText as normalizeDisplayText } from "@/lib/displayText";
import { PDP_ROUTE_COPY } from "@/data/site/routeCopy";

interface ProductViewerProps {
  product: Product;
  seriesName: string;
  categoryRoute: string;
  categoryId?: string;
}

type WorkstationSeries = "Desking Series" | "Panel Series" | "Height Adjustable Series";

export function sanitizeDisplayText(value: string): string {
  return String(value || "")
    .replace(/[�]+/g, "")
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/â€˜|â€™/g, "'")
    .replace(/â€œ|â€\u009d|â€"/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeDisplayList(values: string[]): string[] {
  return values.map((item) => normalizeDisplayText(item)).filter(Boolean);
}

export function ProductViewer({
  product,
  seriesName,
  categoryRoute,
  categoryId,
}: ProductViewerProps) {
  const addItem = useQuoteCart((state) => state.addItem);
  const compareItems = useProductCompare((state) => state.items);
  const toggleCompareItem = useProductCompare((state) => state.toggleItem);
  const cleanName = (raw: string) => {
    if (!raw) return raw;
    const m = raw.match(/^([A-Z][a-z]+(?:[- ][A-Z][a-z0-9]*)?)\1/);
    if (m && m[1]) return m[1];
    if (raw.length > 30 && !raw.includes(" ")) {
      const cap = raw.match(/^[A-Z][a-z]+/);
      if (cap) return cap[0];
    }
    return raw;
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null,
  );
  const displayName = cleanName(normalizeDisplayText(product.name));

  const modelPath =
    selectedVariant?.threeDModelUrl ||
    product["3d_model"] ||
    product.threeDModelUrl ||
    "";
  const hasModelPath = modelPath.length > 0;

  const allImages = [
    ...(product.images || []),
    product.flagshipImage,
    ...(selectedVariant?.galleryImages || []),
    ...(product.sceneImages || []),
  ].filter(Boolean) as string[];

  const uniqueImages = Array.from(new Set(allImages));
  const swatchFallbackImage =
    product.flagshipImage ||
    product.images?.find(Boolean) ||
    product.sceneImages?.find(Boolean) ||
    uniqueImages[0] ||
    "";
  const productImageAlt =
    (product as unknown as { altText?: string }).altText ||
    (product.metadata as Record<string, unknown> | undefined)?.ai_alt_text?.toString() ||
    (product.metadata as Record<string, unknown> | undefined)?.aiAltText?.toString() ||
    `${displayName} product image`;

  useEffect(() => {
    // Basic anonymous tracking for recommendations
    let userId = localStorage.getItem("oando_user_id");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("oando_user_id", userId);
    }

    fetch("/api/tracking/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: product.id }),
    }).catch(console.error);
  }, [product.id]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // When variants change, uniqueImages will update which resets the ProductGallery index implicitly
  };

  const [is3DMode, setIs3DMode] = useState(false);
  const [isModelAvailable, setIsModelAvailable] = useState(false);
  const [isCheckingModel, setIsCheckingModel] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!hasModelPath) {
      setIsModelAvailable(false);
      setIsCheckingModel(false);
      setIs3DMode(false);
      return;
    }

    const validateModel = async () => {
      setIsCheckingModel(true);
      try {
        const response = await fetch(modelPath, { method: "HEAD" });
        if (!cancelled) {
          const ok = response.ok;
          setIsModelAvailable(ok);
          if (!ok) setIs3DMode(false);
        }
      } catch {
        if (!cancelled) {
          setIsModelAvailable(false);
          setIs3DMode(false);
        }
      } finally {
        if (!cancelled) setIsCheckingModel(false);
      }
    };

    validateModel();
    return () => {
      cancelled = true;
    };
  }, [hasModelPath, modelPath]);

  const toText = (value: unknown): string => {
    if (typeof value === "string") return normalizeDisplayText(value);
    if (typeof value === "number") return String(value);
    return "";
  };
  const toStringList = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return sanitizeDisplayList(value.map((item) => String(item)));
  };
  const routeKey = (product.slug || product.id || "").trim();
  const compareId = `compare-${categoryId || "products"}-${routeKey}`;
  const inCompare = compareItems.some((item) => item.id === compareId);

  const normalizedCategory = (categoryId || "").toLowerCase();
  const categorySpecProfile: Record<
    string,
    { dimensions: string; materials: string[]; useCase: string[] }
  > = {
    workstations: {
      dimensions: "Module width and depth customized to floor layout",
      materials: ["PLPB top", "Powder-coated steel frame"],
      useCase: ["Open offices", "Operations floors", "Team work areas"],
    },
    storages: {
      dimensions: "Cabinet and locker sizes configured per storage volume",
      materials: ["CRCA steel", "Prelam board options"],
      useCase: ["File rooms", "Utility zones", "Department storage"],
    },
  };
  const fallbackProfile = categorySpecProfile[normalizedCategory] || {
    dimensions: "Configuration dimensions available on request",
    materials: ["Material options available"],
    useCase: ["Corporate", "Institutional"],
  };

  const rawSpecs =
    product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? (product.specs as Record<string, unknown>)
      : {};

  const overview = normalizeDisplayText(
    product.detailedInfo?.overview || product.description || "",
  );
  const dimensions =
    product.detailedInfo?.dimensions ||
    toText(rawSpecs.dimensions) ||
    toText(rawSpecs.dimension) ||
    fallbackProfile.dimensions;
  const primaryMaterials = sanitizeDisplayList(
    product.detailedInfo?.materials?.filter(Boolean) || [],
  );
  const specMaterials = toStringList(rawSpecs.materials);
  const metadataMaterials = sanitizeDisplayList(product.metadata?.material || []);
  const materials =
    primaryMaterials.length > 0
      ? primaryMaterials
      : specMaterials.length > 0
        ? specMaterials
        : metadataMaterials.length > 0
          ? metadataMaterials
          : fallbackProfile.materials;
  const features = sanitizeDisplayList(
    product.detailedInfo?.features?.filter(
      (f: string) => f && f !== "MANUFACTURING" && f !== "Sustainability",
    ) || [],
  );
  const useCases = sanitizeDisplayList(product.metadata?.useCase || fallbackProfile.useCase);
  const isConfigurableCategory =
    normalizedCategory === "workstations" || normalizedCategory === "storages";
  const warrantyYears = product.metadata?.warrantyYears;
  const warrantyText = warrantyYears
    ? `${warrantyYears}-Year Warranty`
    : normalizedCategory === "workstations" || normalizedCategory === "storages"
      ? "Up to 5-year warranty (model dependent)"
      : "Warranty on request";
  const certificationText = product.metadata?.bifmaCertified
    ? "BIFMA Certified"
    : PDP_ROUTE_COPY.trustBadges.certificationFallback;
  const sustainabilityText =
    typeof product.metadata?.sustainabilityScore === "number"
      ? `Eco Score ${product.metadata.sustainabilityScore}/10`
      : "Sustainability details on request";
  const quickConfig =
    toText(rawSpecs.configuration) ||
    toText(rawSpecs.type) ||
    toText(product.metadata?.subcategory) ||
    (normalizedCategory === "workstations"
      ? "Modular workstation system"
      : normalizedCategory === "storages"
        ? "Modular storage system"
        : "Configuration available");
  const shortOverview = (() => {
    if (!overview) return "";
    const clean = overview.replace(/\s+/g, " ").trim();
    const sentenceMatch = clean.match(/^[^.!?]+[.!?]\s*[^.!?]*[.!?]?/);
    if (sentenceMatch?.[0]) return sentenceMatch[0].trim();
    return clean.length > 180 ? `${clean.slice(0, 180).trim()}...` : clean;
  })();
  const inferredPlanningSeries: WorkstationSeries | null =
    normalizedCategory !== "workstations"
      ? null
      : /height|adjustable|sit-stand/i.test(seriesName) || /height|adjustable|sit-stand/i.test(displayName)
        ? "Height Adjustable Series"
        : /panel/i.test(seriesName) || /panel/i.test(displayName)
          ? "Panel Series"
          : "Desking Series";
  const recommendedLayout =
    normalizedCategory === "storages"
      ? "wall-run"
      : useCases.some((useCase) => /operations|team|open/i.test(useCase))
        ? "cluster-6"
        : "double-bank";
  const planningGoal =
    normalizedCategory === "storages"
      ? "storage"
      : inferredPlanningSeries === "Height Adjustable Series"
        ? "ergonomics"
        : /focus|privacy|director|executive/i.test(shortOverview)
          ? "privacy"
          : "density";
  const plannerHref = (() => {
    const params = new URLSearchParams({
      type: normalizedCategory === "storages" ? "storages" : "workstations",
      goal: planningGoal,
      roomWidth: normalizedCategory === "storages" ? "9000" : "12000",
      roomLength: normalizedCategory === "storages" ? "12000" : "18000",
      roomClearance: "450",
    });
    if (normalizedCategory === "workstations" && inferredPlanningSeries) {
      params.set("series", inferredPlanningSeries);
      params.set("layout", recommendedLayout);
    }
    return `/planning?${params.toString()}`;
  })();
  const planningPrimaryLabel = isConfigurableCategory
    ? PDP_ROUTE_COPY.ctas.planSystem
    : PDP_ROUTE_COPY.ctas.planningRecommendation;
  const planningRole =
    normalizedCategory === "workstations"
      ? `Best explored as a ${quickConfig.toLowerCase()} with room-fit and capacity checks.`
      : normalizedCategory === "storages"
        ? "Works best when storage volume, aisle access, and room clearance are tested together."
        : PDP_ROUTE_COPY.planningNotes.consultative;
  const plannerAvailability = isConfigurableCategory
    ? PDP_ROUTE_COPY.planningNotes.configurable
    : PDP_ROUTE_COPY.planningNotes.consultative;
  const bestFor =
    useCases.length > 0 ? useCases.slice(0, 3).join(", ") : "Corporate and institutional projects";
  const relatedPlanningLayouts =
    normalizedCategory === "storages"
      ? ["Wall-run planning", "Dual-aisle storage", "Compactor-ready zone"]
      : recommendedLayout === "cluster-6"
        ? ["Cluster-6 planning", "Double-bank floorplate", "Operations benching"]
        : inferredPlanningSeries === "Height Adjustable Series"
          ? ["Ergonomic sit-stand bay", "Double-bank planning", "Leadership touch-down"]
          : ["Double-bank planning", "Cluster-4 module", "Linear benching"];
  const relatedPlanningNotes =
    normalizedCategory === "storages"
      ? [
          "Pairs well with aisle-clearance checks and phased storage growth.",
          "Best used when filing volume and access speed matter equally.",
        ]
      : [
          `Recommended layout direction: ${relatedPlanningLayouts[0]}.`,
          "Use the planner to compare density, privacy, and ergonomic tradeoffs before finalizing the system.",
        ];
  const specRows = [
    { label: "Dimensions", value: dimensions },
    {
      label: "Materials",
      value:
        materials.length > 0
          ? materials.slice(0, 3).join(", ")
          : "Material options available",
    },
    { label: "Warranty", value: warrantyText },
    { label: "Certification", value: certificationText },
    { label: "Configuration", value: quickConfig },
    {
      label: "Use Case",
      value:
        useCases.length > 0
          ? useCases.slice(0, 3).join(", ")
          : "Corporate and institutional",
    },
    { label: "Sustainability", value: sustainabilityText },
  ];
  const formatSpecLabel = (key: string) =>
    key
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const toSpecText = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return sanitizeDisplayList(value.map((v) => String(v))).join(", ");
    if (typeof value === "object") return "";
    return normalizeDisplayText(String(value));
  };
  const inlineSpecs = (() => {
    const entries: Array<{ label: string; value: string }> = [];
    const seen = new Set<string>();
    const blocked = new Set([
      "dimensions",
      "materials",
      "features",
      "sustainability_score",
    ]);

    const addEntriesFromObject = (source: unknown) => {
      if (!source || typeof source !== "object" || Array.isArray(source)) return;
      for (const [rawKey, rawValue] of Object.entries(
        source as Record<string, unknown>,
      )) {
        const key = rawKey.toLowerCase();
        if (blocked.has(key) || seen.has(key)) continue;
        const value = toSpecText(rawValue);
        if (!value) continue;
        entries.push({ label: formatSpecLabel(rawKey), value });
        seen.add(key);
      }
    };

    addEntriesFromObject(product.specs);
    addEntriesFromObject(
      (product.metadata as Record<string, unknown> | undefined)?.specifications,
    );
    return entries.slice(0, 16);
  })();

  const seriesShort = normalizeDisplayText(seriesName.replace(/ Series$/i, ""));

  return (
    <section className="bg-white min-h-screen">
      {/* ── BREADCRUMB BAR ── */}
      <div className="sticky top-16 z-10 border-b border-neutral-200 bg-white/92 backdrop-blur-sm">
        <div className="container px-6 2xl:px-0 h-10 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
          <Link
            href="/products"
            className="hover:text-neutral-900 transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={categoryRoute}
            className="hover:text-neutral-900 transition-colors"
          >
            {seriesShort}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">
            {displayName}
          </span>
        </div>
      </div>

      <div className="min-h-[calc(100vh-112px)] flex flex-col lg:flex-row">
        {/* ── LEFT: IMAGE GALLERY ── */}
        <div className="flex w-full flex-col border-b border-neutral-200 bg-[linear-gradient(180deg,#fafbfd_0%,#f4f6fa_100%)] pt-0 lg:w-[58%] lg:border-b-0 lg:border-r xl:w-[62%]">
          <div className="mx-auto flex-1 w-full max-w-[860px] p-4 lg:p-8">
              <ProductGallery
                images={uniqueImages}
                productName={displayName}
              />
          </div>

          {/* 3D viewer toggle wrapper */}
          {hasModelPath && (
            <div className="group relative aspect-video w-full border-t border-neutral-200 bg-white/70">
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!isModelAvailable) return;
                    setIs3DMode((prev) => !prev);
                  }}
                  disabled={!isModelAvailable}
                  className={clsx(
                    "rounded-full border border-neutral-200 bg-white/92 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur",
                    isModelAvailable
                      ? "text-neutral-800 hover:bg-neutral-900 hover:text-white transition-colors"
                      : "text-neutral-400 cursor-not-allowed",
                  )}
                >
                  {is3DMode ? PDP_ROUTE_COPY.ctas.viewImage : PDP_ROUTE_COPY.ctas.view3d}
                </button>
              </div>
              {!isModelAvailable && !isCheckingModel && (
                <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
                  <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                    {PDP_ROUTE_COPY.ctas.modelUnavailable}
                  </p>
                </div>
              )}
              {isCheckingModel && (
                <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
                  <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                    {PDP_ROUTE_COPY.ctas.modelChecking}
                  </p>
                </div>
              )}

              {is3DMode && isModelAvailable ? (
                <div className="w-full h-full absolute inset-0 z-10 flex items-center justify-center bg-transparent">
                  <div className="hidden md:block w-full h-full">
                    <ThreeViewer
                      modelUrl={modelPath}
                      fallback={
                        <Image
                          src={uniqueImages[0]}
                          alt={productImageAlt}
                          width={1200}
                          height={900}
                          className="w-full h-full object-contain"
                        />
                      }
                    />
                  </div>
                  <div className="block md:hidden w-full h-full">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `
                      <model-viewer
                        src="${modelPath}"
                        ar
                        ios-src="${modelPath.replace(".glb", ".usdz")}"
                        camera-controls
                        shadow-intensity="1"
                        alt="3D model of ${displayName}"
                        style="width: 100%; height: 100%;"
                      ></model-viewer>
                    `,
                      }}
                    ></div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* ── RIGHT: DETAILS PANEL ── */}
        <div className="scrollbar-hide w-full overflow-y-auto px-6 py-10 sm:px-10 lg:sticky lg:top-[112px] lg:h-[calc(100vh-112px)] lg:w-[42%] lg:bg-white xl:w-[38%] lg:px-12">
          <div className="max-w-sm mx-auto lg:max-w-none">
            {/* Title block */}
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">
                {seriesShort}
              </p>
              <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 tracking-tight leading-[1.05] mb-5">
                {displayName}
              </h1>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-light mb-6 max-w-prose line-clamp-3 lg:line-clamp-none">
                {shortOverview}
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-700">
                  {warrantyText}
                </span>
                {product.metadata?.bifmaCertified && (
                  <span className="rounded-full border border-neutral-900 bg-neutral-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    BIFMA
                  </span>
                )}
                {typeof product.metadata?.sustainabilityScore === "number" && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Eco {product.metadata.sustainabilityScore}/10
                  </span>
                )}
              </div>

              <div className="mb-6 rounded-[24px] border border-neutral-200 bg-[linear-gradient(180deg,#fbfcfe_0%,#f5f7fb_100%)] p-5 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.18)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  {PDP_ROUTE_COPY.ctas.planningRecommendation}
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      {PDP_ROUTE_COPY.planningSummaryLabels.bestFor}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-800">{bestFor}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      {PDP_ROUTE_COPY.planningSummaryLabels.planningRole}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-800">{planningRole}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      {PDP_ROUTE_COPY.planningSummaryLabels.planner}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-800">{plannerAvailability}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `Check out ${displayName} at One & Only Furniture!`,
                    );
                    const url = encodeURIComponent(window.location.href);
                    window.open(
                      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                      "_blank",
                    );
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                      "_blank",
                    );
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // could add a toast here
                  }}
                  aria-label={PDP_ROUTE_COPY.ctas.copyLink}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> {PDP_ROUTE_COPY.ctas.copyLink}
                </button>
              </div>
            </div>

            {/* Variant swatches */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-7 border-t border-neutral-100 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                    {PDP_ROUTE_COPY.ctas.configuration}
                  </p>
                  <span className="text-xs text-neutral-400">
                    {product.variants.length} options
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  {product.variants.map((variant: ProductVariant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        type="button"
                        key={variant.id}
                        onClick={() => handleVariantChange(variant)}
                        title={variant.variantName}
                        className={clsx(
                          "w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-200",
                          isSelected
                            ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2 scale-110"
                            : "border-neutral-200 hover:border-neutral-500 hover:scale-105",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            variant.galleryImages?.[0] || product.flagshipImage
                          }
                          alt={variant.variantName}
                          className="w-full h-full object-cover scale-150"
                          onError={(e) => {
                            const el = e.currentTarget as HTMLImageElement;
                            if (!el.dataset.fallback) {
                              el.dataset.fallback = "1";
                              const originalSrc = el.getAttribute("src") || "";
                              if (
                                swatchFallbackImage &&
                                swatchFallbackImage !== originalSrc
                              ) {
                                el.src = swatchFallbackImage;
                              } else {
                                el.style.visibility = "hidden";
                              }
                            }
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
                {selectedVariant && (
                  <p className="text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-800">
                      Selected:
                    </span>{" "}
                    {selectedVariant.variantName}
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="mb-8">
              <Link
                href={isConfigurableCategory ? plannerHref : "/planning"}
                className="btn-primary group mb-2 flex w-full items-center justify-between px-6 py-4"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  {planningPrimaryLabel}
                </span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="btn-outline group mb-2 flex w-full items-center justify-between px-6 py-3.5"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  {PDP_ROUTE_COPY.ctas.requestQuote}
                </span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    id: `quote-${product.slug || product.id}`,
                    name: displayName,
                    image: uniqueImages[0],
                    href: `${categoryRoute}/${product.slug || product.id}`,
                    qty: 1,
                  })
                }
                className="group mb-2 flex w-full items-center justify-between rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-neutral-900 transition-colors hover:border-primary hover:text-primary"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  {PDP_ROUTE_COPY.ctas.addToQuote}
                </span>
                <ShoppingCart className="w-4 h-4" />
              </button>
              {routeKey ? (
                <button
                  type="button"
                  onClick={() =>
                    toggleCompareItem({
                      id: compareId,
                      productUrlKey: routeKey,
                      categoryId: categoryId || "products",
                      name: displayName,
                      image: uniqueImages[0],
                      href: `${categoryRoute}/${routeKey}`,
                    })
                  }
                  className={clsx(
                    "group mb-2 flex w-full items-center justify-between rounded-full border px-6 py-3.5 transition-colors",
                    inCompare
                      ? "border-primary bg-primary text-white hover:bg-primary-hover"
                      : "border-neutral-300 bg-white text-neutral-800 hover:border-primary hover:text-primary",
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                    {inCompare ? PDP_ROUTE_COPY.ctas.addedToCompare : PDP_ROUTE_COPY.ctas.addToCompare}
                  </span>
                  <GitCompareArrows className="w-4 h-4" />
                </button>
              ) : null}
              <Link
                href="/contact"
                className="group mt-2 flex w-full items-center justify-between rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-neutral-900 transition-colors hover:border-neutral-400"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  {PDP_ROUTE_COPY.ctas.consultation}
                </span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mb-8 grid grid-cols-1 gap-4 border-t border-neutral-200 pt-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <ShieldCheck className="w-5 h-5 text-neutral-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">
                  {warrantyText}
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {PDP_ROUTE_COPY.trustBadges.warrantyDescription}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <Award className="w-5 h-5 text-neutral-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">
                  {PDP_ROUTE_COPY.trustBadges.madeInIndia}
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {PDP_ROUTE_COPY.trustBadges.madeInIndiaDescription}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <ThumbsUp className="w-5 h-5 text-neutral-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">
                  {certificationText}
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {PDP_ROUTE_COPY.trustBadges.certificationDescription}
                </p>
              </div>
            </div>

            <div className="mb-8 rounded-[24px] border border-neutral-200 bg-[linear-gradient(180deg,#fbfcfe_0%,#f5f7fb_100%)] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                Related planning paths
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedPlanningLayouts.map((layout) => (
                  <span
                    key={layout}
                    className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700"
                  >
                    {layout}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {relatedPlanningNotes.map((note) => (
                  <p key={note} className="text-sm leading-relaxed text-neutral-700">
                    {note}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={isConfigurableCategory ? plannerHref : "/planning"} className="btn-primary">
                  {planningPrimaryLabel}
                </Link>
                <Link href={categoryRoute} className="btn-outline">
                  View related systems
                </Link>
              </div>
            </div>

            {/* Specifications */}
            <div className="pt-7 border-t border-neutral-100">
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                {PDP_ROUTE_COPY.ctas.specifications}
              </h2>
              <div className="mb-7 overflow-hidden rounded-[20px] border border-neutral-200">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[120px_1fr] gap-3 px-4 py-3 border-b border-neutral-100 last:border-b-0"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                      {row.label}
                    </span>
                    <span className="text-sm text-neutral-700 leading-relaxed">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {features.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-3">
                    {PDP_ROUTE_COPY.ctas.keyFeatures}
                  </p>
                  <ul className="space-y-2">
                    {features.slice(0, 8).map((f: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed"
                      >
                        <span className="text-neutral-400 mt-0.5 shrink-0">-</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {inlineSpecs.length > 0 && (
                <div className="pt-7 border-t border-neutral-100 mt-7">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-3">
                    {PDP_ROUTE_COPY.ctas.technicalDetails}
                  </h3>
                  <div className="rounded-lg border border-neutral-200 overflow-hidden">
                    {inlineSpecs.map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-[120px_1fr] gap-3 px-4 py-3 border-b border-neutral-100 last:border-b-0"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                          {row.label}
                        </span>
                        <span className="text-sm text-neutral-700 leading-relaxed">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {materials.length > 0 && (
                <div className="pt-7 border-t border-neutral-100 mt-7">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-3">
                    {PDP_ROUTE_COPY.ctas.materialOptions}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((material) => (
                      <span
                        key={material}
                        className="px-2.5 py-1 text-xs text-neutral-700 border border-neutral-200 bg-neutral-50"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide px-6 2xl:px-0 pb-24">
        <Reviews productId={product.id} />
      </div>
      <CompareDock />

      <style
        dangerouslySetInnerHTML={{
          __html: `.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`,
        }}
      />
    </section>
  );
}

