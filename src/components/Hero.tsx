"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/in-hero/1920/1080"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-surface/30 via-surface/40 to-surface/80" />

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 md:px-8">
        <div className="w-full">
          <h1 className="hero-text-shadow font-headline text-[13vw] font-black uppercase leading-[0.85] tracking-[-0.04em] text-primary sm:text-[12vw] md:text-[8vw]">
            {t.hero.titleLine1}
            <br />
            {t.hero.titleLine2}
          </h1>
        </div>

        <p className="mt-16 max-w-md font-body text-base leading-relaxed text-on-surface-variant md:mt-24 md:text-lg">
          {t.hero.description}
        </p>
      </div>
    </section>
  );
}
