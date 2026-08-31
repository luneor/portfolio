import type { Metadata } from "next";
import { Cv } from "@/components/sections/cv";

export const metadata: Metadata = {
  title: "CV | Hanru Wehmeyer",
  description:
    "Curriculum vitae for Hanru Wehmeyer, UX Designer at Genio, experience, education, achievements and interests.",
};

export default function CvPage() {
  return (
    <main id="main">
      <Cv />
    </main>
  );
}
