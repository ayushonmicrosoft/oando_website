import { Hero } from "@/components/home/Hero";
import { Simple2DConfigurator } from "@/components/configurator/Simple2DConfigurator";
import { CONFIGURATOR_PAGE_COPY } from "@/data/site/routeCopy";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiValuePlus } from "@/lib/kpiFormat";

export default async function ConfiguratorPage({
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
      <Hero
        variant="small"
        title={CONFIGURATOR_PAGE_COPY.heroTitle}
        subtitle={CONFIGURATOR_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/catalog/oando-workstations--deskpro/image-1.webp"
      />

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-12">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              stats.clientOrganisations,
              stats.projectsDelivered,
              stats.sectorsServed,
            ].map((value, index) => (
              <div key={CONFIGURATOR_PAGE_COPY.statsLabels[index]} className="rounded-lg border border-neutral-300 bg-white px-5 py-4">
                <p className="text-2xl text-neutral-950">{formatKpiValuePlus(value)}</p>
                <p className="text-sm text-neutral-700">{CONFIGURATOR_PAGE_COPY.statsLabels[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-6 py-16 md:py-20 2xl:px-0">
        <Simple2DConfigurator defaultType={defaultType} />
      </section>
    </section>
  );
}
