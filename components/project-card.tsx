"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/*
  The `tag` badge is intentionally not rendered for now. `tag`/`tagMuted` stay
  on the Project type so the data isn't lost and the badge can come back.
*/
interface ProjectCardProps {
  slug: string;
  title: string;
  summary: string;
  media: ReactNode;
  className?: string;
  /** Short skill/theme labels, shown as pills at the foot of the card. */
  topics?: string[];
}

export function ProjectCard({
  slug,
  title,
  summary,
  media,
  className,
  topics,
}: ProjectCardProps) {
  return (
    <motion.div
      className={cn("group h-full", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/*
        The shadow eases via CSS, not Motion. Motion can't cleanly interpolate
        two box-shadows with different numbers of length values (3 vs 4), which
        made it lurch dark on the way back out. Depths stay soft so they read on
        cream as well as near-black.
      */}
      {/*
        Same border treatment as the On AI cards: a mint hairline at rest that
        crosses into the brand gradient on hover (`.brand-ring` +
        `.brand-ring-card` in globals.css).

        The plain `border` is gone rather than kept alongside it. `.brand-ring`
        paints its ring at the padding box, so a real border underneath would
        hold the gradient a pixel in from the edge and leave a dead outline
        around it. `--brand-ring-fill` carries the card colour the border used
        to sit against, since .brand-ring paints its own fill.
      */}
      <div
        className="brand-ring brand-ring-card h-full overflow-hidden rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] transition-shadow duration-300 ease-out group-hover:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.28)] [--brand-ring-fill:var(--card)] [--brand-ring-rest:0]"
      >
        <Link href={`/work/${slug}`} className="flex h-full flex-col">
          <div className="relative aspect-video overflow-hidden border-b border-border bg-background-alt">
            {/*
              No hover scale on the media. The card now answers hover itself,
              with the border crossing from mint into the gradient, and a
              second thing moving under that read as two effects fighting for
              the same gesture.
            */}
            <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full">
              {media}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <h3 className="text-base font-bold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-foreground">
              {summary}
            </p>
            {/* `mt-auto` pins topics to the card's foot regardless of how
                many lines the summary above takes up. */}
            {topics && topics.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {topics.map((topic) => (
                  <Badge key={topic} variant="outline" className="text-brand-weak">
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
