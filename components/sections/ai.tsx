import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/kokonutui/spotlight-card";

/*
  Content grounded in Hanru's approved AI stance (see design-brief-prompt.md /
  About). Provisional wording, expected to change, but no new claims invented.
*/
const principles = [
  {
    key: "speed",
    label: "Speed, not autopilot",
    body: "I lean on AI for the pace it offers, then question if it's the right thing. Speed is only a win if the thinking survives it.",
  },
  {
    key: "sounding-board",
    label: "Thinking partner, not a peer",
    body: "AI's genuinely useful for thinking out loud. But belonging and trust is earned from collaborating with others.",
  },
  {
    key: "pushback",
    label: "Pushback is important",
    body: "AI's always willing to run with my ideas. But agreement that costs it nothing isn't worth much, so I build the pushback in myself.",
  },
];

export function Ai() {
  return (
    <section id="ai" aria-labelledby="ai-heading" className="py-24">
      <div className="mx-auto max-w-page px-6">
        <SectionHeading title="AI" headingId="ai-heading">
          <div className="flex flex-col gap-3">
            <p>
              It&apos;s become part of how I actually work: AI-assisted
              prototyping in Figma, Claude for research synthesis and for
              helping build this very site, Google AI Studio for exploring
              ideas quickly. I reach for it because good design needs speed:
              iterating faster, testing more ideas, throwing more away.
            </p>
            <p>
              That said, I&apos;ve learned some lessons along the way, and I
              keep questioning why I&apos;m reaching for it when I do.
            </p>
          </div>
        </SectionHeading>

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
