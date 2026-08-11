import type { NavItem } from "@/components/kokonutui/morphic-navbar";

/*
  The site's primary navigation, in one place because several surfaces render it
  and they must never drift apart: the hero's large centred pill, the header's
  compact pill, and the header's mobile hamburger panel.

  The hero's list has no "Home", which on the homepage would only point at
  itself.
*/
export const SITE_NAV: NavItem[] = [
  { key: "work", href: "/work", name: "Work" },
  { key: "ai", href: "/ai", name: "AI" },
  { key: "about", href: "/about", name: "About" },
  { key: "cv", href: "/cv", name: "CV" },
  // Contact is a section at the foot of every page, not a route of its own.
  { key: "contact", href: "#contact", name: "Contact" },
];

/*
  The header's list, used on every page except the homepage. Home leads, giving
  an explicit way back that doesn't depend on knowing the logo is a link.
*/
export const HEADER_NAV: NavItem[] = [
  { key: "home", href: "/", name: "Home" },
  ...SITE_NAV,
];

/**
 * Which nav item, if any, the given path is "in". Case studies live under
 * /work/<slug>, so they keep Work highlighted rather than losing the highlight
 * entirely. Returns undefined on the homepage and for the in-page Contact
 * anchor, so nothing is falsely marked as the current page.
 */
export function activeNavKey(pathname: string): string | undefined {
  if (pathname === "/") return undefined;

  return HEADER_NAV.find(
    (item) =>
      item.href.startsWith("/") &&
      // The trailing slash is what stops Home ("/") matching every route.
      (pathname === item.href || pathname.startsWith(`${item.href}/`))
  )?.key;
}
