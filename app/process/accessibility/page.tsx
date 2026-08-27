import type { Metadata } from "next";
import { AccessibilityProcess } from "@/components/sections/accessibility-process";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Accessibility | Hanru Wehmeyer",
  description:
    "How Hanru Wehmeyer approaches accessibility as a UX designer: compliance as meaningful work rather than a checklist, constraints that sharpen design, and the perspective it opens up.",
};

export default function AccessibilityPage() {
  return (
    <main id="main">
      <AccessibilityProcess />
      <Contact />
    </main>
  );
}
