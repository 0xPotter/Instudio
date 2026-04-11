"use client";

import { useMemo } from "react";
import { sortedProjects, type Division } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { ProjectGrid } from "./ProjectGrid";

type DivisionViewProps = {
  division: Division;
};

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function DivisionView({ division }: DivisionViewProps) {
  const { t } = useLocale();
  const copy = t.divisionPage.divisions[division];

  const projects = useMemo(
    () => sortedProjects.filter((p) => p.division === division),
    [division],
  );

  return (
    <section className="bg-surface pb-32 pt-32 md:pt-40">
      <div className="container mx-auto max-w-screen-3xl px-6 md:px-8">
        {/* Header */}
        <header className="pb-16 md:pb-20">
          <h1 className="mb-6 font-headline text-[11px] font-extrabold uppercase tracking-[0.3em] text-primary md:text-sm">
            {copy.name}
          </h1>
          <p className="max-w-5xl font-body text-2xl leading-relaxed text-primary/80 md:text-3xl">
            {copy.intro}
          </p>
        </header>

        {/* Filter indicator */}
        <div className="flex flex-col gap-4 border-t border-outline-variant/15 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/60">
            {t.divisionPage.filteredBy}:{" "}
            <span className="font-bold text-primary">{copy.name}</span>
          </div>
          <div className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/60">
            {t.divisionPage.displaying}:{" "}
            <span className="font-bold text-primary">
              {pad2(projects.length)} {t.divisionPage.projectsLabel}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="pt-12 md:pt-16">
          {projects.length === 0 ? (
            <p className="py-24 text-center font-label text-sm uppercase tracking-widest text-primary/40">
              {t.divisionPage.empty}
            </p>
          ) : (
            <ProjectGrid projects={projects} />
          )}
        </div>
      </div>
    </section>
  );
}
