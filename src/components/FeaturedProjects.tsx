"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getFeaturedProjects,
  type FirestoreProject,
} from "@/lib/firebase/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function formatYear(iso: string): string {
  return iso.slice(0, 4);
}

export function FeaturedProjects() {
  const { t, locale } = useLocale();
  const [featured, setFeatured] = useState<FirestoreProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProjects()
      .then(setFeatured)
      .catch((err) => console.error("Failed to load featured:", err))
      .finally(() => setLoading(false));
  }, []);

  // Don't render the section at all if there are no featured projects.
  if (!loading && featured.length === 0) return null;

  return (
    <section
      id="work"
      className="overflow-hidden bg-surface py-20 md:py-24"
      aria-labelledby="featured-projects-heading"
    >
      <div className="mx-auto mb-8 flex max-w-screen-3xl items-center justify-between gap-8 px-6 md:mb-10 md:px-8">
        <h2
          id="featured-projects-heading"
          className="font-headline text-xl font-black uppercase tracking-tighter opacity-40 md:text-2xl"
        >
          {t.work.heading}
        </h2>
        <Link
          href="/work"
          className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/60 transition-colors hover:text-primary"
        >
          {t.work.cta} →
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="font-label text-[10px] uppercase tracking-widest text-primary/40 animate-pulse">
            Loading…
          </span>
        </div>
      ) : (
        <div className="no-scrollbar flex snap-x snap-mandatory gap-px overflow-x-auto px-6 pb-2 md:px-8">
          {featured.map((project, idx) => {
            const cover = project.media[0];
            const coverUrl = cover?.type === "image" ? cover.url : undefined;
            return (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                className="group relative flex aspect-[4/5] w-[78vw] flex-shrink-0 snap-start overflow-hidden bg-surface-container-low sm:w-[52vw] md:w-[36vw] lg:w-[26vw]"
              >
                {coverUrl && (
                  <Image
                    src={coverUrl}
                    alt={project.title[locale]}
                    fill
                    priority={idx < 2}
                    sizes="(min-width: 1024px) 26vw, (min-width: 768px) 36vw, (min-width: 640px) 52vw, 78vw"
                    className="h-full w-full object-cover grayscale transition-all duration-[1500ms] group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 md:p-8">
                  <span className="font-label text-[10px] uppercase tracking-widest text-primary/70">
                    {t.workPage.filters[project.discipline]} /{" "}
                    {formatYear(project.publishedAt)}
                  </span>
                  <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-primary md:text-xl">
                    {project.title[locale]}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
