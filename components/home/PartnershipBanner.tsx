import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_PARTNERSHIP_CONTENT } from "@/data/site/homepage";

export function PartnershipBanner() {
  return (
    <section className="border-y border-neutral-200 bg-white py-10 md:py-12">
      <div className="home-shell">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="shrink-0">
            <Image
              src={HOMEPAGE_PARTNERSHIP_CONTENT.image.src}
              alt={HOMEPAGE_PARTNERSHIP_CONTENT.image.alt}
              width={224}
              height={153}
              sizes="(max-width: 768px) 154px, 224px"
              quality={100}
              className="h-auto w-[154px] md:w-[224px]"
            />
          </div>

          <div className="max-w-2xl text-center md:text-right">
            <span className="typ-eyebrow mb-3 block">
              {HOMEPAGE_PARTNERSHIP_CONTENT.kicker}
            </span>
            <h2 className="typ-section mb-4 text-neutral-950">
              {HOMEPAGE_PARTNERSHIP_CONTENT.title[0]}{" "}
              <br className="hidden md:block" />{" "}
              {HOMEPAGE_PARTNERSHIP_CONTENT.title[1]}
            </h2>
            <p className="mb-6 max-w-lg text-base text-neutral-600 md:ml-auto">
              {HOMEPAGE_PARTNERSHIP_CONTENT.description}
            </p>
            <Link href={HOMEPAGE_PARTNERSHIP_CONTENT.cta.href} className="link-arrow typ-label">
              {HOMEPAGE_PARTNERSHIP_CONTENT.cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
