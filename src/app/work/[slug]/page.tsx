import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { WorkCTA } from "@/components/work/WorkCTA";
import { projects } from "@/lib/data/projects";

/**
 * Pre-render the known static slugs so their HTML shells exist in `out/`.
 * For unknown slugs (projects created via admin), the Cloudflare Worker
 * serves one of these identical shells and the client code reads the
 * real slug from the URL + fetches from Firestore.
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const metadata: Metadata = {
  title: "Project — IN Studio",
};

/**
 * Universal shell — no project-specific data at build time.
 * ProjectDetail reads the slug from usePathname() and fetches from Firestore.
 */
export default function ProjectPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProjectDetail />
        <WorkCTA />
      </main>
      <Footer />
    </>
  );
}
