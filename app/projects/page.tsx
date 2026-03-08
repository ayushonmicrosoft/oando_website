import { Hero } from "@/components/home/Hero";
import { ClientBadge, type ClientBadgeData } from "@/components/ClientBadge";
import { KpiIntegrityMonitor } from "@/components/analytics/KpiIntegrityMonitor";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiAsOf, formatKpiValuePlus } from "@/lib/kpiFormat";

const ALL_CLIENTS: ClientBadgeData[] = [
  { name: "Adani Power", sector: "Energy" },
  { name: "Adecco", sector: "Corporate" },
  { name: "Ambuja Neotia", sector: "Corporate" },
  { name: "Annapurna Finance", sector: "Finance" },
  { name: "Asian Paints", sector: "FMCG" },
  { name: "Azim Premji Foundation", sector: "NGO / UN" },
  { name: "BBC Media Action", sector: "NGO / UN" },
  { name: "BHEL", sector: "Energy" },
  { name: "Bureau of Indian Standards", sector: "Government" },
  { name: "BNP Paribas", sector: "Finance" },
  { name: "BSPHCL", sector: "Energy", location: "Bihar" },
  { name: "Bandhan Bank", sector: "Finance" },
  { name: "Big Bazaar", sector: "FMCG" },
  { name: "Government of Bihar", sector: "Government", location: "Patna" },
  { name: "Indian Army", sector: "Government" },
  { name: "Birla School", sector: "Education" },
  { name: "CIMP", sector: "Education", location: "Patna" },
  { name: "CRI Pumps", sector: "Manufacturing" },
  { name: "Canara Bank", sector: "Finance" },
  { name: "Coca-Cola", sector: "FMCG" },
  { name: "DMRC", sector: "Government", location: "New Delhi" },
  { name: "Dalmia Bharat Cement", sector: "Manufacturing" },
  { name: "Essel Utilities", sector: "Energy" },
  { name: "FHI 360", sector: "NGO / UN" },
  { name: "Franklin Templeton Investments", sector: "Finance" },
  { name: "D. Goenka School", sector: "Education" },
  { name: "Government of India", sector: "Government" },
  { name: "HDFC", sector: "Finance" },
  { name: "HelpAge India", sector: "NGO / UN" },
  { name: "Hyundai", sector: "Automotive" },
  { name: "IDBI Bank", sector: "Finance" },
  { name: "ITC Limited", sector: "FMCG" },
  { name: "Income Tax Department", sector: "Government" },
  { name: "Indian Bank", sector: "Finance" },
  { name: "IndianOil", sector: "Energy" },
  { name: "Amara Raja", sector: "Manufacturing" },
  { name: "JSW", sector: "Manufacturing" },
  { name: "Janalakshmi", sector: "Finance" },
  { name: "L&T", sector: "Manufacturing" },
  { name: "Maruti Suzuki", sector: "Automotive" },
  { name: "NTPC", sector: "Energy" },
  { name: "NABARD", sector: "Finance" },
  { name: "SAIL", sector: "Manufacturing" },
  { name: "State Bank of India", sector: "Finance" },
  { name: "SITI Networks", sector: "Telecom" },
  { name: "Shriram", sector: "Finance" },
  { name: "Sonalika International", sector: "Manufacturing" },
  { name: "Survey of India", sector: "Government" },
  { name: "Syndicate Bank", sector: "Finance" },
  { name: "Tata Steel", sector: "Manufacturing" },
  { name: "Tata Motors", sector: "Automotive" },
  { name: "Titan", sector: "Manufacturing", location: "Patna, Bihar" },
  { name: "TVS Group", sector: "Automotive" },
  { name: "United Nations", sector: "NGO / UN" },
  { name: "Usha International", sector: "Manufacturing", location: "New Delhi" },
  { name: "Ujjivan Small Finance Bank", sector: "Finance" },
  { name: "UNICEF", sector: "NGO / UN" },
  { name: "United Spirits", sector: "FMCG" },
  { name: "Vodafone", sector: "Telecom" },
  { name: "World Health Organization", sector: "NGO / UN" },
  { name: "ZTE", sector: "Telecom" },
];

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
        title="Our Work"
        subtitle={`${clientsValue} organisations trust One and Only Furniture across Government, Finance, Energy, Manufacturing and more.`}
        showButton={false}
        backgroundImage="/images/hero/hero-2.webp"
      />

      <section className="container-wide py-16 md:py-24">
        {/* Stats row */}
        <div className="stats-block grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 border-b border-neutral-100 pb-16">
          {[
            { id: "client-organisations", value: clientsValue, label: "Client Organisations" },
            { id: "projects-delivered", value: projectsValue, label: "Projects Delivered" },
            { id: "sectors-served", value: sectorsValue, label: "Sectors Served" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p data-testid={`kpi-${stat.id}-projects`} className="typ-stat text-neutral-900 mb-1">
                {stat.value}
              </p>
              <p className="stats-block__label">{stat.label}</p>
            </div>
          ))}
        </div>

        <p data-testid="kpi-as-of-projects" className="-mt-10 mb-16 text-center text-xs font-medium text-neutral-500 tracking-wide">
          {asOfLabel}
        </p>

        {/* Featured clients — first 12, larger display */}
        <div className="mb-12">
          <p className="typ-label text-neutral-400 mb-6">Featured organisations</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ALL_CLIENTS.slice(0, 12).map((client) => (
              <ClientBadge key={client.name} {...client} />
            ))}
          </div>
        </div>

        {/* All clients — remaining, compact grid */}
        <div className="border-t border-neutral-200 pt-12">
          <p className="typ-label text-neutral-400 mb-6">All organisations</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {ALL_CLIENTS.slice(12).map((client) => (
              <ClientBadge key={client.name} {...client} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

