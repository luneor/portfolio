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
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** A plain destination. */
export interface NavLink {
  key: string;
  href: string;
  name: string;
}

/**
 * A dropdown. No `href` of its own, deliberately: it opens a panel rather than
 * going anywhere, so making it a link too would leave one label doing two
 * different things depending on how it was activated.
 */
export interface NavMenu {
  key: string;
  name: string;
  items: NavLink[];
}

export type NavItem = NavLink | NavMenu;

export function isNavMenu(item: NavItem): item is NavMenu {
  return "items" in item;
}

interface MorphicNavbarProps {
  items: NavItem[];
  /** The current page, if it's in the list. Drives the resting highlight. */
  activeKey?: string;
  /**
   * Casts a shadow under the whole block, for a nav sitting on something busy
   * enough that a flat block reads as painted onto it, which in practice means
   * the hero's gradient field. See `.morph-raised`.
   */
  onField?: boolean;
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
  gradientRing: boolean
) {
  const startExposed =
    index === 0 || index === highlight || index === highlight + 1;
  const endExposed =
    index === count - 1 || index === highlight || index === highlight - 1;

  /*
    The gradient ring is a real ring drawn round the whole pill, so the inset
    shadows have to get out of its way entirely, or the item carries two
    outlines at once.

    Written out as whole literal class names rather than interpolated: Tailwind
    finds classes by scanning source text, so a name assembled at runtime
    (`[--ring-start:${x}]`) never appears in the build and the property is
    simply never emitted.
  */
  return clsx(
    "morph-ring",
    startExposed
      ? gradientRing
        ? "rounded-l-2xl [--ring-start:transparent]"
        : "rounded-l-2xl [--ring-start:var(--border)]"
      : "[--ring-start:transparent]",
    endExposed
      ? gradientRing
        ? "rounded-r-2xl [--ring-end:transparent]"
        : "rounded-r-2xl [--ring-end:var(--border)]"
      : "[--ring-end:transparent]",
    // The margin is what physically opens the gap.
    index === highlight && "mx-2"
  );
}

