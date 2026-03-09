import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { PORTFOLIO_CLIENTS, PORTFOLIO_PAGE_COPY } from "@/data/site/routeCopy";

type ClientPortfolio = (typeof PORTFOLIO_CLIENTS)[number];

type ClientPortfolioWithPhotos = ClientPortfolio & {
  photos: string[];
};

function encodePathForNextImage(pathname: string): string {
  return encodeURI(pathname);
}

async function getClientPhotos(folder: string): Promise<string[]> {
  const folderPath = path.join(process.cwd(), "public", "projects", folder);
  const fileNames = await fs.readdir(folderPath);
  return fileNames
    .filter((name) => /\.(webp|jpg|jpeg|png)$/i.test(name))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => `/projects/${folder}/${name}`);
}

async function buildPortfolioData(): Promise<ClientPortfolioWithPhotos[]> {
  const items = await Promise.all(
    PORTFOLIO_CLIENTS.map(async (client) => {
      const photos = await getClientPhotos(client.folder);
      return { ...client, photos };
    }),
  );

  return items.filter((item) => item.photos.length >= 2);
}

export default async function PortfolioPage() {
  const portfolio = await buildPortfolioData();
  const totalPhotos = portfolio.reduce((sum, item) => sum + item.photos.length, 0);

  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={PORTFOLIO_PAGE_COPY.heroTitle}
        subtitle={PORTFOLIO_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/projects/titan-gallery.webp"
      />

      <section className="container px-6 py-16 md:py-20 2xl:px-0">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="typ-eyebrow">{PORTFOLIO_PAGE_COPY.eyebrow}</p>
            <h2 className="typ-h1 mt-2 text-neutral-900">{PORTFOLIO_PAGE_COPY.title}</h2>
          </div>
          <p className="hidden text-sm text-neutral-500 md:block">
            {PORTFOLIO_PAGE_COPY.totalTemplate
              .replace("{clients}", String(portfolio.length))
              .replace("{photos}", String(totalPhotos))}
          </p>
        </div>

        <div className="space-y-12">
          {portfolio.map((client) => (
            <article
              key={client.id}
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 md:p-7"
            >
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h3 className="typ-h2 text-neutral-900">{client.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.12em] text-neutral-500">
                    {client.location}
                  </p>
                </div>
                <p className="max-w-3xl text-base leading-relaxed text-neutral-600">
                  {client.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="relative overflow-hidden rounded-2xl border border-neutral-200 md:col-span-7">
                  <Image
                    src={encodePathForNextImage(client.photos[0])}
                    alt={`${client.name} portfolio photo 1`}
                    width={1600}
                    height={1000}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 md:col-span-5">
                  {client.photos.slice(1).map((photo, index) => (
                    <div
                      key={`${client.id}-${photo}`}
                      className="relative overflow-hidden rounded-2xl border border-neutral-200"
                    >
                      <Image
                        src={encodePathForNextImage(photo)}
                        alt={`${client.name} portfolio photo ${index + 2}`}
                        width={900}
                        height={700}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
