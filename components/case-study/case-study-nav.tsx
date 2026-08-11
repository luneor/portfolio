"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { CaseStudySection } from "@/lib/projects";

/*
  Case-study sidebar navigation.

  Structure/behaviour notes (styling is intentionally minimal, tokens only):
  - Desktop (>= md): a sticky, viewport-height rail. Logo + back-link on top,
    table of contents below, built from the sections actually present so a
    decision shows its own preview heading rather than "Decision 1".
  - Mobile (< md): the rail collapses to a single trigger button; tapping it
    opens the same content as an overlay drawer.
  - Scrollspy uses IntersectionObserver and marks the active item with
    aria-current="location". The active state is signalled by MORE THAN COLOUR
    (bold + underline + a left border accent) so it doesn't depend on colour
    perception.
  - Anchors are real <a href="#id">, so clicking smooth-scrolls via the global
    `scroll-behavior: smooth` (already disabled under prefers-reduced-motion),
    remains keyboard operable, and still works with JS disabled.
*/

const BREAKPOINT = 768; // px, matches Tailwind's `md`

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
 * Link back to the portfolio index. No logo here: the sticky site header
 * above already carries it, so repeating it in the nested column would show
 * two logos at once.
 */
function BackLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/#work"
      onClick={onNavigate}
      className="w-fit text-sm text-foreground-muted underline decoration-brand-strong underline-offset-4 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      ← Back to work
    </Link>
  );
}

/** The table of contents itself. Shared by rail and drawer. */
function NavList({
  sections,
  activeId,
  title,
  onNavigate,
}: {
  sections: CaseStudySection[];
  activeId: string;
  title: string;
  onNavigate?: () => void;
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
                onClick={onNavigate}
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
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Close the drawer on Escape, and if the viewport grows past the breakpoint
  // (so it can't stay "open" behind the desktop rail).
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= BREAKPOINT) setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop: rail pinned to the viewport (see .case-study-rail). The
          aside keeps the grid column so the article never slides underneath. */}
      <aside className="hidden md:block">
        <div className="case-study-rail flex flex-col gap-6 py-8 pr-4">
          <BackLink />
          <NavList sections={sections} activeId={activeId} title={title} />
        </div>
      </aside>

      {/* Mobile: trigger + overlay drawer. */}
      <div className="md:hidden">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="case-study-drawer"
          className="sticky top-[4.5rem] z-30 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <span aria-hidden="true">☰</span>
          <span>Contents</span>
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Outside tap closes. Inert to screen readers: the drawer's own
                controls provide the accessible way out. */}
            <div
              className="absolute inset-0 bg-background/80"
              onClick={close}
              aria-hidden="true"
            />
            <div
              id="case-study-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={`Sections of ${title}`}
              className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col gap-6 overflow-y-auto border-r border-border bg-background p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <BackLink onNavigate={close} />
                <button
                  type="button"
                  onClick={close}
                  className="rounded-md border border-border px-2 py-1 text-sm text-foreground-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  <span className="sr-only">Close contents</span>
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
              {/* Clicking a section closes the drawer. */}
              <NavList
                sections={sections}
                activeId={activeId}
                title={title}
                onNavigate={close}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
