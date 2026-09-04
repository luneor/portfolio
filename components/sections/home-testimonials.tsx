"use client";

import { useState } from "react";
import { LinkedInMark } from "@/components/linkedin-mark";
import { TESTIMONIALS } from "@/lib/testimonials";

/*
  The About page's colleague quotes, one at a time, stepped through by the
  reader. About shows all three stacked, which is right on a page someone has
  chosen to read; here the homepage is already long and three full paragraphs
  in a row would be the heaviest block on it.

  Nothing advances on its own. An auto-rotating carousel has to carry a pause
  control to satisfy WCAG 2.2.2, and more to the point it takes the pacing away
  from the reader in the middle of a paragraph they're still reading.

  A counter and a pair of arrows, rather than the colleagues' names or a row of
  dots. A first-time visitor doesn't know who these people are, so names give
  them nothing to navigate by, and the name is under the quote once they've
  read it anyway. "1 of 3" says how much is left in a way three circles don't.

  Not the tabs pattern any more: with no dots there is nothing to be a tab, and
  claiming the role without the markup to back it would describe the control
  wrongly. It's two buttons and a live region, which is what it actually is.

  The quote area is aria-live, so the new quote is announced when someone steps
  to it. Without that the buttons appear to do nothing to a screen reader.
*/
export function HomeTestimonials() {
  const [active, setActive] = useState(0);
  const last = TESTIMONIALS.length - 1;

  return (
    <section
      id="colleagues"
      aria-labelledby="colleagues-heading"
      className="py-20"
    >
      <div className="mx-auto max-w-page px-6">
        <h2
          id="colleagues-heading"
          className="text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-foreground"
        >
          Don&apos;t just hear it from me
        </h2>

        {/*
          Counter first, then the two arrows together. The arrows are a pair
          doing one job, so they sit as a pair; separating them around a row of
          dots made them read as two unrelated controls.

          Drawn as SVG rather than set as the arrow characters. A glyph sits on
          the text baseline, which left it visibly low in a circle that centres
          on the box, and the exact offset varies by font. A path centres on the
          viewBox and stays put.
        */}
        <div className="mt-8 flex items-center gap-4">
          <p className="font-mono text-[0.78rem] tracking-[0.03em] text-foreground-muted">
            {active + 1} of {TESTIMONIALS.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActive(active === 0 ? last : active - 1)}
              aria-label="Previous quote"
              className="grid size-9 place-items-center rounded-full border border-border text-brand-weak transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-4"
              >
                <path
                  d="M10 3.5 5.5 8l4.5 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setActive(active === last ? 0 : active + 1)}
              aria-label="Next quote"
              className="grid size-9 place-items-center rounded-full border border-border text-brand-weak transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-4"
              >
                <path
                  d="M6 3.5 10.5 8 6 12.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/*
          All three occupy the same grid cell, so the block is always as tall as
          the longest quote and stepping through it doesn't shunt the page
          around. The inactive two are `invisible` rather than unmounted, which
          keeps that height while still taking them out of the accessibility
          tree and out of the tab order, since a visibility-hidden link can't be
          focused.
        */}
        <div className="mt-8 grid" aria-live="polite">
          {TESTIMONIALS.map((person, i) => (
            <div
              key={person.key}
              className={`col-start-1 row-start-1 ${
                i === active ? "" : "invisible"
              }`}
            >
              {/* Same figure/blockquote/figcaption as About: the attribution is
                  the caption of the quote, and this is the markup that says so
                  to a screen reader as well as to the eye. */}
              <figure className="max-w-[68ch] border-l-2 border-brand-weak pl-6">
                <blockquote className="text-[1.05rem] leading-relaxed text-foreground">
                  <p>{person.quote}</p>
                </blockquote>
                <figcaption className="mt-4">
                  <a
                    href={person.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-brand-weak hover:underline hover:underline-offset-4"
                  >
                    {person.name}
                    <LinkedInMark />
                  </a>
                  <p className="mt-0.5 text-[0.9rem] text-foreground-muted">
                    {person.role}
                  </p>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
