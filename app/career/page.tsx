import { Briefcase, GraduationCap, Users } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { JobCard } from "@/components/career/JobCard";
import { CAREER_PAGE_COPY, CAREER_PAGE_JOBS } from "@/data/site/routeCopy";

const CAREER_PILLAR_ICONS = {
  users: Users,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
} as const;

export default function CareerPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={CAREER_PAGE_COPY.heroTitle}
        subtitle={CAREER_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/tvs-patna-enhanced.webp"
      />

      <section className="container px-6 py-18 md:py-22 2xl:px-0">
        <div className="mb-12 max-w-4xl space-y-5">
          <p className="typ-label text-neutral-700">{CAREER_PAGE_COPY.introKicker}</p>
          <h2 className="typ-section text-neutral-950">{CAREER_PAGE_COPY.introTitle}</h2>
          <p className="text-lg leading-relaxed text-neutral-800">{CAREER_PAGE_COPY.introDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CAREER_PAGE_COPY.pillars.map((pillar) => {
            const Icon = CAREER_PILLAR_ICONS[pillar.icon];
            return (
              <article key={pillar.title} className="rounded-xl border border-neutral-300 bg-neutral-50 p-7">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="text-2xl font-light text-neutral-950">{pillar.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{pillar.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="typ-section text-neutral-950">{CAREER_PAGE_COPY.openingsTitle}</h2>
            <p className="text-sm font-medium text-neutral-700">
              {CAREER_PAGE_COPY.openingsAvailableTemplate.replace("{count}", String(CAREER_PAGE_JOBS.length))}
            </p>
          </div>

          <div className="space-y-4">
            {CAREER_PAGE_JOBS.map((job) => (
              <JobCard
                key={`${job.title}-${job.department}`}
                title={job.title}
                department={job.department}
                location={job.location}
              />
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-neutral-300 bg-white p-6">
            <h3 className="text-2xl font-light text-neutral-950">{CAREER_PAGE_COPY.fallbackTitle}</h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-800">
              {CAREER_PAGE_COPY.fallbackDescription}
            </p>
            <a
              href={`mailto:${CAREER_PAGE_COPY.careersEmail}`}
              className="link-arrow mt-5"
            >
              {CAREER_PAGE_COPY.careersEmail}
            </a>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
