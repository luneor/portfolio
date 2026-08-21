/*
  Bullets carry their own bold lead-in label (matches the source CV, and the
  site's existing habit of bolding the one thing a reader's eye should land
  on, see `Emph` in lib/projects.tsx), rather than a plain sentence.
*/
const genioBullets = [
  {
    label: "Stakeholder management",
    body: `Stepped up to cover our PM's responsibilities mid-project and pushed back on an overcomplicated leadership-proposed solution in favour of a simpler one. The feature was adopted across 27 organisations within days.`,
  },
  {
    label: "Team collaboration and process improvement",
    body: `Built a lightweight asynchronous feedback workflow for the UX team to replace the in-person "quick question" habit that remote working couldn't offer. It's structured around clearly framing the problem and defining exactly what feedback is needed.`,
  },
  {
    label: "Accessibility & inclusive design",
    body: `Contributed to accessibility work across multiple projects in a company-wide push for WCAG 2.1 AA compliance. This included redesigning our core "audio-capture" interface to balance colour contrast requirements against cognitive load, with input from stakeholders including the CEO.`,
  },
  {
    label: "Research-led design decisions",
    body: `Pitched and validated a flexible custom-range filtering approach over a date picker, backing it with a high-fidelity prototype, scenario-based customer testing, and survey data.`,
  },
  {
    label: "Data-informed problem solving",
    body: `Built a custom effort-modelling calculator to measure user effort across a complex Admin flow, surfacing edge cases and keyboard-accessibility gaps that shaped the redesign.`,
  },
  {
    label: "Design systems",
    body: `Designed the platform-wide Pill component, corrected legacy Admin components to current standards, and partnered with engineering on a new table component.`,
  },
  {
    label: "Senior coverage",
    body: `Trusted as cover for a Senior UX Designer during their paternity leave. Covered their remit alongside my own workload, including weighing in on projects for their team.`,
  },
];

const storiBullets = [
  {
    label: "Human-centred design",
    body: `Designed a calming recording process using colour psychology (avoiding red's medical connotations, drawing on children's book palettes) and a sensitive onboarding flow for a difficult moment in parents' lives.`,
  },
  {
    label: "User research & prototyping",
    body: `Ran user interviews, including with a head neonatal nurse, and built low- to high-fidelity prototypes; flagged the NHS digital-integration risk she raised in my research report.`,
  },
];

const skillGroups = [
  { label: "Design & Prototyping", items: ["Figma"] },
  {
    label: "AI-Assisted Design",
    items: ["AI Prototyping", "Claude/Claude Code", "Google AI Studio"],
  },
  {
    label: "Research & Testing",
    items: [
      "Claude",
      "User interviews",
      "Surveys",
      "Moderated usability testing",
      "Ballpark",
    ],
  },
  { label: "Whiteboarding & Collaboration", items: ["Lucidboard", "Jira"] },
  { label: "Visual Design", items: ["Adobe Illustrator", "Adobe Photoshop"] },
];

const interests = ["Video Games", "Graphic Design"];

function CvBlockHeading({ children }: { children: string }) {
  return (
    <h3 className="mb-4 text-xl font-bold text-foreground">{children}</h3>
  );
}

