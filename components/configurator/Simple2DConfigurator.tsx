"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Cable, Grid3X3, Layers3, ShieldCheck } from "lucide-react";

type ProjectType = "workstations" | "storages";
type WorkstationSeries = "Desking Series" | "Panel Series" | "Height Adjustable Series";
type LayoutId = "linear-bench" | "double-bank" | "cluster-4" | "cluster-6" | "l-pod";
type ScreenId = "none" | "acrylic" | "fabric" | "glass";
type ModestyId = "none" | "metal" | "perforated" | "fabric";
type RacewayId = "none" | "tray" | "spine" | "full-power-beam";
type StorageModeId = "none" | "shared-pedestal" | "individual-pedestal" | "overhead";

type ConfigForm = {
  projectType: ProjectType;
  workstationSeries: WorkstationSeries;
  layoutId: LayoutId;
  moduleCount: number;
  modulesPerRow: number;
  deskWidth: number;
  deskDepth: number;
  aisleWidth: number;
  screen: ScreenId;
  screenHeight: number;
  modesty: ModestyId;
  raceway: RacewayId;
  powerPerSeat: number;
  dataPerSeat: number;
  storageMode: StorageModeId;
  storageLayout: string;
  storageRows: number;
  storageColumns: number;
  storageUnits: number;
  finish: string;
  roomWidth: number;
  roomLength: number;
  roomClearance: number;
  clientName: string;
  projectName: string;
  siteLocation: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
};

type SubmitState = {
  loading: boolean;
  error: string;
  queryId: string;
};

type WorkstationLayout = {
  id: LayoutId;
  label: string;
  description: string;
  seatPattern: number[][];
  supportedSeries: WorkstationSeries[];
};

type OptionDefinition<T extends string> = {
  id: T;
  label: string;
  extraPerSeat: number;
};

type SuggestedSystem = {
  name: string;
  hint: string;
  image: string;
  href: string;
};

const WORKSTATION_SERIES: WorkstationSeries[] = [
  "Desking Series",
  "Panel Series",
  "Height Adjustable Series",
];

const WORKSTATION_LAYOUTS: WorkstationLayout[] = [
  {
    id: "linear-bench",
    label: "Linear bench",
    description: "Straight benching modules for dense planning.",
    seatPattern: [[1], [1]],
    supportedSeries: ["Desking Series", "Panel Series", "Height Adjustable Series"],
  },
  {
    id: "double-bank",
    label: "Double bank",
    description: "Back-to-back desk banks with shared spine.",
    seatPattern: [
      [1, 1],
      [1, 1],
    ],
    supportedSeries: ["Desking Series", "Panel Series", "Height Adjustable Series"],
  },
  {
    id: "cluster-4",
    label: "Cluster of 4",
    description: "Compact 4-seat module for operations teams.",
    seatPattern: [
      [1, 1],
      [1, 1],
    ],
    supportedSeries: ["Desking Series", "Panel Series"],
  },
  {
    id: "cluster-6",
    label: "Cluster of 6",
    description: "High-density module for larger teams.",
    seatPattern: [
      [1, 1, 1],
      [1, 1, 1],
    ],
    supportedSeries: ["Desking Series", "Panel Series"],
  },
  {
    id: "l-pod",
    label: "L-shape pod",
    description: "Hybrid pod for task-plus-storage use.",
    seatPattern: [
      [1, 1],
      [1, 0],
    ],
    supportedSeries: ["Desking Series", "Panel Series", "Height Adjustable Series"],
  },
];

const SCREEN_OPTIONS: OptionDefinition<ScreenId>[] = [
  { id: "none", label: "No screens", extraPerSeat: 0 },
  { id: "acrylic", label: "Acrylic screens", extraPerSeat: 1200 },
  { id: "fabric", label: "Fabric screens", extraPerSeat: 1800 },
  { id: "glass", label: "Glass-top screens", extraPerSeat: 2400 },
];

const MODESTY_OPTIONS: OptionDefinition<ModestyId>[] = [
  { id: "none", label: "No modesty panel", extraPerSeat: 0 },
  { id: "metal", label: "Metal modesty panel", extraPerSeat: 900 },
  { id: "perforated", label: "Perforated modesty panel", extraPerSeat: 1100 },
  { id: "fabric", label: "Fabric modesty panel", extraPerSeat: 1400 },
];

