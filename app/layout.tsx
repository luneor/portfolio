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
          Both themes, reader's choice. `forcedTheme` is gone, so whatever is
          in localStorage wins again and ThemeToggle is back in the header.

          `defaultTheme="dark"` still: dark is the palette the brand gradient
          work was built around, so a first-time visitor gets the intended
          look and light is opt-in.

          `enableSystem` stays off. With no "system" option in the toggle it
          isn't a state a visitor can reach, and turning it on would mean the
          first paint depends on an OS setting the toggle can't show.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
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
