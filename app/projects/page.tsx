import { Hero } from "@/components/home/Hero";
import { ClientBadge } from "@/components/ClientBadge";
import { KpiIntegrityMonitor } from "@/components/analytics/KpiIntegrityMonitor";
import Image from "next/image";
import { GALLERY_PROJECTS, PROJECTS_PAGE_CLIENTS, PROJECTS_PAGE_COPY } from "@/data/site/routeCopy";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiAsOf, formatKpiValuePlus } from "@/lib/kpiFormat";

export default async function ProjectsPage() {
  const { stats, source } = await getBusinessStats();
  const clientsValue = formatKpiValuePlus(stats.clientOrganisations);
  const projectsValue = formatKpiValuePlus(stats.projectsDelivered);
  const sectorsValue = formatKpiValuePlus(stats.sectorsServed);
  const asOfLabel = formatKpiAsOf(stats.asOfDate);

  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <KpiIntegrityMonitor page="projects" source={source} stats={stats} />
      <Hero
        variant="small"
        title={PROJECTS_PAGE_COPY.heroTitle}
        subtitle={PROJECTS_PAGE_COPY.heroSubtitleTemplate.replace("{clients}", clientsValue)}
        showButton={false}
        backgroundImage="/images/hero/hero-2.webp"
      />

      <section className="container-wide py-16 md:py-24">
        <div className="stats-block mb-16 grid grid-cols-1 gap-6 border-b border-neutral-100 pb-16 sm:grid-cols-3">
          {[
            { id: "client-organisations", value: clientsValue, label: "Client Organisations" },
            { id: "projects-delivered", value: projectsValue, label: "Projects Delivered" },
            { id: "sectors-served", value: sectorsValue, label: "Sectors Served" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p data-testid={`kpi-${stat.id}-projects`} className="typ-stat mb-1 text-neutral-900">
                {stat.value}
              </p>
              <p className="stats-block__label">{stat.label}</p>
            </div>
          ))}
        </div>

        <p
          data-testid="kpi-as-of-projects"
          className="-mt-10 mb-16 text-center text-xs font-medium tracking-wide text-neutral-500"
        >
          {asOfLabel}
        </p>

        {/* Photographed Projects / Showroom execution */}
        <div className="mb-24">
          <p className="typ-label mb-8 text-neutral-400">Featured Installations</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GALLERY_PROJECTS.map((project) => (
              <div key={project.title} className="group flex flex-col gap-3">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 tracking-tight">{project.title}</h3>
                  <p className="text-sm text-neutral-500">{project.category} &middot; {project.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <p className="typ-label mb-6 text-neutral-400">{PROJECTS_PAGE_COPY.featuredLabel}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {PROJECTS_PAGE_CLIENTS.slice(0, 12).map((client) => (
              <ClientBadge key={client.name} {...client} />
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-12">
          <p className="typ-label mb-6 text-neutral-400">{PROJECTS_PAGE_COPY.allLabel}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {PROJECTS_PAGE_CLIENTS.slice(12).map((client) => (
              <ClientBadge key={client.name} {...client} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
