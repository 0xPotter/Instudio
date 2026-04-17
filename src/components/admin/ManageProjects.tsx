"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getProjects,
  toggleFeatured,
  archiveProject,
  deleteProject,
  type FirestoreProject,
  type ProjectStatus,
} from "@/lib/firebase/projects";
import { AdminShell } from "./AdminShell";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  published: "border-emerald-500/40 text-emerald-400",
  draft: "border-amber-500/40 text-amber-400",
  archived: "border-neutral-700 text-neutral-500",
};

export function ManageProjects() {
  const [items, setItems] = useState<FirestoreProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getProjects());
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((p) => p.status === filter)),
    [items, filter],
  );

  async function handleToggleFeatured(id: string, current: boolean) {
    await toggleFeatured(id, current);
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
    );
  }

  async function handleArchive(id: string) {
    await archiveProject(id);
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "archived" as const } : p,
      ),
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    await deleteProject(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <AdminShell
      eyebrow="Espacio / Proyectos"
      title="Gestionar Proyectos"
      actions={
        <Link
          href="/admin/create"
          className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-label text-[10px] uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-surface"
        >
          + Nuevo Proyecto
        </Link>
      }
    >
      {/* Status filters */}
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
          Filtrar
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

      {/* Loading state */}
      {loading ? (
        <p className="py-24 text-center font-label text-sm uppercase tracking-widest text-primary/40 animate-pulse">
          Cargando proyectos…
        </p>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-24">
          <p className="font-label text-sm uppercase tracking-widest text-primary/40">
            {items.length === 0
              ? "Aún no hay proyectos. Crea el primero."
              : "No hay proyectos en esta vista."}
          </p>
          {items.length === 0 && (
            <Link
              href="/admin/create"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-label text-[10px] uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-surface"
            >
              + Crear Proyecto
            </Link>
          )}
        </div>
      ) : (
        <div className="border border-outline-variant/10">
          {/* Header row */}
          <div className="hidden grid-cols-[80px_2fr_1fr_1fr_1fr_auto] items-center gap-6 border-b border-outline-variant/10 px-6 py-4 font-label text-[10px] uppercase tracking-widest text-primary/40 md:grid">
            <span>Portada</span>
            <span>Título</span>
            <span>División</span>
            <span>Disciplina</span>
            <span>Estado</span>
            <span className="text-right">Acciones</span>
          </div>

          <ul className="divide-y divide-outline-variant/10">
            {visible.map((project) => {
              const cover = project.media[0];
              const coverUrl =
                cover?.type === "image" ? cover.url : undefined;
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
                    className={`inline-flex w-fit rounded-full border px-3 py-1 font-label text-[9px] uppercase tracking-widest ${STATUS_STYLES[project.status]}`}
                  >
                    {project.status}
                  </span>

                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleFeatured(project.id, project.featured)
                      }
                      className="rounded border border-primary/20 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-primary/70 transition-colors hover:border-primary hover:text-primary"
                    >
                      {project.featured ? "Quitar destaque" : "Destacar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleArchive(project.id)}
                      className="rounded border border-primary/20 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-primary/70 transition-colors hover:border-primary hover:text-primary"
                    >
                      Archivar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="rounded border border-red-500/30 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-red-400/80 transition-colors hover:border-red-400 hover:text-red-400"
                    >
                      Eliminar
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
