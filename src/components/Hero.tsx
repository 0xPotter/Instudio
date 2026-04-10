"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface pt-20">
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="https://picsum.photos/seed/in-hero/1920/1080"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-surface/20 via-surface to-surface" />

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 md:px-8">
        <div className="w-full">
          <span className="mb-8 block font-label text-[12px] uppercase tracking-[0.4em] text-primary/60">
            {t.hero.eyebrow}
          </span>
          <h1 className="hero-text-shadow font-headline text-[13vw] font-black uppercase leading-[0.85] tracking-[-0.04em] text-primary sm:text-[12vw] md:text-[8vw]">
            {t.hero.titleLine1}
            <br />
            {t.hero.titleLine2}
          </h1>
        </div>

        <div className="mt-16 flex w-full flex-col items-start justify-between gap-12 md:mt-24 md:flex-row md:items-end md:gap-8">
          <p className="max-w-md font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
            {t.hero.description}
          </p>
          <div className="flex flex-col items-start md:items-end">
            <span className="mb-2 text-5xl font-black text-primary md:text-6xl">
              {t.hero.counter}
            </span>
            <div className="relative h-px w-48 bg-outline-variant/30">
              <div className="absolute left-0 top-0 h-full w-1/3 bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
