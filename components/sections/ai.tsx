import { SectionHeading } from "@/components/section-heading";

/*
  Content grounded in Hanru's approved AI stance (see design-brief-prompt.md /
  About). Provisional wording — expected to change — but no new claims invented.
*/
const principles = [
  {
    key: "speed",
    label: "speed, not autopilot",
    body: "I lean on AI for the pace it offers, then verify the decisions it just accelerated — speed is only a win if the thinking survives it.",
  },
  {
    key: "collaboration",
    label: "collaboration first",
    body: "AI shouldn't quietly replace the conversations between real people that make the work good. I use it around that, not instead of it.",
  },
  {
    key: "assumptions",
    label: "no unverified assumptions",
    body: "When a decision rests on something nobody actually checked, that's exactly where I slow down — whether a person or a model produced it.",
  },
];

export function Ai() {
  return (
    <section id="ai" aria-labelledby="ai-heading" className="py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading eyebrow="ways of working" title="On AI" headingId="ai-heading">
          <p>
            I&apos;m genuinely pro-AI — I just refuse to let it skip the parts of
            design that matter. Here&apos;s how I keep it useful without letting
            it drive.
          </p>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {principles.map((p, i) => (
            <div
              key={p.key}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-3 flex items-center gap-2 font-mono text-[0.8rem]">
                <span className="text-brand-weak">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground-muted lowercase">{p.label}</span>
              </div>
              <p className="text-[0.95rem] leading-relaxed text-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
