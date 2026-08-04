import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { CaseStudyNav } from "@/components/case-study/case-study-nav";
import { cn } from "@/lib/utils";
import {
  PROJECTS,
  decisionId,
  getCaseStudySections,
  getProjectBySlug,
  type ProjectImage,
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
    title: `${project.title} — Hanru Wehmeyer`,
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
        className="text-[0.85rem] font-bold tracking-wide text-brand-weak uppercase"
      >
        {heading}
      </h2>
      <div className="mt-3 flex flex-col gap-4 text-foreground-muted">
        {children}
      </div>
    </section>
  );
}

/** Snapshot facts, rendered as a definition list so pairs stay associated. */
function SnapshotFacts({
  facts,
}: {
  facts: { label: string; value: string }[];
}) {
  if (facts.length === 0) return null;

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 font-mono text-[0.82rem]">
      {facts.map((fact) => (
        <div key={fact.label} className="col-span-2 grid grid-cols-subgrid">
          <dt className="text-brand-weak">{fact.label}</dt>
          <dd className="text-foreground-muted">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Figure({ image }: { image: ProjectImage }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-border bg-background-alt">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) 100vw, 680px"
          className="h-auto w-full"
        />
      </div>
      {image.caption && (
        <figcaption className="font-mono text-[0.72rem] leading-relaxed tracking-[0.03em] text-foreground-muted">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
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

  const facts = [
    { label: "role", value: snapshot?.role },
    { label: "timeline", value: snapshot?.timeline },
    { label: "team", value: snapshot?.team },
    { label: "tools", value: snapshot?.tools },
  ].filter((fact): fact is { label: string; value: string } =>
    Boolean(fact.value)
  );

  return (
    <main id="main" className="mx-auto w-full max-w-[1120px] px-6 pb-24">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-12">
        <CaseStudyNav sections={sections} title={project.title} />

        <article className="min-w-0 max-w-[680px] pt-8 md:pt-16">
          {/* Title block — outside the TOC sections, it's the page's h1. */}
          <header>
            <Badge
              variant="outline"
              className={cn(
                "w-fit rounded-full border px-2.5 py-1 font-mono text-[0.7rem] tracking-[0.04em] lowercase",
                project.tagMuted
                  ? "border-border text-foreground-muted"
                  : "border-brand-weak text-brand-weak"
              )}
            >
              {project.tag}
            </Badge>
            <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.15] font-bold tracking-tight text-foreground">
              {project.title}
            </h1>
            <p className="mt-3 text-[1.05rem] text-foreground-muted">
              {project.summary}
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background-alt">
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
          </header>

          <div className="mt-12 flex flex-col gap-12">
            {snapshot && (
              <Section id="snapshot" heading="Snapshot">
                {snapshot.statement && (
                  <p className="text-[1.05rem] text-foreground">
                    {snapshot.statement}
                  </p>
                )}
                <SnapshotFacts facts={facts} />
                {snapshot.overview && <p>{snapshot.overview}</p>}
              </Section>
            )}

            {project.problem && (
              <Section id="problem" heading="Problem">
                <p>{project.problem}</p>
              </Section>
            )}

            {/* Each decision is its own section so it gets its own TOC entry,
                titled with the actual judgment call. */}
            {project.decisions?.map((decision, index) => (
              <Section
                key={decision.heading}
                id={decisionId(index)}
                heading={decision.heading}
              >
                <p>{decision.body}</p>
              </Section>
            ))}

            {project.shipped && (
              <Section id="shipped" heading="Shipped">
                <p>{project.shipped}</p>
                {project.gallery && project.gallery.length > 0 && (
                  <div className="mt-4 flex flex-col gap-10">
                    {project.gallery.map((image) => (
                      <Figure key={image.src} image={image} />
                    ))}
                  </div>
                )}
              </Section>
            )}

            {project.outcome && (
              <Section id="outcome" heading="Outcome">
                <p>{project.outcome}</p>
              </Section>
            )}

            {project.reflection && (
              <Section id="reflection" heading="Reflection">
                <p>{project.reflection}</p>
              </Section>
            )}

            {/* Projects with no `shipped` section still show their imagery. */}
            {!project.shipped && project.gallery && project.gallery.length > 0 && (
              <div className="flex flex-col gap-10">
                {project.gallery.map((image) => (
                  <Figure key={image.src} image={image} />
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
