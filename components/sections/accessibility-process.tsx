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

        {/*
          Same shape as "Filling the gap" on the Collaboration page: an h3 and
          full-width prose under the three principle cards. The two Process
          pages are built to read as a pair, so the stance is followed by the
          work in both places rather than in one.

          Deliberately about the process and not about a product. The three
          cards above are a stance, and what a reader wants next is what the
          stance makes me DO, which is the same on everything I design. A
          product-by-product account would answer a question nobody asked
          here; the work pages are where a single product belongs.
        */}
        <div className="mt-20">
          <h3 className="text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.2] font-bold tracking-tight text-foreground">
            How this shows up in my work
          </h3>
          {/* Full container width, no measure cap -- the rule SectionHeading
              states for section intros, which is what this is. */}
          <p className="mt-3 text-[1.05rem] text-foreground">
            During the early stages of design I&apos;m already thinking about
            accessibility and WCAG standards. Knowing where that line is lets
            me design up to it, rather than designing it first and finding out
            it doesn&apos;t hold.
          </p>
          <p className="mt-4 text-[1.05rem] text-foreground">
            Colour contrast has to pass, the keyboard experience has to be
            complete, VoiceOver has to make sense of a screen. When I think
            something isn&apos;t right I put it in front of the people who
            would know: the accessibility experts and test engineers I work
            with.
          </p>
        </div>
      </div>
    </section>
  );
}
