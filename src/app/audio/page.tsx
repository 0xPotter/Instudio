import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { DivisionView } from "@/components/work/DivisionView";
import { WorkCTA } from "@/components/work/WorkCTA";

export const metadata: Metadata = {
  title: "IN AUDIO — IN Studio",
  description:
    "Music production, mixing, mastering, and live event audio engineering by IN AUDIO.",
};

export default function AudioPage() {
  return (
    <>
      <Navbar />
      <main>
        <DivisionView division="inaudio" />
        <WorkCTA />
      </main>
      <Footer />
    </>
  );
}
