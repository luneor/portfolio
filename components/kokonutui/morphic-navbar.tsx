"use client";

/**
 * Morphic Navbar, following KokonutUI's mechanic
 * (https://kokonutui.com/docs/navigation/morphic-navbar).
 *
 * How it actually works, which is not obvious from looking at it:
 *
 *  - Every item carries the SAME solid fill, all the time. Nothing fades in
 *    or out, and there is no separate highlight layer sliding underneath.
 *  - The items sit in one `overflow-hidden` track, so with square inner
 *    corners they read as a single fused block.
 *  - The highlighted item gains a horizontal margin and full corner rounding,
 *    which physically pushes it out of the block and detaches it. Its two
 *    neighbours round off the edges now facing the new gap.
 *  - `transition-all` animates the margin and the radii together, so the block
 *    appears to split fluidly and re-fuse as the highlight moves.
 *
 * The reference moves the highlight on click, to the active route. Here it
 * follows hover/focus instead, purely as a delight: clicking a link navigates
 * immediately, exactly like any other link. `activeKey` still drives the
 * resting highlight and `aria-current`, so the real page is never signalled by
 * the animation alone.
 *
 * Below `sm` the track stacks vertically and the same mechanic runs on the
 * vertical axis: the highlight gains a vertical margin and its neighbours
 * round off their top/bottom edges instead.
 */

import clsx from "clsx";
import Link from "next/link";
import { useRef, useState } from "react";

export interface NavItem {
  key: string;
  href: string;
  name: string;
  /**
   * Draws the eye with the coral accent, for the one item that should read as
   * the primary destination.
   */
  accent?: boolean;
}

interface MorphicNavbarProps {
  items: NavItem[];
  /** The current page, if it's in the list. Drives the resting highlight. */
  activeKey?: string;
  className?: string;
}

/**
 * Corner rounding and margin for one item, given which item is highlighted.
 * Rules mirror the reference exactly, including that they stack: an item can
 * be both "last in the track" and "the neighbour after the highlight".
 */
function shapeFor(index: number, highlight: number, count: number) {
  // The highlighted item detaches: margin opens the gap, full radius frees it.
  if (index === highlight) {
    return "rounded-2xl max-sm:my-2 sm:mx-2";
  }

  const classes: string[] = [];
  const roundStart = "max-sm:rounded-t-2xl sm:rounded-l-2xl";
  const roundEnd = "max-sm:rounded-b-2xl sm:rounded-r-2xl";

  // Outer ends of the track are always rounded.
  if (index === 0) classes.push(roundStart);
  if (index === count - 1) classes.push(roundEnd);
  // Edges facing the gap left by the highlighted item.
  if (index === highlight - 1) classes.push(roundEnd);
  if (index === highlight + 1) classes.push(roundStart);

  return classes.join(" ");
}

export function MorphicNavbar({ items, activeKey, className }: MorphicNavbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const activeIndex = items.findIndex((item) => item.key === activeKey);
  // Hover wins while it lasts, then the highlight falls back to the real page.
  const highlight = hovered ?? activeIndex;

  return (
    <nav className={clsx("flex justify-center", className)}>
      {/* No surface of its own: the gap left by a detaching item shows the page
          behind, which already contrasts with the item fill (the fill is
          `--foreground`, so it inverts against the page in either theme). */}
      <div
        ref={trackRef}
        onMouseLeave={() => setHovered(null)}
        className="flex max-sm:flex-col max-sm:items-stretch sm:items-center"
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
              "flex items-center justify-center px-6 py-3 text-center text-base whitespace-nowrap transition-all duration-300 ease-out sm:px-7 sm:text-lg",
              /*
                Weight follows the real page, never hover. Only margin and
                radius change on hover, and both interpolate smoothly; swapping
                font-weight mid-transition does not (DM Sans ships discrete
                weights, so 600 snaps rather than tweening) and the resulting
                glyph-width change jolted the row as items re-fused.
              */
              item.key === activeKey ? "font-semibold" : "font-medium",
              /*
                The accent item takes the coral fill with a near-black label:
                that's the site's `--primary` / `--primary-foreground` pair,
                which clears AA at 4.50:1 in both themes. Coral as *text* on
                the standard fill would only have reached ~4.1-4.3, under the
                4.5 needed at this size. Every other item inverts against the
                foreground fill.
              */
              item.accent
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-background",
              shapeFor(index, highlight, items.length)
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default MorphicNavbar;
