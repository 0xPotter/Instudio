import { ClientsTicker } from "@/components/ClientsTicker";
import { Ecosystem } from "@/components/Ecosystem";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { SelectedWork } from "@/components/SelectedWork";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ecosystem />
        <ClientsTicker />
        <SelectedWork />
      </main>
      <Footer />
    </>
  );
}
