"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { sortedProjects, type Project } from "@/lib/data/projects";
import { AdminShell } from "./AdminShell";

type Status = "published" | "draft" | "archived";

type AdminProject = Project & {
  status: Status;
  featured: boolean;
};

// Mock admin state — replace with Supabase query in next iteration.
function withAdminMeta(p: Project, idx: number): AdminProject {
  return {
    ...p,
    status: idx === 0 ? "draft" : "published",
    featured: idx < 3,
  };
}

const STATUS_STYLES: Record<Status, string> = {
  published: "border-emerald-500/40 text-emerald-400",
  draft: "border-amber-500/40 text-amber-400",
  archived: "border-neutral-700 text-neutral-500",
};

export function ManageProjects() {
  const [items, setItems] = useState<AdminProject[]>(() =>
    sortedProjects.map(withAdminMeta),
  );
  const [filter, setFilter] = useState<"all" | Status>("all");

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((p) => p.status === filter)),
    [items, filter],
  );

  function toggleFeatured(id: string) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
    );
  }

  function archive(id: string) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "archived" } : p)),
    );
  }

  function remove(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <AdminShell
      eyebrow="Workspace / Projects"
      title="Manage Projects"
      actions={
        <Link
          href="/admin/create"
          className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-label text-[10px] uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-surface"
        >
          + New Project
        </Link>
      }
    >
      {/* Status filters */}
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
          Filter
        </span>
        {(["all", "published", "draft", "archived"] as const).map((key) => {
          const active = filter === key;
          const count =
            key === "all"
              ? items.length
              : items.filter((p) => p.status === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 font-label text-[10px] uppercase tracking-widest transition-all ${
                active
                  ? "border-primary bg-primary text-surface"
                  : "border-primary/20 text-primary/60 hover:border-primary/60 hover:text-primary"
              }`}
            >
              {key} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      {visible.length === 0 ? (
        <p className="py-24 text-center font-label text-sm uppercase tracking-widest text-primary/40">
          No projects in this view.
        </p>
      ) : (
        <div className="border border-outline-variant/10">
          {/* Header row */}
          <div className="hidden grid-cols-[80px_2fr_1fr_1fr_1fr_auto] items-center gap-6 border-b border-outline-variant/10 px-6 py-4 font-label text-[10px] uppercase tracking-widest text-primary/40 md:grid">
            <span>Cover</span>
            <span>Title</span>
            <span>Division</span>
            <span>Discipline</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <ul className="divide-y divide-outline-variant/10">
            {visible.map((project) => {
              const cover = project.media[0];
              const coverUrl = cover?.type === "image" ? cover.url : undefined;
              return (
                <li
                  key={project.id}
                  className="grid grid-cols-1 items-center gap-4 px-6 py-5 md:grid-cols-[80px_2fr_1fr_1fr_1fr_auto] md:gap-6"
                >
                  <div className="relative h-16 w-16 overflow-hidden bg-surface-container-low md:h-14 md:w-14">
                    {coverUrl && (
                      <Image
                        src={coverUrl}
                        alt={project.title.en}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-headline text-base font-bold uppercase tracking-tight text-primary">
                        {project.title.en}
                      </span>
                      {project.featured && (
                        <span className="rounded-full border border-amber-500/40 px-2 py-0.5 font-label text-[8px] uppercase tracking-widest text-amber-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
                      /{project.slug}
                    </span>
                  </div>

                  <span className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                    {project.division}
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                    {project.discipline}
                  </span>

                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1 font-label text-[9px] uppercase tracking-widest ${
                      STATUS_STYLES[project.status]
                    }`}
                  >
                    {project.status}
                  </span>

                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(project.id)}
                      className="rounded border border-primary/20 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-primary/70 transition-colors hover:border-primary hover:text-primary"
                    >
                      {project.featured ? "Unfeature" : "Feature"}
                    </button>
                    <Link
                      href={`/admin/create?id=${project.id}`}
                      className="rounded border border-primary/20 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-primary/70 transition-colors hover:border-primary hover:text-primary"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => archive(project.id)}
                      className="rounded border border-primary/20 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-primary/70 transition-colors hover:border-primary hover:text-primary"
                    >
                      Archive
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(project.id)}
                      className="rounded border border-red-500/30 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-red-400/80 transition-colors hover:border-red-400 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