/*
  The dropdown panel.

  A DISCLOSURE, not a menu: it's a short list of ordinary page links, so the
  right pattern is a button with `aria-expanded` revealing a `<ul>` of links,
  and NOT role="menu"/role="menuitem". Those roles promise arrow-key traversal
  and a focus trap, and applying them to plain links tells a screen reader to
  expect behaviour that isn't there. Tab moves through these exactly as it
  moves through any other list of links.

  Positioned under its own trigger and centred on it. `min-w-full` keeps the
  panel at least as wide as Process itself so a narrow panel never looks
  detached from the item it belongs to.
*/
function NavMenuPanel({
  id,
  label,
  items,
  pathname,
  onNavigate,
  onItemActive,
}: {
  id: string;
  label: string;
  items: NavLink[];
  pathname: string;
  onNavigate: () => void;
  /**
   * Reports whether any item in here is hovered or focused, so the trigger can
   * hand its gradient ring over while one is.
   */
  onItemActive: (active: boolean) => void;
}) {
  return (
    <div
      id={id}
      /* Shadow per theme, for the reason given at `.morph-raised`: the same
         alpha that reads as lift on near-black reads as smudge on cream. */
      className="absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 min-w-full rounded-2xl border border-border bg-card p-1.5 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.22)] dark:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.45)]"
    >
      <ul aria-label={label} className="flex flex-col gap-0.5">
        {items.map((child) => {
          const isCurrent =
            pathname === child.href || pathname.startsWith(`${child.href}/`);
          return (
            <li key={child.key}>
              <Link
                href={child.href}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onNavigate}
                onMouseEnter={() => onItemActive(true)}
                onMouseLeave={() => onItemActive(false)}
                onFocus={() => onItemActive(true)}
                onBlur={() => onItemActive(false)}
                className={clsx(
                  "block rounded-xl px-3 py-2 text-sm whitespace-nowrap",
                  /*
                    The same gradient hairline the nav's highlighted item
                    wears, hidden at rest and brought up by this item's OWN
                    hover or focus (`.brand-ring:hover::before` in
                    globals.css). `--brand-ring-rest: 0` is what hides it, and
                    `--brand-ring-fill` has to be restated as the panel's card
                    colour, since .brand-ring paints its own fill and would
                    otherwise punch the page ground through the panel.

                    No `hover:bg-*` alongside it: .brand-ring sets
                    `background` itself from unlayered CSS, which outranks a
                    Tailwind background utility, so a hover fill here would
                    silently do nothing.
                  */
                  "brand-ring [--brand-ring-fill:var(--card)] [--brand-ring-rest:0]",
                  "focus-visible:outline-none",
                  // Current page by weight, not colour alone.
                  isCurrent
                    ? "font-bold text-foreground"
                    : "font-normal text-card-foreground"
                )}
              >
                {child.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function MorphicNavbar({
  items,
  activeKey,
  onField = false,
  size = "lg",
  className,
}: MorphicNavbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuItemActive, setMenuItemActive] = useState(false);
  const pathname = usePathname();

  /*
    Close the dropdown on navigation. Adjusted during render rather than in an
    effect, the same way MobileNav does it: React re-runs this pass immediately
    with the new state and never commits the stale open panel, so there's no
    flash of it. Route changes aren't the only way to leave, so this covers
    browser back as well as clicking a child link.
  */
  const [renderedAt, setRenderedAt] = useState(pathname);
  if (renderedAt !== pathname) {
    setRenderedAt(pathname);
    setOpenMenu(null);
    setMenuItemActive(false);
  }

  /*
    Escape closes, and a pointer down anywhere outside the track closes. Both
    only while something is open, so the listeners aren't sitting on the
    document for the entire life of the page.
  */
  useEffect(() => {
    if (!openMenu) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      setMenuItemActive(false);
      // Escape should leave focus on the trigger, not adrift on <body>.
      trackRef.current
        ?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${openMenu}"]`)
        ?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!trackRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setMenuItemActive(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu]);

  const activeIndex = items.findIndex((item) => item.key === activeKey);
  const openIndex = items.findIndex((item) => item.key === openMenu);
  /*
    An open menu holds the highlight, ahead of hover. The panel hangs off the
    detached item, so letting hover move the highlight elsewhere would leave
    the panel pointing at a fused item with nothing above it. Otherwise hover
    wins while it lasts, then the highlight falls back to the real page.
  */
  const highlight = openIndex >= 0 ? openIndex : (hovered ?? activeIndex);

  return (
    <nav className={clsx("flex justify-center", className)}>
      {/* No surface of its own: the gap left by a detaching item shows whatever
          is behind, which the item fill already contrasts with in either
          theme. */}
      <div
        ref={trackRef}
        onMouseLeave={() => setHovered(null)}
        className={clsx("flex items-center", onField && "morph-raised")}
      >
        {items.map((item, index) => {
          const isCurrent = item.key === activeKey;
          /*
            The gradient ring goes on the highlighted item, which is the one
            that has just detached from the block: hover if there is one, the
            current page otherwise.

            Not on the hero, though. There the block already sits on the
            gradient field, and a gradient hairline on top of it was two
            statements of the same idea competing an inch apart; the field
            behind carries it, and the plain hairline is enough to draw the
            detached item. So the ring is the header's way of marking the
            highlight, and the field is the hero's.

            Either way the current page gets no colour of its own: at rest it's
            the highlighted item, which is the "you are here" signal, and
            `aria-current` carries it regardless.
          */
          /*
            While a dropdown ITEM is hovered or focused, the trigger gives up
            its ring, so only one thing in the nav is ringed at a time -- the
            thing being pointed at. It keeps its DETACHMENT though (see
            `highlight` above): the panel hangs off the trigger, so re-fusing
            it into the block would leave the panel pointing at nothing.
          */
          const gradientRing =
            index === highlight &&
            !onField &&
            !(isNavMenu(item) && menuItemActive);

          /*
            One className for both kinds of item, so a dropdown trigger is the
            same shape, fill and ring as its neighbours and takes part in the
            morph identically. Only the element differs: a Link goes somewhere,
            a button opens a panel.
          */
          const itemClassName = clsx(
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
              gradientRing
                ? "[--ring-long:transparent]"
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
              "bg-card text-card-foreground",
              /*
                `--brand-ring-fill` has to be restated as the card colour:
                .brand-ring otherwise paints its own fill in the page ground,
                which is a step darker than the block around it.
              */
            gradientRing && "brand-ring [--brand-ring-fill:var(--card)]",
            shapeFor(index, highlight, items.length, gradientRing),
            isNavMenu(item) && "gap-1.5"
          );

          /*
            Two stacked copies in one grid cell. The bold ghost is invisible
            but still reserves space, so the cell is always as wide as the
            bold text and the weight tween never resizes the item or nudges
            its neighbours: the strokes just thicken in place.
          */
          const label = (
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
          );

          // Shared between both kinds of item, so tabbing across the block
          // keeps morphing instead of snapping shut.
          const focusHandlers = {
            onMouseEnter: () => setHovered(index),
            onFocus: () => setHovered(index),
            onBlur: (event: React.FocusEvent) => {
              if (!trackRef.current?.contains(event.relatedTarget as Node)) {
                setHovered(null);
              }
            },
          };

          if (isNavMenu(item)) {
            const isOpen = openMenu === item.key;
            return (
              /*
                `relative` so the panel can hang off this item rather than the
                whole track: it should line up under Process, not under the
                middle of the nav.
              */
              <div key={item.key} className="relative">
                <button
                  type="button"
                  data-menu-trigger={item.key}
                  aria-expanded={isOpen}
                  aria-controls={`${item.key}-menu`}
                  /*
                    Click, not hover. The track already spends hover on the
                    morph highlight, and a panel that opens on pass-through
                    would fire every time someone crossed the nav on their way
                    somewhere else. Click also means one behaviour on touch and
                    pointer alike.
                  */
                  onClick={() => {
                    setOpenMenu(isOpen ? null : item.key);
                    setMenuItemActive(false);
                  }}
                  className={itemClassName}
                  {...focusHandlers}
                >
                  {label}
                  <ChevronDown
                    aria-hidden="true"
                    className={clsx(
                      "shrink-0 transition-transform duration-300 ease-out",
                      size === "lg" ? "size-4" : "size-3.5",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOpen && (
                  <NavMenuPanel
                    id={`${item.key}-menu`}
                    label={item.name}
                    items={item.items}
                    pathname={pathname}
                    onNavigate={() => {
                      setOpenMenu(null);
                      setMenuItemActive(false);
                    }}
                    onItemActive={setMenuItemActive}
                  />
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              className={itemClassName}
              {...focusHandlers}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MorphicNavbar;