export function Cv() {
  return (
    <section id="cv" aria-labelledby="cv-heading" className="py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Visually hidden: the nav tab and page title already say "CV", so
            a third repeat added nothing on the page itself. Kept as a real
            heading, not dropped outright, so the section still has the
            accessible name `aria-labelledby` promises assistive tech. */}
        <h2 id="cv-heading" className="sr-only">
          CV
        </h2>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          {/*
            The rule under each heading moved here: a divider between
            sections rather than directly under a title, so it reads as
            "end of Experience" rather than underlining the Experience
            heading itself. `divide-y` only draws between children, so
            there's no stray rule floating above the first section or
            below the last.
          */}
          <div className="divide-y-2 divide-brand-weak">
            <div className="pb-8">
              <CvBlockHeading>Designer Identity</CvBlockHeading>
              <p className="text-foreground">
                I strive to push the boundaries of UX/UI with innovative,
                human-centred
                solutions, own problems end to end and balance what users
                need against business goals and technical constraints,
                always starting from why we&apos;re building something and
                what it will actually mean for the people using it.
                That&apos;s part of why I&apos;m drawn to meaningful work. I
                work well in a team, and communication is something
                I&apos;ve deliberately built into a real strength: sharing
                work early and often, welcoming opinions from anyone in the
                room, and looking at a project from as many angles as I can
                before we commit to a direction.
              </p>
            </div>

            <div className="py-8">
              <CvBlockHeading>Experience</CvBlockHeading>

              <div className="mb-6">
                <strong className="text-[1.05rem] text-foreground">
                  Junior UX Designer, Genio
                </strong>
                <div className="mb-2 text-[0.85rem] text-foreground-muted italic">
                  June 2025 – Present
                </div>
                <p className="text-foreground">
                  Design lead within my squad, working closely with a
                  Product Manager (PM), Tech Lead, and Product Marketing
                  Manager. I own UX for Genio Admin, the B2B SaaS platform
                  organisations use to manage their access to Genio Notes,
                  our flagship product for students.
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  {genioBullets.map(({ label, body }) => (
                    <li key={label} className="text-foreground">
                      <strong className="font-semibold text-foreground">
                        {label}:
                      </strong>{" "}
                      {body}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-[1.05rem] text-foreground">
                  UX Designer, University of Dundee
                </strong>
                <div className="mb-2 text-[0.85rem] text-foreground-muted italic">
                  January 2025 – June 2025
                </div>
                <p className="text-foreground">
                  Selected to continue a 3rd-year concept into &ldquo;Tell
                  Me a Story&rdquo;, a research project for NHS neonatal
                  units, aimed at reducing communication barriers between
                  parents and their neonatal babies for when they
                  couldn&apos;t be with them in person.
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  {storiBullets.map(({ label, body }) => (
                    <li key={label} className="text-foreground">
                      <strong className="font-semibold text-foreground">
                        {label}:
                      </strong>{" "}
                      {body}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="py-8">
              <CvBlockHeading>Skills</CvBlockHeading>
              <div className="flex flex-col gap-1.5">
                {skillGroups.map((group) => (
                  <div key={group.label}>
                    <span className="font-semibold text-foreground">
                      {group.label}:
                    </span>{" "}
                    <span className="text-foreground-muted">
                      {group.items.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-8">
              <CvBlockHeading>Education</CvBlockHeading>
              <div className="mb-6">
                <strong className="text-[1.05rem] text-foreground">
                  BSc (Hons) Digital Interaction Design, 1st Class
                </strong>
                <div className="mb-2 text-[0.85rem] text-foreground-muted italic">
                  University of Dundee · 2021–2024
                </div>
                <p className="text-foreground">
                  University is where I properly developed as a
                  collaborator, making full use of the studio space to
                  engage with other students&apos; work and invite them
                  into mine, and where I took every chance to work across
                  disciplines, blending physical and digital interactions.
                  It&apos;s also where I found my interest in pushing at
                  the edges of a project: what&apos;s actually possible
                  within its constraints, and how those constraints can be
                  used to push a design forward rather than limit it. My
                  final year gave me a genuinely open creative brief with
                  full freedom over the project, and that is where I
                  learned I like to go beyond the surface, not just how
                  something looks, but what it actually means for someone
                  using it. My honours project, a calendar app built around
                  a fluid, handcrafted interface, is the clearest example:
                  it went past a visual overhaul to get people thinking
                  about their own relationship with time, productivity, and
                  the present.
                </p>
              </div>
              <div>
                <strong className="text-[1.05rem] text-foreground">
                  HND User Experience Design, Distinction
                </strong>
                <div className="mb-2 text-[0.85rem] text-foreground-muted italic">
                  Edinburgh College · 2019–2021
                </div>
                <p className="text-foreground">
                  Where I learned the fundamentals: the double diamond
                  process, the core laws of UX, layout principles, how to
                  break down a brief, and how to get from a brief to a
                  low-fidelity prototype. Worked on real-world briefs
                  throughout, including entering design competitions like
                  D&amp;AD, which pushed my work to hold up against an
                  external, industry-facing standard rather than just a
                  classroom one.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <CvBlockHeading>Achievements &amp; Interests</CvBlockHeading>
              <div className="mb-4">
                <strong className="text-[1.05rem] text-foreground">
                  Field Hockey
                </strong>
                <div className="text-foreground">
                  University of Dundee Men&apos;s Hockey 1st Team
                </div>
                <div className="text-[0.85rem] text-foreground-muted">
                  Vice Captain 2022–2023
                </div>
                <div className="text-[0.85rem] text-foreground-muted">
                  Captain 2023–2024
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {interests.map((interest) => (
                  <strong
                    key={interest}
                    className="text-[1.05rem] text-foreground"
                  >
                    {interest}
                  </strong>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
