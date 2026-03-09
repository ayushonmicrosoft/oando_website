import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { GALLERY_PAGE_COPY, GALLERY_PROJECTS } from "@/data/site/routeCopy";
import { Masonry, MasonryItem } from "@/components/ui/Masonry";

export default function GalleryPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={GALLERY_PAGE_COPY.heroTitle}
        subtitle={GALLERY_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/projects/titan-gallery.webp"
      />

      <section className="container px-6 py-18 md:py-22 2xl:px-0">
        <div className="mb-12 max-w-4xl">
          <p className="typ-label mb-4 text-neutral-700">{GALLERY_PAGE_COPY.kicker}</p>
          <h2 className="typ-section text-neutral-950">{GALLERY_PAGE_COPY.title}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-800">
            {GALLERY_PAGE_COPY.description}
          </p>
        </div>

        <Masonry columns={2} gap="2rem">
          {GALLERY_PROJECTS.map((project) => (
            <MasonryItem key={`${project.title}-${project.location}`}>
              <article className="group relative mb-8 overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100">
                <Image
                  src={project.image}
                  alt={`${project.title} project`}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    {project.category}
                  </p>
                  <h3 className="mt-2 text-3xl font-light tracking-tight text-white">{project.title}</h3>
                  <p className="mt-1 text-sm text-white/85">{project.location}</p>
                </div>
              </article>
            </MasonryItem>
          ))}
        </Masonry>
      </section>

      <ContactTeaser />
    </section>
  );
}
