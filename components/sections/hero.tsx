"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { MorphicNavbar } from "@/components/kokonutui/morphic-navbar";
import { Button } from "@/components/ui/button";
import { SITE_NAV } from "@/lib/nav";

/*
  Base hero: headline, one line of positioning, and a way into the site.

  From `sm` up that's the site's primary navigation, centred beneath at full
  size, which is why the header omits its own copy on the homepage. Below `sm`
  it's a pair of CTAs, with navigation handled by the header's hamburger.

  Accent colours come from the theme tokens, never hardcoded hexes, so they stay
  legible in light mode (mint is dark-mode only; light substitutes a deep teal).
*/

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
            /*
              One line at every width. `whitespace-nowrap` forbids the wrap, so
              the size has to come from the viewport instead: ~7vw keeps the 22
              characters inside the gutters down to the smallest phones, with a
              rem cap so it stops growing on wide screens.
            */
            className="text-[clamp(1.5rem,7vw,4.2rem)] leading-[1.1] font-extrabold tracking-tight whitespace-nowrap text-foreground"
          >
            Hi, I&apos;m{" "}
            {/*
              Coral is normally kept off text, because at body sizes it lands
              around 4.1-4.3:1 and misses AA. Here it's display type at 38px+ and
              extrabold, which is "large text" under WCAG and needs only 3:1, so
              it clears the bar on both papers. Same exception the old headline's
              accent word used.
            */}
            <span className="text-brand-strong">Hanru Wehmeyer</span>
          </motion.h1>

          <motion.p
            variants={item}
            /*
              Tight to the headline: the two read as one block, which leaves the
              larger gap below to separate them from the navigation.
            */
            className="mt-5 max-w-[54ch] text-[1.05rem] leading-relaxed text-foreground"
          >
            UX Designer, curious about what&apos;s next - always{" "}
            <strong className="font-semibold">thinking creatively</strong> and
            pushing for <strong className="font-semibold">collaboration</strong>.
          </motion.p>

          {/*
            Two routes into the site, split by width rather than shown together.

            From `sm` up, the morphic pill is the whole navigation and a pair of
            CTAs beside it would just duplicate Work and Contact. Below `sm` the
            pill doesn't fit, so nav moves to the header's hamburger and these
            buttons take over as the hero's call to action.
          */}
          {/* Set well below the text block, so the page reads as two groups. */}
          <motion.div variants={item} className="mt-14 flex flex-wrap justify-center gap-3 sm:hidden">
            <Button
              size="lg"
              nativeButton={false}
              className="h-11 px-6 text-[0.95rem]"
              render={<Link href="/work">See the work →</Link>}
            />
            {/*
              Filled with the page background, not transparent: an outline
              button over the hero's glow reads as a ghost otherwise.
            */}
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="h-11 border border-border bg-background px-6 text-[0.95rem] text-foreground hover:bg-accent"
              render={<Link href="#contact">Get in touch</Link>}
            />
          </motion.div>

          <motion.div variants={item} className="mt-20 max-sm:hidden">
            {/* Coral on Work only here: on the homepage it's the call to
                action. Elsewhere the nav is just navigation. */}
            <MorphicNavbar items={SITE_NAV} accentKey="work" size="lg" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
