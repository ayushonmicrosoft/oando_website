import { HomepageHero } from "@/components/home/HomepageHero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SolutionsGrid } from "@/components/home/SolutionsGrid";
import { OurExperience } from "@/components/home/OurExperience";
import { ProcessSection } from "@/components/home/ProcessSection";
import { PartnershipBanner } from "@/components/home/PartnershipBanner";
import { WorkspaceShowcase } from "@/components/home/WorkspaceShowcase";
import { ClientStories } from "@/components/home/ClientStories";
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
        <WorkspaceShowcase />
      </SectionReveal>

      <SectionReveal>
        <ClientStories />
      </SectionReveal>

      <SectionReveal>
        <SolutionsGrid />
      </SectionReveal>

      <SectionReveal>
        <OurExperience clientCount={stats.clientOrganisations} />
      </SectionReveal>

      <SectionReveal>
        <ProcessSection />
      </SectionReveal>

      <SectionReveal>
        <PartnershipBanner />
      </SectionReveal>

      <SectionReveal>
        <ContactTeaser />
      </SectionReveal>
    </div>
  );
}
