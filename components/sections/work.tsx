import { GenioAdmin } from "@/components/sections/genio-admin";
import { Accessibility } from "@/components/sections/accessibility";
import { EarlierProjects } from "@/components/sections/earlier-projects";

/**
 * "Work" groups current professional work and the earlier archive under one
 * nav tab and one scroll anchor, while keeping each family visually distinct.
 * Independent AI concepts live in the AI section instead.
 *
 * Three families now: Genio Admin, Accessibility (Genio Notes work, so a peer
 * rather than a subsection of Genio Admin), then the earlier archive.
 */
export function Work() {
  return (
    <section id="work" aria-label="Work">
      <GenioAdmin />
      <Accessibility />
      <EarlierProjects />
    </section>
  );
}
