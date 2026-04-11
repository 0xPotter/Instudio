import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { DivisionView } from "@/components/work/DivisionView";
import { WorkCTA } from "@/components/work/WorkCTA";

export const metadata: Metadata = {
  title: "IN LABS — IN Studio",
  description:
    "AI-driven creative innovation: generative systems, prototypes, and creative tools by IN LABS.",
};

export default function LabsPage() {
  return (
    <>
      <Navbar />
      <main>
        <DivisionView division="inlabs" />
        <WorkCTA />
      </main>
      <Footer />
    </>
  );
}
