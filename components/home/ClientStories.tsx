import { HOMEPAGE_CLIENT_STORIES_CONTENT } from "@/data/site/homepage";

function getInitial(value: string): string {
  return value.trim().charAt(0).toUpperCase() || "C";
}

export function ClientStories() {
  return (
    <section className="home-section border-y border-neutral-200 bg-neutral-50 py-16 md:py-20">
      <div className="home-shell">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <p className="home-kicker text-neutral-500">{HOMEPAGE_CLIENT_STORIES_CONTENT.kicker}</p>
          <h2 className="home-heading mt-2">
            {HOMEPAGE_CLIENT_STORIES_CONTENT.titleLead}{" "}
            <span className="italic">{HOMEPAGE_CLIENT_STORIES_CONTENT.titleEmphasis}</span>
          </h2>
          <p className="home-copy mt-4">{HOMEPAGE_CLIENT_STORIES_CONTENT.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {HOMEPAGE_CLIENT_STORIES_CONTENT.cards.map((card) => (
            <article key={card.client} className="rounded-2xl border border-neutral-200 bg-white p-7">
              <p className="mb-5 text-sm tracking-[0.22em] text-amber-500">★★★★★</p>
              <blockquote className="text-[2rem] font-light leading-relaxed text-neutral-900">
                &ldquo;{card.quote}&rdquo;
              </blockquote>
              <div className="mt-7 border-t border-neutral-200 pt-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-lg text-neutral-900">
                    {getInitial(card.client)}
                  </span>
                  <div>
                    <p className="text-xl font-light text-neutral-950">{card.client}</p>
                    <p className="text-sm text-neutral-600">{card.sector}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
