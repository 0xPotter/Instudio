import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./client";

/**
 * Upload a single file to Firebase Storage under the project's folder.
 * Returns the public download URL.
 */
export async function uploadProjectFile(
  projectId: string,
  file: File,
  folder: "hero" | "gallery",
): Promise<string> {
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const path = `projects/${projectId}/${folder}/${safeName}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file, { contentType: file.type });
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
