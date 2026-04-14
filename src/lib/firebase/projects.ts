import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  setDoc,
  updateDoc,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./client";
import type { Discipline, Division, ProjectMedia } from "../data/projects";

/* ───────── types ───────── */

export type ProjectStatus = "published" | "draft" | "archived";

export type FirestoreProject = {
  id: string;
  slug: string;
  title: { en: string; es: string };
  description: { en: string; es: string };
  division: Division;
  discipline: Discipline;
  media: ProjectMedia[];
  /**
   * Optional pre-cropped cover (4:5) used by the home "featured" cards.
   * When absent, the UI falls back to the first media image.
   */
  coverUrl?: string;
  externalLink?: string;
  publishedAt: string;
  featured: boolean;
  status: ProjectStatus;
};

/* ───────── helpers ───────── */

const COL = "projects";

function toProject(id: string, data: DocumentData): FirestoreProject {
  return {
    id,
    slug: data.slug ?? "",
    title: data.title ?? { en: "", es: "" },
    description: data.description ?? { en: "", es: "" },
    division: data.division ?? "inlabs",
    discipline: data.discipline ?? "design",
    media: data.media ?? [],
    coverUrl: data.coverUrl,
    externalLink: data.externalLink,
    publishedAt: data.publishedAt ?? "",
    featured: data.featured ?? false,
    status: data.status ?? "draft",
  };
}

/* ───────── reads ───────── */

export async function getProjects(): Promise<FirestoreProject[]> {
  try {
    const q = query(collection(db, COL), orderBy("publishedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toProject(d.id, d.data()));
  } catch (err) {
    // orderBy may fail if the Firestore index hasn't been created yet.
    // Fall back to an unordered read so the site still works.
    console.warn("getProjects: ordered query failed, falling back to unordered read.", err);
    const snap = await getDocs(collection(db, COL));
    const results = snap.docs.map((d) => toProject(d.id, d.data()));
    results.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return results;
  }
}

/** Published projects only — for the public site. */
export async function getPublishedProjects(): Promise<FirestoreProject[]> {
  const all = await getProjects();
  return all.filter((p) => p.status === "published");
}

/** Published + featured — for the home page highlights. */
export async function getFeaturedProjects(): Promise<FirestoreProject[]> {
  const published = await getPublishedProjects();
  return published.filter((p) => p.featured);
}

/** Find a single project by slug (any status). */
export async function getProjectBySlug(
  slug: string,
): Promise<FirestoreProject | null> {
  try {
    // Direct query by slug — no index needed, no full collection scan.
    const q = query(collection(db, COL), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return toProject(d.id, d.data());
  } catch (err) {
    console.error("getProjectBySlug failed:", err);
    return null;
  }
}

/* ───────── writes ───────── */

/** Create a new project. Returns the generated ID. */
export async function createProject(
  data: Omit<FirestoreProject, "id">,
): Promise<string> {
  const ref = doc(collection(db, COL));
  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Full update (e.g. from the edit form). */
export async function updateProject(
  id: string,
  data: Partial<Omit<FirestoreProject, "id">>,
) {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Toggle the `featured` flag. */
export async function toggleFeatured(id: string, current: boolean) {
  await updateDoc(doc(db, COL, id), {
    featured: !current,
    updatedAt: serverTimestamp(),
  });
}

/** Set status to "archived". */
export async function archiveProject(id: string) {
  await updateDoc(doc(db, COL, id), {
    status: "archived",
    updatedAt: serverTimestamp(),
  });
}

/** Permanently delete a project document. */
export async function deleteProject(id: string) {
  await deleteDoc(doc(db, COL, id));
}
