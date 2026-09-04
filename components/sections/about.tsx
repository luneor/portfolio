import Image from "next/image";
import { LinkedInMark } from "@/components/linkedin-mark";
import { TESTIMONIALS } from "@/lib/testimonials";



export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24">
      {/* The page container moved out to here, so the testimonials below the
          grid line up with the same gutters rather than needing their own. */}
      <div className="mx-auto max-w-page px-6">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-[1fr_1.3fr]">
          {/*
            One portrait, square. `md:w-[85%]` rather than a narrower first grid
            track: shrinking the track would hand the freed width to the prose
            column, pushing its measure past ~80 characters. Capping the image
            instead leaves the text column exactly as it was and lets the space
            fall into the gap. Below `md` the layout is one column and the
            portrait still runs its full width.
          */}
          <Image
            src="/assets/about-headshot.png"
            alt="Hanru Wehmeyer, portrait"
            width={1400}
            height={1400}
            sizes="(max-width: 768px) 92vw, 380px"
            className="aspect-square w-full rounded-xl border border-border object-cover md:w-[85%]"
          />
          <div>
            <h2
              id="about-heading"
              className="mb-4 text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-foreground"
            >
              Hi, I&apos;m Hanru.
            </h2>
            <p className="mb-4 text-foreground">
              I&apos;m 26, based in Scotland, and I&apos;ve been a UX Designer
              at Genio since June 2025, designing admin tools that give
              educators real control over how they support students.
            </p>
            <p className="mb-4 text-foreground">
              I&apos;ve always been interested in art and visuals growing up,
              which took me from an art college course to developing an
              interest in UX design, and eventually a career in it. I&apos;m
              keen to keep developing my skillset, think creatively, and push
              for collaboration.
            </p>
            <p className="text-foreground">
              Outside of work, I&apos;ve been playing field hockey my whole
              life, and recently ran my first half marathon. I&apos;m also a
              keen gamer, my usual way to unwind.
            </p>
          </div>
        </div>

        {/*
          Same h3 as "How this shows up in my work" and "Filling the gap": the
          sub-heading size is one decision made once, so a reader meets the same
          step down from an h2 on every page that has one.
        */}
        <div className="mt-20">
          <h3 className="text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.2] font-bold tracking-tight text-foreground">
            Don&apos;t just hear it from me
          </h3>

          {/*
            Stacked, not side by side. Both quotes are a full paragraph, and in
            two columns they'd either run past a comfortable line length or set
            at a size that reads as a caption. One under the other keeps the
            measure and lets each be read as a voice rather than as half of a
            comparison.
          */}
          <div className="mt-8 flex flex-col gap-10">
            {TESTIMONIALS.map((person) => (
              /*
                `figure` + `blockquote` + `figcaption`, not a div with a name
                under it: the attribution is the caption of the quote, and this
                is the markup that says so to a screen reader as well as to the
                eye.

                A rule in the brand colour rather than a card. Cards on this
                site carry a set of peers a reader scans across -- three
                principles, a grid of work -- and these are meant to be read
                straight through, one after the other. The rule marks each as
                somebody else's voice without turning it into a tile.

                Measure capped, unlike the section intros that run the full
                container: those are a couple of lines, these are paragraphs,
                and at full width on a wide screen they ran well past a
                comfortable line length.
              */
              <figure
                key={person.key}
                className="max-w-[68ch] border-l-2 border-brand-weak pl-6"
              >
                <blockquote className="text-[1.05rem] leading-relaxed text-foreground">
                  <p>{person.quote}</p>
                </blockquote>
                <figcaption className="mt-4">
                  {/*
                    The name is the link, with the mark after it, rather than a
                    bare glyph beside plain text: an icon-only link has to
                    borrow its accessible name from an aria-label, and there's
                    a perfectly good one right here. Colour plus the mark
                    identify it without a permanent underline, the same bargain
                    the contact links strike, and the underline still arrives on
                    hover.
                  */}
                  <a
                    href={person.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-brand-weak hover:underline hover:underline-offset-4"
                  >
                    {person.name}
                    <LinkedInMark />
                  </a>
                  {/* Role is metadata about the speaker, which is what the
                      muted tone is for; the quote itself stays full-strength. */}
                  <p className="mt-0.5 text-[0.9rem] text-foreground-muted">
                    {person.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
