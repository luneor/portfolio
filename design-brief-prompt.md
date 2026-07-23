# Portfolio Build Prompt — Hanru Wehmeyer, UX Designer

Build a static portfolio website and a CV (PDF + on-site page) for a UX Designer named Hanru Wehmeyer. All content below is approved — write connective/transitional copy in the same voice if needed, but don't invent new claims.

## Tech

Plain static HTML/CSS/JS, no framework, no build step, so it can be dragged straight onto Vercel's (or any) free static host. Single-page site with anchor-linked sections: Home/Hero, Genio Admin work, Exploring, Earlier Projects, About, CV, Contact. Fully responsive, semantic HTML, strong accessibility (proper heading hierarchy, alt text, visible focus states, solid colour contrast — this person cares a lot about accessibility, so it should be more than an afterthought).

## Visual direction

Evolve, don't replace, the look of her old site (hanruwehmeyer.framer.website): large hero portrait, clean minimal sans-serif type, generous whitespace, simple project cards. Warm coral-orange accent (~#F2825C) plus near-black text on a light neutral/cream background, used sparingly (labels, buttons, borders), not as big colour blocks. Modern and confident, not corporate.

Where a project has no real screenshot yet (Memor, Stori, Dissertation, Five Whys, and any others), use tasteful abstract CSS/SVG placeholder art (gradient or geometric pattern in the accent palette, project name overlaid) rather than stock photography, with a code comment flagging it as a placeholder to swap later.

## Hero

Headline: "UX Designer at Genio, shaping how educators manage and understand their students at scale."

Subhead: she defaults to asking *why* before *how*, on feature decisions and on her own use of AI in the design process — pro-AI, but wary of it skipping authentic collaboration or letting decisions run ahead on unverified assumptions.

## Section: Genio Admin (grouped case studies, current professional work)

Intro line: she designs admin tooling for academic institutions, and increasingly pushes Admin beyond a purely utilitarian feel toward something considered and pleasant to use for its full range of users (internal super admins/support staff, organisation admins, account managers).

**Card 1 — Last Active Filtering**
- Problem: Admin-facing "last active" data was stagnant and binary — institutions had no way to define what "active" actually meant for their own students, so at-risk students blended into the noise.
- Approach: Used RAG-coded status categories (Active / At Risk / Inactive / No Data), and critically, let admins set their own custom week-thresholds for each category rather than imposing one fixed definition of "active" across every institution.
- Outcome: Strong adoption, plus admins recording and sharing videos unprompted showing appreciation for the feature — validation that wasn't solicited.
- Audience: admins at academic institutions (school/university staff, not consumers).

**Card 2 — Feature Toggles for AI Tools**
- Problem: AI tools within Genio Notes can conflict with a course or institution's academic policy, but some individual students genuinely need that support.
- Approach: Designed a two-tier control model — an org-wide baseline setting plus group-level overrides — across the 3 AI features Notes currently ships, so institutions set policy but individual groups (e.g. a course with different needs) can override it.
- Outcome: A student who needs the support isn't blocked by a blanket policy decision made elsewhere in the org.

**Card 3 — Admin Home Page (in progress / process exploration)**
Mark clearly as "Ongoing — revisiting in H2," lighter-weight than the other cards, explicitly current thinking rather than a shipped result. Framing: giving admins the tools to build efficient, seamless workflows on their home page.

**Card 4 — Audio Bubbles: Accessibility-Driven Redesign**
- Problem: The audio-capture interface ("bubbles") failed WCAG 2.1 AA colour contrast requirements, but a straightforward contrast fix risked making the redesign visually loud and cognitively heavy for what's meant to be a lightweight, background UI element.
- Process: Iterated through many design directions over an extended back-and-forth, working closely with stakeholders including direct input from the CEO. Rather than defaulting to consensus, she pushed for the specific direction she believed was right and managed the process through to a concrete decision.
- Solution: More compact sizing; added a border that met contrast requirements without relying on heavier colour; reduced the connecting line to 1px for a sharper, more modern feel.
- Outcome: A WCAG 2.1 AA–compliant component that reads as light and sleek rather than muddy — appropriate for a quiet background feature.

## Section: Exploring (isolated conceptual work — explicitly NOT attributed to her employer)

**Card — working title "Five Whys" (or propose a cleaner title):** a Genio-Notes-adjacent learning-space concept built around autonomy and progressive disclosure. Students reveal one important sentence/concept at a time, then are prompted to articulate *why* that piece matters, borrowing the "5 Whys" root-cause technique to build genuine understanding rather than passive reading. Mark clearly as an independent concept exploration, still taking shape, not shipped or employer-attributed.

## Section: Earlier Projects (visual refresh only — don't restructure the underlying claims)

