import Image from "next/image";
import Link from "next/link";
import type { BusinessStats } from "@/lib/types/businessStats";
import { formatKpiValuePlus } from "@/lib/kpiFormat";
import { HOMEPAGE_TRUST_CONTENT } from "@/data/site/homepage";

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
    <section className="home-section border-y border-neutral-200 bg-white py-12 md:py-14" aria-label="Trust indicators">
      <div className="home-shell">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="max-w-lg">
            <p className="home-kicker text-neutral-700">{HOMEPAGE_TRUST_CONTENT.kicker}</p>
            <h2 className="home-heading mt-3">
              {HOMEPAGE_TRUST_CONTENT.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-700">
              {HOMEPAGE_TRUST_CONTENT.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600">
              {HOMEPAGE_TRUST_CONTENT.brands.map((name, index) => (
                <span key={name}>
                  {name}
                  {index < HOMEPAGE_TRUST_CONTENT.brands.length - 1 ? " /" : ""}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <p className="typ-label text-neutral-700">
                {HOMEPAGE_TRUST_CONTENT.summary}
              </p>
              <p data-testid="kpi-as-of-home" className="typ-label text-neutral-700">
                {asOfLabel}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
              {kpis.map(({ value, label, testId }) => (
                <div
                  key={label}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-center"
                >
                  <span data-testid={testId} className="block text-[1.85rem] tracking-tight text-neutral-950 md:text-[2.1rem]">
                    {value}
                  </span>
                  <p className="stats-block__label mt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-12">
          <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
            {HOMEPAGE_TRUST_CONTENT.logoLabel}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {HOMEPAGE_TRUST_CONTENT.logos.map((logo) => (
              <div key={logo.name} className="flex min-h-12 items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={140}
                  height={46}
                  className="h-9 w-auto object-contain opacity-65 grayscale transition hover:opacity-90"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/projects" className="link-arrow typ-label">
              {HOMEPAGE_TRUST_CONTENT.projectsCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
