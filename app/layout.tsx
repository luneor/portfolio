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
          Dark only, for now. `forcedTheme` pins every visitor to it regardless
          of what's in localStorage, so anyone who picked light earlier isn't
          stranded on a half-tuned palette while the new brand gradient work
          settles.

          Parked rather than removed: the light tokens, the 500ms cross-fade,
          and ThemeToggle itself are all still in the tree. Bringing the toggle
          back is dropping this one prop and un-commenting it in
          components/site-header.tsx.

          `enableSystem` stays off for the same reason it always was: "system"
          isn't a state a visitor can reach here.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
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
