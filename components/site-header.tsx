"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MorphicNavbar } from "@/components/kokonutui/morphic-navbar";
import { MobileNav } from "@/components/mobile-nav";
import { HEADER_NAV, SITE_NAV, activeNavKey } from "@/lib/nav";

/*
  Logo, navigation, theme toggle.

  From `sm` up the nav is the same morphic component the hero uses, at its
  compact size so it sits level with the logo and the toggle rather than
  towering over them. Below `sm` it collapses to a hamburger, since five items
  in a row don't fit and stacking them into a column would leave a sticky header
  tall enough to swallow the viewport.

  The nav is omitted on the homepage, where the hero's full-size pill is the
  main event and a second copy up here would just be a duplicate. The logo and
  the hamburger stay.
*/
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  /*
    Two different bars.

    Everywhere else: sticky, with a solid fill and a bottom rule. Solid, not
    translucent, because as a sticky bar it sits over the article the whole way
    down, and at 92% opacity content stayed faintly visible sliding underneath.

    On the homepage, from `sm` up: no fill and no rule, so the hero's gradient
    field runs all the way up behind the logo instead of stopping at a hard
    line under it. `absolute`, so it is out of flow (the hero therefore starts
    at the very top of the viewport and the field fills the whole thing) but
    anchored to the top of the DOCUMENT rather than the viewport, so it scrolls
    away with the hero instead of riding down the page over the sections below.

    On the homepage below `sm`: the same solid, ruled, sticky bar as everywhere
    else. Out of flow is a desktop luxury. On a phone the hamburger is the ONLY
    route to the rest of the site -- the hero shows CTAs instead of the nav pill
    there -- so a header that scrolls away takes navigation with it and doesn't
    come back until you scroll all the way home. Sticky keeps it in reach, and
    once it's riding over the page it needs the fill and the rule again to stop
    the sections sliding visibly underneath the logo.
  */
  return (
    <header
      className={
        isHome
          ? "sticky top-0 z-50 border-b border-border bg-background sm:absolute sm:inset-x-0 sm:border-b-0 sm:bg-transparent"
          : "sticky top-0 z-50 border-b border-border bg-background"
      }
    >
      {/*
        `min-h-16` keeps the row the height it has everywhere else even on the
        homepage, which renders no nav pill. Without it the row is only as tall
        as the logo there, and since everything is centred the logo sat 2px
        higher on the homepage than on every other page, so it visibly hopped
        on each navigation to or from it.

        16 (64px), not 8: `box-sizing` is border-box, so a min-height of 32px
        is already met by `py-4`'s padding alone and does nothing. The figure
        has to be the whole row, padding included.
      */}
      <div className="mx-auto flex min-h-16 max-w-[1120px] items-center justify-between gap-4 px-6 py-4">
        {/*
          Two SVGs, driven by the `.dark` class already on <html>, so the swap
          needs no theme-detection JS and can't flash the wrong mark on first
          paint. A red variant exists (public/brand/logo-red.svg), reserved for
          whenever a colour accent is wanted here.

          Stacked and cross-faded on opacity rather than toggled with `display`:
          a display swap is instantaneous, so the wordmark would pop while every
          colour around it eased. `theme-fade` keeps that opacity transition
          alive during the theme switch (see globals.css).
        */}
        <Link
          href="/"
          aria-label="Hanru Wehmeyer, home"
          className="relative block h-7 w-11 shrink-0"
        >
          <Image
            src="/brand/logo-black.svg"
            alt=""
            width={44}
            height={28}
            priority
            className="theme-fade absolute inset-0 h-7 w-auto opacity-100 transition-opacity duration-300 ease-in-out dark:opacity-0"
          />
          <Image
            src="/brand/logo-white.svg"
            alt=""
            width={44}
            height={28}
            priority
            className="theme-fade absolute inset-0 h-7 w-auto opacity-0 transition-opacity duration-300 ease-in-out dark:opacity-100"
          />
        </Link>

        {!isHome && (
          <MorphicNavbar
            items={HEADER_NAV}
            activeKey={activeNavKey(pathname)}
            size="sm"
            className="max-sm:hidden"
          />
        )}

        <div className="flex items-center gap-2">
          {/*
            The theme toggle is parked, not deleted: the site is dark-only for
            now (see `forcedTheme` in app/layout.tsx). ThemeToggle and the whole
            light palette are still in the tree, so putting it back is this line
            plus dropping `forcedTheme`.
          */}
          {/*
            The hamburger is on every page, the homepage included: below `sm`
            the hero shows CTAs instead of the nav pill, so this is the only way
            to reach the other pages. It drops "Home" there, which would only
            point at the page you're already on.
          */}
          <MobileNav
            items={isHome ? SITE_NAV : HEADER_NAV}
            activeKey={activeNavKey(pathname)}
          />
        </div>
      </div>
    </header>
  );
}
