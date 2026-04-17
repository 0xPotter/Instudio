"use client";

import { useEffect, useMemo, useState } from "react";

type GridImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

type ProjectMediaGridProps = {
  images: GridImage[];
  onOpen: (index: number) => void;
};

function rowSizes(n: number): number[] {
  if (n <= 0) return [];
  if (n <= 3) return [n];
  if (n === 4) return [2, 2];
  return [3, ...rowSizes(n - 3)];
}

export function ProjectMediaGrid({ images, onOpen }: ProjectMediaGridProps) {
  const [probed, setProbed] = useState<Record<string, { w: number; h: number }>>({});

  useEffect(() => {
    const missing = images.filter((img) => !img.width || !img.height);
    if (missing.length === 0) return;

    let cancelled = false;
    for (const img of missing) {
      if (probed[img.url]) continue;
      const probe = new window.Image();
      probe.onload = () => {
        if (cancelled) return;
        setProbed((prev) => ({
          ...prev,
          [img.url]: { w: probe.naturalWidth, h: probe.naturalHeight },
        }));
      };
      probe.src = img.url;
    }
    return () => {
      cancelled = true;
    };
  }, [images, probed]);

  const resolved = useMemo(
    () =>
      images.map((img) => {
        if (img.width && img.height) return { ...img, aspect: img.width / img.height };
        const p = probed[img.url];
        if (p) return { ...img, aspect: p.w / p.h };
        return { ...img, aspect: 3 / 2 };
      }),
    [images, probed],
  );

  if (resolved.length === 0) return null;

  const sizes = rowSizes(resolved.length);
  const rows: { start: number; count: number }[] = [];
  let cursor = 0;
  for (const size of sizes) {
    rows.push({ start: cursor, count: size });
    cursor += size;
  }

  return (
    <div className="container mx-auto flex max-w-screen-3xl flex-col gap-4 px-6 md:gap-6 md:px-8">
      {rows.map((row, rowIdx) => {
        const rowImages = resolved.slice(row.start, row.start + row.count);
        return (
          <div
            key={`row-${rowIdx}`}
            className="flex w-full flex-col gap-4 md:flex-row md:gap-6"
          >
            {rowImages.map((image, i) => {
              const absoluteIndex = row.start + i;
              return (
                <button
                  key={`img-${absoluteIndex}`}
                  type="button"
                  onClick={() => onOpen(absoluteIndex)}
                  className="group relative block w-full overflow-hidden bg-surface-container-lowest transition-opacity hover:opacity-95"
                  style={{
                    flex: `${image.aspect} 1 0`,
                    aspectRatio: `${image.aspect}`,
                  }}
                  aria-label={`Abrir imagen ${absoluteIndex + 1}`}
                >
                  {/* Plain <img> — avoids Next.js Image/fill quirks with
                      dynamic aspect-ratio containers in static export mode */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading={absoluteIndex < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="pointer-events-none absolute bottom-3 right-3 font-label text-[9px] uppercase tracking-[0.3em] text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                    Ver ↗
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
