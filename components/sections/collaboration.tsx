import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/kokonutui/spotlight-card";

/*
  Same shape as the On AI section: intro prose under the heading, then three
  principle cards in a row. Deliberately the same, so the two Process pages
  read as a pair rather than as two one-off layouts.

  Three cards is what the grid is built for (`md:grid-cols-3`) and what the
  copy happens to be, so nothing had to be padded or dropped to fit.
*/
const principles = [
  {
    key: "proactive-reactive",
    label: "Proactive and reactive collaboration",
    body: "In-person collaboration is proactive, remote collaboration is reactive, meaning you need to be more intentional.",
  },
  {
    key: "trust-belonging",
    label: "Collaboration builds trust and belonging",
    body: "Every problem solved alone or with AI is a missed chance to build trust and belonging in a team.",
  },
  {
    key: "everyone",
    label: "Everyone can collaborate",
    body: "Collaborating isn't limited to designers, some of my sharpest feedback came from people who know nothing about design.",
  },
];

export function Collaboration() {
  return (
    <section
      id="collaboration"
      aria-labelledby="collaboration-heading"
      className="py-24"
    >
      <div className="mx-auto max-w-page px-6">
        <SectionHeading
          title="Collaboration"
          headingId="collaboration-heading"
        >
          <div className="flex flex-col gap-3">
            <p>
              At university, the studio made this easy. I&apos;d lean over and
              ask the person next to me a question about their work, or
              they&apos;d ask me about mine, it just happened. No booking a
              slot, no overthinking it, just proximity and curiosity.
            </p>
            <p>
              Moving to remote work, I quickly realised how much I&apos;d
              relied on that.
            </p>
          </div>
        </SectionHeading>

        {/*
          No `items-start` -- the cards stretch to a shared height, same as On
          AI. That needed overriding while these bodies were three times the
          length of each other; trimmed to roughly even, flush bottoms read
          tidier than three cards of slightly different heights.
        */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {principles.map((p) => (
            <SpotlightCard key={p.key}>
              <h3 className="font-bold tracking-tight text-foreground">
                {p.label}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-foreground">
                {p.body}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
