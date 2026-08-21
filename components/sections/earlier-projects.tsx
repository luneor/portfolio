import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { ProjectThumb } from "@/components/project-thumb";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "earlier-projects");

export function EarlierProjects() {
  return (
    /*
      Page ground, deliberately not the lifted `bg-background-alt` used by
      Recent Projects above: current work sits on a raised surface, the
      archive recedes to the base. The two sections are adjacent, so sharing a
      surface merged them into one slab.
    */
    <div
      aria-labelledby="earlier-projects-heading"
      className="border-t border-border py-24"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading
          title="Earlier Projects"
          headingId="earlier-projects-heading"
        >
          <p>
            Conceptual apps and sponsored research, refreshed visually with the
            original findings kept intact.
          </p>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            return (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                summary={project.summary}
                topics={project.topics}
                media={<ProjectThumb project={project} />}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
