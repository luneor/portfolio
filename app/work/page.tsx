import type { Metadata } from "next";
import { Work } from "@/components/sections/work";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Work | Hanru Wehmeyer",
  description:
    "Case studies from Genio Admin, plus earlier concept and research projects, by Hanru Wehmeyer, UX Designer.",
};

export default function WorkPage() {
  return (
    <main id="main">
      <Work />
      <Contact />
    </main>
  );
}
