import { SectionHeading } from "@/components/section-heading";
import { ProjectFeature } from "@/components/project-feature";
import { ProjectThumb } from "@/components/project-thumb";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter(
  (project) => project.section === "accessibility"
);

/*
  A peer of Genio Admin, not a subsection of it, which is why the heading
  is an h2 at the same size rather than an h3 inside the Genio Admin stack.

  The split is real and not just presentational: this work is on Genio Notes,
  the student-facing product, so the Genio Admin intro copy above describes a
  different platform entirely and shouldn't be read as framing it.

  Same one-column, no-border stack and spacing as the sections either side.
*/
export function Accessibility() {
  return (
    <div aria-labelledby="accessibility-heading" className="py-20">
      <div className="mx-auto max-w-page px-6">
        <SectionHeading title="Accessibility" headingId="accessibility-heading" />

        <div className="mt-10 flex flex-col gap-24">
          {projects.map((project) => {
            return (
              <ProjectFeature
                key={project.slug}
                slug={project.slug}
                title={project.title}
                summary={project.summary}
                secondaryAction={project.secondaryAction}
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
