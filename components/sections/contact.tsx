"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(
      "This form isn't wired up to a backend yet — please reach out directly via email or LinkedIn below in the meantime."
    );
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-16 px-6 md:grid-cols-2">
        <div>
          <span className="mb-4 flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.06em] lowercase">
            <span className="text-brand-weak">›</span>
            <span className="text-foreground-muted">get in touch</span>
          </span>
          <h2
            id="contact-heading"
            className="mb-4 text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.15] font-bold tracking-tight text-foreground"
          >
            Contact
          </h2>
          <p className="mb-4 text-foreground-muted">
            Happy to talk about UX work, collaborations, or roles — drop a
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
          {/* Front-end only: this form has no backend wired up yet.
              Connect a service such as Formspree, Basin, or Netlify Forms
              before deploying, e.g. by setting the form action to your
              Formspree endpoint and adding a name attribute per field. */}
          <form onSubmit={handleSubmit} noValidate className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required className="min-h-[130px]" />
            </div>
            <Button type="submit" className="w-fit px-6">
              Send message
            </Button>
            <p role="status" aria-live="polite" className="min-h-[1.2em] text-[0.9rem] text-brand-weak">
              {status}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
