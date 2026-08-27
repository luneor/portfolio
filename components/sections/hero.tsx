"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroGlow } from "@/components/hero-glow";
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
  /*
    Filled in by HeroGradient once its WebGL context is up, and left null if
    that never happens (the CSS fallback has nothing to reshuffle), which is
    what the button's `disabled` reads.
  */
  const randomizeRef = useRef<(() => void) | null>(null);
  const [canRandomize, setCanRandomize] = useState(false);

  useEffect(() => {
    // The ref is populated inside a child effect, which runs before this one,
    // so by now it either exists or never will.
    setCanRandomize(randomizeRef.current !== null);
  }, []);

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="hero-surface relative overflow-hidden"
    >
      {/* The gradient field. */}
      <HeroGlow randomizeRef={randomizeRef} />

      {/*
        Full viewport from `sm` up, not the 88vh it used to be: the header is
        out of flow at those widths (see SiteHeader), so the hero starts at the
        very top and has to cover the height the header used to take as well, or
        the field would stop short of the fold.

        Below `sm` the header is sticky and therefore IN flow, taking its
        `min-h-16` off the top before the hero begins. A full `svh` here would
        push the hero's own bottom that far past the fold and shove the centred
        block visibly low; subtracting the header's height puts it back.
      */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-page flex-col items-center justify-center px-6 py-24 text-center sm:min-h-svh">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/*
            Small, circular, and cropped tight on the face -- a face reads at
            this size where a wider portrait would just be a blur of tone.
            `rounded-full` + `overflow-hidden` draws the circle; the source
            asset itself is a square crop with headroom on every side so the
            ring never clips hair or chin.

            No border: a flat ring around a light photo read as a hard black
            outline on the gradient field. `morph-raised`, the same lift the
            CTAs and nav pill use, separates it from the field on its own.
          */}
          <motion.div variants={item} className="morph-raised mb-5">
            <Image
              src="/assets/hero-avatar.png"
              alt="Hanru Wehmeyer"
              width={256}
              height={256}
              className="h-16 w-16 rounded-full object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
              priority
            />
          </motion.div>

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
            Hi, I&apos;m Hanru Wehmeyer
          </motion.h1>

          <motion.p
            variants={item}
            /*
              Tight to the headline: the two read as one block, which leaves the
              larger gap below to separate them from the navigation.
            */
            className="mt-5 max-w-[54ch] text-[1.05rem] leading-relaxed text-foreground"
          >
            UX Designer in Scotland, creating{" "}
            <strong className="font-semibold">innovative, human-centred</strong>{" "}
            solutions that align with business needs.
          </motion.p>

          {/*
            Two routes into the site, split by width rather than shown together.

            From `sm` up, the morphic pill is the whole navigation and a pair of
            CTAs beside it would just duplicate Work and Contact. Below `sm` the
            pill doesn't fit, so nav moves to the header's hamburger and these
            buttons take over as the hero's call to action.
          */}
          {/*
            Set well below the text block, so the page reads as two groups.

            `morph-raised` is the nav pill's own lift, borrowed. These two are
            what stands in for the pill below `sm`, and they sit on the same
            gradient field it does, where a flat block reads as painted onto the
            colour rather than resting on it. On the ROW, not on each button,
            which is how the pill does it too: `drop-shadow` follows the union
            of the silhouettes, so the shadow in the gap between the pair is
            drawn behind both of them instead of one button casting onto the
            other.
          */}
          <motion.div variants={item} className="morph-raised mt-14 flex flex-wrap justify-center gap-3 sm:hidden">
            {/*
              Both plain, neither carrying the coral fill. Work used to take it
              as the page's call to action, but over a field that is itself
              coral half the time the button stopped reading as the emphasised
              one and just read as another patch of the background.

              `ghost` with the border added by hand, not `outline`: the outline
              variant carries a `dark:bg-input/30`, and a dark-variant rule
              outranks a plain `bg-card`, so the fill lands at 30% alpha with
              the field showing through. Ghost declares no base background, so
              the one set here is the only one in play.
            */}
            <Button
              variant="ghost"
              size="lg"
              nativeButton={false}
              className="h-11 border border-border bg-card px-6 text-[0.95rem] text-card-foreground hover:bg-accent!"
              render={<Link href="/work">See my work →</Link>}
            />
            <Button
              variant="ghost"
              size="lg"
              nativeButton={false}
              className="h-11 border border-border bg-card px-6 text-[0.95rem] text-card-foreground hover:bg-accent!"
              render={<Link href="#contact">Get in touch</Link>}
            />
          </motion.div>

          <motion.div variants={item} className="mt-20 max-sm:hidden">
            <MorphicNavbar items={SITE_NAV} size="lg" onField />
          </motion.div>

          {/*
            Sits under the nav pill, and shares its `max-sm:hidden`: below `sm`
            the pill is replaced by the two CTAs above, and a toy button in
            among the only two real routes into the site would be competing for
            the tap rather than sitting beside it.

            It only rearranges decoration, so there's nothing for a screen
            reader to be told afterwards and no live region here; the label
            says plainly what pressing it does. Rendered only when the field is
            actually running, since the CSS fallback has nothing to reshuffle.

            Its own `initial`/`animate` rather than the shared `item` variant,
            so it lands after the nav pill above it has finished arriving.
            Being last in the stagger only bought it 0.1s, which reads as
            simultaneous; and because `canRandomize` flips in an effect this
            block mounts a beat after its siblings, by which point the parent's
            orchestration has already run and it would simply appear. An
            explicit delay is the only thing that sequences it reliably.
          */}
          {canRandomize && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.85 }}
              className="mt-6 max-sm:hidden"
            >
              {/*
                Filled with `--card`, the same step off the page ground the nav
                pill above it uses, rather than `--background`: the two sit
                directly on top of each other over a moving field, and two
                different dark fills there read as a mistake rather than as a
                hierarchy.
              */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => randomizeRef.current?.()}
                className="border border-border bg-card px-4 text-card-foreground hover:bg-accent!"
              >
                Press me!
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
