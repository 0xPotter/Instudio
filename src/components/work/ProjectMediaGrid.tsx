"use client";

import Image from "next/image";
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

/**
 * Smart row-based grid inspired by Behance's project editor.
 *
 * Images are grouped into rows of 2–3 (or 1 for a single image). Within a
 * row, each image's flex-grow is proportional to its aspect ratio, so all
 * images in the row end up the SAME height with widths that reflect their
 * natural proportions — no cropping, no letterboxing, no black bars.
 *
 * Row sizes pattern:
 *   1 → [1]  (full-width hero)
 *   2 → [2]
 *   3 → [3]
 *   4 → [2,2]
 *   5 → [3,2]
 *   6 → [3,3]
 *   7 → [3,2,2]
 *   8 → [3,3,2]
 *   9 → [3,3,3]
 *   10+ → [3, 3, …, <2 or 3>]
 */
function rowSizes(n: number): number[] {
  if (n <= 0) return [];
  if (n <= 3) return [n];
  if (n === 4) return [2, 2];
  return [3, ...rowSizes(n - 3)];
}

export function ProjectMediaGrid({ images, onOpen }: ProjectMediaGridProps) {
  // Track dimensions probed at runtime for legacy images that didn't save
  // width/height at upload time. Keyed by image URL.
  const [probed, setProbed] = useState<Record<string, { w: number; h: number }>>(
    {},
  );

  // For every image missing width/height, load it in a detached <img> element
  // and store its natural dimensions once known.
  useEffect(() => {
    const missing = images.filter(
      (img) => !img.width || !img.height,
    );
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

  // Resolve the final dimensions for each image — either from saved values or
  // from the live probe. Fall back to 3:2 only as a last resort (before probe
  // completes).
  const resolved = useMemo(
    () =>
      images.map((img) => {
        if (img.width && img.height) {
          return { ...img, aspect: img.width / img.height };
        }
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
                  aria-label={`Open image ${absoluteIndex + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    priority={absoluteIndex < 2}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="pointer-events-none absolute bottom-3 right-3 font-label text-[9px] uppercase tracking-[0.3em] text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                    View ↗
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
