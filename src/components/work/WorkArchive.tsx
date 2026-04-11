"use client";

import { useMemo, useState } from "react";
import { sortedProjects, type Division } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { ProjectGrid } from "./ProjectGrid";

type Filter = "all" | Division;

const FILTER_KEYS: Filter[] = ["all", "inlabs", "inaudio", "invisuals"];

export function WorkArchive() {
  const { t } = useLocale();
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
          <ProjectGrid projects={projects} />
        )}
      </div>
    </section>
  );
}
