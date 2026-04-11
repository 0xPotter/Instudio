import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { WorkCTA } from "@/components/work/WorkCTA";
import { projects } from "@/lib/data/projects";

type RouteParams = { slug: string };

export function generateStaticParams(): RouteParams[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title.en} — IN Studio`,
    description: project.description.en,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main>
        <ProjectDetail project={project} />
        <WorkCTA />
      </main>
      <Footer />
    </>
  );
}
