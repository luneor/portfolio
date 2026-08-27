import type { NavItem, NavLink } from "@/components/kokonutui/morphic-navbar";
import { isNavMenu } from "@/components/kokonutui/morphic-navbar";

/*
  The site's primary navigation, in one place because several surfaces render it
  and they must never drift apart: the hero's large centred pill, the header's
  compact pill, and the header's mobile hamburger panel.

  ONE list for all three now. The header used to prepend a "Home" item, giving
  an explicit way back that didn't depend on knowing the logo is a link; the
  logo carries that on its own (it has an aria-label saying so), and dropping
  the item keeps the row short enough for Process to be added without the pill
  outgrowing the header.

  An item with `items` is a dropdown rather than a link -- see NavMenu.
*/
export const SITE_NAV: NavItem[] = [
  { key: "work", href: "/work", name: "Work" },
  /*
    Sits straight after Work on purpose: Work is what was built, Process is how.
    Neither section is a route of its own, so the parent is a menu with no href
    of its own rather than a link to an overview page that doesn't exist.
  */
  {
    key: "process",
    name: "Process",
    items: [
      {
        key: "collaboration",
        href: "/process/collaboration",
        name: "Collaboration",
      },
      {
        key: "accessibility",
        href: "/process/accessibility",
        name: "Accessibility",
      },
    ],
  },
  { key: "ai", href: "/ai", name: "AI" },
  { key: "about", href: "/about", name: "About" },
  { key: "cv", href: "/cv", name: "CV" },
  // Contact is a section at the foot of every page, not a route of its own.
  { key: "contact", href: "#contact", name: "Contact" },
];

/**
 * Whether a path is "in" a nav href. Case studies live under /work/<slug>, so
 * they keep Work highlighted rather than losing the highlight entirely; the
 * same rule keeps /process/* under Process.
 *
 * The `startsWith("/")` guard skips the in-page Contact anchor, which is on
 * every page and would otherwise match nothing usefully.
 */
function isUnder(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Which nav item, if any, the given path is "in". For a dropdown this returns
 * the PARENT's key, so Process stays marked while a reader is on either of its
 * pages. Returns undefined on the homepage, so nothing is falsely marked there.
 */
export function activeNavKey(pathname: string): string | undefined {
  if (pathname === "/") return undefined;

  return SITE_NAV.find((item) =>
    isNavMenu(item)
      ? item.items.some((child) => isUnder(pathname, child.href))
      : isUnder(pathname, item.href)
  )?.key;
}

/**
 * The specific dropdown child the reader is on, so the open panel can mark it.
 * Separate from `activeNavKey`, which deliberately reports the parent.
 */
export function activeNavChild(pathname: string): NavLink | undefined {
  for (const item of SITE_NAV) {
    if (!isNavMenu(item)) continue;
    const match = item.items.find((child) => isUnder(pathname, child.href));
    if (match) return match;
  }
  return undefined;
}
