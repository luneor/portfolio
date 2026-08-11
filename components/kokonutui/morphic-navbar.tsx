"use client";

/**
 * Adapted from KokonutUI's Morphic Navbar (@kokonutui/morphic-navbar):
 * https://kokonutui.com/docs/components/morphic-navbar
 *
 * Original component targeted Next.js route paths with click-only active
 * state and a filled active pill. Adapted here for this site: it's a
 * presentational glass bar whose active item is decided by the parent
 * (SiteHeader, which owns scroll/route detection). The active item is shown
 * with lime (brand-weak) text only, no fill.
 */

import clsx from "clsx";
import Link from "next/link";

export interface NavItem {
  key: string;
  href: string;
  name: string;
}

interface MorphicNavbarProps {
  items: NavItem[];
  activeKey: string;
  className?: string;
}

export function MorphicNavbar({ items, activeKey, className }: MorphicNavbarProps) {
  return (
    <nav className={clsx("flex items-center justify-center", className)}>
      {/* `glass` no longer carries a border, callers supply their own. */}
      <div className="glass flex items-center gap-1 rounded-full border border-border px-1.5 py-1.5">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <Link
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-200",
                isActive
                  ? "font-semibold text-brand-weak"
                  : "font-medium text-foreground-muted hover:text-foreground"
              )}
              href={item.href}
              key={item.key}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MorphicNavbar;
