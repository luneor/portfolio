import Link from "next/link";
import { ProjectFeature } from "@/components/project-feature";
import { ProjectThumb } from "@/components/project-thumb";
import { PROJECTS } from "@/lib/projects";

/*
  The three projects the work page opens with, so the homepage can be scrolled
  into rather than only clicked out of. Previously the hero was the whole page:
  every route was behind a click, and the one sentence in the hero carried the
  entire job of convincing someone to go further.

  Taken from PROJECTS in page order rather than hand-picked, so this can't
  drift out of step with /work when that order changes. Three because it fills
  the grid at every breakpoint and stops short of duplicating the work page.
*/
const FEATURED = ["last-active-filtering", "feature-toggles-for-ai-tools", "memor"]
  .map((slug) => PROJECTS.find((project) => project.slug === slug))
  .filter((project) => project !== undefined);

export function HomeWork() {
  return (
    <section
      id="featured-work"
      aria-labelledby="featured-work-heading"
      className="py-20"
    >
      <div className="mx-auto max-w-page px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="featured-work-heading"
            className="text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-foreground"
          >
            Selected work
          </h2>

          <Link
            href="/work"
            className="rounded-sm font-mono text-[0.78rem] tracking-[0.03em] text-brand-weak underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            All work →
          </Link>
        </div>

        {/*
          The same one-project-per-row layout the work page uses, with the same
          `gap-24` and the same `sizes`, so a project looks identical wherever
          it's met. A card grid here would have made the homepage a different
          presentation of the same three projects for no reason.
        */}
        <div className="mt-10 flex flex-col gap-24">
          {FEATURED.map((project) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