const RACEWAY_OPTIONS: OptionDefinition<RacewayId>[] = [
  { id: "none", label: "No raceway", extraPerSeat: 0 },
  { id: "tray", label: "Underdesk tray", extraPerSeat: 700 },
  { id: "spine", label: "Spine raceway", extraPerSeat: 1300 },
  { id: "full-power-beam", label: "Full power beam", extraPerSeat: 1900 },
];

const STORAGE_MODE_OPTIONS: OptionDefinition<StorageModeId>[] = [
  { id: "none", label: "No pedestal", extraPerSeat: 0 },
  { id: "shared-pedestal", label: "Shared pedestal", extraPerSeat: 1100 },
  { id: "individual-pedestal", label: "Individual pedestal", extraPerSeat: 2200 },
  { id: "overhead", label: "Overhead storage", extraPerSeat: 1900 },
];

const STORAGE_LAYOUT_OPTIONS = ["Wall run", "Dual aisle", "Compactor zone", "Locker bank"] as const;

const FINISH_OPTIONS = [
  "Warm Oak",
  "Light Maple",
  "Concrete Grey",
  "Matte White",
  "Matte Black",
  "Custom finish",
] as const;

const SERIES_BASE_SEAT_PRICE: Record<WorkstationSeries, number> = {
  "Desking Series": 18500,
  "Panel Series": 24500,
  "Height Adjustable Series": 41000,
};

const STORAGE_BASE_UNIT_PRICE = 12000;

