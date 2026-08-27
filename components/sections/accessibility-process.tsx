import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/kokonutui/spotlight-card";

/*
  Same shape as On AI and On Collaboration: intro prose under the heading, then
  three principle cards. Deliberately identical, so the two Process pages read
  as a pair and both sit in the same family as the AI section.

  Named `accessibility-process` rather than `accessibility` because
  components/sections/accessibility.tsx already exists and is a different
  thing: that one is the work-page section listing the Audio Bubbles case
  study. This is the Process page's stance.
*/
const principles = [
  {
    key: "not-a-checklist",
    label: "Compliance isn't a checklist",
    body: "Complying with accessibility standards shouldn't just be treated as a checklist, it's meaningful work which makes design inclusive.",
  },
  {
    key: "better-design",
    label: "Accessible design is better design",
    body: "Constraints that come with accessible design help to create stronger, more polished designs, not the other way around.",
  },
  {
    key: "new-perspective",
    label: "Accessibility creates a new perspective",
    body: "Putting yourself in the shoes of users who rely on accessibility standards offers a valuable, new perspective.",
  },
];

export function AccessibilityProcess() {
  return (
    <section
      id="accessibility"
      aria-labelledby="accessibility-process-heading"
      className="py-24"
    >
      <div className="mx-auto max-w-page px-6">
        <SectionHeading
          title="Accessibility"
          headingId="accessibility-process-heading"
        >
          <p>
            I used to think accessibility was just best practice, but I
            didn&apos;t realise the impact it had on people when approached
            correctly. After helping to reach WCAG 2.1 AA compliance, my
            opinion changed completely.
          </p>
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
