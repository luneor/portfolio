"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
  The work page's answer to ProjectCard: one project per row, stacked the
  full height of the page instead of packed three-wide into a grid. No
  border, no card fill, no shadow -- there's no box to draw at all, so the
  image sits on the page and the whitespace around it does the work a card
  boundary used to.

  Image and text sit side by side from `md` up rather than stacked, which is
  also what keeps the image in check: at full container width a stacked
  16:9 image ran taller than felt right for a single row among five. Giving
  the image roughly half the row's width instead holds it to a size that
  reads as "big" without dominating the page the way full width did.

  The row is NOT clickable, and the buttons are the only links in it. So the
  title is plain text and there is no stretched overlay: nothing about the row
  responds to a click, which is what stops the whole thing reading as one big
  target.

  Two hover scopes, deliberately separate:

  - The ROW answers with the title crossing into the brand colour and the
    image easing up a little. Ambient only -- it says "this block is one
    thing", not "click me".
  - The BUTTON answers on its own hover, with the gradient ring and the bloom
    behind it (`.brand-ring-reveal` / `.brand-glow` in globals.css). The only
    thing that can actually be clicked is the only thing that lights up like
    it can be.

  That split is why the pill's ring keys off its own `:hover` rather than an
  ancestor `.group`, and why the glow hangs off `group/cta` -- a group scoped
  to the button's own wrapper, not the row.

  Each pill takes an `aria-label` carrying the project title. Five rows would
  otherwise offer five links all named "View case study", which tells anyone
  listing the page's links nothing about where any of them go.
*/
interface ProjectFeatureProps {
  slug: string;
  title: string;
  summary: string;
  media: ReactNode;
  /** A second, lower-emphasis link in the row, beside "View case study". */
  secondaryAction?: { href: string; label: string };
}

export function ProjectFeature({
  slug,
  title,
  summary,
  media,
  secondaryAction,
}: ProjectFeatureProps) {
  return (
    /* See the note in project-card.tsx: CSS scroll-driven reveal, so a fast
       scroll can't leave this row blank. */
    <div className="reveal-rise group grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12">
      {/*
        The border is on the IMAGE, not around the row -- the row still has no
        box drawn around it. It's here because most of these screenshots are of
        light UI, so on the cream paper the image and the page are near enough
        the same value that the picture has no edge and bleeds into the layout.
        The hairline gives it one.

        Both themes, not just light. Dark doesn't need it -- a bright
        screenshot has all the edge it wants against near-black -- but a frame
        that appears in one theme and vanishes in the other reads as a bug when
        you switch, and at `--border` it costs dark nothing. Same treatment the
        About portrait already uses.
      */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background-alt">
        <div className="aspect-video w-full [&>svg]:h-full [&>svg]:w-full">
          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            {media}
          </div>
        </div>
      </div>

      <div>
        {/* Plain text, not a link: the row isn't a target, the button is. */}
        <h3 className="text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.2] font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand-weak">
          {title}
        </h3>
        <p className="mt-3 text-[1.05rem] text-foreground">{summary}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {/*
            `group/cta` is scoped to this wrapper, which is `w-fit` around the
            pill, so "hovered" here means the button and not the row. `relative`
            keeps the glow, a preceding sibling, behind the pill without a
            negative z-index. See .brand-glow.
          */}
          <div className="group/cta relative w-fit">
            {/* `-inset-0.5` + `blur-sm` rather than a wider spread and a
                bigger blur: the bloom wants to hug the ring and be gone,
                so the ring still reads as the edge. */}
            <span
              aria-hidden="true"
              className="brand-glow pointer-events-none absolute -inset-0.5 rounded-full opacity-0 blur-sm transition-opacity duration-300 ease-out group-hover/cta:opacity-70 group-has-[:focus-visible]/cta:opacity-70"
            />
            <Link
              href={`/work/${slug}`}
              aria-label={`View case study: ${title}`}
              className={cn(
                buttonVariants({ variant: "gradient", size: "lg" }),
                "brand-ring-reveal relative h-11 px-6",
              )}
            >
              View case study
            </Link>
          </div>

          {/*
            Lower emphasis than the primary pill on purpose: the case study is
            what this row is for, and two pills at equal weight would make the
            reader choose before they know what either is.
          */}
          {/*
            Same ground as the primary pill at rest -- `bg-background` and a
            flat `--border` hairline, which is exactly what `.brand-ring-reveal`
            leaves the primary looking like before it's hovered. So the two sit
            as a matched pair, and the tinted fill this button used to wear all
            the time is now its HOVER state instead.

            `ghost` with the border by hand, not `outline`, for the reason the
            hero's CTAs give: the outline variant ships `dark:bg-input/30`, and
            a dark-variant rule outranks a plain background, so the fill landed
            at 30% alpha over the page and the two pills stopped matching.
            `hover:bg-accent!` overrides ghost's own `hover:bg-muted`.
          */}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "group/alt h-11 gap-2 rounded-full border border-border bg-background px-6 hover:bg-accent!",
              )}
            >
              {secondaryAction.label}
              {/*
                Marks it as going somewhere. This pill is lower emphasis than
                the primary one and sits beside it, so without a cue the two
                read as a pair of equal buttons rather than one action and one
                link. It nudges on hover, which is the only movement in the
                row that belongs to this button alone.
              */}
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover/alt:translate-x-0.5"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
