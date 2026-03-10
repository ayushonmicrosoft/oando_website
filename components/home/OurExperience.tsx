import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { HOMEPAGE_EXPERIENCE_CONTENT } from "@/data/site/homepage";
import { formatKpiValuePlus } from "@/lib/kpiFormat";

interface OurExperienceProps {
  clientCount: number;
}

export function OurExperience({ clientCount }: OurExperienceProps) {
  return (
    <section className="home-section home-section--soft py-20 md:py-28">
      <div className="home-shell">
        <Reveal>
          <div className="section-divider mb-12 pt-5 md:mb-14">
            <p className="home-kicker mb-4 text-neutral-700">
              {HOMEPAGE_EXPERIENCE_CONTENT.kicker}
            </p>
            <h2 className="home-heading max-w-2xl">{HOMEPAGE_EXPERIENCE_CONTENT.title}</h2>
            <p className="home-copy mt-4 max-w-2xl">
              {HOMEPAGE_EXPERIENCE_CONTENT.description.replace(
                "client organisations",
                formatKpiValuePlus(clientCount),
              )}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="home-panel home-panel--light home-panel--elevated p-6 md:p-8">
              <p className="home-kicker mb-6 text-neutral-700">
                {HOMEPAGE_EXPERIENCE_CONTENT.trustedByLabel}
              </p>
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {HOMEPAGE_EXPERIENCE_CONTENT.featuredClients.map((name) => (
                  <p
                    key={name}
                    className="home-stat-card rounded-xl px-3 py-3 text-sm font-medium text-neutral-800"
                  >
                    {name}
                  </p>
                ))}
              </div>
              <Link href="/trusted-by" className="link-arrow">
                {HOMEPAGE_EXPERIENCE_CONTENT.trustedByCta}
              </Link>
            </div>
          </Reveal>

          <div>
            <p className="home-kicker mb-4 text-neutral-700">
              {HOMEPAGE_EXPERIENCE_CONTENT.recentDeliveriesLabel}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {HOMEPAGE_EXPERIENCE_CONTENT.projectCards.map((item) => (
                <Reveal key={item.title} y={20}>
                  <Link href={item.link} className="home-media-card group">
                    <Image
                      src={item.image}
                      alt={item.subtitle}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="home-media-card__overlay" />
                    <div className="home-media-card__caption">
                      <p className="home-media-card__eyebrow">
                        Project
                      </p>
                      <p className="text-2xl font-light tracking-tight text-white">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Link href="/portfolio" className="link-arrow mt-6">
              {HOMEPAGE_EXPERIENCE_CONTENT.portfolioCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
