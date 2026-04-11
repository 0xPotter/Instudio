import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WorkArchive } from "@/components/work/WorkArchive";
import { WorkCTA } from "@/components/work/WorkCTA";

export const metadata: Metadata = {
  title: "Work — IN Studio",
  description:
    "A living archive of selected projects across IN LABS, IN AUDIO, and IN VISUALS.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main>
        <WorkArchive />
        <WorkCTA />
      </main>
      <Footer />
    </>
  );
}
