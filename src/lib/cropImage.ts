/**
 * Canvas-based helper to produce a cropped image Blob from a source image URL
 * and a pixel-area rectangle (as returned by `react-easy-crop`).
 *
 * The output is a JPEG Blob — smaller than PNG for photographic covers and
 * perfectly fine since we don't need transparency for cover images.
 */

export type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Load an HTMLImageElement from a URL (object URL, blob URL, or remote). */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    // Allow canvas export for remote images (e.g. Firebase Storage URLs).
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for cropping."));
    img.src = src;
  });
}

/**
 * Crop a source image to a pixel-area rectangle and return a JPEG Blob.
 *
 * @param src             Source image URL (object URL from a File works best).
 * @param area            Crop area in natural pixels.
 * @param maxDimension    Optional max width/height of the output. Useful for
 *                        keeping cover images reasonably small (e.g. 1600).
 * @param quality         JPEG quality (0-1). Default 0.9.
 */
export async function cropImageToBlob(
  src: string,
  area: Area,
  maxDimension = 1600,
  quality = 0.9,
): Promise<Blob> {
  const img = await loadImage(src);

  // Downscale if the crop area is larger than maxDimension on its longest side.
  const scale = Math.min(
    1,
    maxDimension / Math.max(area.width, area.height),
  );
  const outW = Math.round(area.width * scale);
  const outH = Math.round(area.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context.");

  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    outW,
    outH,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null."));
      },
      "image/jpeg",
      quality,
    );
  });
}
