import { SectionHeading } from "@/components/section-heading";
import { ProjectFeature } from "@/components/project-feature";
import { ProjectThumb } from "@/components/project-thumb";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "earlier-projects");

export function EarlierProjects() {
  return (
    /*
      Page ground, matching Recent Projects above (see the note there on why
      that section gave up its lifted surface). No dividing rule between the
      two: a hairline earns its place when it separates two different
      surfaces, and once both sections sat on the same ground it was drawing
      a line through continuous space. The heading and the `py-32` either
      side of it are what mark the change of section now.
    */
    <div aria-labelledby="earlier-projects-heading" className="py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading
          title="Earlier Projects"
          headingId="earlier-projects-heading"
        />

        {/* Same one-column, no-border stack and spacing as Recent Projects. */}
        <div className="mt-10 flex flex-col gap-24">
          {projects.map((project) => {
            return (
              <ProjectFeature
                key={project.slug}
                slug={project.slug}
                title={project.title}
                summary={project.summary}
                media={
                  <ProjectThumb
                    project={project}
                    sizes="(max-width: 768px) 100vw, 512px"
                  />
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