const SERIES_SUGGESTIONS: Record<WorkstationSeries, SuggestedSystem[]> = {
  "Desking Series": [
    {
      name: "DeskPro",
      hint: "Modular desking for linear and cluster plans.",
      image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
      href: "/products/workstations",
    },
    {
      name: "Linear Workstation",
      hint: "Benching-oriented plan for high seat density.",
      image: "/images/products/linear-workstation-1.webp",
      href: "/products/workstations",
    },
  ],
  "Panel Series": [
    {
      name: "Panel Pro",
      hint: "Screen-integrated workstations with better zoning.",
      image: "/images/products/deskpro-workstation-1.webp",
      href: "/products/workstations",
    },
    {
      name: "Curvivo",
      hint: "Flexible panel modules for evolving floor plans.",
      image: "/images/products/60x30-workstation-1.webp",
      href: "/products/workstations",
    },
  ],
  "Height Adjustable Series": [
    {
      name: "Tectara",
      hint: "Sit-stand layouts for premium ergonomic deployment.",
      image: "/images/products/60x30-workstation-2.webp",
      href: "/products/workstations",
    },
    {
      name: "X-Bench",
      hint: "Collaborative modular system with adjustable options.",
      image: "/images/products/deskpro-workstation-2.webp",
      href: "/products/workstations",
    },
  ],
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function clampInteger(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function optionExtra<T extends string>(options: OptionDefinition<T>[], id: T): number {
  return options.find((option) => option.id === id)?.extraPerSeat ?? 0;
}

function countSeats(pattern: number[][]): number {
  return pattern.reduce(
    (total, row) => total + row.reduce((rowTotal, slot) => rowTotal + (slot ? 1 : 0), 0),
    0,
  );
}

function normalizePatternWidth(pattern: number[][]): number {
  return pattern.reduce((max, row) => Math.max(max, row.length), 0);
}

export function Simple2DConfigurator({
  defaultType = "workstations",
}: {
  defaultType?: ProjectType;
}) {
  const pathname = usePathname();

  const [form, setForm] = useState<ConfigForm>({
    projectType: defaultType,
    workstationSeries: "Desking Series",
    layoutId: "linear-bench",
    moduleCount: 6,
    modulesPerRow: 3,
    deskWidth: 1200,
    deskDepth: 600,
    aisleWidth: 1050,
    screen: "acrylic",
    screenHeight: 450,
    modesty: "metal",
    raceway: "spine",
    powerPerSeat: 1,
    dataPerSeat: 1,
    storageMode: "shared-pedestal",
    storageLayout: "Wall run",
    storageRows: 4,
    storageColumns: 4,
    storageUnits: 10,
    finish: "Warm Oak",
    roomWidth: 9000,
    roomLength: 14000,
    roomClearance: 450,
    clientName: "",
    projectName: "",
    siteLocation: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [submit, setSubmit] = useState<SubmitState>({
    loading: false,
    error: "",
    queryId: "",
  });

  const layoutOptions = useMemo(
    () =>
      WORKSTATION_LAYOUTS.filter((layout) => layout.supportedSeries.includes(form.workstationSeries)),
    [form.workstationSeries],
  );

  const activeLayout = useMemo(
    () => layoutOptions.find((layout) => layout.id === form.layoutId) ?? layoutOptions[0],
    [layoutOptions, form.layoutId],
  );

  const moduleCount = clampInteger(form.moduleCount, 1, 80);
  const modulesPerRow = clampInteger(form.modulesPerRow, 1, 10);
  const storageRows = clampInteger(form.storageRows, 1, 12);
  const storageColumns = clampInteger(form.storageColumns, 1, 12);
  const storageTotalCells = clampInteger(storageRows * storageColumns, 1, 144);
  const storageUnits = clampInteger(form.storageUnits, 1, storageTotalCells);

  const moduleRows = useMemo(
    () => Math.ceil(moduleCount / modulesPerRow),
    [moduleCount, modulesPerRow],
  );

  const modulePatternRows = activeLayout?.seatPattern.length ?? 1;
  const modulePatternCols = activeLayout ? normalizePatternWidth(activeLayout.seatPattern) : 1;
  const seatsPerModule = activeLayout ? countSeats(activeLayout.seatPattern) : 1;
  const totalWorkstationSeats = moduleCount * seatsPerModule;
  const totalSeatsOrUnits = form.projectType === "workstations" ? totalWorkstationSeats : storageUnits;

  const roughWidthMm =
    form.projectType === "workstations"
      ? modulesPerRow * modulePatternCols * form.deskWidth + (modulesPerRow - 1) * form.aisleWidth
      : storageColumns * 900;

  const roughDepthMm =
    form.projectType === "workstations"
      ? moduleRows * modulePatternRows * form.deskDepth + (moduleRows - 1) * form.aisleWidth
      : storageRows * 600;

  const roomWidthMm = clampInteger(form.roomWidth, 3000, 50000);
  const roomLengthMm = clampInteger(form.roomLength, 3000, 50000);
  const roomClearanceMm = clampInteger(form.roomClearance, 0, 1500);
  const usableRoomWidthMm = Math.max(0, roomWidthMm - roomClearanceMm * 2);
  const usableRoomLengthMm = Math.max(0, roomLengthMm - roomClearanceMm * 2);

  const fitsAsDrawn = roughWidthMm <= usableRoomWidthMm && roughDepthMm <= usableRoomLengthMm;
  const fitsRotated = roughDepthMm <= usableRoomWidthMm && roughWidthMm <= usableRoomLengthMm;
  const fitOrientation = fitsAsDrawn ? "as-drawn" : fitsRotated ? "rotated" : "overflow";

  const fitWidthLimit = fitOrientation === "rotated" ? usableRoomLengthMm : usableRoomWidthMm;
  const fitDepthLimit = fitOrientation === "rotated" ? usableRoomWidthMm : usableRoomLengthMm;
  const overflowWidthMm = Math.max(0, roughWidthMm - fitWidthLimit);
  const overflowDepthMm = Math.max(0, roughDepthMm - fitDepthLimit);
  const roomAreaSqm = (roomWidthMm * roomLengthMm) / 1_000_000;
  const planAreaSqm = (roughWidthMm * roughDepthMm) / 1_000_000;
  const planCoveragePercent = roomAreaSqm > 0 ? Math.min(999, (planAreaSqm / roomAreaSqm) * 100) : 0;
  const areaPerSeatOrUnit = totalSeatsOrUnits > 0 ? roomAreaSqm / totalSeatsOrUnits : 0;

  const pricing = useMemo(() => {
    if (form.projectType === "storages") {
      const storageTotal = storageUnits * STORAGE_BASE_UNIT_PRICE;
      return {
        low: Math.round(storageTotal * 0.9),
        high: Math.round(storageTotal * 1.1),
      };
    }

    const perSeat =
      SERIES_BASE_SEAT_PRICE[form.workstationSeries] +
      optionExtra(SCREEN_OPTIONS, form.screen) +
      optionExtra(MODESTY_OPTIONS, form.modesty) +
      optionExtra(RACEWAY_OPTIONS, form.raceway) +
      optionExtra(STORAGE_MODE_OPTIONS, form.storageMode) +
      form.powerPerSeat * 650 +
      form.dataPerSeat * 450;

    const total = totalWorkstationSeats * perSeat;
    return {
      low: Math.round(total * 0.9),
      high: Math.round(total * 1.12),
    };
  }, [
    form.dataPerSeat,
    form.modesty,
    form.powerPerSeat,
    form.projectType,
    form.raceway,
    form.screen,
    form.storageMode,
    form.workstationSeries,
    storageUnits,
    totalWorkstationSeats,
  ]);

  const drawing = useMemo(() => {
    if (form.projectType === "storages") {
      const cells = Array.from({ length: storageTotalCells }, (_, index) => {
        const row = Math.floor(index / storageColumns);
        const column = index % storageColumns;
        return {
          x: column,
          y: row,
          active: index < storageUnits,
        };
      });
      return {
        cells,
        gridRows: storageRows,
        gridCols: storageColumns,
        racewayCenters: [] as number[],
      };
    }

    if (!activeLayout) {
      return {
        cells: [] as Array<{ x: number; y: number; active: boolean }>,
        gridRows: 1,
        gridCols: 1,
        racewayCenters: [] as number[],
      };
    }

    const pattern = activeLayout.seatPattern;
    const patternRows = pattern.length;
    const patternCols = normalizePatternWidth(pattern);
    const cells: Array<{ x: number; y: number; active: boolean }> = [];

    for (let moduleIndex = 0; moduleIndex < moduleCount; moduleIndex += 1) {
      const moduleRow = Math.floor(moduleIndex / modulesPerRow);
      const moduleCol = moduleIndex % modulesPerRow;
      const originY = moduleRow * (patternRows + 1);
      const originX = moduleCol * (patternCols + 1);

      for (let row = 0; row < patternRows; row += 1) {
        for (let col = 0; col < patternCols; col += 1) {
          const active = Boolean(pattern[row]?.[col]);
          if (!active) continue;
          cells.push({
            x: originX + col,
            y: originY + row,
            active: true,
          });
        }
      }
    }

    const gridRows = moduleRows * patternRows + Math.max(0, moduleRows - 1);
    const gridCols = modulesPerRow * patternCols + Math.max(0, modulesPerRow - 1);

    const racewayCenters: number[] = [];
    if (form.raceway !== "none") {
      for (let row = 0; row < moduleRows; row += 1) {
        racewayCenters.push(row * (patternRows + 1) + Math.floor(patternRows / 2));
      }
    }

    return {
      cells,
      gridRows,
      gridCols,
      racewayCenters,
    };
  }, [
    activeLayout,
    form.projectType,
    form.raceway,
    moduleCount,
    moduleRows,
    modulesPerRow,
    storageColumns,
    storageRows,
    storageTotalCells,
    storageUnits,
  ]);

  const suggestedSystems = SERIES_SUGGESTIONS[form.workstationSeries];
  const canSubmit = form.name.trim() && form.email.trim();

  const screenLabel = SCREEN_OPTIONS.find((option) => option.id === form.screen)?.label ?? "No screens";
  const modestyLabel =
    MODESTY_OPTIONS.find((option) => option.id === form.modesty)?.label ?? "No modesty panel";
  const racewayLabel =
    RACEWAY_OPTIONS.find((option) => option.id === form.raceway)?.label ?? "No raceway";

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setSubmit((prev) => ({
        ...prev,
        error: "Please add name and email to submit this configuration.",
      }));
      return;
    }

    setSubmit({ loading: true, error: "", queryId: "" });

    const summaryLines =
      form.projectType === "workstations"
        ? [
            "Full workstation module enquiry",
            `Series: ${form.workstationSeries}`,
            `Layout: ${activeLayout?.label || form.layoutId}`,
            `Modules: ${moduleCount}`,
            `Modules per row: ${modulesPerRow}`,
            `Seats per module: ${seatsPerModule}`,
            `Total seats: ${totalWorkstationSeats}`,
            `Desk size: ${form.deskWidth} x ${form.deskDepth} mm`,
            `Aisle width: ${form.aisleWidth} mm`,
            `Screen: ${screenLabel} (${form.screenHeight} mm)`,
            `Modesty: ${modestyLabel}`,
            `Raceway: ${racewayLabel}`,
            `Power points per seat: ${form.powerPerSeat}`,
            `Data points per seat: ${form.dataPerSeat}`,
            `Storage mode: ${STORAGE_MODE_OPTIONS.find((option) => option.id === form.storageMode)?.label || "None"}`,
            `Rough footprint: ${roughWidthMm} x ${roughDepthMm} mm`,
            `Room size: ${roomWidthMm} x ${roomLengthMm} mm`,
            `Perimeter clearance: ${roomClearanceMm} mm`,
            `Usable planning zone: ${usableRoomWidthMm} x ${usableRoomLengthMm} mm`,
            `Fit check: ${fitOrientation === "overflow" ? `Overflow by ${overflowWidthMm} x ${overflowDepthMm} mm` : fitOrientation === "rotated" ? "Fits with rotated orientation" : "Fits as drawn"}`,
            `Area per seat: ${areaPerSeatOrUnit.toFixed(2)} sq m`,
            `Finish: ${form.finish}`,
            `Estimated budget: ${CURRENCY_FORMATTER.format(pricing.low)} to ${CURRENCY_FORMATTER.format(pricing.high)}`,
          ]
        : [
            "2D storage module enquiry",
            `Layout: ${form.storageLayout}`,
            `Rows x columns: ${storageRows} x ${storageColumns}`,
            `Units: ${storageUnits}`,
            `Rough footprint: ${roughWidthMm} x ${roughDepthMm} mm`,
            `Room size: ${roomWidthMm} x ${roomLengthMm} mm`,
            `Perimeter clearance: ${roomClearanceMm} mm`,
            `Usable planning zone: ${usableRoomWidthMm} x ${usableRoomLengthMm} mm`,
            `Fit check: ${fitOrientation === "overflow" ? `Overflow by ${overflowWidthMm} x ${overflowDepthMm} mm` : fitOrientation === "rotated" ? "Fits with rotated orientation" : "Fits as drawn"}`,
            `Area per unit: ${areaPerSeatOrUnit.toFixed(2)} sq m`,
            `Finish: ${form.finish}`,
            `Estimated budget: ${CURRENCY_FORMATTER.format(pricing.low)} to ${CURRENCY_FORMATTER.format(pricing.high)}`,
          ];

    if (form.clientName.trim()) summaryLines.push(`End client: ${form.clientName.trim()}`);
    if (form.projectName.trim()) summaryLines.push(`Project name: ${form.projectName.trim()}`);
    if (form.siteLocation.trim()) summaryLines.push(`Site location: ${form.siteLocation.trim()}`);
    if (form.company.trim()) summaryLines.push(`Company: ${form.company.trim()}`);
    if (form.notes.trim()) summaryLines.push(`Notes: ${form.notes.trim()}`);

    try {
      const response = await fetch("/api/customer-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company || undefined,
          message: summaryLines.join("\n"),
          requirement:
            form.projectType === "workstations"
              ? "Full workstation module configuration"
              : "2D storage configuration",
          preferredContact: form.phone.trim() ? "phone" : "email",
          source: form.projectType === "workstations" ? "configurator-workstation-module" : "configurator-2d",
          sourcePath: pathname,
        }),
      });

      const json = (await response.json()) as { queryId?: string; error?: string };
      if (!response.ok || !json.queryId) {
        setSubmit({
          loading: false,
          error: json.error || "Unable to submit this configuration right now.",
          queryId: "",
        });
        return;
      }

      setSubmit({ loading: false, error: "", queryId: json.queryId });
    } catch {
      setSubmit({
        loading: false,
        error: "Network error while sending your enquiry.",
        queryId: "",
      });
    }
  }

  const cellSize = 28;
  const svgWidth = Math.max(1, drawing.gridCols) * cellSize;
  const svgHeight = Math.max(1, drawing.gridRows) * cellSize;
  const fitStatusText =
    fitOrientation === "overflow"
      ? `Over by ${Math.round(overflowWidthMm / 10) / 100}m x ${Math.round(overflowDepthMm / 10) / 100}m`
      : fitOrientation === "rotated"
        ? "Fits after rotating layout"
        : "Fits within room";
  const fitStatusTone =
    fitOrientation === "overflow"
      ? "text-rose-200 border-rose-300/60 bg-rose-500/20"
      : "text-emerald-100 border-emerald-300/50 bg-emerald-500/15";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 p-5 text-white md:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(20,52,203,0.42),transparent_40%),radial-gradient(circle_at_100%_100%,rgba(29,78,216,0.22),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:26px_26px]" />

        <div className="relative z-10 mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="typ-label mb-2 text-white/70">Planning studio</p>
            <h2 className="text-2xl font-light tracking-tight text-white">
              {form.projectType === "workstations" ? "Live workstation module map" : "Live storage module map"}
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Rough drawing updates instantly as you change layout, room size, screens, modesty, and raceway
              selections.
            </p>
          </div>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            {totalSeatsOrUnits} {form.projectType === "workstations" ? "seats" : "units"}
          </span>
        </div>

        <div className="relative z-10 overflow-hidden rounded-2xl border border-white/20 bg-[#0e1424] p-4 shadow-[0_32px_80px_-36px_rgba(0,0,0,0.65)]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="h-auto w-full"
            role="img"
            aria-label="Rough workstation drawing"
          >
            <rect x={0} y={0} width={svgWidth} height={svgHeight} fill="#111b31" />

            {drawing.racewayCenters.map((rowCenter, index) => {
              const y = rowCenter * cellSize + cellSize / 2;
              return (
                <line
                  key={`raceway-${index}`}
                  x1={2}
                  y1={y}
                  x2={svgWidth - 2}
                  y2={y}
                  stroke={form.raceway === "full-power-beam" ? "#facc15" : "#38bdf8"}
                  strokeWidth={form.raceway === "full-power-beam" ? 4 : 2}
                  strokeDasharray={form.raceway === "tray" ? "6 4" : "0"}
                  opacity={0.85}
                />
              );
            })}

            {drawing.cells.map((cell, index) => {
              const x = cell.x * cellSize + 2;
              const y = cell.y * cellSize + 2;
              const width = cellSize - 4;
              const height = cellSize - 4;

              return (
                <g key={`${cell.x}-${cell.y}-${index}`}>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={5}
                    fill={form.projectType === "workstations" ? "#102f71" : "#0f766e"}
                    stroke={form.projectType === "workstations" ? "#93c5fd" : "#99f6e4"}
                    strokeWidth={1.2}
                  />

                  {form.projectType === "workstations" && form.screen !== "none" ? (
                    <line
                      x1={x + 3}
                      y1={y + 4}
                      x2={x + width - 3}
                      y2={y + 4}
                      stroke={form.screen === "glass" ? "#e2e8f0" : "#93c5fd"}
                      strokeWidth={form.screenHeight >= 530 ? 3 : 2}
                      opacity={0.92}
                    />
                  ) : null}

                  {form.projectType === "workstations" && form.modesty !== "none" ? (
                    <line
                      x1={x + 3}
                      y1={y + height - 4}
                      x2={x + width - 3}
                      y2={y + height - 4}
                      stroke="#f8fafc"
                      strokeWidth={2}
                      opacity={0.75}
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="relative z-10 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">Total seats/units</p>
            <p className="mt-1 text-2xl font-light text-white">{totalSeatsOrUnits}</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">Rough footprint</p>
            <p className="mt-1 text-2xl font-light text-white">
              {Math.round(roughWidthMm / 1000)}m x {Math.round(roughDepthMm / 1000)}m
            </p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">Room fit check</p>
            <p className="mt-1 text-sm font-semibold text-white">{fitStatusText}</p>
            <p className="mt-1 text-xs text-white/70">
              Room {Math.round(roomWidthMm / 1000)}m x {Math.round(roomLengthMm / 1000)}m
            </p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">Budget range</p>
            <p className="mt-1 text-lg font-medium text-white">
              {CURRENCY_FORMATTER.format(pricing.low)} - {CURRENCY_FORMATTER.format(pricing.high)}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${fitStatusTone}`}>
            {fitStatusText}
          </span>
          <span className="rounded-full border border-white/25 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/80">
            Coverage {Math.round(planCoveragePercent)}%
          </span>
          <span className="rounded-full border border-white/25 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/80">
            {areaPerSeatOrUnit.toFixed(2)} sq m / {form.projectType === "workstations" ? "seat" : "unit"}
          </span>
        </div>

        {form.projectType === "workstations" ? (
          <>
            <div className="relative z-10 mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/[0.12] px-3 py-1 text-xs font-semibold text-white">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                {screenLabel}
              </span>
              <span className="rounded-full border border-white/30 bg-white/[0.12] px-3 py-1 text-xs font-semibold text-white">
                {modestyLabel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/[0.12] px-3 py-1 text-xs font-semibold text-white">
                <Cable className="h-3.5 w-3.5 text-cyan-300" />
                {racewayLabel}
              </span>
            </div>

            <div className="relative z-10 mt-6">
              <p className="typ-label mb-3 text-white/70">Suggested workstation systems</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestedSystems.map((system) => (
                  <Link
                    key={system.name}
                    href={system.href}
                    className="group overflow-hidden rounded-xl border border-white/20 bg-white/[0.08]"
                  >
                    <div className="relative aspect-[16/10] bg-neutral-800">
                      <Image
                        src={system.image}
                        alt={system.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-base font-medium text-white">{system.name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/75">{system.hint}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.35)] md:p-7">
        <form className="space-y-5" onSubmit={submitEnquiry}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="typ-label mb-2 text-neutral-700">Configuration setup</p>
              <h3 className="text-2xl font-light tracking-tight text-neutral-950">Full modular configurator</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Select module logic, add room and client context, then send a quote-ready requirement.
              </p>
            </div>
            <div className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 sm:block">
              5-stage flow
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-1">
            {(["workstations", "storages"] as ProjectType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    projectType: type,
                  }))
                }
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                  form.projectType === type
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-transparent bg-transparent text-neutral-700 hover:border-neutral-300 hover:bg-white"
                }`}
              >
                {type === "workstations" ? (
                  <Grid3X3 className="h-4 w-4" />
                ) : (
                  <Layers3 className="h-4 w-4" />
                )}
                {type}
              </button>
            ))}
          </div>

          {form.projectType === "workstations" ? (
            <>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
                  Stage 1: system and layout
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Series</span>
                    <select
                      value={form.workstationSeries}
                      onChange={(event) =>
                        setForm((prev) => {
                          const workstationSeries = event.target.value as WorkstationSeries;
                          const nextLayoutOptions = WORKSTATION_LAYOUTS.filter((layout) =>
                            layout.supportedSeries.includes(workstationSeries),
                          );
                          const layoutId = nextLayoutOptions.some((layout) => layout.id === prev.layoutId)
                            ? prev.layoutId
                            : (nextLayoutOptions[0]?.id ?? prev.layoutId);
                          return {
                            ...prev,
                            workstationSeries,
                            layoutId,
                          };
                        })
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {WORKSTATION_SERIES.map((series) => (
                        <option key={series} value={series}>
                          {series}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Layout</span>
                    <select
                      value={activeLayout?.id || form.layoutId}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          layoutId: event.target.value as LayoutId,
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {layoutOptions.map((layout) => (
                        <option key={layout.id} value={layout.id}>
                          {layout.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-neutral-500">{activeLayout?.description}</p>
                  </label>

                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Module count</span>
                    <input
                      type="number"
                      min={1}
                      max={80}
                      value={moduleCount}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          moduleCount: clampInteger(Number(event.target.value), 1, 80),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Modules per row</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={modulesPerRow}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          modulesPerRow: clampInteger(Number(event.target.value), 1, 10),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Aisle width (mm)</span>
                    <select
                      value={form.aisleWidth}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          aisleWidth: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {[900, 1050, 1200].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Finish</span>
                    <select
                      value={form.finish}
                      onChange={(event) => setForm((prev) => ({ ...prev, finish: event.target.value }))}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {FINISH_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
                  Stage 2: module and room dimensions
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Desk width (mm)</span>
                    <select
                      value={form.deskWidth}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          deskWidth: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {[1200, 1350, 1500].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Desk depth (mm)</span>
                    <select
                      value={form.deskDepth}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          deskDepth: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {[600, 750].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Room width (mm)</span>
                    <input
                      type="number"
                      min={3000}
                      max={50000}
                      value={roomWidthMm}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          roomWidth: clampInteger(Number(event.target.value), 3000, 50000),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Room length (mm)</span>
                    <input
                      type="number"
                      min={3000}
                      max={50000}
                      value={roomLengthMm}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          roomLength: clampInteger(Number(event.target.value), 3000, 50000),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Perimeter clearance (mm)</span>
                    <select
                      value={roomClearanceMm}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          roomClearance: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {[0, 300, 450, 600, 750, 900].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="mt-3 text-xs text-neutral-600">
                  Fit check:{" "}
                  <span className={fitOrientation === "overflow" ? "font-semibold text-rose-700" : "font-semibold text-emerald-700"}>
                    {fitStatusText}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
                  Stage 3: technical options
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Screens</span>
                    <select
                      value={form.screen}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          screen: event.target.value as ScreenId,
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {SCREEN_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Screen height (mm)</span>
                    <select
                      value={form.screenHeight}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          screenHeight: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                      disabled={form.screen === "none"}
                    >
                      {[300, 450, 530, 600].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Modesty panel</span>
                    <select
                      value={form.modesty}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          modesty: event.target.value as ModestyId,
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {MODESTY_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Raceway</span>
                    <select
                      value={form.raceway}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          raceway: event.target.value as RacewayId,
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {RACEWAY_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Power points per seat</span>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={form.powerPerSeat}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          powerPerSeat: clampInteger(Number(event.target.value), 0, 4),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Data points per seat</span>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={form.dataPerSeat}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          dataPerSeat: clampInteger(Number(event.target.value), 0, 4),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700 sm:col-span-3">
                    <span>Storage add-on</span>
                    <select
                      value={form.storageMode}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          storageMode: event.target.value as StorageModeId,
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {STORAGE_MODE_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
                  Stage 1: storage module setup
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Layout style</span>
                    <select
                      value={form.storageLayout}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          storageLayout: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {STORAGE_LAYOUT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Finish</span>
                    <select
                      value={form.finish}
                      onChange={(event) => setForm((prev) => ({ ...prev, finish: event.target.value }))}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {FINISH_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Rows</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={storageRows}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          storageRows: clampInteger(Number(event.target.value), 1, 12),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Columns</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={storageColumns}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          storageColumns: clampInteger(Number(event.target.value), 1, 12),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700 sm:col-span-2">
                    <span>Units</span>
                    <input
                      type="number"
                      min={1}
                      max={144}
                      value={storageUnits}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          storageUnits: clampInteger(Number(event.target.value), 1, 144),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
                  Stage 2: room dimensions
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Room width (mm)</span>
                    <input
                      type="number"
                      min={3000}
                      max={50000}
                      value={roomWidthMm}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          roomWidth: clampInteger(Number(event.target.value), 3000, 50000),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Room length (mm)</span>
                    <input
                      type="number"
                      min={3000}
                      max={50000}
                      value={roomLengthMm}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          roomLength: clampInteger(Number(event.target.value), 3000, 50000),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-neutral-700">
                    <span>Perimeter clearance (mm)</span>
                    <select
                      value={roomClearanceMm}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          roomClearance: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-primary/60"
                    >
                      {[0, 300, 450, 600, 750, 900].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="mt-3 text-xs text-neutral-600">
                  Fit check:{" "}
                  <span className={fitOrientation === "overflow" ? "font-semibold text-rose-700" : "font-semibold text-emerald-700"}>
                    {fitStatusText}
                  </span>
                </p>
              </div>
            </>
          )}

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
              Stage 4: project and client context
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="End client (optional)"
                value={form.clientName}
                onChange={(event) => setForm((prev) => ({ ...prev, clientName: event.target.value }))}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary/60"
              />
              <input
                type="text"
                placeholder="Project name (optional)"
                value={form.projectName}
                onChange={(event) => setForm((prev) => ({ ...prev, projectName: event.target.value }))}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary/60"
              />
              <input
                type="text"
                placeholder="Site location (city/state)"
                value={form.siteLocation}
                onChange={(event) => setForm((prev) => ({ ...prev, siteLocation: event.target.value }))}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary/60"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={form.company}
                onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary/60"
              />
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
              Stage 5: contact and submission
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary/60"
              />
              <input
                type="email"
                placeholder="Work email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary/60"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary/60"
              />
              <textarea
                rows={3}
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary/60 sm:col-span-2"
              />
            </div>
          </div>

          {submit.error ? <p className="text-sm text-red-600">{submit.error}</p> : null}
          {submit.queryId ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Configuration sent. Reference: <span className="font-semibold">{submit.queryId}</span>
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submit.loading || !canSubmit}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submit.loading ? "Sending..." : "Submit configuration"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              href={form.projectType === "workstations" ? "/products/workstations" : "/products/storages"}
              className="btn-outline"
            >
              View matching products
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
