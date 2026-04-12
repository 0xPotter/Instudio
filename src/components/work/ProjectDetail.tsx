"use client";

import Image from "next/image";
import Link from "next/link";
import { type Project } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type ProjectDetailProps = {
  project: Project;
};

function formatYear(iso: string): string {
  return iso.slice(0, 4);
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const { t, locale } = useLocale();
  const images = project.media.filter((m) => m.type === "image");

  return (
    <article className="bg-surface pb-32 pt-32 md:pt-40">
      {/* Header */}
      <header className="container mx-auto max-w-screen-3xl px-6 pb-16 md:px-8 md:pb-20">
        <Link
          href="/work"
          className="mb-12 inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.3em] text-primary/40 transition-colors hover:text-primary"
        >
          <span aria-hidden="true">←</span> {t.workPage.backToWork}
        </Link>
        <span className="block font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
          {t.workPage.filters[project.discipline]} /{" "}
          {formatYear(project.publishedAt)}
        </span>
        <h1 className="mt-6 font-headline text-5xl font-black uppercase leading-[0.95] tracking-tighter md:text-8xl">
          {project.title[locale]}
        </h1>
        <p className="mt-10 max-w-3xl font-body text-xl leading-relaxed text-primary/70 md:text-2xl">
          {project.description[locale]}
        </p>
      </header>

      {/* Image gallery — 1 col mobile, 2 cols desktop, tight gap */}
      <div className="grid w-full grid-cols-1 gap-px md:grid-cols-2">
        {images.map((media, idx) => (
          <div
            key={`${project.id}-img-${idx}`}
            className="relative aspect-[3/2] w-full overflow-hidden bg-surface-container-low"
          >
            <Image
              src={media.url}
              alt={
                media.type === "image" && media.alt
                  ? media.alt
                  : `${project.title[locale]} — ${idx + 1}`
              }
              fill
              priority={idx < 2}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {project.externalLink && (
        <div className="container mx-auto max-w-screen-3xl px-6 pt-20 md:px-8">
          <a
            href={project.externalLink}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-block rounded-full border border-primary px-10 py-4 font-label text-[11px] uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-surface"
          >
            {t.workPage.cta.action}
          </a>
        </div>
      )}
    </article>
  );
}
