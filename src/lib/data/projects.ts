/**
 * Placeholder data layer for projects.
 *
 * This file mirrors the shape of what the future Supabase `projects` table
 * will return, so the migration is just swapping `import { projects }` for
 * `const projects = await getProjects()` without touching components.
 */

export type Division = "inlabs" | "inaudio" | "invisuals";

export type ProjectMedia =
  | { type: "image"; url: string; alt?: string }
  | { type: "video"; url: string; poster?: string }
  | { type: "embed"; url: string };

export type Project = {
  /** Stable id — will become the Supabase row id */
  id: string;
  /** URL-safe slug for the future detail page */
  slug: string;
  /** Bilingual title */
  title: { en: string; es: string };
  /** Bilingual short description */
  description: { en: string; es: string };
  /** Which IN division this project belongs to */
  division: Division;
  /** Media gallery (first item is the cover) */
  media: ProjectMedia[];
  /** Optional external link (case study, behance, vimeo, etc.) */
  externalLink?: string;
  /** ISO date — controls ordering on the home grid */
  publishedAt: string;
  /** Layout span for the masonry grid on desktop (1–12, defaults to 4) */
  gridSpan?: 4 | 6 | 8 | 12;
};

/**
 * Helper to build a picsum.photos placeholder URL with a deterministic seed.
 * Replace these with real assets (or Supabase Storage URLs) when ready.
 */
const placeholder = (seed: string, w = 1600, h = 1000): ProjectMedia => ({
  type: "image",
  url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
});

export const projects: Project[] = [
  {
    id: "p-001",
    slug: "obsidian-echoes",
    title: { en: "Obsidian Echoes", es: "Ecos de Obsidiana" },
    description: {
      en: "Spatial audio installation exploring the resonance of dark matter.",
      es: "Instalación de audio espacial explorando la resonancia de la materia oscura.",
    },
    division: "inaudio",
    media: [placeholder("project-obsidian-echoes")],
    publishedAt: "2024-11-12",
    gridSpan: 8,
  },
  {
    id: "p-002",
    slug: "monolith-os",
    title: { en: "Monolith OS", es: "Monolith OS" },
    description: {
      en: "Brand system for a brutalist architecture studio.",
      es: "Sistema de marca para un estudio de arquitectura brutalista.",
    },
    division: "invisuals",
    media: [placeholder("project-monolith-os")],
    publishedAt: "2024-09-04",
    gridSpan: 4,
  },
  {
    id: "p-003",
    slug: "liquid-logic",
    title: { en: "Liquid Logic", es: "Lógica Líquida" },
    description: {
      en: "Generative visual identity for an AI research lab.",
      es: "Identidad visual generativa para un laboratorio de IA.",
    },
    division: "inlabs",
    media: [placeholder("project-liquid-logic")],
    publishedAt: "2024-08-20",
    gridSpan: 4,
  },
  {
    id: "p-004",
    slug: "ether-core",
    title: { en: "Ether Core", es: "Ether Core" },
    description: {
      en: "Live event audio engineering for a corporate launch.",
      es: "Ingeniería de audio en vivo para un lanzamiento corporativo.",
    },
    division: "inaudio",
    media: [placeholder("project-ether-core")],
    publishedAt: "2024-07-15",
    gridSpan: 8,
  },
  {
    id: "p-005",
    slug: "modular-synthesis",
    title: { en: "Modular Synthesis", es: "Síntesis Modular" },
    description: {
      en: "Sound design system for a generative cinema experience.",
      es: "Sistema de diseño sonoro para una experiencia de cine generativo.",
    },
    division: "invisuals",
    media: [placeholder("project-modular-synthesis")],
    publishedAt: "2024-05-28",
    gridSpan: 6,
  },
  {
    id: "p-006",
    slug: "mercury-flow",
    title: { en: "Mercury Flow", es: "Flujo Mercurio" },
    description: {
      en: "AI-driven motion identity for a fintech rebrand.",
      es: "Identidad en movimiento impulsada por IA para un rebrand fintech.",
    },
    division: "inlabs",
    media: [placeholder("project-mercury-flow")],
    publishedAt: "2024-04-10",
    gridSpan: 6,
  },
];

/**
 * Sort by publishedAt (newest first). Mirrors the future Supabase query.
 */
export const sortedProjects = [...projects].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);
