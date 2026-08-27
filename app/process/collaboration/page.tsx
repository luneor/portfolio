import type { Metadata } from "next";
import { Collaboration } from "@/components/sections/collaboration";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Collaboration | Hanru Wehmeyer",
  description:
    "How Hanru Wehmeyer collaborates as a UX designer: proactive and reactive modes, why working with people builds trust, and why anyone can collaborate.",
};

export default function CollaborationPage() {
  return (
    <main id="main">
      <Collaboration />
      <Contact />
    </main>
  );
}
