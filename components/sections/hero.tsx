"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

/*
  Base hero — headline, one line of positioning, two actions. Deliberately
  stripped back as a starting point for a redesign. Accent colours come from
  the theme tokens, never hardcoded hexes, so they stay legible in light mode
  (mint is dark-mode only; light substitutes a deep teal).
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
      <div className="mx-auto flex min-h-[88vh] max-w-[1120px] flex-col justify-center px-6 py-24">
        <motion.div variants={container} initial="hidden" animate="show">
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
            UX designer, currently at Genio and curious about what&apos;s next.
            I care about the reasoning behind a product as much as the
            interface — pro-AI, without letting it skip the thinking.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <Button
              size="lg"
              nativeButton={false}
              className="h-11 px-6 text-[0.95rem]"
              render={<a href="#work">See the work →</a>}
            />
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="h-11 border border-border bg-transparent px-6 text-[0.95rem] text-foreground hover:bg-accent"
              render={<a href="#contact">Get in touch</a>}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