- **Memor** — a conceptual app focused on reducing productivity guilt and promoting mindfulness.
- **Stori** — began as a 3rd-year university project on neonatal experiences; after graduating she was contacted and selected (sponsored by Sarra Hoy) to continue it as a proof-of-concept research project targeting NHS neonatal units, enabling parents to send recorded audio messages to premature/hospitalised infants for nurses to play back. She designed low- and high-fidelity prototypes, ran user interviews, analysed results, and authored a full research report. Status: her portion of the work is complete; progress on the wider initiative has slowed since (started Sept 2024). Frame honestly as "paused," not abandoned or failed.
- **Honours Dissertation** — investigated gamification's effect on motivation in exercise apps and how to improve its implementation; produced usage guidelines plus her own user-tested gamified feature concept.

## About section (site)

Lead with the why/AI stance, then facts, then interests — in that order:

> I ask why more than I ask how. Before a feature, a workflow, or a piece of AI-generated output gets signed off, I want to know why we're doing it this way, and whether that reasoning actually holds up. That same instinct shapes how I use AI: I lean into it for the speed it offers, but I stay wary of what speed quietly skips — authentic collaboration between people, and decisions that hold up because they've been checked, not just assumed.
>
> I'm 26, based in Scotland, and I've been a UX Designer at Genio since June 2025, designing admin tools that give educators real control over how they support students.
>
> Outside of work: graphic design, video games, and field hockey.

Do **not** mention the word "Junior" anywhere on the site.

## Contact

Simple front-end-only section/form (name/email/message), no backend — flag with a comment that a form service like Formspree needs wiring up. Include email and LinkedIn links (placeholders: `[EMAIL]`, `[LINKEDIN]`).

---

## CV content (on-site CV page + downloadable PDF, same visual system as the rest of the site; PDF should use the warm orange/near-black CV style)

**Header:** Hanru Wehmeyer — UX Designer — Scotland — [portfolio link] — [EMAIL] — [LINKEDIN]

**Profile** (professional positioning, kept concise):
> UX Designer shaping how educators manage and understand their students at scale, currently designing admin tooling at Genio.

**Experience**

*UX Designer, Genio* — June 2, 2025–Present, Full-time
(Contract title is "Junior UX Designer" — include it, small/quiet type, since some HR/recruiter processes cross-check titles, but don't lead with it or emphasize it; the bullets carry the weight.)
- Played a lead UX role in reaching WCAG 2.1 AA compliance, including a complex redesign of the audio-capture ("audio bubbles") interface, balancing colour contrast requirements against cognitive load through many iterations, with input up to CEO level, and pushed for the specific direction she believed was right through to a concrete decision.
- Operates as design lead within a cross-functional squad trio (product manager, tech lead, engineering manager), including stepping up to cover core PM responsibilities during an absence: consolidating scattered stakeholder input into a single source of truth and driving the squad to a concrete direction during a period of shifting priorities.
- Introduced a lightweight, asynchronous feedback workflow for the UX team, replacing the in-person "quick question" habit lost to remote work, structured around clearly framing the problem and narrowing exactly what feedback is being sought.
- Consistently pushes teams to interrogate the why behind a feature request or technical shortcut before committing to a how, keeping decisions grounded in verified user need rather than convenience or assumption.
- Designs for Admin's full range of users (internal super admins, organisation admins, account managers), pushing the platform beyond a purely utilitarian feel toward something considered and pleasant to use.
- Refreshed App Store assets with a sharper, more CTA-driven design than previous versions.

*UX Research & Prototyping, University of Dundee* (Stori project, NHS-sponsored) — Sept 2024–2024 (end date unconfirmed)
- Selected to continue a 3rd-year concept into a sponsored research project targeting NHS neonatal units, enabling parents to send recorded audio messages to premature/hospitalised infants.
- Designed low- and high-fidelity prototypes, ran user interviews, analysed findings, and authored a full research report on impact.

No retail/delivery jobs (Clarks, NEXT) — confirmed removed entirely.

**Skills:** Figma, Lucidboard, Jira (cross-squad), FigJam, Adobe Illustrator, Adobe Photoshop, Claude, Google AI Studio

**Education:**
BSc (Hons) Digital Interaction Design, 1st Class, University of Dundee (2021–2024)
HND User Experience Design, A Grade, Edinburgh College (2019–2021)

**About Me** (personal/philosophy section, distinct from Profile — mirrors the site About's lead paragraph):
> I ask why more than I ask how, on feature decisions, on process, on the tools I reach for. That instinct extends to AI: I use it deliberately for the speed it offers, but I stay wary of what speed quietly skips — authentic collaboration between people, and decisions that hold up because they've been verified, not just assumed.

**Achievements & Interests:** Dundee Uni Men's Hockey 1st XI Captain (2024); graphic design, mixed media art, data visualisation, field hockey, travel, video games, music

---

## Outstanding placeholders (flag, don't block on)

- Real email address and LinkedIn URL (currently `[EMAIL]` / `[LINKEDIN]`)
- Contact form backend (Formspree or similar)
- Final portfolio domain/link
- Real screenshots for the 5 project cards (currently placeholder art)
- Stori project end date (start confirmed as Sept 2024)
