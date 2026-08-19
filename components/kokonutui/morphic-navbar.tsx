"use client";

/**
 * Morphic Navbar, following KokonutUI's mechanic
 * (https://kokonutui.com/docs/navigation/morphic-navbar).
 *
 * How it actually works, which is not obvious from looking at it:
 *
 *  - Every item carries the SAME fill, all the time. Nothing fades in or out,
 *    and there is no separate highlight layer sliding underneath.
 *  - Square inner corners, and an outline lit only along the block's outside,
 *    make a run of items read as one shape inside one continuous hairline.
 *  - The highlighted item gains a horizontal margin and full corner rounding,
 *    which physically pushes it out of the block and detaches it. Its two
 *    neighbours round off the edges now facing the new gap.
 *  - `transition-all` animates margins, radii and the outline together, so the
 *    block splits and re-fuses fluidly as the highlight moves. Nothing that
 *    animates affects layout, which is what keeps it from snapping: see the
 *    notes in `shapeFor`, and on the ghost span for the weight tween.
 *
 * The reference moves the highlight on click, to the active route. Here it
 * follows hover/focus instead, purely as a delight: clicking a link navigates
 * immediately, exactly like any other link. `activeKey` still drives the
 * resting highlight and `aria-current`, so the real page is never signalled by
 * the animation alone.
 *
 * This is a horizontal component only. Below `sm` there isn't room for it on any
 * surface, so callers swap it out: the header for a hamburger, the hero for a
 * pair of CTAs.
 */

import clsx from "clsx";
import Link from "next/link";
import { useRef, useState } from "react";

export interface NavItem {
  key: string;
  href: string;
  name: string;
}

interface MorphicNavbarProps {
  items: NavItem[];
  /** The current page, if it's in the list. Drives the resting highlight. */
  activeKey?: string;
  /**
   * Which item, if any, takes the coral fill. This is a per-surface decision
   * rather than a property of the nav data: the homepage uses it to point at
   * Work as its call to action, and nowhere else wants that emphasis.
   */
  accentKey?: string;
  /**
   * `lg` is the hero's centred pill. `sm` is the compact version for the site
   * header, scaled to sit level with the logo and the theme toggle.
   */
  size?: "sm" | "lg";
  className?: string;
}

/*
  Padding and type scale only. Corner radius is deliberately shared: at the
  compact size the same radius is larger than half the item's height, so CSS
  clamps it and the item reads as a pill, which sits nicely beside the round
  theme toggle. One set of radii, two scales, still recognisably one component.
*/
const SIZES = {
  lg: "px-6 py-3 text-base sm:px-7 sm:text-lg",
  sm: "px-3 py-1.5 text-sm sm:px-4",
} as const;

/**
 * Geometry for one item: corner rounding, the detaching margin, and which ends
 * of its outline are lit.
 *
 * It all comes off two questions. An item's left edge is "exposed" if it's the
 * front of the block, the detached item itself, or the item just after the gap;
 * its right edge likewise. An exposed edge gets rounded and gets its end of the
 * outline painted; a buried edge stays square and unpainted, so a run of fused
 * items reads as one block inside one continuous hairline, with no division
 * lines inside it.
 *
 * The outline is drawn with inset shadows, not borders, for reasons spelled out
 * at `morph-ring` in globals.css. The short version: borders miter, so every
 * seam grew a visible triangular peak where two edge colours met.
 *
 * Everything that animates is a margin, a radius, or a shadow colour, none of
 * which affect layout. That's what keeps the morph from snapping.
 *
 * `isCurrent` recolours one item's ring to brand-strong: the page the reader
 * is actually on, as opposed to `highlight`, which just follows hover. Its
 * top/bottom edges (`--ring-long`, set alongside this on the Link itself)
 * carry that colour unconditionally, so the current item keeps a visible red
 * hairline even while hover morphs the block around it and buries one or both
 * of its side edges.
 */
function shapeFor(
  index: number,
  highlight: number,
  count: number,
  isCurrent: boolean
) {
  const startExposed =
    index === 0 || index === highlight || index === highlight + 1;
  const endExposed =
    index === count - 1 || index === highlight || index === highlight - 1;

  return clsx(
    "morph-ring",
    startExposed
      ? isCurrent
        ? "rounded-l-2xl [--ring-start:var(--brand-strong)]"
        : "rounded-l-2xl [--ring-start:var(--border)]"
      : "[--ring-start:transparent]",
    endExposed
      ? isCurrent
        ? "rounded-r-2xl [--ring-end:var(--brand-strong)]"
        : "rounded-r-2xl [--ring-end:var(--border)]"
      : "[--ring-end:transparent]",
    // The margin is what physically opens the gap.
    index === highlight && "mx-2"
  );
}

export function MorphicNavbar({
  items,
  activeKey,
  accentKey,
  size = "lg",
  className,
}: MorphicNavbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const activeIndex = items.findIndex((item) => item.key === activeKey);
  // Hover wins while it lasts, then the highlight falls back to the real page.
  const highlight = hovered ?? activeIndex;

  return (
    <nav className={clsx("flex justify-center", className)}>
      {/* No surface of its own: the gap left by a detaching item shows whatever
          is behind, which the item fill already contrasts with in either
          theme. */}
      <div
        ref={trackRef}
        onMouseLeave={() => setHovered(null)}
        className="flex items-center"
      >
        {items.map((item, index) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={item.key === activeKey ? "page" : undefined}
            onMouseEnter={() => setHovered(index)}
            onFocus={() => setHovered(index)}
            onBlur={(event) => {
              // Only reset once focus leaves the whole track, so tabbing
              // between items keeps morphing instead of snapping shut.
              if (!trackRef.current?.contains(event.relatedTarget as Node)) {
                setHovered(null);
              }
            }}
            className={clsx(
              "flex items-center justify-center text-center whitespace-nowrap transition-all duration-300 ease-out",
              /*
                Focus indicator, not the sitewide `focus-visible:ring-*`: a
                ring is a `box-shadow`, and this element's `box-shadow` is
                already spoken for by `morph-ring` above. Two utilities
                writing the same CSS property don't compose, whichever
                compiles later would just win and silently erase the other.
                `outline` is a distinct property, so it layers over the ring
                for free, and every modern browser already clips it to
                whichever corners are rounded at the moment, following the
                shape as it morphs.
              */
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              item.key === activeKey
                ? "[--ring-long:var(--brand-strong)]"
                : "[--ring-long:var(--border)]",
              SIZES[size],
              /*
                Card, not an inverted fill: white ground with near-black type in
                light, near-black ground with off-white type in dark. `--card`
                sits a step off `--background` in both themes, which is what
                lets the block read against the page at all; the border does the
                rest of that work.

                The accent item swaps in the coral fill with a near-black label,
                the site's `--primary` pair, which clears AA at 4.50:1 in both
                themes. Coral as *text* measured ~4.1-4.3, under the 4.5 needed
                at this size.
              */
              item.key === accentKey
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground",
              shapeFor(index, highlight, items.length, item.key === activeKey)
            )}
          >
            {/*
              Two stacked copies in one grid cell. The bold ghost is invisible
              but still reserves space, so the cell is always as wide as the
              bold text and the weight tween never resizes the item or nudges
              its neighbours: the strokes just thicken in place.
            */}
            <span className="grid">
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 font-bold"
              >
                {item.name}
              </span>
              <span
                className="col-start-1 row-start-1 transition-[font-weight] duration-300 ease-out"
                style={{ fontWeight: index === highlight ? 700 : 400 }}
              >
                {item.name}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default MorphicNavbar;
