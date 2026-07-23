import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only rounded-br-md bg-foreground px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[1000]"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
