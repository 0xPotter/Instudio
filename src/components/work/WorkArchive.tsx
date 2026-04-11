"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  sortedProjects,
  type Division,
  type Project,
} from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Filter = "all" | Division;

const FILTER_KEYS: Filter[] = ["all", "inlabs", "inaudio", "invisuals"];

const SPAN_CLASS: Record<NonNullable<Project["gridSpan"]>, string> = {
  4: "md:col-span-4",
  6: "md:col-span-6",
  8: "md:col-span-8",
  12: "md:col-span-12",
};

const DIVISION_LABEL: Record<Division, string> = {
  inlabs: "IN LABS",
  inaudio: "IN AUDIO",
  invisuals: "IN VISUALS",
};

function formatYear(iso: string): string {
  return iso.slice(0, 4);
}

export function WorkArchive() {
  const { t, locale } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const projects = useMemo(
    () =>
      filter === "all"
        ? sortedProjects
        : sortedProjects.filter((p) => p.division === filter),
    [filter],
  );

  return (
    <section className="bg-surface pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container mx-auto max-w-screen-3xl px-6 md:px-8">
        {/* Header */}
        <header className="mb-16 flex flex-col gap-12 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-6">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
              {t.workPage.eyebrow}
            </span>
            <h1 className="font-headline text-6xl font-black uppercase tracking-tighter md:text-8xl">
              {t.workPage.title}
            </h1>
            <p className="max-w-xl font-body text-base leading-relaxed text-primary/60 md:text-lg">
              {t.workPage.intro}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 md:items-end">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
              {t.workPage.filterLabel}
            </span>
            <div className="flex flex-wrap gap-3">
              {FILTER_KEYS.map((key) => {
                const active = filter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    aria-pressed={active}
                    className={`rounded-full border px-5 py-2 font-label text-[10px] uppercase tracking-widest transition-all duration-300 ${
                      active
                        ? "border-primary bg-primary text-surface"
                        : "border-primary/20 text-primary/60 hover:border-primary/60 hover:text-primary"
                    }`}
                  >
                    {t.workPage.filters[key]}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Archive grid */}
        {projects.length === 0 ? (
          <p className="py-24 text-center font-label text-sm uppercase tracking-widest text-primary/40">
            {t.workPage.empty}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-16 md:grid-cols-12 md:gap-y-24">
            {projects.map((project) => {
              const cover = project.media[0];
              const coverUrl = cover?.type === "image" ? cover.url : undefined;
              const span = SPAN_CLASS[project.gridSpan ?? 4];
              return (
                <article
                  key={project.id}
                  className={`group flex flex-col ${span}`}
                >
                  <div className="relative h-[55vw] w-full overflow-hidden bg-surface-container-low md:h-[42vh]">
                    {coverUrl && (
                      <Image
                        src={coverUrl}
                        alt={project.title[locale]}
                        fill
                        sizes="(min-width: 768px) 66vw, 100vw"
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
                    <p className="max-w-md font-body text-sm leading-relaxed text-primary/60">
                      {project.description[locale]}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
