"use client";

import Image from "next/image";
import Link from "next/link";
import { sortedProjects } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function formatYear(iso: string): string {
  return iso.slice(0, 4);
}

export function FeaturedProjects() {
  const { t, locale } = useLocale();
  const featured = sortedProjects.slice(0, 6);

  return (
    <section
      id="work"
      className="overflow-hidden bg-surface py-24 md:py-32"
      aria-labelledby="featured-projects-heading"
    >
      <div className="mx-auto mb-12 flex max-w-screen-3xl items-end justify-between gap-8 px-6 md:mb-16 md:px-8">
        <h2
          id="featured-projects-heading"
          className="font-headline text-4xl font-black uppercase tracking-tighter md:text-6xl"
        >
          {t.work.heading}
        </h2>
        <Link
          href="/work"
          className="hidden whitespace-nowrap rounded-full border border-primary px-8 py-3 font-label text-[11px] uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-surface md:inline-block"
        >
          {t.work.cta}
        </Link>
      </div>

      <div className="no-scrollbar flex snap-x snap-mandatory gap-1 overflow-x-auto px-6 pb-2 md:px-8">
        {featured.map((project, idx) => {
          const cover = project.media[0];
          const coverUrl = cover?.type === "image" ? cover.url : undefined;
          return (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="group relative flex aspect-[3/2] w-[85vw] flex-shrink-0 snap-start overflow-hidden bg-surface-container-low sm:w-[60vw] md:w-[44vw] lg:w-[32vw]"
            >
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={project.title[locale]}
                  fill
                  priority={idx < 2}
                  sizes="(min-width: 1024px) 32vw, (min-width: 768px) 44vw, (min-width: 640px) 60vw, 85vw"
                  className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 md:p-8">
                <span className="font-label text-[10px] uppercase tracking-widest text-primary/70">
                  {t.workPage.filters[project.discipline]} /{" "}
                  {formatYear(project.publishedAt)}
                </span>
                <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-primary md:text-2xl">
                  {project.title[locale]}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-12 flex max-w-screen-3xl px-6 md:hidden md:px-8">
        <Link
          href="/work"
          className="inline-block rounded-full border border-primary px-8 py-3 font-label text-[11px] uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-surface"
        >
          {t.work.cta}
        </Link>
      </div>
    </section>
  );
}
