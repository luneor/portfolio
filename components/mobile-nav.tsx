"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import type { NavItem } from "@/components/kokonutui/morphic-navbar";

/*
  The header's navigation below `sm`, where the morphic pill doesn't fit.

  A disclosure rather than a full-screen overlay: there are five links, so a
  panel dropping out of the header is enough, and it leaves the page visible
  behind it. The morphic pill takes over from `sm` up, so this whole component
  is hidden there.
*/
export function MobileNav({
  items,
  activeKey,
}: {
  items: NavItem[];
  activeKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  /*
    Close on navigation. The header stays mounted across route changes, so
    without this the panel would still be hanging open on arrival, and tapping a
    link isn't the only way to leave (browser back, for one).

    Adjusted during render rather than in an effect: React re-runs this pass
    immediately with the new state and never commits the stale open panel, so
    there's no flash of it and no cascading render.
  */
  const [renderedAt, setRenderedAt] = useState(pathname);
  if (renderedAt !== pathname) {
    setRenderedAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Escape should leave focus somewhere sensible, not adrift on <body>.
      buttonRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        {open ? (
          <X aria-hidden="true" className="size-4" />
        ) : (
          <Menu aria-hidden="true" className="size-4" />
        )}
      </button>

      {/*
        Anchored to the header, which is `sticky` and so acts as the containing
        block. `top-full` drops the panel just below it, overlaying the page
        rather than pushing it down.
      */}
      {open && (
        <nav
          id={panelId}
          aria-label="Main"
          className="absolute inset-x-0 top-full border-b border-border bg-background px-6 py-3 shadow-lg"
        >
          <ul className="flex flex-col">
            {items.map((item) => {
              const isCurrent = item.key === activeKey;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      // The current page is marked by weight and a rule, never
                      // by colour alone.
                      "block border-l-2 py-2.5 pl-3 text-base transition-colors hover:text-brand-weak focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      isCurrent
                        ? "border-brand-strong font-bold text-foreground"
                        : "border-transparent font-normal text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
