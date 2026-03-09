import { Hero } from "@/components/home/Hero";
import { ClientBadge } from "@/components/ClientBadge";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { TRUSTED_BY_PAGE_COPY } from "@/data/site/routeCopy";
import { TRUSTED_BY_CLIENTS, TRUSTED_BY_STATS } from "@/data/site/proof";

export default function TrustedByPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={TRUSTED_BY_PAGE_COPY.heroTitle}
        subtitle={TRUSTED_BY_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/hero/franklin-hero.webp"
      />

      <section className="container px-6 py-16 2xl:px-0">
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {TRUSTED_BY_STATS.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center"
            >
              <p className="text-3xl text-primary md:text-4xl">{item.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.12em] text-neutral-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {TRUSTED_BY_CLIENTS.map((client) => (
            <ClientBadge key={client.name} {...client} />
          ))}
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
