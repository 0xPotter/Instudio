"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type CardKey = "inlabs" | "inaudio" | "invisuals";

const CARDS: { key: CardKey; seed: string; logo: string }[] = [
  { key: "inlabs", seed: "in-labs", logo: "/in-labs.svg" },
  { key: "inaudio", seed: "in-audio", logo: "/in-audio.svg" },
  { key: "invisuals", seed: "in-visuals", logo: "/in-visuals.svg" },
];

export function Ecosystem() {
  const { t } = useLocale();

  return (
    <section className="overflow-hidden bg-surface-container-lowest py-24 md:py-32">
      <div className="mx-auto mb-12 flex max-w-screen-3xl items-center justify-between px-6 md:px-8">
        <h2 className="font-headline text-xl font-black uppercase tracking-tighter opacity-40 md:text-2xl">
          {t.ecosystem.heading}
        </h2>
        <span aria-hidden="true" className="text-xl text-primary/40">
          →
        </span>
      </div>

      <div className="relative">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-1 overflow-x-auto px-6 md:grid md:grid-cols-3 md:gap-1 md:overflow-visible md:px-8">
          {CARDS.map((card) => {
            const data = t.ecosystem.cards[card.key];
            return (
              <article
                key={card.key}
                className="group relative aspect-[4/5] w-[85vw] flex-shrink-0 cursor-pointer snap-start overflow-hidden bg-surface-container md:w-auto md:flex-shrink"
              >
                <Image
                  src={`https://picsum.photos/seed/${card.seed}/800/1000`}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 85vw"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/10" />
                <div className="absolute bottom-8 left-6 right-6 z-10 text-left md:bottom-12 md:left-12 md:right-12">
                  <Image
                    src={card.logo}
                    alt={data.alt}
                    width={200}
                    height={50}
                    className="mb-3 h-6 w-auto md:mb-4 md:h-8"
                  />
                  <p className="max-w-xs font-body text-sm text-secondary md:translate-y-4 md:opacity-0 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    {data.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
