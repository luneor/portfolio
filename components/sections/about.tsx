import Image from "next/image";

/*
  LinkedIn's own mark, inline rather than from lucide, which dropped its brand
  icons. `currentColor` so it takes the colour of the link it sits in, in both
  themes and on hover.

  Decorative, and deliberately so: it sits inside a link whose text is already
  the person's name, so announcing it as well would just say the same thing
  twice.
*/
function LinkedInMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4 shrink-0"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/*
  What colleagues say, in their words. Data rather than markup, so adding a
  third is one entry and not another hand-built block that has to be kept in
  line with the first two.

  `quote` stays a plain string: these are somebody else's sentences, and the
  moment the type allows JSX in here it becomes possible to emphasise a phrase
  they didn't emphasise themselves.
*/
const TESTIMONIALS = [
  {
    key: "blair-gibson",
    name: "Blair Gibson",
    role: "Senior UX Designer",
    href: "https://www.linkedin.com/in/mrblairgibson/",
    quote:
      "Since joining Genio after university, Hanru has grown into an exceptional emerging designer. He is endlessly curious, never hesitating to ask questions and always ensuring that every angle has been explored. He makes experimentation look effortless, embracing a wide range of AI tools to strengthen his UX process, accelerate prototyping and explore new approaches to creating effective interview guides and surveys.",
  },
  {
    key: "marianne-jennings",
    name: "Marianne Jennings",
    role: "Product Manager",
    href: "https://www.linkedin.com/in/mariannejennings/",
    quote:
      "What sets Hanru apart is his design philosophy. He is always anchored to the right questions: what problem are we actually solving, and what is the simplest way to solve it for the user? The result is work I can only describe as having a kind of simple elegance. Working primarily in Figma, his designs are beautiful, intuitive, and purposeful, and his eye for aesthetics and problem solving feel completely unified.",
  },
];

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
