"use client";

import { motion } from "motion/react";
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
        Full viewport, not the 88vh it used to be. The header is out of flow on
        this page (see SiteHeader), so the hero starts at the very top and has
        to cover the height the header used to take as well, or the field would
        stop short of the fold.
      */}
      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1120px] flex-col items-center justify-center px-6 py-24 text-center">
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
              render={<Link href="/work">See the work →</Link>}
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
