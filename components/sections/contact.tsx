"use client";

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

  const isSending = status.state === "sending";
  const statusMessage =
    status.state === "sent"
      ? "Thanks, that's sent. I'll get back to you soon."
      : status.state === "error"
        ? status.message
        : "";

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-16 px-6 md:grid-cols-2">
        <div>
          <h2
            id="contact-heading"
            className="mb-4 text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-brand-weak"
          >
            Contact
          </h2>
          <p className="mb-4 text-foreground">
            Happy to talk about UX work, collaborations, or roles, drop a
            message or reach out directly.
          </p>
          <ul className="space-y-2.5">
            <li>
              <a
                href="mailto:hanruweh@hotmail.com"
                className="underline decoration-brand-strong underline-offset-4"
              >
                hanruweh@hotmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/hanru-wehmeyer-2a5327258/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-brand-strong underline-offset-4"
              >
                linkedin.com/in/hanru-wehmeyer
              </a>
            </li>
          </ul>
        </div>
        <div>
          <form onSubmit={handleSubmit} noValidate className="grid gap-4">
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
            <Button type="submit" className="w-fit px-6" disabled={isSending}>
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
          </form>
        </div>
      </div>
    </section>
  );
}
