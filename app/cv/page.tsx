import type { Metadata } from "next";
import { Cv } from "@/components/sections/cv";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "CV | Hanru Wehmeyer",
  description:
    "Curriculum vitae for Hanru Wehmeyer, UX Designer at Genio, experience, education, achievements and interests.",
};

export default function CvPage() {
  return (
    <main id="main">
      <Cv />
      <Contact />
    </main>
  );
}
