import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { SITE_CONTACT } from "@/data/site/contact";
import {
  SERVICE_PAGE_CHANNELS,
  SERVICE_PAGE_COPY,
  SERVICE_PAGE_PILLARS,
} from "@/data/site/routeCopy";

export default function ServicePage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={SERVICE_PAGE_COPY.heroTitle}
        subtitle={SERVICE_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/hero/usha-hero.webp"
      />

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-12 max-w-3xl">
            <p className="typ-label mb-4 text-neutral-700">{SERVICE_PAGE_COPY.frameworkKicker}</p>
            <h2 className="typ-section text-neutral-950">{SERVICE_PAGE_COPY.frameworkTitle}</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {SERVICE_PAGE_PILLARS.map((item) => (
              <article key={item.title} className="rounded-xl border border-neutral-300 bg-neutral-50 p-6">
                <h3 className="text-2xl font-light tracking-tight text-neutral-950">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="typ-label mb-4 text-neutral-700">{SERVICE_PAGE_COPY.channelsKicker}</p>
              <h2 className="typ-section text-neutral-950">{SERVICE_PAGE_COPY.channelsTitle}</h2>
              <div className="mt-6 space-y-4">
                {SERVICE_PAGE_CHANNELS.map((channel) => {
                  if (channel.kind === "supportPhone") {
                    const phone = SITE_CONTACT.supportPhone;
                    return (
                      <a
                        key={channel.label}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="block rounded-lg border border-neutral-300 bg-white px-5 py-4 transition-colors hover:border-primary/50"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                          {channel.label}
                        </p>
                        <p className="mt-1 text-lg text-neutral-900">{phone}</p>
                      </a>
                    );
                  }

                  if (channel.kind === "salesEmail") {
                    const email = SITE_CONTACT.salesEmail;
                    return (
                      <a
                        key={channel.label}
                        href={`mailto:${email}`}
                        className="block rounded-lg border border-neutral-300 bg-white px-5 py-4 transition-colors hover:border-primary/50"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                          {channel.label}
                        </p>
                        <p className="mt-1 text-lg text-neutral-900">{email}</p>
                      </a>
                    );
                  }

                  return (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-neutral-300 bg-white px-5 py-4 transition-colors hover:border-primary/50"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                        {channel.label}
                      </p>
                      <p className="mt-1 text-lg text-neutral-900">{channel.value}</p>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-300 bg-white p-6">
              <p className="typ-label mb-3 text-neutral-700">{SERVICE_PAGE_COPY.supportKicker}</p>
              <p className="text-lg leading-relaxed text-neutral-800">
                {SERVICE_PAGE_COPY.supportDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  {SERVICE_PAGE_COPY.primaryCta}
                </Link>
                <Link
                  href="/tracking"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-400 bg-white px-6 py-3 text-sm font-semibold tracking-[0.08em] text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-50"
                >
                  {SERVICE_PAGE_COPY.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
