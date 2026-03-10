import { HomepageHero } from "@/components/home/HomepageHero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { TrustedClients } from "@/components/home/TrustedClients";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiAsOf } from "@/lib/kpiFormat";

export default async function Home() {
  const { stats } = await getBusinessStats();
  const asOfLabel = formatKpiAsOf(stats.asOfDate);

  return (
    <div className="min-h-screen bg-white">
      <HomepageHero />

      <SectionReveal>
        <TrustStrip stats={stats} asOfLabel={asOfLabel} />
      </SectionReveal>

      <SectionReveal>
        <TrustedClients />
      </SectionReveal>

      <SectionReveal>
        <ContactTeaser />
      </SectionReveal>
    </div>
  );
}
