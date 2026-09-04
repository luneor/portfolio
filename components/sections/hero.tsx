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

/*
  The entrance stagger, as plain data. Each child gets `.hero-rise` (see
  globals.css) plus its own delay, so the whole sequence is CSS and the content
  is in the markup already visible rather than waiting on hydration.

  40ms apart and 200ms at the last step: long enough to read as a sequence,
  short enough that nothing looks absent while it waits its turn.
*/
function rise(step: number) {
  return { "--rise-delay": `${step * 40}ms` } as React.CSSProperties;
}

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
        <div
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
          <div style={rise(0)} className="hero-rise morph-raised mb-5">
            <Image
              src="/assets/hero-avatar.png"
              alt="Hanru Wehmeyer"
              width={256}
              height={256}
              className="h-16 w-16 rounded-full object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
              priority
            />
          </div>

          {/*
            Name and pitch in one statement rather than a big name over a quiet
            subtitle. The name on its own is the least useful thing a first-time
            visitor can read, and splitting them gave the sentence that actually
            says what I do the visual weight of a caption.

            No `whitespace-nowrap` now: at ~100 characters this has to wrap, so
            the size comes from a clamp against a width cap instead of being
            forced to one line. `text-balance` keeps the wrap even rather than
            leaving a short last line.

            The cap is 56rem because three lines is the target and the measure
            has to be wide enough to reach it. At 46rem it fell 17px short at
            1440 and tipped to four. 56rem clears three comfortably without
            getting wide enough to collapse to two (which would need ~1130px at
            that size), and the container's own 1280px keeps it honest. Below
            about 400px the clamp bottoms out and a fourth line is unavoidable.
          */}
          <h1
            id="hero-heading"
            style={rise(1)}
            className="hero-rise max-w-[56rem] text-[clamp(1.5rem,4.2vw,2.9rem)] leading-[1.15] font-medium tracking-tight text-balance text-foreground"
          >
            {/*
              The name holds 800 while everything around it drops to 500,
              "I'm" included: the weight marks the name itself, not the phrase
              it arrives in, and carrying it across "I'm" blunted that. The
              clause after it is doing explanatory work and reads better much
              lighter, which also stops it competing with the question below.
              700 was tried first and the gap to 800 was too small to look
              deliberate.
            */}
            I&apos;m{" "}
            <strong className="font-extrabold">Hanru Wehmeyer</strong>
            , UX Designer in Scotland who starts by asking{" "}
            {/*
              The question is Archivo like the rest of the line now, so it
              needs no optical size correction and no tracking of its own: same
              face, same weight, same measure. Only the slant on "have to"
              marks it.

              `block` stays, so the question always starts its own line rather
              than beginning halfway along the sentence, with its own
              `text-balance` since balancing is per block.
            */}
            <span className="block italic text-balance">
              &ldquo;<em>Why</em>{" "}
              does it <em>have to</em>{" "}
              work like that?&rdquo;
            </span>
          </h1>

          <div style={rise(2)} className="hero-rise morph-raised mt-14 flex flex-wrap justify-center gap-3 sm:hidden">
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
              render={<Link href="/contact">Get in touch</Link>}
            />
          </div>

          <div style={rise(3)} className="hero-rise mt-20 max-sm:hidden">
            <MorphicNavbar items={SITE_NAV} size="lg" onField />
          </div>

          {/*
            Sits under the nav pill, and shares its `max-sm:hidden`: below `sm`
            the pill is replaced by the two CTAs above, and a toy button in
            among the only two real routes into the site would be competing for
            the tap rather than sitting beside it.

            It only rearranges decoration, so there's nothing for a screen
            reader to be told afterwards and no live region here; the label
            says plainly what pressing it does. Rendered only when the field is
            actually running, since the CSS fallback has nothing to reshuffle.

            The one entrance still done in Motion, and the only one that can
            be: `canRandomize` flips in an effect, so this block doesn't exist
            until JS has run anyway. There's no blank-content risk to design
            around, and an explicit delay is what lands it after the nav pill
            above has finished arriving.
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
        </div>
      </div>
    </section>
  );
}
