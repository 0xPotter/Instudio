import { ClientsTicker } from "@/components/ClientsTicker";
import { Ecosystem } from "@/components/Ecosystem";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProjects />
        <ClientsTicker />
        <Ecosystem />
      </main>
      <Footer />
    </>
  );
}
