import { Leaf, Recycle, Lightbulb } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { Newsletter } from "@/components/shared/Newsletter";
import { SUSTAINABILITY_PAGE_COPY } from "@/data/site/routeCopy";

const SUSTAINABILITY_ICONS = {
  leaf: Leaf,
  recycle: Recycle,
  lightbulb: Lightbulb,
} as const;

export default function SustainabilityPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={SUSTAINABILITY_PAGE_COPY.heroTitle}
        subtitle={SUSTAINABILITY_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/products/imported/halo/image-1.webp"
      />

      <section className="container px-6 py-24 2xl:px-0">
        <div className="mx-auto mb-20 max-w-4xl space-y-8 text-center">
          <h2 className="typ-h1 text-neutral-900">
            {SUSTAINABILITY_PAGE_COPY.introTitleLead}
            <span className="text-primary italic">{SUSTAINABILITY_PAGE_COPY.introTitleEmphasis}</span>
          </h2>
          <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
            {SUSTAINABILITY_PAGE_COPY.introDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          {SUSTAINABILITY_PAGE_COPY.pillars.map((pillar) => {
            const Icon = SUSTAINABILITY_ICONS[pillar.icon];
            return (
              <div key={pillar.title} className="group space-y-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/8 transition-colors group-hover:bg-primary/15">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="typ-h3 border-l-2 border-primary pl-4 text-neutral-900">
                  {pillar.title}
                </h3>
                <p className="text-base leading-relaxed text-neutral-600 md:text-lg">{pillar.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-24 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="typ-h2 mb-6 text-neutral-900">{SUSTAINABILITY_PAGE_COPY.ecoScoreTitle}</h2>
            <p className="mb-6 text-base leading-relaxed text-neutral-600 md:text-lg">
              {SUSTAINABILITY_PAGE_COPY.ecoScoreDescription}
            </p>
            <ul className="space-y-4 text-base text-neutral-600 md:text-lg">
              {SUSTAINABILITY_PAGE_COPY.ecoScoreItems.map((item) => (
                <li key={item.index} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                    {item.index}
                  </span>
                  <span>
                    <strong>{item.title}:</strong> {item.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8 rounded-2xl border border-neutral-100 bg-neutral-50 p-10 md:p-12">
            {SUSTAINABILITY_PAGE_COPY.badges.map((badge, index) => (
              <div key={badge.title}>
                <h3 className="typ-h3 mb-2 text-neutral-900">{badge.title}</h3>
                <p className="text-base text-neutral-600">{badge.detail}</p>
                {index < SUSTAINABILITY_PAGE_COPY.badges.length - 1 ? (
                  <div className="mt-8 h-px bg-neutral-200" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-24 overflow-hidden rounded-3xl bg-neutral-900 p-12 text-white">
          <div className="absolute -mr-32 -mt-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl right-0 top-0" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="max-w-xl">
              <h3 className="typ-h2 mb-4 text-white">{SUSTAINABILITY_PAGE_COPY.verifiedTitle}</h3>
              <p className="text-base leading-relaxed text-white/75 md:text-lg">
                {SUSTAINABILITY_PAGE_COPY.verifiedDescription}
              </p>
            </div>
            <div className="flex items-center gap-8 rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
              {SUSTAINABILITY_PAGE_COPY.verifiedLabels.map((label) => (
                <div
                  key={label}
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 text-center text-xs uppercase tracking-[0.12em] text-white/85"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <ContactTeaser />
    </section>
  );
}
