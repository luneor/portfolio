import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CaseStudyContact,
  CaseStudyNav,
} from "@/components/case-study/case-study-nav";
import { ProjectFigure } from "@/components/case-study/project-figure";
import {
  PROJECTS,
  decisionId,
  getCaseStudySections,
  getProjectBySlug,
} from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} | Hanru Wehmeyer`,
    description: project.summary,
  };
}

/*
  Every case-study section follows the same shape: a <section> with an id the
  sidebar TOC anchors to, labelled by its own heading. `scroll-mt` keeps the
  heading clear of the sticky site header when jumped to.
*/
function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 border-t border-border pt-8"
    >
      <h2
        id={`${id}-heading`}
        className="text-[1.05rem] font-bold tracking-wide text-brand-weak uppercase"
      >
        {heading}
      </h2>
      <div className="mt-3 flex flex-col gap-4 text-foreground">
        {children}
      </div>
    </section>
  );
}

/*
  The role/timeline/team/tools fact list is intentionally not rendered, it
  read as clutter above the write-up. The fields stay on the Project type so
  the metadata isn't lost and the list can be brought back if wanted.
*/

/**
 * Section body content. A plain string becomes a paragraph; richer content
 * (multiple paragraphs, lists) is passed straight through, since the wrapping
 * <p> a string needs would be invalid markup around block elements.
 */
function Prose({ children }: { children: React.ReactNode }) {
  return typeof children === "string" ? <p>{children}</p> : <>{children}</>;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const Art = project.art;
  const sections = getCaseStudySections(project);
  const { snapshot } = project;

  /*
    `pb-10` rather than the pb-24 the other pages use: those end with the Contact
    section, which wants room to breathe, whereas a case study ends on its last
    paragraph. A 96px void there just left the contact button stranded in empty
    space. This keeps a clear gap to the footer without the dead air.
  */
  return (
    <main id="main" className="mx-auto w-full max-w-[1120px] px-6 pb-10">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-12">
        <CaseStudyNav sections={sections} title={project.title} />

        {/*
          `pt-8` matches the rail's own top padding, so the h1 starts on the
          same line as "Back to work" in the sidebar.
        */}
        <article className="min-w-0 max-w-[680px] pt-8">
          {/*
            Title block, outside the TOC sections, it's the page's h1. Neither
            the tag nor the one-line `summary` is repeated here: the tag is card
            chrome and the summary restates the Snapshot statement. Both still
            do their job on the work cards, and the summary is the page's meta
            description.
          */}
          <header>
            <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.15] font-bold tracking-tight text-foreground">
              {project.title}
            </h1>
          </header>

          <div className="mt-10 flex flex-col gap-12">
            {/* Snapshot leads, so it frames the work before the image. */}
            {snapshot && (
              <Section id="snapshot" heading="Snapshot">
                {snapshot.statement && (
                  <p className="text-[1.05rem] text-foreground">
                    {snapshot.statement}
                  </p>
                )}
                {snapshot.overview && <Prose>{snapshot.overview}</Prose>}
              </Section>
            )}

            {/* Cover sits under the snapshot rather than above it. */}
            <div className="overflow-hidden rounded-2xl border border-border bg-background-alt">
              {project.cover ? (
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  width={project.cover.width}
                  height={project.cover.height}
                  sizes="(max-width: 768px) 100vw, 680px"
                  className="h-auto w-full"
                  priority
                />
              ) : (
                <div className="aspect-video [&>svg]:h-full [&>svg]:w-full">
                  <Art />
                </div>
              )}
            </div>

            {project.problem && (
              <Section id="problem" heading="Problem">
                <Prose>{project.problem}</Prose>
              </Section>
            )}

            {project.constraints && (
              <Section id="constraints" heading="Constraints">
                <Prose>{project.constraints}</Prose>
              </Section>
            )}

            {/* Each decision is its own section so it gets its own TOC entry,
                titled with the actual judgment call. Its evidence renders with
                it, rather than being pooled into the gallery below. */}
            {project.decisions?.map((decision, index) => (
              <Section
                key={decision.heading}
                id={decisionId(index)}
                heading={decision.heading}
              >
                <Prose>{decision.body}</Prose>
                {decision.media && decision.media.length > 0 && (
                  <div className="mt-4 flex flex-col gap-10">
                    {decision.media.map((media) => (
                      <ProjectFigure key={media.src} media={media} />
                    ))}
                  </div>
                )}
              </Section>
            ))}

            {project.shipped && (
              <Section id="shipped" heading="Shipped">
                <Prose>{project.shipped}</Prose>
                {project.gallery && project.gallery.length > 0 && (
                  <div className="mt-4 flex flex-col gap-10">
                    {project.gallery.map((media) => (
                      <ProjectFigure key={media.src} media={media} />
                    ))}
                  </div>
                )}
              </Section>
            )}

            {project.outcome && (
              <Section id="outcome" heading="Outcome">
                <Prose>{project.outcome}</Prose>
              </Section>
            )}

            {project.reflection && (
              <Section id="reflection" heading="Reflection">
                <Prose>{project.reflection}</Prose>
              </Section>
            )}

            {/* Projects with no `shipped` section still show their imagery. */}
            {!project.shipped && project.gallery && project.gallery.length > 0 && (
              <div className="flex flex-col gap-10">
                {project.gallery.map((media) => (
                  <ProjectFigure key={media.src} media={media} />
                ))}
              </div>
            )}

            {/*
              Mobile's copy of the contact CTA. On desktop it lives at the foot
              of the sticky rail, always in view; there's no rail here, and
              burying it in the Contents drawer meant opening a menu to find it,
              so it sits at the natural end of the read instead.
            */}
            <CaseStudyContact className="md:hidden" />
          </div>
        </article>
      </div>
    </main>
  );
}
