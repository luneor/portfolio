import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "About — Hanru Wehmeyer",
  description:
    "Hanru Wehmeyer is a UX Designer at Genio, based in Scotland, designing admin tools that give educators real control over how they support students.",
};

export default function AboutPage() {
  return (
    <main id="main">
      <About />
      <Contact />
    </main>
  );
}
