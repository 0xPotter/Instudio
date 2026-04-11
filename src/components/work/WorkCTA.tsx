"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export function WorkCTA() {
  const { t } = useLocale();

  return (
    <section className="border-t border-outline-variant/10 bg-surface py-24 md:py-32">
      <div className="container mx-auto max-w-screen-3xl px-6 md:px-8">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="flex max-w-2xl flex-col gap-6">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
              {t.workPage.cta.eyebrow}
            </span>
            <h2 className="font-headline text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">
              {t.workPage.cta.heading}
            </h2>
            <p className="max-w-xl font-body text-base leading-relaxed text-primary/60 md:text-lg">
              {t.workPage.cta.description}
            </p>
          </div>
          <a
            href="#contact"
            className="inline-block whitespace-nowrap rounded-full border border-primary px-10 py-4 font-label text-[11px] uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-surface"
          >
            {t.workPage.cta.action}
          </a>
        </div>
      </div>
    </section>
  );
}
