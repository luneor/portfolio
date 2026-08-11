import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { ProjectThumb } from "@/components/project-thumb";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "genio-admin");

export function GenioAdmin() {
  return (
    <div aria-labelledby="genio-admin-heading" className="bg-background-alt py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading
          title="Genio Admin"
          headingId="genio-admin-heading"
        >
          <p>
            <strong className="font-semibold">Admin tooling for academic
            institutions</strong>: the software that gives university staff
            control over how their students are supported. I&apos;m pushing it
            past a purely utilitarian feel, for everyone from internal support
            staff to organisation admins.
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
                media={<ProjectThumb project={project} />}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
