import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./client";

/**
 * Upload a single file or blob to Firebase Storage under the project's folder.
 * Returns the public download URL.
 *
 * Accepts either a `File` (regular upload) or a `Blob` (e.g. a cropped cover
 * produced by canvas). For a raw Blob, pass an explicit `filename`.
 */
export async function uploadProjectFile(
  projectId: string,
  file: File | Blob,
  folder: "hero" | "gallery" | "cover",
  filename?: string,
): Promise<string> {
  const baseName =
    filename ??
    (file instanceof File ? file.name : `blob-${Date.now()}.jpg`);
  const safeName = `${Date.now()}-${baseName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const path = `projects/${projectId}/${folder}/${safeName}`;
  const fileRef = ref(storage, path);
  const contentType = file.type || "image/jpeg";
  await uploadBytes(fileRef, file, { contentType });
  return getDownloadURL(fileRef);
}

/**
 * Delete a single file from Storage by its full download URL.
 * Silently ignores errors (file may already be gone).
 */
export async function deleteProjectFile(downloadURL: string) {
  try {
    const fileRef = ref(storage, downloadURL);
    await deleteObject(fileRef);
  } catch {
    // File may already be deleted — ignore.
  }
}
