"use client";

import Image from "next/image";
import { sortedProjects, type Project } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const SPAN_CLASS: Record<NonNullable<Project["gridSpan"]>, string> = {
  4: "md:col-span-4",
  6: "md:col-span-6",
  8: "md:col-span-8",
  12: "md:col-span-12",
};

const DIVISION_LABEL: Record<Project["division"], string> = {
  inlabs: "IN LABS",
  inaudio: "IN AUDIO",
  invisuals: "IN VISUALS",
};

function formatYear(iso: string): string {
  return iso.slice(0, 4);
}

export function SelectedWork() {
  const { t, locale } = useLocale();

  return (
    <section id="work" className="bg-surface py-24 md:py-32">
      <div className="container mx-auto max-w-screen-3xl px-6 md:px-8">
        <div className="mb-16 flex flex-col items-start justify-between gap-12 md:mb-24 md:flex-row">
          <div className="flex flex-col items-start gap-8">
            <h2 className="max-w-sm font-headline text-5xl font-black uppercase tracking-tighter md:text-6xl">
              {t.work.heading}
            </h2>
            <a
              href="#"
              className="inline-block rounded-full border border-primary px-10 py-4 font-label text-[11px] uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-surface"
            >
              {t.work.cta}
            </a>
          </div>
          <div className="flex items-center space-x-12">
            <div className="flex flex-col">
              <span className="mb-1 font-label text-[10px] uppercase tracking-widest text-primary/40">
                {t.work.yearLabel}
              </span>
              <span className="font-headline font-medium">
                {t.work.yearValue}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="mb-1 font-label text-[10px] uppercase tracking-widest text-primary/40">
                {t.work.focusLabel}
              </span>
              <span className="font-headline font-medium">
                {t.work.focusValue}
              </span>
            </div>
          </div>
        </div>

        <div className="grid auto-rows-[60vh] grid-cols-1 gap-4 md:auto-rows-[40vh] md:grid-cols-12">
          {sortedProjects.map((project) => {
            const cover = project.media[0];
            const coverUrl = cover?.type === "image" ? cover.url : undefined;
            const span = SPAN_CLASS[project.gridSpan ?? 4];
            return (
              <article
                key={project.id}
                className={`group relative cursor-pointer overflow-hidden bg-surface-container-low ${span}`}
              >
                {coverUrl && (
                  <Image
                    src={coverUrl}
                    alt={project.title[locale]}
                    fill
                    sizes="(min-width: 768px) 66vw, 100vw"
                    className="h-full w-full object-cover grayscale transition-all duration-[1500ms] group-hover:scale-105 group-hover:grayscale-0"
                  />
                )}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                  <span className="mb-2 font-label text-[10px] uppercase tracking-widest text-primary">
                    {DIVISION_LABEL[project.division]} / {formatYear(project.publishedAt)}
                  </span>
                  <h3 className="font-headline text-2xl font-bold uppercase tracking-tight md:text-3xl">
                    {project.title[locale]}
                  </h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
