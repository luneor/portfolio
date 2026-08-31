"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";
import { HeroGlow } from "@/components/hero-glow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

const GENERIC_ERROR = "Sorry, something went wrong sending that. Please email directly instead.";

/*
  Page ground inside the fields, rather than the input primitive's own
  `bg-transparent` + `dark:bg-input/30`. That 30% tint of `--input` used to be
  invisible, but `--input` had to be lifted to clear WCAG 1.4.11 on the field
  BORDER, which lifted the tint with it and left the fields sitting on a
  lighter slab than the page around them.

  Overridden here rather than in components/ui/input.tsx: `cn` runs
  tailwind-merge, so these replace the primitive's background cleanly and the
  primitive stays stock for anything else that uses it. `dark:` needs stating
  too -- without it the primitive's own dark rule still outranks the base.
*/
const FIELD_SURFACE = "bg-background dark:bg-background";

export function Contact() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    setStatus({ state: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setStatus({ state: "error", message: body?.error || GENERIC_ERROR });
        return;
      }

      setStatus({ state: "sent" });
      form.reset();
    } catch {
      setStatus({ state: "error", message: GENERIC_ERROR });
    }
  }

  const reduce = useReducedMotion() ?? false;
  const isSending = status.state === "sending";
  const statusMessage = status.state === "error" ? status.message : "";

  return (
    /*
      Its own page now, rather than the block every other page ended with, so
      it gets the hero's gradient field instead of flat `--background`: the two
      are the only pages that are a destination in themselves rather than
      something to read, and the field is what says so.

      No "Press me!" button with it. That belongs to the hero, where it sits
      under the nav pill with room to be a toy; here the form is the only thing
      to do on the page and a second button competing for the press would read
      as part of it.
    */
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="hero-surface relative overflow-hidden [--hero-fade-start:88%]"
    >
      {/*
        The gradient field, same as the hero's. No `randomizeRef`, since
        nothing on this page reshuffles it.

        `--hero-fade-start` pushed from the hero's 62% to 88%: the hero fills
        its height and hands off to the page below, where a short form centred
        in a full viewport leaves the bottom third empty, and a field that has
        already faded out by then reads as a band behind the form rather than
        as the ground it sits on.
      */}
      <HeroGlow />

      {/*
        Full viewport less the header, which is sticky and therefore in flow on
        every page but home. Without a min-height the field would only be as
        tall as the form and read as a band behind it rather than as the page's
        ground.

        `items-center` so the two columns sit in the middle of that height
        together, the way the hero's block does.
      */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-page grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2">
        <div>
          <h2
            id="contact-heading"
            className="mb-4 text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-foreground"
          >
            Contact
          </h2>
          <p className="mb-4 text-foreground">
            Happy to talk about UX work, collaborations, or roles, drop a
            message or reach out directly.
          </p>
          {/*
            These two carry colour rather than a permanent underline, which is
            only safe because they're a standalone list: a link identified by
            colour alone inside a paragraph would be unidentifiable to anyone
            not perceiving the hue, but a list item that is nothing except the
            address reads as the link by position. The underline still comes
            back on hover, so there's a non-colour cue on interaction.
          */}
          <ul className="space-y-2.5">
            <li>
              <a
                href="mailto:hanruweh@hotmail.com"
                className="text-brand-weak hover:underline hover:underline-offset-4"
              >
                hanruweh@hotmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/hanru-wehmeyer-2a5327258/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-weak hover:underline hover:underline-offset-4"
              >
                linkedin.com/in/hanru-wehmeyer
              </a>
            </li>
          </ul>
        </div>
        <div>
          {/* Sent and not-sent are two different sights, not one form with a
              banner tacked on: swapping the whole block is what makes success
              register as "done" rather than just another status line to read
              past. Skips the crossfade under prefers-reduced-motion, same as
              SpotlightCard, but still swaps content instantly either way. */}
          <AnimatePresence mode="wait" initial={false}>
            {status.state === "sent" ? (
              <motion.div
                key="success"
                role="status"
                aria-live="polite"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
                className="flex min-h-[368px] flex-col items-start justify-center gap-3"
              >
                <motion.div
                  initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut", delay: reduce ? 0 : 0.1 }}
                >
                  <CheckCircle2 className="h-10 w-10 text-brand-weak" aria-hidden="true" />
                </motion.div>
                <p className="text-lg font-bold tracking-tight text-foreground">
                  Thanks for getting in touch, I&apos;ll get back to you soon!
                </p>
                <button
                  type="button"
                  onClick={() => setStatus({ state: "idle" })}
                  className="text-sm text-foreground-muted underline decoration-brand-weak underline-offset-4 hover:text-foreground"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
                className="grid gap-4"
              >
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    disabled={isSending}
                    className={FIELD_SURFACE}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isSending}
                    className={FIELD_SURFACE}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    disabled={isSending}
                    className={cn("min-h-[130px]", FIELD_SURFACE)}
                  />
                </div>
                {/*
                  The site's primary treatment, same as the work page's "View
                  case study": bare at rest with a flat `--border` hairline,
                  and on the button's own hover the gradient ring plus a bloom
                  of the same gradient behind it.

                  `group/cta` is scoped to this wrapper, which is `w-fit` around
                  the button, so "hovered" means the button and not the form.
                  `relative` keeps the glow, a preceding sibling, behind the
                  button without a negative z-index.

                  The glow is dropped entirely while sending rather than being
                  hidden: a disabled button is `pointer-events-none`, so hover
                  would still register on the WRAPPER and light the bloom
                  around a button that can't be pressed.
                */}
                <div className="group/cta relative w-fit">
                  {!isSending && (
                    <span
                      aria-hidden="true"
                      className="brand-glow pointer-events-none absolute -inset-0.5 rounded-full opacity-0 blur-sm transition-opacity duration-300 ease-out group-hover/cta:opacity-70 group-has-[:focus-visible]/cta:opacity-70"
                    />
                  )}
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="brand-ring-reveal relative h-11 w-fit px-6"
                    disabled={isSending}
                  >
                    {isSending ? "Sending…" : "Send message"}
                  </Button>
                </div>
                <p
                  role="status"
                  aria-live="polite"
                  className={`min-h-[1.2em] text-[0.9rem] ${
                    status.state === "error" ? "text-destructive" : "text-brand-weak"
                  }`}
                >
                  {statusMessage}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
