import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Contact — IN Studio",
  description:
    "Tell us about your project — a launch, a film, an album, an experiment.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactView />
      </main>
      <Footer />
    </>
  );
}
