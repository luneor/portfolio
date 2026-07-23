import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "earlier-projects");

export function EarlierProjects() {
  return (
    <div aria-labelledby="earlier-projects-heading" className="bg-background-alt py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading
          eyebrow="Portfolio archive"
          title="Earlier Projects"
          headingId="earlier-projects-heading"
        >
          <p>
            Earlier work spanning conceptual apps, sponsored research, and
            university study — refreshed here visually, with the original
            findings and claims kept intact.
          </p>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => {
            const Art = project.art;
            return (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                tag={project.tag}
                title={project.title}
                summary={project.summary}
                media={<Art />}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
