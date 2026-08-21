"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

const GENERIC_ERROR = "Sorry, something went wrong sending that. Please email directly instead.";

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
    <section id="contact" aria-labelledby="contact-heading" className="py-24">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-16 px-6 md:grid-cols-2">
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
                  <Input id="name" name="name" autoComplete="name" required disabled={isSending} />
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
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    disabled={isSending}
                    className="min-h-[130px]"
                  />
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="h-11 w-fit px-6"
                  disabled={isSending}
                >
                  {isSending ? "Sending…" : "Send message"}
                </Button>
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
