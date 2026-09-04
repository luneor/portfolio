import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

          {/*
            A real button rather than a mono text link. It's the way out of a
            three-project preview to the full set, which is the same kind of
            move as "View case study" below it, and a small underlined link was
            reading as a footnote next to a section heading.

            Same gradient-ring-on-hover pair as those, so the two sit as
            matched controls: see the note in project-feature.tsx.
          */}
          <div className="group/cta relative w-fit">
            <span
              aria-hidden="true"
              className="brand-glow pointer-events-none absolute -inset-0.5 rounded-full opacity-0 blur-sm transition-opacity duration-300 ease-out group-hover/cta:opacity-70 group-has-[:focus-visible]/cta:opacity-70"
            />
            <Link
              href="/work"
              className={cn(
                buttonVariants({ variant: "gradient", size: "lg" }),
                "brand-ring-reveal relative h-11 px-6"
              )}
            >
              All work →
            </Link>
          </div>
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
