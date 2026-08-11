"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  - Scrollspy marks the active item with aria-current="location". The active
    state is signalled by MORE THAN COLOUR (bold + underline + a left border
    accent) so it doesn't depend on colour perception.
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

/**
 * Tracks which section is currently in view. Picks the last section whose top
 * has passed the reading line, which keeps the final section selectable even
 * when it's too short to fill the viewport.
 */
function useActiveSection(sections: CaseStudySection[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (sections.length === 0) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = window.scrollY + window.innerHeight * 0.3;
        let current = sections[0].id;

        for (const section of sections) {
          const el = document.getElementById(section.id);
          if (!el) continue;
          if (el.getBoundingClientRect().top + window.scrollY <= line) {
            current = section.id;
          }
        }

        // At the very bottom the last section always wins, even if short.
        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 4;
        if (atBottom) current = sections[sections.length - 1].id;

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

  return activeId;
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
    <Link
      href="/work"
      className="w-fit text-sm text-foreground-muted underline decoration-brand-strong underline-offset-4 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      ← Back to work
    </Link>
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
      // Filled with the page background, matching the hero's secondary action:
      // an outline button with no fill reads as a ghost.
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
  title,
}: {
  sections: CaseStudySection[];
  activeId: string;
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
                // aria-current tells assistive tech which section is in view.
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block border-l-2 py-1.5 pl-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                  // Active state is carried by weight + underline + border,
                  // never by colour alone.
                  isActive
                    ? "border-brand-strong font-bold text-foreground underline decoration-brand-strong underline-offset-4"
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
  const activeId = useActiveSection(sections);
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
        <NavList sections={sections} activeId={activeId} title={title} />
        <CaseStudyContact className="mt-auto" />
      </div>
    </aside>
  );
}
