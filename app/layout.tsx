import type { Metadata } from "next";
import { Archivo, DM_Sans, Space_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

// Body + buttons. DM Sans at Regular (400) and Bold (700) per the type spec.
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Headings only. Archivo Heavy (800/900) gives display type its weight.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

// Captions & labels — eyebrows, nav, tags, the terminal prompt motif.
const spaceMono = Space_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Hanru Wehmeyer — UX Designer",
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
          Dark is the default look, but light is a real theme now — no
          forcedTheme. `disableTransitionOnChange` is deliberately NOT set: the
          toggle drives the 500ms cross-fade defined in globals.css.
        */}
        <ThemeProvider attribute="class" defaultTheme="dark">
          <MotionConfig reducedMotion="user">
            <SiteHeader />
            {children}
            <SiteFooter />
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
