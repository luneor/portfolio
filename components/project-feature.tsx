"use client";

import { motion } from "motion/react";
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

  The whole row is one link, and "View case study" is a SPAN wearing the
  button's styles -- not a button or a second Link. An anchor inside an
  anchor is invalid, and it would put two tab stops and two click targets on
  one destination. So the pill is purely an affordance: it names where the
  row goes and lights up with it, while the row carries the actual click and
  the single tab stop.

  Everything hover therefore keys off the row: the title crosses into the
  brand colour, the image scales, and the pill gains its gradient ring plus
  a bloom of the same gradient behind it (`.brand-ring-reveal` /
  `.brand-glow` in globals.css). Three responses to one gesture, but they
  answer three different properties -- colour, scale, and an edge that
  wasn't there -- so they read as one state rather than as effects competing.
*/
interface ProjectFeatureProps {
  slug: string;
  title: string;
  summary: string;
  media: ReactNode;
}

export function ProjectFeature({
  slug,
  title,
  summary,
  media,
}: ProjectFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={`/work/${slug}`}
        className="group grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12"
      >
        {/*
          `overflow-hidden` is the only thing standing in for the card's
          border now: it still clips the image to a rounded rect, there's
          just nothing drawn at the edge of it.
        */}
        <div className="overflow-hidden rounded-2xl bg-background-alt">
          <div className="aspect-video w-full [&>svg]:h-full [&>svg]:w-full">
            <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              {media}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.2] font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand-weak">
            {title}
          </h3>
          <p className="mt-3 text-[1.05rem] text-foreground">{summary}</p>

          {/* `relative` so the glow, a preceding sibling, sits behind the
              pill without needing a negative z-index. See .brand-glow. */}
          <div className="relative mt-6 w-fit">
            {/* `-inset-0.5` + `blur-sm` rather than a wider spread and a
                bigger blur: the bloom wants to hug the ring and be gone,
                so the ring still reads as the edge. */}
            <span
              aria-hidden="true"
              className="brand-glow pointer-events-none absolute -inset-0.5 rounded-full opacity-0 blur-sm transition-opacity duration-300 ease-out group-hover:opacity-70"
            />
            <span
              className={cn(
                buttonVariants({ variant: "gradient", size: "lg" }),
                "brand-ring-reveal relative h-11 px-6",
              )}
            >
              View case study
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
