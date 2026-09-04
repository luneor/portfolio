import Link from "next/link";

/*
  The two writing-led parts of the site, which the work cards above don't reach:
  how the work gets done, and where AI sits in it. Both were nav-only before, so
  a visitor scrolling the homepage had no idea either existed.

  Grouped rather than listed flat. Process is two pages about method and AI is
  one about a position, so putting all three in a single row would imply they
  answer the same kind of question.

  Summaries are drawn from each page's own meta description rather than written
  fresh, so a link can't end up promising something the page doesn't say.
*/
const GROUPS = [
  {
    key: "process",
    heading: "Understand my process",
    intro: "How the work actually gets done, rather than what came out of it.",
    links: [
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
    ],
  },
  {
    key: "ai",
    heading: "Where I stand on AI",
    intro: "Used for pace, never as a way to skip the thinking.",
    links: [
      {
        href: "/ai",
        name: "On AI",
        blurb:
          "How I work with AI day to day, and where I keep it out of the thinking.",
      },
    ],
  },
];

export function HomeProcess() {
  return (
    <section
      id="explore"
      aria-labelledby="explore-heading"
      className="py-20"
    >
      <div className="mx-auto max-w-page px-6">
        {/* The section's own name is for assistive tech only: on screen the two
            group headings below already say what this is, and a third heading
            above them would be a label for a label. */}
        <h2 id="explore-heading" className="sr-only">
          Process and perspective
        </h2>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {GROUPS.map((group) => (
            <div key={group.key}>
              <h3 className="text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.2] font-bold tracking-tight text-foreground">
                {group.heading}
              </h3>
              <p className="mt-3 text-foreground">{group.intro}</p>

              <ul className="mt-6 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {/*
                      The whole card is the link, not a "read more" inside it:
                      one target, and it's the size of the block rather than
                      two words. `block` so the hit area is the full row.
                    */}
                    <Link
                      href={link.href}
                      className="group block rounded-lg border border-border bg-background-alt p-5 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
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
          ))}
        </div>
      </div>
    </section>
  );
}
