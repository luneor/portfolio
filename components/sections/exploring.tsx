import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "exploring");

export function Exploring() {
  return (
    <div aria-labelledby="exploring-heading" className="py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading
          eyebrow="Independent exploration"
          title="Exploring"
          headingId="exploring-heading"
        >
          <p>
            Conceptual work I explore on my own time, isolated from and not
            attributed to my employer. These are ideas still taking shape,
            not shipped products.
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
