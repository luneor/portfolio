import ParticleButton from "@/components/kokonutui/particle-button";

const genioBullets = [
  `Played a lead UX role in reaching WCAG 2.1 AA compliance, including a complex redesign of the audio-capture ("audio bubbles") interface, balancing colour contrast requirements against cognitive load through many iterations, with input up to CEO level, and pushed for the specific direction I believed was right through to a concrete decision.`,
  `Operate as design lead within a cross-functional squad trio (product manager, tech lead, engineering manager), including stepping up to cover core PM responsibilities during an absence: consolidating scattered stakeholder input into a single source of truth and driving the squad to a concrete direction during a period of shifting priorities.`,
  `Introduced a lightweight, asynchronous feedback workflow for the UX team, replacing the in-person "quick question" habit lost to remote work, structured around clearly framing the problem and narrowing exactly what feedback is being sought.`,
  `Consistently push teams to interrogate the why behind a feature request or technical shortcut before committing to a how, keeping decisions grounded in verified user need rather than convenience or assumption.`,
  `Design for Admin's full range of users (internal super admins, organisation admins, account managers), pushing the platform beyond a purely utilitarian feel toward something considered and pleasant to use.`,
  `Refreshed App Store assets with a sharper, more CTA-driven design than previous versions.`,
];

const storiBullets = [
  `Selected to continue a 3rd-year concept into a sponsored research project targeting NHS neonatal units, enabling parents to send recorded audio messages to premature or hospitalised infants.`,
  `Designed low- and high-fidelity prototypes, ran user interviews, analysed findings, and authored a full research report on impact.`,
];

const skills = [
  "Figma",
  "Lucidboard",
  "Jira (cross-squad)",
  "FigJam",
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Claude",
  "Google AI Studio",
];

const interests = [
  "Graphic design",
  "Mixed media art",
  "Data visualisation",
  "Field hockey",
  "Travel",
  "Video games",
  "Music",
];

function CvBlockHeading({ children }: { children: string }) {
  return (
    <h3 className="mb-4 border-b-2 border-brand-strong pb-1.5 text-xl font-bold text-foreground">
      {children}
    </h3>
  );
}

export function Cv() {
  return (
    <section id="cv" aria-labelledby="cv-heading" className="py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="cv-heading"
              className="text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-brand-weak"
            >
              CV
            </h2>
          </div>
          <ParticleButton
            size="lg"
            nativeButton={false}
            className="h-11 px-6 text-[0.95rem]"
            render={<a href="/Hanru_Wehmeyer_CV.pdf" download />}
          >
            Download PDF
          </ParticleButton>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <div className="mb-8">
            <CvBlockHeading>Profile</CvBlockHeading>
            <p className="text-foreground">
              UX Designer shaping how educators manage and understand their
              students at scale, currently designing admin tooling at Genio.
              I default to asking why before how, on feature decisions, on
              process, on tooling. That same instinct shapes my view on AI in
              design: I use it deliberately, but I&apos;m wary of it
              replacing authentic collaboration or letting a project drift on
              assumptions nobody&apos;s verified.
            </p>
          </div>

          <div className="mb-8">
            <CvBlockHeading>Experience</CvBlockHeading>

            <div className="mb-6">
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <strong className="text-[1.05rem] text-foreground">
                  UX Designer, Genio
                </strong>
                <span className="text-[0.85rem] whitespace-nowrap text-foreground-muted">
                  June 2, 2025 – Present · Full-time
                </span>
              </div>
              <p className="text-[0.78rem] text-foreground-muted italic">
                Contract title: Junior UX Designer.
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {genioBullets.map((bullet) => (
                  <li key={bullet.slice(0, 24)} className="text-foreground">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <strong className="text-[1.05rem] text-foreground">
                  UX Research &amp; Prototyping, University of Dundee
                </strong>
                <span className="text-[0.85rem] whitespace-nowrap text-foreground-muted">
                  Sept 2024–2024 · Stori project, NHS-sponsored
                </span>
              </div>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {storiBullets.map((bullet) => (
                  <li key={bullet.slice(0, 24)} className="text-foreground">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <CvBlockHeading>Skills</CvBlockHeading>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-border bg-background-alt px-3 py-1.5 text-[0.85rem] text-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <CvBlockHeading>Education</CvBlockHeading>
            <div className="mb-3">
              <strong className="text-[1.05rem] text-foreground">
                BSc (Hons) Digital Interaction Design, 1st Class
              </strong>
              <div className="text-[0.85rem] text-foreground-muted italic">
                University of Dundee · 2021–2024
              </div>
            </div>
            <div>
              <strong className="text-[1.05rem] text-foreground">
                HND User Experience Design, A Grade
              </strong>
              <div className="text-[0.85rem] text-foreground-muted italic">
                Edinburgh College · 2019–2021
              </div>
            </div>
          </div>

          <div className="mb-8">
            <CvBlockHeading>About Me</CvBlockHeading>
            <p className="text-foreground">
              I ask why more than I ask how, on feature decisions, on
              process, on the tools I reach for. That instinct extends to
              AI: I use it deliberately for the speed it offers, but I stay
              wary of what speed quietly skips, authentic collaboration
              between people, and decisions that hold up because they&apos;ve
              been verified, not just assumed.
            </p>
          </div>

          <div>
            <CvBlockHeading>Achievements &amp; Interests</CvBlockHeading>
            <p className="mb-2 text-foreground">
              Dundee Uni Men&apos;s Hockey 1st XI Captain (2024)
            </p>
            <ul className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <li
                  key={interest}
                  className="rounded-md border border-border bg-background-alt px-3 py-1.5 text-[0.85rem] text-foreground"
                >
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
