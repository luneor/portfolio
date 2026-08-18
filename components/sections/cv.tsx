/*
  Bullets carry their own bold lead-in label (matches the source CV, and the
  site's existing habit of bolding the one thing a reader's eye should land
  on, see `Emph` in lib/projects.tsx), rather than a plain sentence.
*/
const genioBullets = [
  {
    label: "Stakeholder management",
    body: `Worked on a project where I had to cover PM responsibilities during a teammate's leave. Pushed back against an initial complex solution from leadership stakeholders in favour of something simpler, balancing stakeholder needs against product complexity. The first customer group was live within hours of deploy, and 27 organisations adopted the feature within days.`,
  },
  {
    label: "Team collaboration and process improvement",
    body: `Introduced a lightweight, asynchronous feedback workflow for the UX team, replacing the in-person "quick question" habit lost to remote work. I purposefully built it around clearly framing the problem and exactly what feedback is needed.`,
  },
  {
    label: "Accessibility & inclusive design",
    body: `Took on multiple projects within a major company-wide push for WCAG 2.1 AA compliance, working with stakeholders, including the CEO, on a redesign for our core "audio-capture" interface, balancing colour contrast requirements against cognitive load, while staying available to advise on trickier accessibility issues elsewhere.`,
  },
  {
    label: "Research-led design decisions",
    body: `Took a unique approach to a user-facing filtering feature, offering flexible custom ranges rather than fixed presets. Built a high-fidelity prototype and tested it directly with customers through scenario-based calls, alongside supporting survey data.`,
  },
  {
    label: "Data-informed problem solving",
    body: `Designed several enhancements to the Admin platform. Created a custom effort-modelling calculator to measure user effort on a complex flow via keystrokes, which surfaced edge cases and keyboard-accessibility gaps.`,
  },
  {
    label: "Design systems",
    body: `Contributed to the design system beyond my own feature work: designed the Pill component (now used platform-wide for beta labelling), corrected legacy Admin components to current design system standards, and collaborated with engineering on a new table component.`,
  },
  {
    label: "Senior coverage",
    body: `Trusted as cover for a Senior UX Designer during their paternity leave. Covered their remit alongside my own workload, including weighing in on projects for their team.`,
  },
];

const storiBullets = [
  {
    label: "Human-centred design",
    body: `Designed a calming, user-friendly recording process using gentle colours inspired by children's books and avoiding colours like red, which have negative medical connotations. Created a sensitive onboarding process aimed at offering comfort during a difficult time.`,
  },
  {
    label: "User research & prototyping",
    body: `Designed low- and high-fidelity prototypes and ran user interviews, including with a head neonatal nurse who raised concerns about integrating the tool into existing NHS digital systems, a risk I flagged in my full research report on impact.`,
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
          <div className="divide-y-2 divide-brand-strong">
            <div className="pb-8">
              <CvBlockHeading>Designer Identity</CvBlockHeading>
              <p className="text-foreground">
                I push the boundaries of UX/UI with innovative, human-centred
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
