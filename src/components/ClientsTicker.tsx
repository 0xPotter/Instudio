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
      <span className="font-label text-[10px] uppercase tracking-[0.3em]">
        {t.clients.label}
      </span>
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
    <section className="overflow-hidden border-y border-outline-variant/10 bg-surface py-20">
      <div className="flex w-max animate-ticker items-center gap-12 whitespace-nowrap opacity-30 grayscale">
        {renderSet("primary")}
        {renderSet("duplicate")}
      </div>
    </section>
  );
}
