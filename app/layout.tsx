import type { Metadata } from "next";
import { Archivo, DM_Sans, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

/*
  Body + buttons. Loaded as a variable font (no explicit `weight`), which is
  what makes weight *animatable*: with discrete faces the browser snaps to the
  nearest one mid-transition, so a 400 -> 700 tween pops. The whole axis lets
  it interpolate. The type spec's Regular/Bold are still what we set; we just
  get everything between them as well.
*/
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Headings only. Archivo Heavy (800/900) gives display type its weight.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

// Captions & labels, eyebrows, nav, tags, the terminal prompt motif.
const spaceMono = Space_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Hanru Wehmeyer | UX Designer",
  description:
    "Hanru Wehmeyer is a UX Designer at Genio, designing admin tooling that gives educators real control over how they support students at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${archivo.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only rounded-br-md bg-foreground px-5 py-3 text-background focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[1000]"
        >
          Skip to main content
        </a>
        {/*
          Dark is the default look, but light is a real theme now, no
          forcedTheme. `disableTransitionOnChange` is deliberately NOT set: the
          toggle drives the 500ms cross-fade defined in globals.css.

          `enableSystem` is explicitly off: the toggle only ever picks "light"
          or "dark", "system" isn't a state a visitor can reach, so there's no
          reason for next-themes to watch `prefers-color-scheme` or treat it
          as a possible resolved value. A first-time visitor always lands on
          `defaultTheme` below; only an explicit toggle click ever moves them
          off it, and that choice then persists via localStorage as normal.
        */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <MotionConfig reducedMotion="user">
            <SiteHeader />
            {children}
            <SiteFooter />
          </MotionConfig>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
