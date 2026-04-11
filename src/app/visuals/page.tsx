import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { DivisionView } from "@/components/work/DivisionView";
import { WorkCTA } from "@/components/work/WorkCTA";

export const metadata: Metadata = {
  title: "IN VISUALS — IN Studio",
  description:
    "Photography, cinematography, graphic design, and animation by IN VISUALS.",
};

export default function VisualsPage() {
  return (
    <>
      <Navbar />
      <main>
        <DivisionView division="invisuals" />
        <WorkCTA />
      </main>
      <Footer />
    </>
  );
}
