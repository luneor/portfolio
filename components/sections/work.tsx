import { GenioAdmin } from "@/components/sections/genio-admin";
import { EarlierProjects } from "@/components/sections/earlier-projects";

/**
 * "Work" groups current professional work and the earlier archive under one
 * nav tab and one scroll anchor, while keeping each family visually distinct.
 * Independent AI concepts live in the AI section instead.
 */
export function Work() {
  return (
    <section id="work" aria-label="Work">
      <GenioAdmin />
      <EarlierProjects />
    </section>
  );
}
