"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-surface pt-20 md:h-[90vh]">

      {/* ─── Video layer ─────────────────────────────────────────────────────
          Two independent <video> elements, each with autoPlay + muted +
          playsInline declared in HTML. CSS toggles which one is visible.
          display:none stops the hidden video from downloading / playing,
          so the mobile file never loads on desktop and vice-versa.
          No JS source-switching needed — the browser handles everything. */}
      <div className="absolute inset-0 z-0">
        {/* Mobile (≤ 767 px) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
        >
          <source src="/hero-mobile.mp4" type="video/mp4" />
        </video>

        {/* Desktop (≥ 768 px) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-surface/20 via-surface/30 to-surface/50" />

      {/* Gaussian blur + colour fade at the bottom edge */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-48 md:h-64"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          maskImage: "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 z-30 h-48 bg-gradient-to-t from-surface via-surface/70 to-transparent md:h-64" />

      {/* Content */}
      <div className="relative z-40 mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 md:px-8">
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
