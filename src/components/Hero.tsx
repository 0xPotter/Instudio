"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pick the right resolution based on actual viewport width — avoids the
    // unreliable <source media=""> approach that breaks on iOS Safari.
    const src =
      window.innerWidth < 768 ? "/hero-mobile.mp4" : "/hero.mp4";

    video.src = src;
    video.load();
    // Explicitly call play() — required on some mobile browsers even when
    // autoPlay + muted + playsInline are present.
    video.play().catch(() => {
      // Autoplay blocked by the browser — video stays as a static poster.
    });
  }, []);

  return (
    <section className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-surface pt-20 md:h-[90vh]">
      {/* Video layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Dark overlay — softens the video so text stays readable */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-surface/20 via-surface/30 to-surface/50" />

      {/* Gaussian blur fade — blurs the video progressively toward the bottom,
          then a color gradient covers the remainder to hide the hard edge.
          backdrop-filter applies to whatever is below (the video + overlay);
          mask-image shapes the blur into a soft upward fade. */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-48 md:h-64"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          maskImage:
            "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
        }}
      />
      {/* Color fill on top of the blur zone — fades video fully into surface */}
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
