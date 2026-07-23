"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MouseEffectBackground from "@/components/kokonutui/mouse-effect-background";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="hero-surface relative overflow-hidden pt-16 pb-20"
    >
      <MouseEffectBackground className="-z-10" focus={{ x: 0.28, y: 0.5 }} />
      <div className="relative mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-[1.2fr_1fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h1
            id="hero-heading"
            variants={item}
            className="mb-6 text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.15] font-bold tracking-tight text-foreground"
          >
            UX Designer
          </motion.h1>
          <motion.p
            variants={item}
            className="max-w-[46ch] text-[1.1rem] text-foreground-muted"
          >
            I&apos;m Hanru Wehmeyer. I default to asking <em>why</em> before{" "}
            <em>how</em> — on feature decisions, and on my own use of AI in
            the design process. I&apos;m pro-AI, but wary of it skipping
            authentic collaboration, or letting decisions run ahead on
            assumptions nobody&apos;s actually verified.
          </motion.p>
          <motion.div variants={item} className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              nativeButton={false}
              className="h-11 px-6 text-[0.95rem]"
              render={<a href="#work">See my work</a>}
            />
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="h-11 border-2 border-foreground px-6 text-[0.95rem] text-foreground hover:bg-foreground hover:text-white"
              render={<a href="#contact">Get in touch</a>}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-3/4 md:mr-0 md:ml-auto"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <Image
            src="/assets/about-portrait-1.png"
            alt="Portrait of Hanru Wehmeyer, UX Designer"
            width={1875}
            height={1886}
            priority
            className="aspect-square w-full rounded-2xl border border-border object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
