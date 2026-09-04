"use client";

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
    /*
      The reveal is `.reveal-rise` in globals.css, not Motion's `whileInView`.
      That gated the card behind `opacity: 0` in the server HTML and an
      observer callback, and a fast scroll could outrun the callback and leave
      a whole section of the work page rendered blank. Scroll-driven CSS reads
      the card's position instead of waiting to be told about it, so there is
      no callback to lose the race, and where it isn't supported the card is
      simply visible.
    */
    <div className={cn("reveal-rise group h-full", className)}>
      {/*
        The shadow eases via CSS, not Motion. Motion can't cleanly interpolate
        two box-shadows with different numbers of length values (3 vs 4), which
        made it lurch dark on the way back out. Depths stay soft so they read on
        cream as well as near-black.

        The LIFT is CSS now too, and used to be Motion's `whileHover={{ y: -4 }}`
        on the wrapper. It had to move for the keyboard to reach it: `whileHover`
        answers the pointer only, and the wrapper isn't focusable anyway -- the
        link inside it is. Doing it here lets one pair of rules serve both, keyed
        off `group-hover` and `has-[:focus-visible]`.

        Not both mechanisms, deliberately. Leaving `whileHover` in place and
        adding CSS for focus alone would have stacked them at 8px whenever a card
        was keyboard-focused and then hovered, since Motion writes `transform`
        and Tailwind writes `translate` and the two compose rather than override.
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
        className="brand-ring brand-ring-card h-full overflow-hidden rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] transition-[box-shadow,translate] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.28)] has-[:focus-visible]:-translate-y-1 has-[:focus-visible]:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.28)] [--brand-ring-fill:var(--card)] [--brand-ring-rest:0]"
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
            {/*
              No line clamp. The summaries are deliberately a sentence long now
              -- each one states what the project demonstrates -- and a 2-line
              clamp cut every card off mid-clause. Cards still line up because
              they're `h-full` in a grid row, so the row's tallest card sets the
              height for all of them. The trade is that one much longer summary
              would grow its whole row, so keep them to roughly this length.
            */}
            <p className="text-sm text-foreground">
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
    </div>
  );
}
