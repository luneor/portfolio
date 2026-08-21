"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CaseStudySection } from "@/lib/projects";

/*
  Case-study sidebar navigation. Desktop only, from `md` up.

  There is deliberately no mobile equivalent, not even a collapsed one. A table
  of contents behind a "Contents" button meant opening a menu to find out where
  you were in a document you were already scrolling, which is worse than just
  scrolling. On narrow screens a case study is a single linear read: the site
  header's own menu covers getting out, and the contact CTA from the foot of this
  rail is placed at the end of the article instead (see CaseStudyContact).

  Structure/behaviour notes (styling is intentionally minimal, tokens only):
  - A rail pinned to the viewport. Back-link on top, table of contents below,
    built from the sections actually present so a decision shows its own preview
    heading rather than "Decision 1", and a contact button at the foot.
  - Scrollspy marks the active item with aria-current="location", pinned to
    whichever link was just clicked for a beat so a short section near the
    end can't get skipped in favour of its neighbour (see `useActiveSection`).
    The active state is signalled by MORE THAN COLOUR (bold + underline + a
    left border accent) so it doesn't depend on colour perception.
  - Anchors are real <a href="#id">, so clicking smooth-scrolls via the global
    `scroll-behavior: smooth` (already disabled under prefers-reduced-motion),
    remains keyboard operable, and still works with JS disabled.
*/

const RAIL_TOP_PX = 72; // 4.5rem, matches .case-study-rail's `top`

interface CaseStudyNavProps {
  sections: CaseStudySection[];
  /** Project title, used to label the nav for screen readers. */
  title: string;
}

// A fixed offset, not a fraction of the viewport: this rail only ever shows
// on desktop-ish widths (`hidden md:block`), and a percentage of viewport
// HEIGHT scales without bound on a tall screen. At ~1100px+ of viewport
// height, 30% is already 330px+, deeper than Impact's own ~230px of content,
// so the reading line could land past Impact and into Reflection the instant
// an anchor click's scroll (which clears the sticky header, ~scroll-mt-24)
// finishes, before the reader has looked at anything. A small fixed offset
// keeps the "roughly where the reader's eyes are" idea without that blowup.
const READING_LINE_OFFSET_PX = 160;

// How much of the final scroll distance the reading line's offset ramps
// over, from READING_LINE_OFFSET_PX up to a full viewport height, so it can
// still reach short trailing sections that would otherwise sit below its
// normal reach once the page runs out of room to scroll (see
// `useActiveSection`). Comfortably bigger than any one section is likely to
// be, so the ramp is already well underway by the time a short section's
// own top comes into play.
const BOTTOM_RAMP_PX = 500;

// How long a click's own pin overrides the scroll-driven guess, roughly the
// smooth-scroll animation's own duration. Long enough that the anchor jump
// finishes before scroll events can fight it, short enough that scrolling
// straight on afterwards resumes normal tracking almost immediately.
const CLICK_PIN_MS = 700;

/**
 * Tracks which section is currently in view: whichever section's own span,
 * from its top to the next section's top, actually contains the reading
 * line (scrollY + an offset below the viewport's top).
 *
 * That "contains", not just "started before", is the other half of the same
 * fix: picking "the last section whose top has passed the line" sounds
 * equivalent, but isn't once a section is shallower than the lookahead.
 * Requiring the NEXT section to not have started yet keeps a short section
 * (Impact, two short paragraphs) attributable to itself for the whole
 * scroll range where it's what's actually on screen, rather than ceding to
 * whatever comes right after it.
 *
 * The offset itself isn't fixed. Held at READING_LINE_OFFSET_PX it can't
 * reach the end of the page whenever the last few sections (Impact,
 * Reflection, plus the footer) together add up to less than one viewport:
 * scrolling maxes out before a line that low could ever cross into them, so
 * whichever of them happens to sit right at the offset gets stuck as
 * "current" forever, and the other(s) never light up at all, no matter how
 * slowly someone scrolls. `BOTTOM_RAMP_PX` fixes that at the source: over the
 * final stretch of scroll the offset itself ramps from its normal position up
 * towards the BOTTOM of the viewport, so the line keeps sweeping through
 * short trailing sections instead of stalling, and lands exactly on the
 * document's true end at max scroll, an offset of a full viewport height,
 * guaranteeing the last section wins once there's nowhere further to go.
 * Everywhere else on the page (more than BOTTOM_RAMP_PX of scroll still left)
 * this resolves to the plain fixed offset, unchanged.
 *
 * `pin` still matters on top of that: a click jumps straight there rather
 * than waiting for the ramp to catch up, and holds the clicked section active
 * for CLICK_PIN_MS so the anchor's own smooth-scroll can't fight it.
 */
