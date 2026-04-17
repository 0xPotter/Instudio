"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { cropImageToBlob, type Area } from "@/lib/cropImage";

type CoverCropperProps = {
  /** Object URL (or remote URL) of the source image. */
  src: string;
  /** Called with the cropped JPEG Blob when the user confirms. */
  onConfirm: (blob: Blob) => void;
  /** Called when the user cancels without producing a crop. */
  onCancel: () => void;
  /**
   * Locked aspect ratio for the crop frame.
   * Defaults to 4/5 to match the featured card on the home page.
   */
  aspect?: number;
};

/**
 * Behance-style cover cropper modal. Uses `react-easy-crop` to let the admin
 * pan + zoom the source image within a locked-aspect frame; the result is a
 * JPEG Blob of the visible crop that we upload alongside the original.
 */
export function CoverCropper({
  src,
  onConfirm,
  onCancel,
  aspect = 4 / 5,
}: CoverCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: Area) => {
      setPixels(croppedAreaPixels);
    },
    [],
  );

  // Lock body scroll while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ESC to cancel.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  async function handleConfirm() {
    if (!pixels) return;
    setBusy(true);
    try {
      const blob = await cropImageToBlob(src, pixels);
      onConfirm(blob);
    } catch (err) {
      console.error("Crop failed:", err);
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Crop cover image"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10">
        <div className="flex flex-col">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-white/50">
            Imagen Destacada
          </span>
          <span className="font-headline text-base font-bold uppercase tracking-tight text-white">
            Ajustar encuadre (4:5)
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/20 px-5 py-2 font-label text-[10px] uppercase tracking-widest text-white/80 transition-colors hover:border-white hover:text-white"
        >
          Cancelar
        </button>
      </div>

      {/* Crop area */}
      <div className="relative flex-1">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          objectFit="contain"
          showGrid
        />
      </div>

      {/* Footer — zoom slider + confirm */}
      <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-5 md:flex-row md:items-center md:gap-8 md:px-10">
        <div className="flex flex-1 items-center gap-4">
          <span className="font-label text-[10px] uppercase tracking-widest text-white/50">
            Zoom
          </span>
          {/* label stays "Zoom" — it's universal */}
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-white"
            aria-label="Zoom"
          />
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!pixels || busy}
          className="w-full rounded-full bg-white px-8 py-3 font-label text-[11px] uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        >
          {busy ? "Procesando…" : "Confirmar encuadre"}
        </button>
      </div>
    </div>
  );
}
