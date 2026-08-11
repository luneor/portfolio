"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MorphicNavbar } from "@/components/kokonutui/morphic-navbar";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { HEADER_NAV, SITE_NAV, activeNavKey } from "@/lib/nav";

/*
  Logo, navigation, theme toggle.

  From `sm` up the nav is the same morphic component the hero uses, at its
  compact size so it sits level with the logo and the toggle rather than
  towering over them. Below `sm` it collapses to a hamburger, since five items
  in a row don't fit and stacking them into a column would leave a sticky header
  tall enough to swallow the viewport.

  No coral accent on Work here. That highlight is the homepage's call to action;
  in the header the nav is just navigation.

  The whole thing is omitted on the homepage, where the hero's full-size pill is
  the main event and a second copy up here would just be a duplicate.
*/
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  /*
    Solid fill, not a translucent one: as a sticky bar it sits over the article
    the whole way down, and at 92% opacity content stayed faintly visible sliding
    underneath it. `backdrop-blur` goes with it, since there's nothing left to
    see through.
  */
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4">
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
          <ThemeToggle />
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
