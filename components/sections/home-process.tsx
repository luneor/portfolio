import Link from "next/link";

/*
  The three writing-led pages, which the work rows above don't reach: how the
  work gets done, and where AI sits in it. All three were nav-only before, so a
  visitor scrolling the homepage had no idea any of them existed.

  One heading over all three rather than two groups. Splitting process from AI
  gave the single AI card a heading of its own and left a hole beside it, and
  the split implied a distinction a reader has no reason to care about: these
  are all "how I think", whatever the subject.

  Summaries are drawn from each page's own meta description rather than written
  fresh, so a link can't end up promising something the page doesn't say.
*/
const LINKS = [
  {
    href: "/process/collaboration",
    name: "Collaboration",
    blurb:
      "Proactive and reactive modes, why working with people builds trust, and why anyone can collaborate.",
  },
  {
    href: "/process/accessibility",
    name: "Accessibility",
    blurb:
      "Compliance as meaningful work rather than a checklist, and the constraints that sharpen a design.",
  },
  {
    href: "/ai",
    name: "On AI",
    blurb:
      "How I work with AI day to day, and where I keep it out of the thinking.",
  },
];

export function HomeProcess() {
  return (
    <section id="inner-workings" aria-labelledby="inner-workings-heading" className="py-20">
      <div className="mx-auto max-w-page px-6">
        <h2
          id="inner-workings-heading"
          className="text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-foreground"
        >
          My inner workings
        </h2>

        {/*
          Three across from `md`, one below. `items-stretch` so a card with a
          shorter blurb still matches its row rather than leaving a ragged foot.
        */}
        <ul className="mt-8 grid items-stretch gap-4 md:grid-cols-3">
          {LINKS.map((link) => (
            <li key={link.href} className="flex">
              {/*
                The whole card is the link, not a "read more" inside it: one
                target, and it's the size of the block rather than two words.
              */}
              <Link
                href={link.href}
                className="group flex w-full flex-col rounded-lg border border-border bg-background-alt p-5 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
              >
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  {link.name}
                  <span
                    aria-hidden="true"
                    className="text-brand-weak transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </span>
                <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-foreground-muted">
                  {link.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
