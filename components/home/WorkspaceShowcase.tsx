import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_WORKSPACES_CONTENT } from "@/data/site/homepage";

export function WorkspaceShowcase() {
  return (
    <section className="home-section bg-white py-16 md:py-20">
      <div className="home-shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <h2 className="home-heading max-w-3xl">
            {HOMEPAGE_WORKSPACES_CONTENT.titlePrimary}
            <br />
            <span className="text-neutral-500 italic">{HOMEPAGE_WORKSPACES_CONTENT.titleAccent}</span>
          </h2>
          <Link href={HOMEPAGE_WORKSPACES_CONTENT.cta.href} className="link-arrow">
            {HOMEPAGE_WORKSPACES_CONTENT.cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HOMEPAGE_WORKSPACES_CONTENT.cards.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={`${item.title} workspace`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-sm font-medium uppercase tracking-[0.06em] text-white/78">{item.sector}</p>
                <h3 className="mt-2 text-[2rem] font-light leading-tight">{item.title}</h3>
                <p className="mt-1 text-base text-white/86">{item.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
