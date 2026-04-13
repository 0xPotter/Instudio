import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
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
    externalLink: data.externalLink,
    publishedAt: data.publishedAt ?? "",
    featured: data.featured ?? false,
    status: data.status ?? "draft",
  };
}

/* ───────── reads ───────── */

export async function getProjects(): Promise<FirestoreProject[]> {
  const q = query(collection(db, COL), orderBy("publishedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProject(d.id, d.data()));
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
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
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
