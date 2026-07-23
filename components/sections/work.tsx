import { GenioAdmin } from "@/components/sections/genio-admin";
import { Exploring } from "@/components/sections/exploring";
import { EarlierProjects } from "@/components/sections/earlier-projects";

/**
 * "Work" groups the three project families (current professional work,
 * independent exploration, and the earlier archive) under one nav tab and
 * one scroll anchor, while keeping each family visually distinct.
 */
export function Work() {
  return (
    <section id="work" aria-label="Work">
      <GenioAdmin />
      <Exploring />
      <EarlierProjects />
    </section>
  );
}
