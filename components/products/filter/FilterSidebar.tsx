"use client";

import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { CATEGORY_ROUTE_COPY } from "@/data/site/routeCopy";
import {
  SUSTAINABILITY_THRESHOLDS,
  type ActiveFilters,
} from "@/lib/productFilters";

export type FilterSidebarOptions = {
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

function AccordionSection({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-left group"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-[11px] font-normal tracking-[0.04em] text-neutral-600 transition-colors group-hover:text-neutral-900">
          {title}
          {count !== undefined && count > 0 ? (
            <span className="badge bg-neutral-900 px-1.5 py-0.5 text-[9px] leading-none text-white">
              {count}
            </span>
          ) : null}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-neutral-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
        )}
      </button>
      {open ? <div className="px-4 pb-4">{children}</div> : null}
    </div>
  );
}

function CheckList({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) {
    return <p className="text-xs italic text-neutral-400">No options available</p>;
  }

  return (
    <ul className="space-y-1.5">
      {options.map((option) => (
        <li key={option}>
          <label className="group flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-3.5 w-3.5 accent-neutral-900"
            />
            <span className="text-sm capitalize text-neutral-600 transition-colors group-hover:text-neutral-900">
              {option}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

function PriceButtons({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={clsx(
            "rounded-sm border px-3 py-1.5 text-xs font-medium capitalize transition-all",
            selected.includes(option)
              ? "border-accent1 bg-accent1 text-neutral-900"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function SustainabilityButtons({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (value: number | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={clsx(
          "rounded-sm border px-3 py-1.5 text-xs font-medium transition-all",
          selected === null
            ? "border-accent1 bg-accent1 text-neutral-900"
            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400",
        )}
      >
        Any
      </button>
      {SUSTAINABILITY_THRESHOLDS.map((threshold) => (
        <button
          key={threshold}
          type="button"
          onClick={() => onSelect(threshold)}
          className={clsx(
            "rounded-sm border px-3 py-1.5 text-xs font-medium transition-all",
            selected === threshold
              ? "border-accent1 bg-accent1 text-neutral-900"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400",
          )}
        >
          &gt;= {threshold}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1">
      <span className="text-sm text-neutral-600">{label}</span>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-accent1" : "bg-neutral-200",
        )}
      >
        <span
          className={clsx(
            "absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-all",
            checked ? "left-[18px]" : "left-[3px]",
          )}
        />
      </button>
    </label>
  );
}

export function FilterSidebar({
  activeCount,
  filters,
  options,
  showFeatureFilters,
  onClearAll,
  onUpdateFilters,
  onToggleArray,
}: {
  activeCount: number;
  filters: ActiveFilters;
  options: FilterSidebarOptions;
  showFeatureFilters: boolean;
  onClearAll: () => void;
  onUpdateFilters: (next: Partial<ActiveFilters>) => void;
  onToggleArray: (key: keyof Pick<ActiveFilters, "subcategory" | "priceRange" | "material">, value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_24px_56px_-48px_rgba(15,23,42,0.22)]">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-4">
        <span className="typ-label flex items-center gap-2 text-neutral-500">
          <Filter className="h-3.5 w-3.5" />
          {CATEGORY_ROUTE_COPY.filterLabels.filters}
          {activeCount > 0 ? (
            <span className="badge bg-neutral-900 px-1.5 py-0.5 text-[9px] leading-none text-white">
              {activeCount}
            </span>
          ) : null}
        </span>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClearAll}
            className="typ-label text-primary transition-colors hover:text-primary-hover"
          >
            {CATEGORY_ROUTE_COPY.filterLabels.clearAll}
          </button>
        ) : null}
      </div>

      {options.series.length > 1 ? (
        <AccordionSection
          title={CATEGORY_ROUTE_COPY.filterLabels.series}
          count={filters.series !== "all" ? 1 : 0}
          defaultOpen
        >
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onUpdateFilters({ series: "all" })}
              className={clsx(
                "w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                filters.series === "all"
                  ? "bg-accent1 font-normal text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-50",
              )}
            >
              {CATEGORY_ROUTE_COPY.filterLabels.allSeries}
            </button>
            {options.series.map((seriesName) => (
              <button
                key={seriesName}
                type="button"
                onClick={() => onUpdateFilters({ series: seriesName })}
                className={clsx(
                  "w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                  filters.series === seriesName
                    ? "bg-accent1 font-normal text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-50",
                )}
              >
                {seriesName}
              </button>
            ))}
          </div>
        </AccordionSection>
      ) : null}

      {options.subcategory.length > 1 ? (
        <AccordionSection
          title={CATEGORY_ROUTE_COPY.filterLabels.type}
          count={filters.subcategory.length}
          defaultOpen={filters.subcategory.length > 0}
        >
          <CheckList
            options={options.subcategory}
            selected={filters.subcategory}
            onToggle={(value) => onToggleArray("subcategory", value)}
          />
        </AccordionSection>
      ) : null}

      {options.priceRange.length > 1 ? (
        <AccordionSection
          title={CATEGORY_ROUTE_COPY.filterLabels.priceRange}
          count={filters.priceRange.length}
          defaultOpen={filters.priceRange.length > 0}
        >
          <PriceButtons
            options={options.priceRange}
            selected={filters.priceRange}
            onToggle={(value) => onToggleArray("priceRange", value)}
          />
        </AccordionSection>
      ) : null}

      {options.material.length > 1 ? (
        <AccordionSection
          title={CATEGORY_ROUTE_COPY.filterLabels.material}
          count={filters.material.length}
          defaultOpen={filters.material.length > 0}
        >
          <CheckList
            options={options.material}
            selected={filters.material}
            onToggle={(value) => onToggleArray("material", value)}
          />
        </AccordionSection>
      ) : null}

      <AccordionSection
        title={CATEGORY_ROUTE_COPY.filterLabels.sustainability}
        count={typeof filters.ecoMin === "number" ? 1 : 0}
        defaultOpen={typeof filters.ecoMin === "number"}
      >
        <SustainabilityButtons
          selected={filters.ecoMin}
          onSelect={(ecoMin) => onUpdateFilters({ ecoMin })}
        />
      </AccordionSection>

      {showFeatureFilters ? (
        <AccordionSection
          title={CATEGORY_ROUTE_COPY.filterLabels.features}
          count={
            (filters.hasHeadrest ? 1 : 0) +
            (filters.isHeightAdjustable ? 1 : 0) +
            (filters.bifmaCertified ? 1 : 0) +
            (filters.isStackable ? 1 : 0)
          }
        >
          <div className="space-y-1">
            {options.featureAvailability.hasHeadrest ? (
              <Toggle
                label="With Headrest"
                checked={filters.hasHeadrest}
                onChange={(value) => onUpdateFilters({ hasHeadrest: value })}
              />
            ) : null}
            {options.featureAvailability.isHeightAdjustable ? (
              <Toggle
                label="Height Adjustable"
                checked={filters.isHeightAdjustable}
                onChange={(value) => onUpdateFilters({ isHeightAdjustable: value })}
              />
            ) : null}
            {options.featureAvailability.bifmaCertified ? (
              <Toggle
                label="BIFMA Certified"
                checked={filters.bifmaCertified}
                onChange={(value) => onUpdateFilters({ bifmaCertified: value })}
              />
            ) : null}
            {options.featureAvailability.isStackable ? (
              <Toggle
                label="Stackable"
                checked={filters.isStackable}
                onChange={(value) => onUpdateFilters({ isStackable: value })}
              />
            ) : null}
          </div>
        </AccordionSection>
      ) : null}
    </div>
  );
}

export function ActiveFilterChips({
  filters,
  onClearAll,
  onRemove,
  total,
}: {
  filters: ActiveFilters;
  onClearAll: () => void;
  onRemove: (key: string, value?: string | number) => void;
  total: number;
}) {
  if (total === 0) return null;

  const chips: { key: string; label: string; value?: string | number }[] = [];
  if (filters.series !== "all") chips.push({ label: `Series: ${filters.series}`, key: "series" });
  filters.subcategory.forEach((value) => chips.push({ label: value, key: "subcategory", value }));
  filters.priceRange.forEach((value) => chips.push({ label: `${value} range`, key: "priceRange", value }));
  filters.material.forEach((value) => chips.push({ label: value, key: "material", value }));
  if (filters.hasHeadrest) chips.push({ label: "With headrest", key: "hasHeadrest" });
  if (filters.isHeightAdjustable) chips.push({ label: "Height adjustable", key: "isHeightAdjustable" });
  if (filters.bifmaCertified) chips.push({ label: "BIFMA certified", key: "bifmaCertified" });
  if (filters.isStackable) chips.push({ label: "Stackable", key: "isStackable" });
  if (typeof filters.ecoMin === "number") chips.push({ label: `Eco >= ${filters.ecoMin}`, key: "ecoMin", value: filters.ecoMin });

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 py-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Active:</span>
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value ?? ""}`}
          type="button"
          onClick={() => onRemove(chip.key, chip.value)}
          className="flex items-center gap-1.5 rounded-sm bg-accent1 px-2.5 py-1 text-xs text-neutral-900 transition-colors hover:bg-accent2"
        >
          <span className="capitalize">{chip.label}</span>
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 text-xs text-neutral-500 underline transition-colors hover:text-neutral-900"
      >
        Clear all
      </button>
    </div>
  );
}
