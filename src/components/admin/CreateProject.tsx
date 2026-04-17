"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import type { Discipline, Division, ProjectMedia } from "@/lib/data/projects";
import { createProject, type ProjectStatus } from "@/lib/firebase/projects";
import { uploadProjectFile } from "@/lib/firebase/storage";
import { AdminShell } from "./AdminShell";
import { CoverCropper } from "./CoverCropper";

/** Convert any string into a URL-safe slug: lowercase, ascii, hyphens. */
function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/** Read the natural pixel dimensions of an image file. */
function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = objectUrl;
  });
}

const DIVISIONS: { value: Division; label: string }[] = [
  { value: "inlabs", label: "IN LABS" },
  { value: "inaudio", label: "IN AUDIO" },
  { value: "invisuals", label: "IN VISUALS" },
];

const DISCIPLINES: Discipline[] = [
  "photography",
  "video",
  "animation",
  "design",
  "branding",
  "audio",
];

type LocalFile = {
  id: string;
  file: File;
  previewUrl: string;
};

export function CreateProject() {
  const router = useRouter();
  const [heroFile, setHeroFile] = useState<LocalFile | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<LocalFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Cover cropper state — a 4:5 crop the admin confirms after picking the hero.
  // `coverBlob` is the cropped JPEG we'll upload as the featured-card cover.
  const [cropperOpen, setCropperOpen] = useState(false);
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  function handleHero(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    // Discard any previous cover preview URL to avoid leaks.
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverBlob(null);
    setCoverPreviewUrl(null);
    setHeroFile({
      id: `${file.name}-${file.lastModified}`,
      file,
      previewUrl: URL.createObjectURL(file),
    });
    // Open the cropper immediately so the admin frames the featured cover.
    setCropperOpen(true);
    event.target.value = "";
  }

  function handleCoverConfirm(blob: Blob) {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverBlob(blob);
    setCoverPreviewUrl(URL.createObjectURL(blob));
    setCropperOpen(false);
  }

  function handleRecrop() {
    if (!heroFile) return;
    setCropperOpen(true);
  }

  function clearHero() {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setHeroFile(null);
    setCoverBlob(null);
    setCoverPreviewUrl(null);
  }

  function handleGallery(event: ChangeEvent<HTMLInputElement>) {
    const incoming = event.target.files;
    if (!incoming) return;
    const next: LocalFile[] = Array.from(incoming).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setGalleryFiles((prev) => [...prev, ...next]);
    event.target.value = "";
  }

  function removeGalleryFile(id: string) {
    setGalleryFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const form = new FormData(event.currentTarget);
      const status: ProjectStatus = form.get("intent") === "draft" ? "draft" : "published";

      // Single title field — used as-is for both locales (no translation).
      const titleEs = (form.get("title-es") as string).trim();
      const rawSlug = (form.get("slug") as string).trim();

      if (!titleEs) {
        setError("El título es obligatorio.");
        setSubmitting(false);
        return;
      }

      // Auto-generate a URL-safe slug from the input or title.
      const slug = toSlug(rawSlug || titleEs);

      if (!slug) {
        setError("Could not generate a valid slug.");
        setSubmitting(false);
        return;
      }

      // Use a temporary ID for upload paths, then create the doc with that ID.
      const tempId = `${slug}-${Date.now()}`;

      // 1. Upload hero (original) and cropped cover in parallel.
      let media: ProjectMedia[] = [];
      let coverUrl: string | undefined;
      if (heroFile) {
        setProgress("Subiendo portada…");
        const [heroUrl, dims, uploadedCoverUrl] = await Promise.all([
          uploadProjectFile(tempId, heroFile.file, "hero"),
          readImageDimensions(heroFile.file).catch(() => null),
          coverBlob
            ? uploadProjectFile(tempId, coverBlob, "cover", "cover.jpg")
            : Promise.resolve<string | undefined>(undefined),
        ]);
        media.push({
          type: "image",
          url: heroUrl,
          alt: titleEs,
          ...(dims ? { width: dims.width, height: dims.height } : {}),
        });
        coverUrl = uploadedCoverUrl;
      }

      // 2. Upload gallery
      for (let i = 0; i < galleryFiles.length; i++) {
        setProgress(`Subiendo galería ${i + 1}/${galleryFiles.length}…`);
        const [url, dims] = await Promise.all([
          uploadProjectFile(tempId, galleryFiles[i].file, "gallery"),
          readImageDimensions(galleryFiles[i].file).catch(() => null),
        ]);
        media.push({
          type: "image",
          url,
          ...(dims ? { width: dims.width, height: dims.height } : {}),
        });
      }

      // 3. Add video embed if provided
      const videoLink = (form.get("video-link") as string)?.trim();
      if (videoLink) {
        media.push({ type: "embed", url: videoLink });
      }

      // 4. Create Firestore document
      setProgress("Guardando proyecto…");
      await createProject({
        slug,
        // Title is the same for both locales — no translation applied.
        title: { en: titleEs, es: titleEs },
        description: {
          en: (form.get("description-es") as string)?.trim() || "",
          es: (form.get("description-es") as string)?.trim() || "",
        },
        division: (form.get("division") as Division) || "inlabs",
        discipline: (form.get("discipline") as Discipline) || "design",
        media,
        // Only include coverUrl when we actually uploaded one — Firestore
        // rejects `undefined` fields by default.
        ...(coverUrl ? { coverUrl } : {}),
        externalLink: (form.get("external-link") as string)?.trim() || "",
        publishedAt:
          (form.get("published-at") as string) ||
          new Date().toISOString().slice(0, 10),
        featured: form.get("featured") === "on",
        status,
      });

      setProgress("");
      router.push("/admin");
    } catch (err) {
      console.error("Create project failed:", err);
      setError("Algo salió mal. Revisa la consola e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminShell eyebrow="Espacio / Nuevo" title="Crear Proyecto">
      <form
        onSubmit={handleSubmit}
        className="grid gap-12 lg:grid-cols-3 lg:gap-16"
      >
        {/* Left column — main fields */}
        <div className="flex flex-col gap-10 lg:col-span-2">
          <Section label="Datos básicos">
            <TextField
              id="title-es"
              label="Título del proyecto"
              placeholder="Ecos de Obsidiana"
              required
            />
            <TextField
              id="slug"
              label="Slug (opcional — se genera automáticamente)"
              placeholder="ecos-de-obsidiana"
            />
            <Textarea
              id="description-es"
              label="Descripción"
              placeholder="Instalación de audio espacial explorando…"
            />
          </Section>

          <Section label="Medios">
            {/* Portada */}
            <div>
              <span className="mb-3 block font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
                Portada
              </span>
              {heroFile ? (
                <div className="flex items-center gap-4 border border-outline-variant/10 p-4">
                  {/* Show the cropped 4:5 preview when available; fall back to
                      the raw hero thumbnail while the crop is still pending. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreviewUrl ?? heroFile.previewUrl}
                    alt={heroFile.file.name}
                    className="h-24 w-[76px] flex-shrink-0 object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-body text-sm text-primary">
                      {heroFile.file.name}
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
                      {(heroFile.file.size / 1024).toFixed(1)} KB
                      {coverBlob ? " · Encuadre listo (4:5)" : " · Pendiente encuadre"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleRecrop}
                      className="rounded border border-primary/20 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-primary/70 hover:border-primary hover:text-primary"
                    >
                      {coverBlob ? "Re-encuadrar" : "Encuadrar"}
                    </button>
                    <button
                      type="button"
                      onClick={clearHero}
                      className="rounded border border-primary/20 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-primary/70 hover:border-primary hover:text-primary"
                    >
                      Reemplazar
                    </button>
                  </div>
                </div>
              ) : (
                <UploadDropzone
                  id="hero-upload"
                  onChange={handleHero}
                  hint="Una imagen — te pediremos encuadrar el recorte 4:5 para destacados."
                />
              )}
            </div>

            {/* Gallery uploads */}
            <div>
              <span className="mb-3 block font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
                Galería
              </span>
              <UploadDropzone
                id="gallery-upload"
                multiple
                onChange={handleGallery}
                hint="Sube las imágenes. Aparecen en el orden que las subas."
              />
              {galleryFiles.length > 0 && (
                <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {galleryFiles.map((f) => (
                    <li
                      key={f.id}
                      className="group relative aspect-square overflow-hidden border border-outline-variant/10 bg-surface-container-low"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.previewUrl}
                        alt={f.file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryFile(f.id)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 font-label text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label={`Remove ${f.file.name}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* External video link */}
            <TextField
              id="video-link"
              label="Enlace de video (Vimeo / YouTube)"
              placeholder="https://vimeo.com/…"
              type="url"
            />
          </Section>
        </div>

        {/* Right column — meta */}
        <aside className="flex flex-col gap-10">
          <Section label="Clasificación">
            <SelectField
              id="division"
              label="División"
              options={DIVISIONS.map((d) => ({
                value: d.value,
                label: d.label,
              }))}
              required
            />
            <SelectField
              id="discipline"
              label="Disciplina"
              options={DISCIPLINES.map((d) => ({
                value: d,
                label: d.charAt(0).toUpperCase() + d.slice(1),
              }))}
              required
            />
            <TextField
              id="external-link"
              label="Enlace externo"
              placeholder="https://"
              type="url"
            />
            <TextField
              id="published-at"
              label="Fecha de publicación"
              type="date"
              required
            />
          </Section>

          <Section label="Visibilidad">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                className="h-4 w-4 accent-primary"
              />
              <span className="font-label text-[10px] uppercase tracking-widest text-primary/70">
                Marcar como Destacado
              </span>
            </label>
          </Section>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={submitting}
              className="w-full rounded-full bg-primary py-4 font-label text-[11px] uppercase tracking-widest text-surface transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? progress || "Publicando…" : "Publicar Proyecto"}
            </button>
            <button
              type="submit"
              name="intent"
              value="draft"
              disabled={submitting}
              className="w-full rounded-full border border-primary/30 py-4 font-label text-[11px] uppercase tracking-widest text-primary/70 transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? progress || "Guardando…" : "Guardar Borrador"}
            </button>
            {error && (
              <p className="text-center font-label text-[10px] uppercase tracking-widest text-red-400">
                {error}
              </p>
            )}
          </div>
        </aside>
      </form>

      {cropperOpen && heroFile && (
        <CoverCropper
          src={heroFile.previewUrl}
          onConfirm={handleCoverConfirm}
          onCancel={() => setCropperOpen(false)}
        />
      )}
    </AdminShell>
  );
}

/* ───────── shared form helpers ───────── */

function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-6 border border-outline-variant/10 p-6 md:p-8">
      <legend className="px-2 font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "url" | "date";
  required?: boolean;
};

function TextField({
  id,
  label,
  placeholder,
  type = "text",
  required,
}: TextFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
        {label}
        {required && <span className="ml-1 text-primary/60">*</span>}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="border-b border-primary/20 bg-transparent py-3 font-body text-base text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary"
      />
    </label>
  );
}

function Textarea({
  id,
  label,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
        {label}
        {required && <span className="ml-1 text-primary/60">*</span>}
      </span>
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="resize-none border-b border-primary/20 bg-transparent py-3 font-body text-base text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary"
      />
    </label>
  );
}

function SelectField({
  id,
  label,
  options,
  required,
}: {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
        {label}
        {required && <span className="ml-1 text-primary/60">*</span>}
      </span>
      <select
        id={id}
        name={id}
        required={required}
        defaultValue=""
        className="border-b border-primary/20 bg-transparent py-3 font-body text-base text-primary outline-none transition-colors focus:border-primary"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-neutral-950">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function UploadDropzone({
  id,
  multiple,
  onChange,
  hint,
}: {
  id: string;
  multiple?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-primary/20 px-6 py-12 text-center transition-colors hover:border-primary/60"
    >
      <span className="font-label text-[11px] uppercase tracking-[0.25em] text-primary/70">
        Haz clic para subir
      </span>
      {hint && (
        <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
          {hint}
        </span>
      )}
      <input
        id={id}
        name={id}
        type="file"
        accept="image/*,video/*"
        multiple={multiple}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );
}
