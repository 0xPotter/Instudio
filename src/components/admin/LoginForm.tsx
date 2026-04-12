"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    // TODO: replace with real auth (Supabase / NextAuth) once backend is wired.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitting(false);
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo + heading */}
        <div className="mb-12 flex flex-col items-center gap-6">
          <Image
            src="/logo.svg"
            alt="IN"
            width={48}
            height={58}
            priority
            className="h-12 w-auto"
          />
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-headline text-2xl font-black uppercase tracking-tight text-white">
              IN Studio
            </h1>
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Administrative Control
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="border border-neutral-900 bg-neutral-950 p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <Field
              id="identity"
              label="Identity"
              type="text"
              placeholder="username"
              autoComplete="username"
              required
            />
            <Field
              id="authentication"
              label="Authentication"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            {error && (
              <p className="font-label text-[10px] uppercase tracking-widest text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full bg-white py-4 font-label text-[11px] uppercase tracking-[0.25em] text-black transition-all duration-200 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Initializing…" : "Initialize Access"}
            </button>

            <a
              href="#"
              className="text-center font-label text-[10px] uppercase tracking-widest text-neutral-500 transition-colors hover:text-white"
            >
              Remote Reset
            </a>
          </form>
        </div>

        {/* Status footer */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-label text-[9px] uppercase tracking-[0.25em] text-neutral-500">
              System Online
            </span>
          </div>
          <span className="font-label text-[9px] uppercase tracking-[0.25em] text-neutral-600">
            Terminal v2.4.0
          </span>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type: "text" | "password";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

function Field({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  required,
}: FieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-3">
      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">
        {label}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="border-b border-neutral-800 bg-transparent py-3 font-body text-base text-white outline-none transition-colors placeholder:text-neutral-700 focus:border-white"
      />
    </label>
  );
}
