"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MorphicNavbar, type NavItem } from "@/components/kokonutui/morphic-navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV: NavItem[] = [
  { key: "home", href: "/#home", name: "Home" },
  { key: "work", href: "/#work", name: "Work" },
  { key: "ai", href: "/#ai", name: "AI" },
  { key: "about", href: "/#about", name: "About" },
  { key: "cv", href: "/#cv", name: "CV" },
  { key: "contact", href: "/#contact", name: "Contact" },
];

// Homepage sections the scroll-spy watches, in document order.
const SECTION_IDS = ["home", "work", "ai", "about", "cv", "contact"];

export function SiteHeader() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Scroll-spy only runs on the homepage, where the sections live.
    if (pathname !== "/") return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const line = window.scrollY + window.innerHeight * 0.35;
        let current = SECTION_IDS[0];
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= line) current = id;
        }
        // Ensure the final section wins once scrolled to the very bottom.
        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 4;
        if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1];
        setActiveSection(current);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const activeKey = pathname.startsWith("/work") ? "work" : activeSection;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4">
        <Link href="/#home" className="text-[1.05rem] font-bold tracking-tight text-foreground">
          Hanru Wehmeyer
        </Link>

        <div className="flex items-center gap-3">
          <MorphicNavbar items={NAV} activeKey={activeKey} className="hidden lg:flex" />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-border px-3 py-2 lg:hidden"
            aria-expanded={isOpen}
            aria-controls="primary-nav-links"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="sr-only">Toggle menu</span>
            <span aria-hidden="true">☰</span>
          </button>
        </div>

        <ul
          id="primary-nav-links"
          className={cn(
            "absolute top-full right-0 left-0 flex-col items-center gap-4 border-b border-border bg-background p-6 lg:hidden",
            isOpen ? "flex" : "hidden"
          )}
        >
          {NAV.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-[0.95rem] font-medium transition-colors hover:text-brand-weak",
                  activeKey === item.key
                    ? "font-semibold text-brand-weak"
                    : "text-foreground"
                )}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