function useActiveSection(sections: CaseStudySection[]) {
  const [activeId, setActiveId] = useState<string>("");
  const pinnedUntilRef = useRef(0);

  useEffect(() => {
    if (sections.length === 0) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (Date.now() < pinnedUntilRef.current) return;

        const maxScrollY = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        );
        const distanceFromBottom = Math.max(0, maxScrollY - window.scrollY);
        const rampT = 1 - Math.min(1, distanceFromBottom / BOTTOM_RAMP_PX);
        const offset =
          READING_LINE_OFFSET_PX +
          rampT * (window.innerHeight - READING_LINE_OFFSET_PX);
        const line = window.scrollY + offset;

        const tops = sections.map((section) => {
          const el = document.getElementById(section.id);
          return el ? el.getBoundingClientRect().top + window.scrollY : null;
        });

        let current = sections[0].id;
        for (let i = 0; i < sections.length; i++) {
          const top = tops[i];
          if (top === null || top > line) continue;
          const nextTop = tops[i + 1];
          if (nextTop != null && nextTop <= line) continue;
          current = sections[i].id;
        }

        setActiveId(current);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  const pin = useCallback((id: string) => {
    pinnedUntilRef.current = Date.now() + CLICK_PIN_MS;
    setActiveId(id);
  }, []);

  return { activeId, pin };
}

/**
 * Keeps the fixed rail clear of the footer.
 *
 * The rail is `position: fixed` on purpose, so it holds the same spot in the
 * top-left for the whole page rather than drifting away at the end. The cost is
 * that it knows nothing about the document, so once the footer scrolls into view
 * the rail, and especially its bottom-pinned button, would sit on top of it.
 *
 * So the rail's height is clamped each frame to whichever comes first, the bottom
 * of the viewport or the top of the footer. While the footer is still off-screen
 * this resolves to exactly the CSS height, so nothing moves until it has to.
 */
function useRailClearOfFooter(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rail = ref.current;
        if (!rail) return;

        // Below `md` the rail isn't fixed (or even shown), so leave it alone.
        if (!window.matchMedia("(min-width: 768px)").matches) {
          rail.style.removeProperty("height");
          return;
        }

        const footerTop =
          document.querySelector("footer")?.getBoundingClientRect().top ??
          Number.POSITIVE_INFINITY;
        const limit = Math.min(window.innerHeight, footerTop);
        rail.style.height = `${Math.max(0, limit - RAIL_TOP_PX)}px`;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

/**
 * Link back to the portfolio index. No logo here: the sticky site header
 * above already carries it, so repeating it in the nested column would show
 * two logos at once.
 */
function BackLink() {
  return (
    <Button
      variant="outline"
      size="sm"
      nativeButton={false}
      // A plain border, not the brand gradient ring. The rail already carries
      // the gradient on the contents list beside it, and putting it on the
      // buttons too made a narrow column of small elements all compete.
      className="w-fit justify-start border border-border bg-background text-foreground hover:bg-accent"
      render={<Link href="/work">← Back to work</Link>}
    />
  );
}

/**
 * Secondary contact CTA. At the foot of the rail on desktop, so the offer to
 * talk stays in view at any depth of a long case study; placed at the end of the
 * article on mobile, where there is no rail.
 *
 * Points at `/#contact` rather than a bare `#contact`: case-study pages don't
 * carry a Contact section of their own, so a local anchor would go nowhere.
 */
export function CaseStudyContact({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      nativeButton={false}
      // Matches the back-link above: plain border, page-background fill (an
      // outline button with no fill reads as a ghost).
      className={cn(
        "w-full shrink-0 border border-border bg-background text-foreground hover:bg-accent",
        className
      )}
      render={<Link href="/#contact">Get in touch</Link>}
    />
  );
}

/** The table of contents. */
function NavList({
  sections,
  activeId,
  onNavigate,
  title,
}: {
  sections: CaseStudySection[];
  activeId: string;
  onNavigate: (id: string) => void;
  title: string;
}) {
  if (sections.length === 0) return null;

  return (
    <nav aria-label={`Sections of ${title}`} className="min-h-0 overflow-y-auto">
      <ol className="flex flex-col gap-0.5">
        {sections.map((section) => {
          const isActive = section.id === activeId;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => onNavigate(section.id)}
                // aria-current tells assistive tech which section is in view.
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block border-l-2 py-1.5 pl-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                  // Active state is carried by weight + border + colour, never
                  // by colour alone: the label goes mint AND bold AND gains a
                  // lit left edge, so the current section is still obvious
                  // without relying on hue being perceived.
                  //
                  // Mint, not the brand gradient the buttons and the header nav
                  // use: this rail is a dense column of small text, and a
                  // five-colour gradient repeated down every hairline was
                  // louder than the content beside it. One flat accent marks
                  // the position without competing.
                  isActive
                    ? "border-brand-weak font-bold text-brand-weak"
                    : "border-border font-normal text-foreground-muted hover:border-foreground-muted hover:text-foreground"
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function CaseStudyNav({ sections, title }: CaseStudyNavProps) {
  const { activeId, pin } = useActiveSection(sections);
  const railRef = useRef<HTMLDivElement>(null);

  useRailClearOfFooter(railRef);

  return (
    // The aside keeps the grid column so the article never slides underneath
    // the rail (see .case-study-rail, which takes it out of flow).
    <aside className="hidden md:block">
      <div
        ref={railRef}
        className="case-study-rail flex flex-col gap-6 py-8 pr-4"
      >
        <BackLink />
        <NavList
          sections={sections}
          activeId={activeId}
          onNavigate={pin}
          title={title}
        />
        <CaseStudyContact className="mt-auto" />
      </div>
    </aside>
  );
}
