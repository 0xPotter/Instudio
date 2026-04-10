"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

const CLIENTS = [
  "Nexus",
  "Vertex",
  "Aether",
  "Prisma",
  "Oracle",
  "Lumen",
  "Cortex",
  "Axiom",
  "Spectra",
];

export function ClientsTicker() {
  const { t } = useLocale();

  const renderSet = (key: string) => (
    <div
      key={key}
      className="flex items-center gap-24 py-4 pr-24"
      aria-hidden={key !== "primary"}
    >
      <span className="font-label text-[10px] uppercase tracking-[0.3em]">
        {t.clients.label}
      </span>
      {CLIENTS.map((name) => (
        <div
          key={`${key}-${name}`}
          className="text-2xl font-black uppercase tracking-tighter"
        >
          {name}
        </div>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden border-y border-outline-variant/10 bg-surface py-20">
      <div className="flex w-max animate-ticker items-center gap-12 grayscale opacity-30 whitespace-nowrap">
        {renderSet("primary")}
        {renderSet("duplicate")}
      </div>
    </section>
  );
}
