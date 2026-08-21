import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { ProjectThumb } from "@/components/project-thumb";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "genio-admin");

export function GenioAdmin() {
  return (
    <div aria-labelledby="recent-projects-heading" className="bg-background-alt py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading
          title="Recent Projects"
          headingId="recent-projects-heading"
        >
          <p>
            <strong className="font-semibold">
              Genio Admin is the B2B SaaS platform
            </strong>{" "}
            academic institutions use to manage their access to Genio Notes,
            our flagship product for students, giving university staff real
            control over how those students are supported. As design lead
            within the squad, working closely with a Product Manager, Tech
            Lead, and Product Marketing Manager, I own UX for the platform
            end to end.
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
