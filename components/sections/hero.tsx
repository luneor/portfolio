"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

/*
  QUERY hero. Terminal/prompt motif is the signature; copy leads with Hanru as
  a designer (energetic, boundary-pushing) rather than anchoring hard on
  "why before how" — that stance now lives quietly in About/CV. All copy here
  is a first pass and expected to change.
*/

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// Cool anchor (mint) + warm signal (coral), from the gradient-folio system.
const mint = "#44CCBE";
const coral = "#ED2A03";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="hero-surface relative overflow-hidden"
    >
      <div className="mx-auto flex min-h-[88vh] max-w-[1120px] flex-col justify-center px-6 py-24">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* terminal prompt */}
          <motion.div
            variants={item}
            className="mb-6 flex items-center gap-2.5 font-mono text-[0.8rem] tracking-[0.08em] text-foreground-muted"
          >
            <span style={{ color: mint }}>~/hanru</span>
            <span aria-hidden>›</span>
            <span className="text-foreground">whoami</span>
            <motion.span
              aria-hidden
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ background: coral, width: 9, height: 18, display: "inline-block" }}
            />
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={item}
            className="max-w-[18ch] text-[clamp(2.4rem,6.2vw,5rem)] leading-[1.04] font-extrabold tracking-tight text-foreground"
          >
            I sweat the details
            <br />
            most teams{" "}
            <span style={{ color: coral }}>skip</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-[54ch] text-[1.05rem] leading-relaxed text-foreground-muted"
          >
            UX designer, currently at Genio and curious about what&apos;s next.
            I care about the reasoning behind a product as much as the
            interface — pro-AI, without letting it skip the thinking.
          </motion.p>

          {/* terminal "focus" panel — keeps the signature without over-anchoring */}
          <motion.dl
            variants={item}
            className="mt-10 grid max-w-[520px] grid-cols-[auto_1fr] gap-x-5 gap-y-2 font-mono text-[0.82rem]"
          >
            <dt style={{ color: mint }}>focus</dt>
            <dd className="text-foreground-muted">
              product design · design systems · accessibility
            </dd>
            <dt style={{ color: mint }}>now</dt>
            <dd className="text-foreground-muted">UX Designer @ Genio</dd>
          </motion.dl>

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
