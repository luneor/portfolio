"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/*
  The name/email/message form, lifted out of the Contact section unchanged so
  it can live inside the Say hello dialog. Nothing here knows it is in a
  dialog: it posts to /api/contact and swaps itself for a success state, the
  same as when it sat at the foot of every page.
*/

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
  lighter slab than the surface around them.

  Overridden here rather than in components/ui/input.tsx: `cn` runs
  tailwind-merge, so these replace the primitive's background cleanly and the
  primitive stays stock for anything else that uses it. `dark:` needs stating
  too -- without it the primitive's own dark rule still outranks the base.
*/
const FIELD_SURFACE = "bg-background dark:bg-background";

export function ContactForm({
  /*
    Let a caller hold onto the first field. The dialog needs it: Base UI
    focuses the first tabbable element in the popup, which is the close button
    in DOM order, and landing on "close" as the first thing a keyboard reaches
    reads as the dialog offering to undo itself.
  */
  firstFieldRef,
}: {
  firstFieldRef?: RefObject<HTMLInputElement | null>;
}) {
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
    /* Sent and not-sent are two different sights, not one form with a banner
       tacked on: swapping the whole block is what makes success register as
       "done" rather than just another status line to read past. Skips the
       crossfade under prefers-reduced-motion, same as SpotlightCard, but still
       swaps content instantly either way. */
    <AnimatePresence mode="wait" initial={false}>
      {status.state === "sent" ? (
        <motion.div
          key="success"
          role="status"
          aria-live="polite"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
          className="flex min-h-[220px] flex-col items-start justify-center gap-3"
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
          className="grid gap-4 text-left"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="name">Your name</Label>
            <Input
              ref={firstFieldRef}
              id="name"
              name="name"
              autoComplete="name"
              required
              disabled={isSending}
              className={FIELD_SURFACE}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Your email</Label>
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
            The site's primary treatment, same as the work page's "View case
            study": bare at rest with a flat `--border` hairline, and on the
            button's own hover the gradient ring plus a bloom of the same
            gradient behind it.

            `group/cta` is scoped to this wrapper, which is `w-fit` around the
            button, so "hovered" means the button and not the form. `relative`
            keeps the glow, a preceding sibling, behind the button without a
            negative z-index.

            The glow is dropped entirely while sending rather than being
            hidden: a disabled button is `pointer-events-none`, so hover would
            still register on the WRAPPER and light the bloom around a button
            that can't be pressed.
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
  );
}
