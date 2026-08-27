import { SectionHeading } from "@/components/section-heading";
import { ProjectFeature } from "@/components/project-feature";
import { ProjectThumb } from "@/components/project-thumb";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "genio-admin");

export function GenioAdmin() {
  return (
    /*
      Page ground, same as More Work below. This section used to sit on
      the lifted `bg-background-alt` to mark current work as raised above the
      archive, which worked when each project was a card: the cards carried
      `--card` and the grey behind them was what they were lifted OFF. With
      the cards gone there's nothing left to lift, so the grey read as a slab
      of panel colour behind loose content. The section headings and the
      padding either side of them carry the separation instead.

      `py-20`, and every section on this page matches it. Adjacent sections
      each contribute their own padding, so the figure here is half the gap
      between two sections: 80px a side reads as 160px between, against the
      96px `gap-24` between projects INSIDE a section. That ordering is the
      point -- a section break has to read as bigger than a project break --
      and at the old `py-32` it was 256px, nearly triple the project gap,
      which left the page feeling like three separate documents.
    */
    <div aria-labelledby="genio-admin-heading" className="py-20">
      <div className="mx-auto max-w-page px-6">
        <SectionHeading
          title="Genio Admin"
          headingId="genio-admin-heading"
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

        {/*
          One project per row, always -- the grid's sm/lg column breaks are
          gone along with it (each row splits into image/text internally
          instead). `gap-24` is doing the job the card border used to: with
          no boundary drawn around each project, the space between them is
          the only thing separating one from the next, so it has to be wide
          enough to read as a gap between things rather than a gap inside one
          long thing.

          `mt-10` on top of SectionHeading's own `mb-10` sets the intro copy
          apart from the first project. Added here rather than in
          SectionHeading because that component is shared with the On AI
          section, which isn't part of this layout.
        */}
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
