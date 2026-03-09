import type { BusinessStats } from "@/lib/types/businessStats";
import { formatKpiValuePlus } from "@/lib/kpiFormat";

interface TrustStripProps {
  stats: BusinessStats;
  asOfLabel: string;
}

export function TrustStrip({ stats, asOfLabel }: TrustStripProps) {
  const kpis = [
    {
      value: formatKpiValuePlus(stats.clientOrganisations),
      label: "Organisations served",
      testId: "kpi-client-organisations",
    },
    {
      value: formatKpiValuePlus(stats.projectsDelivered),
      label: "Projects delivered",
      testId: "kpi-projects-delivered",
    },
    {
      value: `${stats.yearsExperience}+`,
      label: "Years experience",
      testId: "kpi-years-experience",
    },
    { value: formatKpiValuePlus(stats.sectorsServed), label: "Sectors served", testId: undefined },
  ];

  return (
    <section className="w-full border-y border-neutral-200 bg-white py-12 md:py-14" aria-label="Trust indicators">
      <div className="container px-6 2xl:px-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <p className="typ-label text-neutral-700">
            {formatKpiValuePlus(stats.clientOrganisations)} organisations trust us &mdash; from DMRC to Tata Steel
          </p>
          <p data-testid="kpi-as-of-home" className="typ-label text-neutral-700">
            {asOfLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {kpis.map(({ value, label, testId }) => (
            <div
              key={label}
              className="rounded-xl border border-neutral-300 bg-neutral-50 px-5 py-5 md:px-7 md:py-6"
            >
              <span data-testid={testId} className="typ-stat mb-2 block text-neutral-950">
                {value}
              </span>
              <p className="text-sm font-medium text-neutral-800">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
