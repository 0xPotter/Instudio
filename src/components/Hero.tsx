"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-surface pt-20 md:h-[80vh]">
      {/* Video background — desktop 1080p, mobile 720p */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-center"
          poster="/hero-poster.jpg"
          preload="none"
        >
          <source
            src="/hero-mobile.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-surface/30 via-surface/40 to-surface/60" />

      {/* Bottom fade — dissolves the video edge into the page background */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-40 bg-gradient-to-t from-surface via-surface/80 to-transparent md:h-56" />

      <div className="relative z-30 mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 md:px-8">
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
