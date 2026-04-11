"use client";

import Image from "next/image";
import { clients } from "@/lib/data/clients";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function ClientsTicker() {
  const { t } = useLocale();

  const renderSet = (key: string) => (
    <div
      key={key}
      className="flex items-center gap-24 py-4 pr-24"
      aria-hidden={key !== "primary"}
    >
      {clients.map((client) => (
        <div
          key={`${key}-${client.id}`}
          className="flex items-center text-2xl font-black uppercase tracking-tighter"
        >
          {client.logo ? (
            <Image
              src={client.logo}
              alt={client.name}
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          ) : (
            <span>{client.name}</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden border-y border-outline-variant/10 bg-surface py-16 md:py-20">
      <div className="mx-auto mb-10 flex max-w-screen-3xl justify-center px-6 md:px-8">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/60">
          {t.clients.label}
        </span>
      </div>
      <div className="flex w-max animate-ticker items-center gap-12 whitespace-nowrap opacity-40 grayscale">
        {renderSet("primary")}
        {renderSet("duplicate")}
      </div>
    </section>
  );
}
