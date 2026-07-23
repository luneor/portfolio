import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "genio-admin");

export function GenioAdmin() {
  return (
    <div aria-labelledby="genio-admin-heading" className="bg-background-alt py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading
          eyebrow="Current work"
          title="Genio Admin"
          headingId="genio-admin-heading"
        >
          <p>
            I design admin tooling for academic institutions — the software
            that gives school and university staff visibility and control
            over how their students are supported. Increasingly, I&apos;m
            pushing Admin beyond a purely utilitarian feel toward something
            considered and pleasant to use, for its full range of users:
            internal super admins and support staff, organisation admins, and
            account managers.
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
