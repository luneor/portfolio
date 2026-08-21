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

    On the homepage: no fill and no rule, so the hero's gradient field runs all
    the way up behind the logo instead of stopping at a hard line under it. It
    also switches from `sticky` to `fixed`, which is the part that actually lets
    that happen: a sticky bar still occupies its row in the flow, so the hero
    would begin below it and there would be nothing behind the header to see.
    Taken out of flow, the hero starts at the top of the viewport and the field
    fills the whole thing.

    Except below `sm`, where the fill comes back. The bare version only works
    while there's hero behind it; on a phone the page is short enough that you
    scroll past the hero almost immediately, and from then on the logo and the
    hamburger are sitting on whatever text happens to be passing underneath.
    The homepage also has nothing else up here to hide behind, since its nav
    lives in the hero.
  */
  return (
    <header
      className={
        isHome
          ? "fixed inset-x-0 top-0 z-50 max-sm:border-b max-sm:border-border max-sm:bg-background"
          : "sticky top-0 z-50 border-b border-border bg-background"
      }
    >
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
