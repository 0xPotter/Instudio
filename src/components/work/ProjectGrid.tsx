"use client";

import Image from "next/image";
import Link from "next/link";
import { type Project } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function formatYear(iso: string): string {
  return iso.slice(0, 4);
}

type ProjectGridProps = {
  projects: Project[];
  /** Number of leading cards to mark as priority for LCP. */
  priorityCount?: number;
};

export function ProjectGrid({ projects, priorityCount = 3 }: ProjectGridProps) {
  const { t, locale } = useLocale();

  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, idx) => {
        const cover = project.media[0];
        const coverUrl = cover?.type === "image" ? cover.url : undefined;
        return (
          <Link
            key={project.id}
            href={`/work/${project.slug}`}
            className="group relative block aspect-[3/2] overflow-hidden bg-surface-container-low"
          >
            {coverUrl && (
              <Image
                src={coverUrl}
                alt={project.title[locale]}
                fill
                priority={idx < priorityCount}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 md:p-8">
              <span className="font-label text-[10px] uppercase tracking-widest text-primary/70">
                {t.workPage.filters[project.discipline]} /{" "}
                {formatYear(project.publishedAt)}
              </span>
              <h2 className="font-headline text-xl font-bold uppercase tracking-tight text-primary md:text-2xl">
                {project.title[locale]}
              </h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
