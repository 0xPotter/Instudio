"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

type LightboxImage = { url: string; alt?: string };

type ImageLightboxProps = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function ImageLightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = original;
    };
  }, [handleKey]);

  const current = images[index];
  if (!current) return null;

  const hasMultiple = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center text-white/60 transition-colors hover:text-white md:right-8 md:top-8"
      >
        <span aria-hidden="true" className="text-3xl leading-none">
          ×
        </span>
      </button>

      {/* Counter */}
      {hasMultiple && (
        <span className="absolute left-6 top-6 z-10 font-label text-[10px] uppercase tracking-[0.3em] text-white/50 md:left-8 md:top-8">
          {index + 1} / {images.length}
        </span>
      )}

      {/* Prev */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white md:left-8"
        >
          <span aria-hidden="true" className="text-3xl leading-none">
            ←
          </span>
        </button>
      )}

      {/* Next */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white md:right-8"
        >
          <span aria-hidden="true" className="text-3xl leading-none">
            →
          </span>
        </button>
      )}

      {/* Image */}
      <div
        className="relative h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.url}
          alt={current.alt ?? ""}
          fill
          sizes="100vw"
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
