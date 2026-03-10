"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_PROJECTS_CONTENT } from "@/data/site/homepage";

export function Projects() {
  return (
    <section className="bg-white py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-6 block text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              {HOMEPAGE_PROJECTS_CONTENT.kicker}
            </span>
            <h2 className="text-5xl font-medium leading-[1.05] tracking-tighter text-neutral-900 md:text-6xl">
              {HOMEPAGE_PROJECTS_CONTENT.title[0]} <br className="hidden md:block" />
              <span className="font-light italic text-neutral-400">
                {HOMEPAGE_PROJECTS_CONTENT.title[1]}
              </span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group flex items-center gap-4 border-b border-neutral-900 pb-2 text-sm font-semibold uppercase tracking-widest text-neutral-900 transition-colors hover:border-amber-600 hover:text-amber-600"
          >
            {HOMEPAGE_PROJECTS_CONTENT.portfolioCta}
            <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
          {HOMEPAGE_PROJECTS_CONTENT.projects.map((project, idx) => (
            <div
              key={project.slug}
              className={`group flex flex-col ${
                idx === 0
                  ? "md:col-span-12 lg:col-span-8"
                  : idx === 1
                    ? "md:col-span-6 lg:col-span-4 lg:mt-32"
                    : "md:col-span-6 lg:col-span-6 lg:mt-[-100px]"
              }`}
            >
              <div className="relative mb-6 aspect-4/3 w-full overflow-hidden bg-neutral-100">
                <Image
                  src={project.image}
                  alt={`${project.client} - ${project.category}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col">
                <div className="mb-3 flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    {project.category}
                  </span>
                  <div className="h-px flex-1 bg-neutral-200"></div>
                </div>
                <h3 className="mb-1 text-2xl font-medium text-neutral-900">{project.client}</h3>
                <p className="text-[15px] font-light text-neutral-500">{project.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
