"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import type { Discipline, Division } from "@/lib/data/projects";
import { AdminShell } from "./AdminShell";

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

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  previewUrl: string;
};

export function CreateProject() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [hero, setHero] = useState<UploadedFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const incoming = event.target.files;
    if (!incoming) return;
    const next: UploadedFile[] = Array.from(incoming).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...next]);
    event.target.value = "";
  }

  function handleHero(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setHero({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    });
    event.target.value = "";
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const [intent, setIntent] = useState<"publish" | "draft">("publish");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    // TODO: replace with real upload + insert (Supabase Storage + projects table).
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);
    setFeedback(
      intent === "publish"
        ? "Published. (mock — wire backend to persist)"
        : "Draft saved. (mock — wire backend to persist)",
    );
  }

  return (
    <AdminShell eyebrow="Workspace / New" title="Create Project">
      <form
        onSubmit={handleSubmit}
        className="grid gap-12 lg:grid-cols-3 lg:gap-16"
      >
        {/* Left column — main fields */}
        <div className="flex flex-col gap-10 lg:col-span-2">
          <Section label="Basics">
            <div className="grid gap-6 md:grid-cols-2">
              <TextField
                id="title-en"
                label="Title (EN)"
                placeholder="Obsidian Echoes"
                required
              />
              <TextField
                id="title-es"
                label="Title (ES)"
                placeholder="Ecos de Obsidiana"
                required
              />
            </div>
            <TextField
              id="slug"
              label="Slug"
              placeholder="obsidian-echoes"
              required
            />
            <Textarea
              id="description-en"
              label="Description (EN)"
              placeholder="Spatial audio installation exploring…"
              required
            />
            <Textarea
              id="description-es"
              label="Description (ES)"
              placeholder="Instalación de audio espacial explorando…"
              required
            />
          </Section>

          <Section label="Media">
            {/* Hero image */}
            <div>
              <span className="mb-3 block font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
                Hero Image
              </span>
              {hero ? (
                <div className="flex items-center gap-4 border border-outline-variant/10 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.previewUrl}
                    alt={hero.name}
                    className="h-20 w-20 object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-body text-sm text-primary">
                      {hero.name}
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
                      {(hero.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHero(null)}
                    className="rounded border border-primary/20 px-3 py-1.5 font-label text-[9px] uppercase tracking-widest text-primary/70 hover:border-primary hover:text-primary"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <UploadDropzone
                  id="hero-upload"
                  onChange={handleHero}
                  hint="Single image — used as the cover."
                />
              )}
            </div>

            {/* Gallery uploads */}
            <div>
              <span className="mb-3 block font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
                Gallery
              </span>
              <UploadDropzone
                id="gallery-upload"
                multiple
                onChange={handleFiles}
                hint="Drop images and videos. Reorder later."
              />
              {files.length > 0 && (
                <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {files.map((file) => (
                    <li
                      key={file.id}
                      className="group relative aspect-square overflow-hidden border border-outline-variant/10 bg-surface-container-low"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 font-label text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label={`Remove ${file.name}`}
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
              label="Video Link (Vimeo / YouTube)"
              placeholder="https://vimeo.com/…"
              type="url"
            />
          </Section>
        </div>

        {/* Right column — meta */}
        <aside className="flex flex-col gap-10">
          <Section label="Classification">
            <SelectField
              id="division"
              label="Division"
              options={DIVISIONS.map((d) => ({
                value: d.value,
                label: d.label,
              }))}
              required
            />
            <SelectField
              id="discipline"
              label="Discipline"
              options={DISCIPLINES.map((d) => ({
                value: d,
                label: d.charAt(0).toUpperCase() + d.slice(1),
              }))}
              required
            />
            <TextField
              id="external-link"
              label="External Link"
              placeholder="https://"
              type="url"
            />
            <TextField
              id="published-at"
              label="Publish Date"
              type="date"
              required
            />
          </Section>

          <Section label="Visibility">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                className="h-4 w-4 accent-primary"
              />
              <span className="font-label text-[10px] uppercase tracking-widest text-primary/70">
                Mark as Featured
              </span>
            </label>
          </Section>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              onClick={() => setIntent("publish")}
              disabled={submitting}
              className="w-full rounded-full bg-primary py-4 font-label text-[11px] uppercase tracking-widest text-surface transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && intent === "publish"
                ? "Publishing…"
                : "Publish Project"}
            </button>
            <button
              type="submit"
              onClick={() => setIntent("draft")}
              disabled={submitting}
              className="w-full rounded-full border border-primary/30 py-4 font-label text-[11px] uppercase tracking-widest text-primary/70 transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && intent === "draft" ? "Saving…" : "Save Draft"}
            </button>
            {feedback && (
              <p className="text-center font-label text-[10px] uppercase tracking-widest text-emerald-400">
                {feedback}
              </p>
            )}
          </div>
        </aside>
      </form>
    </AdminShell>
  );
}

/* ───────── helpers ───────── */

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
        Click to upload
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
