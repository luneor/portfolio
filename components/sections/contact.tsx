"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Mail, MessageSquare, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { ContactForm } from "@/components/contact-form";
import { HeroGlow } from "@/components/hero-glow";
import { LinkedInMark } from "@/components/linkedin-mark";
import { cn } from "@/lib/utils";

/*
  Say hello, built as a second hero rather than as a page with a form on it.

  Same bones as components/sections/hero.tsx: the gradient field behind, a
  centred column, the same entry stagger, and the same `morph-raised` pills
  resting on the colour. These are the only two pages that are a destination
  in themselves rather than something to read, and looking alike says so.

  No "Press me!" button. That belongs to the hero, where it sits under the nav
  pill with room to be a toy; here the three actions ARE the page, and a
  fourth thing to press would read as one of them.
*/

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/*
  One action. A pill with the icon over its label, fixed width so the three
  sit as a row of equals.

  `group/action` rather than a bare `group`: the icon inside animates off the
  hover of THIS pill, and an unnamed group would also answer any group that
  later wrapped the row.

  The lift is CSS, not Motion's `whileHover`, for the reason ProjectCard
  gives: `whileHover` answers the pointer only, and this has to work from the
  keyboard too. No `has-[:focus-visible]` needed, unlike the cards -- the pill
  IS the focusable element, so `focus-visible:` on itself does it.
*/
const ACTION_CLASS = cn(
  // Narrower below `sm` so all three still fit one row on a 375px phone: at
  // the full 8rem they wrapped 2 + 1 and the last one sat alone under a pair.
  "group/action flex w-24 flex-col items-center gap-3 rounded-2xl sm:w-32",
  "border border-border bg-card px-4 py-5 text-card-foreground",
  "transition-[translate,background-color] duration-300 ease-out",
  "hover:-translate-y-1 hover:bg-accent focus-visible:-translate-y-1 focus-visible:bg-accent",
  "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
);

const ACTION_LABEL_CLASS = "text-[0.9rem] font-medium";

/*
  Each icon moves differently, and each movement is about what its action
  does: the envelope lifts like a letter being handed over, the LinkedIn mark
  leans out because it leaves the site, and the speech bubble rises the way a
  reply arrives. Three identical scale-ups would have been decoration; this
  way the motion says which is which before the label is read.

  `motion-reduce:transition-none` on each, so anyone who asked for less
  movement still gets the hover colour and the focus ring and none of the
  travel.
*/
const ICON_BASE =
  "size-7 transition-transform duration-300 ease-out motion-reduce:transition-none motion-reduce:group-hover/action:translate-none motion-reduce:group-hover/action:scale-100";

export function Contact() {
  const firstFieldRef = useRef<HTMLInputElement>(null);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      /*
        `--hero-fade-start` pushed from the hero's 62% to 88%: the hero fills
        its height and hands off to the page below, where a centred column in
        a full viewport leaves the bottom third empty, and a field that has
        already faded by then reads as a band behind the content rather than
        as the ground it sits on.
      */
      className="hero-surface relative overflow-hidden [--hero-fade-start:88%]"
    >
      {/* The gradient field, same as the hero's. No `randomizeRef`, since
          nothing on this page reshuffles it. */}
      <HeroGlow />

      {/*
        Full viewport less the header, which is sticky and therefore in flow on
        every page but home. The hero can claim the whole `svh` from `sm` up
        because its header is out of flow there; this one never is.
      */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-page flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/*
            An h1, not the h2 this was when it sat at the foot of other pages:
            it is the only heading on its own page now.

            A smaller clamp than the hero's h1. "Say hello" is nine characters
            against that headline's twenty-two, so at the same ~7vw it ran
            wider than the paragraph beneath it and read as a banner.
          */}
          <motion.h1
            id="contact-heading"
            variants={item}
            className="text-[clamp(2rem,6vw,3.6rem)] leading-[1.1] font-extrabold tracking-tight text-foreground"
          >
            Say hello
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-foreground"
          >
            Happy to talk about UX work, collaborations, or roles, drop a
            message or reach out directly.
          </motion.p>

          {/*
            Three ways in, at equal weight. Two are links straight out of the
            site and the third opens the form, which is a real difference in
            what happens next -- but not a difference in how much any one of
            them is being recommended, so they are a row of peers rather than a
            primary with two alternates.

            `morph-raised` sits on the ROW, not on each pill, which is how the
            hero's CTAs do it: `drop-shadow` follows the union of the
            silhouettes, so the shadow in the gaps is drawn behind all three
            instead of each casting onto its neighbour.
          */}
          <motion.div
            variants={item}
            className="morph-raised mt-12 flex flex-wrap items-stretch justify-center gap-3 sm:gap-4"
          >
            <a
              href="mailto:hanruweh@hotmail.com"
              aria-label="Email hanruweh@hotmail.com"
              className={ACTION_CLASS}
            >
              <Mail
                aria-hidden="true"
                className={cn(
                  ICON_BASE,
                  "group-hover/action:-translate-y-1 group-focus-visible/action:-translate-y-1"
                )}
              />
              <span className={ACTION_LABEL_CLASS}>Email</span>
            </a>

            <a
              href="https://www.linkedin.com/in/hanru-wehmeyer-2a5327258/"
              target="_blank"
              rel="noopener noreferrer"
              className={ACTION_CLASS}
            >
              <LinkedInMark
                className={cn(
                  ICON_BASE,
                  "group-hover/action:translate-x-1 group-focus-visible/action:translate-x-1"
                )}
              />
              <span className={ACTION_LABEL_CLASS}>LinkedIn</span>
            </a>

            {/*
              The one that stays on the page. A Dialog.Trigger renders a real
              <button>, so it announces itself as a button beside two links and
              a screen reader gets told the difference before it's pressed.
            */}
            <Dialog.Root>
              <Dialog.Trigger className={ACTION_CLASS}>
                <MessageSquare
                  aria-hidden="true"
                  className={cn(
                    ICON_BASE,
                    "group-hover/action:-translate-y-1 group-hover/action:scale-110 group-focus-visible/action:-translate-y-1 group-focus-visible/action:scale-110"
                  )}
                />
                <span className={ACTION_LABEL_CLASS}>Message</span>
              </Dialog.Trigger>

              <Dialog.Portal>
                {/*
                  A blur as well as a dim. The page underneath is a moving
                  gradient field, and a flat scrim over it still read as colour
                  shifting behind the form; blurring settles it.
                */}
                <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />

                {/*
                  The viewport scrolls, the popup doesn't. The form is taller
                  than a short viewport with a keyboard up, and scrolling the
                  container rather than the popup keeps all of it reachable
                  without an inner scrollbar around the fields.
                */}
                <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-6">
                  {/* Straight into the Name field. Base UI's default is the
                      first tabbable element, which is the close button above
                      it in DOM order. */}
                  <Dialog.Popup initialFocus={firstFieldRef} className="relative my-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 text-left text-card-foreground shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] transition-[opacity,scale] duration-200 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none">
                    <Dialog.Title className="pr-8 text-lg font-bold tracking-tight text-foreground">
                      Send a message
                    </Dialog.Title>
                    <Dialog.Close
                      aria-label="Close"
                      className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-full text-foreground-muted outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <X aria-hidden="true" className="size-4" />
                    </Dialog.Close>

                    {/* No Dialog.Description: the three labelled fields say
                        what the dialog is for, and a line restating it above
                        them was one more thing to read past. */}
                    <div className="mt-6">
                      <ContactForm firstFieldRef={firstFieldRef} />
                    </div>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            </Dialog.Root>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
