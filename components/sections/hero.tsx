"use client";

import { motion } from "motion/react";
import { MorphicNavbar, type NavItem } from "@/components/kokonutui/morphic-navbar";

/*
  Base hero, headline, one line of positioning, two actions, and the site's
  primary navigation, centred beneath. Work now lives on its own route like
  every other section, so the header above carries only the logo and the
  theme toggle; this centred pill is the main way to get around from the
  homepage. No "Home" entry, since it's redundant here. Accent colours come
  from the theme tokens, never hardcoded hexes, so they stay legible in light
  mode (mint is dark-mode only; light substitutes a deep teal).
*/
const NAV: NavItem[] = [
  // Work carries the coral accent: with the hero's buttons gone, this is the
  // primary destination and needs to read as such.
  { key: "work", href: "/work", name: "Work", accent: true },
  { key: "ai", href: "/ai", name: "AI" },
  { key: "about", href: "/about", name: "About" },
  { key: "cv", href: "/cv", name: "CV" },
  { key: "contact", href: "#contact", name: "Contact" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="hero-surface relative overflow-hidden"
    >
      {/* Drifting accent glow, decorative, so hidden from assistive tech. */}
      <div aria-hidden="true" className="hero-glow">
        <span className="hero-blob hero-blob--a" />
        <span className="hero-blob hero-blob--b" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1120px] flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.h1
            id="hero-heading"
            variants={item}
            className="max-w-[18ch] text-[clamp(2.4rem,6.2vw,5rem)] leading-[1.04] font-extrabold tracking-tight text-foreground"
          >
            I sweat the details
            <br />
            most teams <span className="text-brand-strong">skip</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-[54ch] text-[1.05rem] leading-relaxed text-foreground"
          >
            UX designer at Genio, curious about what&apos;s next. I care about{" "}
            <strong className="font-semibold">the reasoning behind a product as
            much as the interface</strong>.
          </motion.p>

          {/* No hero buttons: Work and Contact already live in the nav below,
              so a pair of CTAs alongside it just duplicated them. */}
          <motion.div variants={item} className="mt-12">
            <MorphicNavbar items={NAV} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
