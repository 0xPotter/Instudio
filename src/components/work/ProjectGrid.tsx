"use client";

import Image from "next/image";
import { type Division, type Project } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const DIVISION_LABEL: Record<Division, string> = {
  inlabs: "IN LABS",
  inaudio: "IN AUDIO",
  invisuals: "IN VISUALS",
};

function formatYear(iso: string): string {
  return iso.slice(0, 4);
}

type ProjectGridProps = {
  projects: Project[];
  /** Number of leading cards to mark as priority for LCP. */
  priorityCount?: number;
};

export function ProjectGrid({ projects, priorityCount = 3 }: ProjectGridProps) {
  const { locale } = useLocale();

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 md:gap-x-8 md:gap-y-20 lg:grid-cols-3">
      {projects.map((project, idx) => {
        const cover = project.media[0];
        const coverUrl = cover?.type === "image" ? cover.url : undefined;
        return (
          <article key={project.id} className="group flex flex-col">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container-low">
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={project.title[locale]}
                  fill
                  priority={idx < priorityCount}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover grayscale transition-all duration-[1500ms] group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              )}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
                {DIVISION_LABEL[project.division]} /{" "}
                {formatYear(project.publishedAt)}
              </span>
              <h2 className="font-headline text-2xl font-bold uppercase tracking-tight md:text-3xl">
                {project.title[locale]}
              </h2>
              <p className="font-body text-sm leading-relaxed text-primary/60">
                {project.description[locale]}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
