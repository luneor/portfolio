import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/kokonutui/spotlight-card";

/*
  Content grounded in Hanru's approved AI stance (see design-brief-prompt.md /
  About). Provisional wording, expected to change, but no new claims invented.
*/
const principles = [
  {
    key: "speed",
    label: "speed, not autopilot",
    body: "I lean on AI for the pace it offers, then question if it's the right thing. Speed is only a win if the thinking survives it.",
  },
  {
    key: "sounding-board",
    label: "sounding board only",
    body: "AI's genuinely useful for thinking out loud. But belonging and trust is earned from collaborating with others.",
  },
  {
    key: "pushback",
    label: "pushback is important",
    body: "AI's always willing to run with my ideas. But agreement that costs it nothing isn't worth much, so I build the pushback in myself.",
  },
];

export function Ai() {
  return (
    <section id="ai" aria-labelledby="ai-heading" className="py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading title="On AI" headingId="ai-heading">
          <p>
            I&apos;m <strong className="font-semibold">genuinely pro-AI</strong>. I just
            won&apos;t let it skip the parts of design that matter.
          </p>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {principles.map((p, i) => (
            <SpotlightCard key={p.key}>
              <h3 className="font-bold tracking-tight text-foreground">
                {i + 1}. {p.label}
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
