import Link from "next/link";
import Image from "next/image";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import {
  CONFIGURATOR_PAGE_COPY,
  PLANNING_PAGE_COPY,
  PLANNING_PAGE_DELIVERABLES,
  PLANNING_PAGE_STEPS,
} from "@/data/site/routeCopy";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiValuePlus } from "@/lib/kpiFormat";

export default async function PlanningPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawType = Array.isArray(resolvedSearchParams.type)
    ? resolvedSearchParams.type[0]
    : resolvedSearchParams.type;
  const defaultType = rawType === "storages" ? "storages" : "workstations";
  const { stats } = await getBusinessStats();

  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <section className="w-full border-b border-neutral-200 bg-[linear-gradient(180deg,#fafbfd_0%,#f4f6fa_100%)]">
        <div className="container grid grid-cols-1 gap-8 px-6 py-16 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-end 2xl:px-0">
          <div className="max-w-2xl">
            <p className="typ-label mb-4 text-neutral-600">{PLANNING_PAGE_COPY.workflowKicker}</p>
            <h1 className="text-4xl font-light tracking-tight text-neutral-950 md:text-6xl">
              {PLANNING_PAGE_COPY.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-700">
              {PLANNING_PAGE_COPY.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#planner" className="btn-primary">
                {PLANNING_PAGE_COPY.primaryCta}
              </Link>
              <Link href="/products" className="btn-outline">
                {PLANNING_PAGE_COPY.secondaryCta}
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-3 shadow-[0_32px_80px_-56px_rgba(15,23,42,0.25)]">
            <Image
              src="/images/catalog/oando-workstations--deskpro/image-1.webp"
              alt="Workspace planning service"
              width={1400}
              height={900}
              className="aspect-16/10 w-full rounded-[24px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-12">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              stats.clientOrganisations,
              stats.projectsDelivered,
              stats.sectorsServed,
            ].map((value, index) => (
              <div
                key={CONFIGURATOR_PAGE_COPY.statsLabels[index]}
                className="rounded-lg border border-neutral-300 bg-white px-5 py-4"
              >
                <p className="text-2xl text-neutral-950">{formatKpiValuePlus(value)}</p>
                <p className="text-sm text-neutral-700">
                  {CONFIGURATOR_PAGE_COPY.statsLabels[index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="planner" className="w-full bg-white py-20 border-b border-neutral-200">
        <div className="container px-6 2xl:px-0 text-center max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-6">Expert Space Planning</p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-6">
            Stop guessing with generic layouts. Let our architects build a precise plan.
          </h2>
          <p className="text-lg text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Every workspace is different. Tell us your headcount, team types, and available footprint, and our interior specialists will provide a custom 2D/3D layout recommendation within 48 hours.
          </p>
          <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-md bg-neutral-900 px-8 py-3 text-sm font-medium tracking-[0.03em] text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
            Request a custom space plan
          </Link>
        </div>
      </section>

      <section className="w-full bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-12 max-w-3xl">
            <p className="typ-label mb-4 text-neutral-700">{PLANNING_PAGE_COPY.workflowKicker}</p>
            <h2 className="typ-section text-neutral-950">{PLANNING_PAGE_COPY.workflowTitle}</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANNING_PAGE_STEPS.map((step) => (
              <article
                key={step.title}
                className="rounded-xl border border-neutral-300 bg-neutral-50 p-6"
              >
                <h3 className="text-2xl font-light tracking-tight text-neutral-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="typ-label mb-4 text-neutral-700">
                {PLANNING_PAGE_COPY.deliverablesKicker}
              </p>
              <h2 className="typ-section text-neutral-950">
                {PLANNING_PAGE_COPY.deliverablesTitle}
              </h2>
              <ul className="mt-6 space-y-3">
                {PLANNING_PAGE_DELIVERABLES.map((item) => (
                  <li key={item} className="text-base text-neutral-800">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-300 bg-white p-6">
              <p className="typ-label mb-3 text-neutral-700">{PLANNING_PAGE_COPY.bestForKicker}</p>
              <p className="text-lg leading-relaxed text-neutral-800">
                {PLANNING_PAGE_COPY.bestForDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="#planner" className="btn-primary">
                  {PLANNING_PAGE_COPY.primaryCta}
                </Link>
                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-400 bg-white px-6 py-3 text-sm font-semibold tracking-[0.08em] text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-50"
                >
                  {PLANNING_PAGE_COPY.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
