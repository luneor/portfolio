"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

/*
  Navigation now lives in the Hero's centred pill, not here. Until every page
  carries its own nav surface, this header is deliberately minimal: the logo
  (a way back to home from anywhere) and the theme toggle.
*/
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4">
        {/*
          Two SVGs, toggled by the `.dark` class already on <html>, so the
          swap needs no theme-detection JS and can't flash the wrong mark on
          first paint. A red variant exists (public/brand/logo-red.svg),
          reserved for whenever a colour accent is wanted here.
        */}
        <Link href="/" aria-label="Hanru Wehmeyer, home" className="shrink-0">
          <Image
            src="/brand/logo-black.svg"
            alt=""
            width={44}
            height={28}
            priority
            className="block h-7 w-auto dark:hidden"
          />
          <Image
            src="/brand/logo-white.svg"
            alt=""
            width={44}
            height={28}
            priority
            className="hidden h-7 w-auto dark:block"
          />
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
