import { GenioAdmin } from "@/components/sections/genio-admin";
import { Accessibility } from "@/components/sections/accessibility";
import { EarlierProjects } from "@/components/sections/earlier-projects";

/**
 * "Work" groups current professional work and the earlier archive under one
 * nav tab and one scroll anchor, while keeping each family visually distinct.
 * Independent AI concepts live in the AI section instead.
 *
 * Three families: Genio Admin, then Concept Work, then Accessibility (Genio
 * Notes work, so a peer rather than a subsection of Genio Admin).
 *
 * Genio Admin leads deliberately: it carries the real constraints,
 * stakeholders and measurable outcomes, and it's the current role. Concept
 * Work follows it rather than sitting at the foot of the page, where a reader
 * who left early never learned it existed at all.
 */
export function Work() {
  return (
    <section id="work" aria-label="Work">
      <GenioAdmin />
      <EarlierProjects />
      <Accessibility />
    </section>
  );
}
