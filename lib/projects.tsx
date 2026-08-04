import type { ComponentType } from "react";
import {
  LastActiveArt,
  FeatureTogglesArt,
  AdminHomeArt,
  AudioBubblesArt,
  FiveWhysArt,
  MemorArt,
  StoriArt,
  DissertationArt,
} from "@/components/project-art";

/**
 * Snapshot / header block for a case study — the at-a-glance facts plus a
 * one-line problem → outcome statement. Every field is optional; unknown
 * facts are simply left out rather than invented.
 */
export interface CaseStudySnapshot {
  role?: string;
  timeline?: string;
  team?: string;
  tools?: string;
  /** One-line problem → outcome statement. */
  statement?: React.ReactNode;
  /** Optional short overview paragraph (relocated from older "Overview" copy). */
  overview?: React.ReactNode;
}

/**
 * One key judgment call on the project. The heading should preview the actual
 * decision (e.g. "Cut onboarding to one step"), never a generic "Decision 1".
 */
export interface Decision {
  heading: string;
  body: React.ReactNode;
}

/**
 * A real image asset in `public/work/<slug>/`. Intrinsic `width`/`height`
 * are required so next/image can reserve space and avoid layout shift.
 * Sourced from the archived Framer portfolio (hanruwehmeyer.framer.website).
 */
export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Project {
  slug: string;
  section: "genio-admin" | "exploring" | "earlier-projects";
  art: ComponentType;
  tag: string;
  tagMuted?: boolean;
  title: string;
  /** Short one-liner shown on the compact card. */
  summary: string;

  /*
    Standardised case-study sections, rendered in this order on the detail
    page and mirrored by the sidebar table of contents. Each is optional so a
    project with no content yet still renders a valid (shorter) page — the TOC
    lists only the sections actually present.
  */
  /** 1. Snapshot: role, timeline, team, tools, problem → outcome statement. */
  snapshot?: CaseStudySnapshot;
  /** 2. Problem: context and the real constraint. */
  problem?: React.ReactNode;
  /** 3. Decisions: 1–3 key judgment calls, each with a specific heading. */
  decisions?: Decision[];
  /** 4. Shipped: the final solution. */
  shipped?: React.ReactNode;
  /** 5. Outcome: result / impact. */
  outcome?: React.ReactNode;
  /** 6. Reflection: one line on what you'd change or learned. */
  reflection?: React.ReactNode;

  /** Wide hero image shown at the top of the detail page in place of the SVG art. */
  cover?: ProjectImage;
  /** Case-study imagery rendered as a captioned column under "Shipped". */
  gallery?: ProjectImage[];
}

export const PROJECTS: Project[] = [
  {
    slug: "last-active-filtering",
    section: "genio-admin",
    art: LastActiveArt,
    tag: "Case study",
    title: "Last Active Filtering",
    summary:
      'Custom, admin-defined thresholds for what "active" means at each institution.',
    snapshot: {
      role: "UX Designer — Genio Admin (BEAR Squad)",
      // TODO: timeline, team, tools
      statement:
        'Binary "last active" data hid at-risk students, so I let each institution define "active" for itself — adopted strongly enough that admins sent unprompted thank-you videos.',
    },
    problem:
      'Admin-facing "last active" data was stagnant and binary. Institutions had no way to define what "active" actually meant for their own students, so at-risk students blended into the noise.',
    decisions: [
      {
        heading: 'Let admins define what "active" means',
        body: 'I introduced RAG-coded status categories — Active, At Risk, Inactive, No Data — and, critically, let admins set their own custom week-thresholds for each category, rather than imposing one fixed definition of "active" across every institution.',
      },
    ],
    outcome:
      "Strong adoption, plus admins recording and sharing videos unprompted showing appreciation for the feature — validation that wasn't solicited.",
  },
  {
    slug: "feature-toggles-for-ai-tools",
    section: "genio-admin",
    art: FeatureTogglesArt,
    tag: "Case study",
    title: "Feature Toggles for AI Tools",
    summary:
      "A two-tier control model so institution-wide policy doesn't block the students who need support.",
    snapshot: {
      role: "UX Designer — Genio Notes (BEAR Squad)",
      // TODO: timeline, team, tools
      statement:
        "Institution-wide AI policy risked blocking the students who most needed support, so I split control into an org baseline plus group-level overrides.",
    },
    problem:
      "AI tools within Genio Notes can conflict with a course or institution's academic policy — but some individual students genuinely need that support.",
    decisions: [
      {
        heading: "Split control into org baseline plus group overrides",
        body: "I designed a two-tier control model — an org-wide baseline setting plus group-level overrides — across the three AI features Notes currently ships, so institutions set policy while individual groups (a course with different needs, for example) can override it.",
      },
    ],
    outcome:
      "A student who needs the support isn't blocked by a blanket policy decision made elsewhere in the organisation.",
  },
  {
    slug: "admin-home-page",
    section: "genio-admin",
    art: AdminHomeArt,
    tag: "Ongoing — revisiting in H2",
    tagMuted: true,
    title: "Admin Home Page",
    summary:
      "Current thinking, not a shipped result: efficient, seamless workflows on the admin home page.",
    snapshot: {
      role: "UX Designer — Genio Admin (BEAR Squad)",
      timeline: "Ongoing — revisiting in H2 2026",
      // TODO: team, tools
      statement:
        "Admins lack a home page that lets them build their own efficient workflows; this is in-progress thinking rather than a shipped result.",
    },
    problem:
      "Current thinking, not a shipped result: giving admins the tools to build efficient, seamless workflows on their home page. I'm revisiting this properly in the second half of the year, so consider this a snapshot of process rather than a finished case study.",
    // TODO: decisions, shipped, outcome, reflection — pending the H2 revisit.
  },
  {
    slug: "audio-bubbles",
    section: "genio-admin",
    art: AudioBubblesArt,
    tag: "Case study",
    title: "Audio Bubbles: Accessibility-Driven Redesign",
    summary:
      "Getting a lightweight, background UI element to WCAG 2.1 AA without making it visually loud.",
    snapshot: {
      role: "Lead UX role on accessibility compliance — Genio",
      // TODO: timeline, team, tools
      statement:
        "A background audio component failed WCAG 2.1 AA, and the obvious contrast fix made it loud — so I met contrast with borders and weight instead of colour, landing AA without the muddiness.",
    },
    problem:
      "The audio-capture interface (\"bubbles\") failed WCAG 2.1 AA colour contrast requirements — but a straightforward contrast fix risked making the redesign visually loud and cognitively heavy for what's meant to be a lightweight, background UI element.",
    decisions: [
      {
        heading: "Meet contrast with borders, not heavier colour",
        body: "Rather than deepening fills to force contrast, I used a border that met requirements without relying on heavier colour, brought the sizing in tighter, and reduced the connecting line to 1px for a sharper, more modern feel.",
      },
      {
        heading: "Push one direction through to a decision, not consensus",
        body: "I iterated through many design directions over an extended back-and-forth, working closely with stakeholders including direct input from the CEO. Rather than defaulting to consensus, I pushed for the specific direction I believed was right and managed the process through to a concrete decision.",
      },
    ],
    shipped:
      "More compact sizing; a border that met contrast requirements without relying on heavier colour; the connecting line reduced to 1px for a sharper, more modern feel.",
    outcome:
      "A WCAG 2.1 AA–compliant component that reads as light and sleek rather than muddy — appropriate for what should be a quiet background feature.",
    // TODO: reflection — one line on what you'd change or learned.
  },
  {
    slug: "five-whys",
    section: "exploring",
    art: FiveWhysArt,
    tag: "Independent concept — still taking shape",
    tagMuted: true,
    title: "Five Whys",
    summary:
      "A Genio-Notes-adjacent learning-space concept built around autonomy and progressive disclosure.",
    snapshot: {
      role: "Independent concept — self-directed",
      // TODO: timeline, team, tools
      statement:
        "Passive reading builds little real understanding, so this concept reveals one idea at a time and asks students why it matters.",
      overview: (
        <>
          <em>Working title.</em> An independent concept exploration, not a
          shipped or employer-attributed project.
        </>
      ),
    },
    problem:
      "Reading through material front-to-back is passive: students can finish a page having absorbed very little, with no moment that forces them to articulate why any of it matters.",
    decisions: [
      {
        heading: "Reveal one concept at a time, then ask why it matters",
        body: (
          <>
            A Genio-Notes-adjacent learning-space concept built around autonomy
            and progressive disclosure. Students reveal one important sentence
            or concept at a time, then are prompted to articulate{" "}
            <em>why</em> that piece matters — borrowing the &quot;5 Whys&quot;
            root-cause technique to build genuine understanding rather than
            passive reading.
          </>
        ),
      },
    ],
    // TODO: shipped, outcome, reflection — concept is still taking shape.
  },
  {
    slug: "memor",
    section: "earlier-projects",
    art: MemorArt,
    tag: "Concept",
    tagMuted: true,
    title: "Memor",
    summary:
      "A conceptual app focused on reducing productivity guilt and promoting mindfulness.",
    cover: {
      src: "/work/memor/m-13.png",
      alt: "Overview of Memor's screens — the fluid clock-calendar, blunt notifications, a weekly view, and the three tone-of-voice profiles.",
      width: 1200,
      height: 675,
    },
    snapshot: {
      role: "Concept, research, UX & UI design — self-directed",
      // TODO: timeline, team, tools
      statement:
        "Productivity apps reinforce guilt by maximising output, so Memor reframes the calendar as a fluid, mindful shape with a voice that talks to you like a friend.",
      overview:
        "Memor is a conceptual app for overcoming productivity guilt and understanding the value of a mindful approach to work. In place of rigid schedules and task lists, it pairs a reinvented, fluid calendar with interchangeable tone-of-voice profiles that keep the focus on well-being, self-reflection, and work-life balance.",
    },
    problem:
      "Many people struggle with productivity guilt — the sense that they're never doing \"enough,\" and a nagging worry about wasting time. Traditional productivity apps reinforce that feeling by maximising output rather than cultivating a sustainable, fulfilling relationship with work and daily life. Research sharpened the real constraint: digital calendars offer flexibility while physical ones offer visibility, and running IDEO's \"Five Whys\" with several people surfaced the same roots each time — productivity, not letting people down, and a general desire to feel in control.",
    decisions: [
      {
        heading: "Make the calendar a fluid shape, not a grid",
        body: "I transformed a static, geometric layout into a fluid, organic shape, keeping a clock face so it stays familiar rather than alien. Events appear as circles around the perimeter at their scheduled hours and blend into the base shape to suggest flexibility in timing; larger circles mean longer events. Adding and removing events is animated to feel dynamic, and the 12/24-hour format is replaced with a simple 0–23 scale to discourage rigidity around time.",
      },
      {
        heading: "Drop \"App Talk\" for a brutally honest voice",
        body: "I pushed back on \"App Talk\" — the habit of being relentlessly nice to keep users engaged, which does little for real motivation. Instead I explored a brutally honest voice, like a good friend who keeps you in check. Realising bluntness wouldn't suit everyone, I built three interchangeable profiles: The Brutally Honest (a kick up the backside), The Bestie (wholesome \"you can do it\" support), and The Storyteller (something a little more playful).",
      },
      {
        heading: "Stack the daily shape into a week",
        body: "Testing showed the concept needed to compete with existing calendars, so I added a weekly view built by stacking the daily shape into a swipeable week rather than inventing a second visual language. This unexpectedly made weekly trends visible and gave a fresh perspective on how a week is really spent.",
      },
    ],
    shipped:
      "A conceptual app pairing the fluid 0–23 clock-calendar with event circles, animated event management, three interchangeable tone-of-voice profiles, a stacked weekly view, and a notes section — presented as high-fidelity prototypes.",
    outcome:
      "User testing praised the calendar as innovative, easy to understand, and effective at combatting feeling overwhelmed — the interventions were seen as genuinely denouncing productivity guilt. The Brutally Honest voice landed hardest, though profiles were sometimes hard to tell apart, and grey events felt unappealing.",
    reflection:
      "The three tone-of-voice profiles were hard to tell apart in testing — given another pass I'd differentiate them much more sharply, and revisit the grey used for events.",
    gallery: [
      {
        src: "/work/memor/m-04.png",
        alt: "A chat-style exchange applying the Five Whys technique to why people use calendars.",
        width: 1055,
        height: 1200,
        caption: "Research — running IDEO's \"Five Whys\" to reach the real reasons behind calendar use.",
      },
      {
        src: "/work/memor/m-03.jpg",
        alt: "A physical paper desk calendar with handwritten notes propped on a windowsill.",
        width: 1200,
        height: 800,
        caption: "Physical calendars trade flexibility for visibility — the tension Memor set out to resolve.",
      },
      {
        src: "/work/memor/m-08.png",
        alt: "A blue organic blob sitting inside a twelve-point clock face.",
        width: 974,
        height: 975,
        caption: "Turning a static, geometric layout into a fluid organic shape — kept familiar by the clock face.",
      },
      {
        src: "/work/memor/m-01.png",
        alt: "Memor's main screen: the fluid clock-calendar with a blunt message and a main menu.",
        width: 540,
        height: 1200,
        caption: "The main screen — events as circles around the hours, with a characteristically blunt nudge.",
      },
      {
        src: "/work/memor/m-05.png",
        alt: "Two Memor notifications written in a brutally honest tone telling the user to go for a walk.",
        width: 794,
        height: 510,
        caption: "The Brutally Honest voice in action — motivation that reads like a friend keeping you in check.",
      },
      {
        src: "/work/memor/m-11.png",
        alt: "A radial weekly calendar built by stacking each day's organic shape.",
        width: 1200,
        height: 1200,
        caption: "The weekly view — stacking daily shapes made weekly trends visible at a glance.",
      },
      {
        src: "/work/memor/m-10.png",
        alt: "Over-the-shoulder photo of a participant using the Memor prototype on a phone.",
        width: 800,
        height: 1200,
        caption: "User testing the prototype flow.",
      },
    ],
  },
  {
    slug: "stori",
    section: "earlier-projects",
    art: StoriArt,
    tag: "Sponsored research — paused",
    tagMuted: true,
    title: "Stori",
    summary:
      "A proof-of-concept research project for NHS neonatal units, sponsored by Sarra Hoy.",
    cover: {
      src: "/work/stori/s-08.png",
      alt: "Two phones showing Stori's story library and a recording screen for the book Dear Zoo.",
      width: 1200,
      height: 1149,
    },
    snapshot: {
      role: "App design, concept, and static deliverables",
      // TODO: timeline, tools
      team: "Sponsored by Sarra Hoy; with NICU staff at Ninewells Hospital",
      statement:
        "NICU parents struggle to communicate with a baby they can't hold, so Stori lets them record stories played at the cot — and sends back a video of their baby listening.",
      overview:
        "Stori lets parents record stories that are sent to the hospital and played to their baby in the NICU. The recording process is tailored to produce the most suitable audio — with paced reading and volume control — and closes the loop by sending a video of the baby listening back to the parent.",
    },
    problem:
      "Having a baby admitted to a Neonatal Intensive Care Unit (NICU) is an intensely stressful, emotionally taxing experience — moving from the intensity of birth, to losing physical contact, to speaking to your baby through an incubator. Parents often struggle to know how to communicate with their baby, and even more so when they can't be at the unit. Visiting the NICU at Ninewells Hospital made the constraint concrete: the ward is designed at every turn to feel less daunting, and anything we added had to respect that — including how sensitive the unit is to noise.",
    decisions: [
      {
        heading: "Pace the read with karaoke-style highlighting",
        body: "So parents don't slip into their default reading speed, we added a karaoke-style feature that highlights words to encourage a gentle \"reading to a child\" pace.",
      },
      {
        heading: "Borrow the ward's own ear graphic for volume",
        body: "Volume is extremely sensitive in the NICU, so — borrowing the visual language of the ward's SoundEar monitor — recordings use an ear graphic to show levels and keep audio from peaking or getting too loud. Using a signal staff already recognised meant no new visual language to learn.",
      },
      {
        heading: "Shape the identity soft rather than clinical",
        body: "For the logo I wanted something soft and nurturing: a handwritten style that still reads as gentle, with the S formed into a baby wrapped in a blanket. \"Tell Me a Story\" was both the project name and a common request from children to their parents — shortened to \"Stori\" for the app itself.",
      },
    ],
    shipped:
      "Low- and high-fidelity prototypes covering the full loop: a library of stories to record, the paced recording screen with volume guarding, nurse-side playback at the cot, reaction videos returned to parents, a thank-you gesture to staff, and a support section of stories from other NICU parents.",
    outcome:
      "Validated with parents who'd been through a neonatal experience, NICU staff, and others with relevant knowledge, to make sure the right design choices were being made. I designed the prototypes, ran user interviews, analysed the results, and authored a full research report.",
    reflection:
      "My portion of the work is complete; progress on the wider initiative has slowed since, so I consider it paused rather than abandoned or failed.",
    gallery: [
      {
        src: "/work/stori/s-06.png",
        alt: "The Stori logo — a handwritten wordmark where the S forms a baby wrapped in a blanket.",
        width: 725,
        height: 698,
        caption: "\"Tell me a Stori\" — a soft, handwritten identity, the S shaped into a swaddled baby.",
      },
      {
        src: "/work/stori/s-03.png",
        alt: "A loop diagram: parent's phone to the hospital to a tablet showing the baby reacting.",
        width: 1200,
        height: 750,
        caption: "The core loop — parents record, nurses play the story, and a reaction video is sent back.",
      },
      {
        src: "/work/stori/s-02.jpg",
        alt: "A top-down floor plan capture of the neonatal ward from the Ninewells visit.",
        width: 699,
        height: 669,
        caption: "Understanding the ward — a visit to the NICU at Ninewells Hospital.",
      },
      {
        src: "/work/stori/s-01.png",
        alt: "Stori's recording screen for Dear Zoo, with highlighted text and an ear-shaped level meter.",
        width: 368,
        height: 800,
        caption: "The recording screen — highlighted words pace the read; the ear meter guards volume.",
      },
      {
        src: "/work/stori/s-04.png",
        alt: "A sequence showing one word highlighted at a time to pace a parent's reading.",
        width: 729,
        height: 509,
        caption: "Karaoke-style highlighting encourages a calm, child-appropriate reading pace.",
      },
      {
        src: "/work/stori/s-07.png",
        alt: "Stori exhibition board showing the concept, features, and mockups around a baby in an incubator.",
        width: 1200,
        height: 848,
        caption: "The full concept — recording, reactions, and a shared library of stories from other NICU parents.",
      },
    ],
  },
  {
    slug: "honours-dissertation",
    section: "earlier-projects",
    art: DissertationArt,
    tag: "Honours dissertation",
    tagMuted: true,
    title: "Honours Dissertation",
    summary:
      "Investigated gamification's effect on motivation in exercise apps.",
    cover: {
      src: "/work/dissertation/slide-07.jpg",
      alt: "A spread from the dissertation's design guideline — four gamification principles on a colourful winding path.",
      width: 2000,
      height: 1414,
    },
    snapshot: {
      role: "Researcher & designer — BSc (Hons) Digital Interaction Design thesis",
      // TODO: timeline, tools
      team: "Solo, with 51 survey participants and a 10-day user-testing cohort",
      statement:
        "Gamification in fitness apps ignores how intrinsic and extrinsic motivation interact, so I tested whether more extrinsic input raises intrinsic drive — it did, and became an eight-part design guideline.",
      overview:
        "My thesis: How gamification influences motivation to exercise through fitness products and services — and how that implementation could be improved. The through-line is the relationship between intrinsic and extrinsic motivation, and whether increasing exposure to extrinsic motivation can, in turn, raise intrinsic motivation.",
    },
    problem:
      "A literature review contrasted intrinsic motivation (self-determination theory; Deci & Ryan) with extrinsic motivation, then defined gamification as design thinking borrowed from video games and applied to non-gaming contexts (Deterding et al., 2011). It identified why gamification works in exercise through three recurring factors: self-tracking, the desire to reach goals, and the visualisation of exercise data. The real constraint surfaced in the survey: 92% of participants said they'd prefer to be intrinsically driven, yet gamification works by supplying extrinsic stimuli — so the question was whether the latter could actually build the former.",
    decisions: [
      {
        heading: "Survey the split between intrinsic and extrinsic drive",
        body: "A survey of 51 participants found 80% considered existing gamification a successful method of motivation. On motivation type, 35% identified as intrinsically motivated, 47% a mixture, and 18% extrinsically motivated — but 92% said they'd prefer to be intrinsically driven, valuing autonomy and independence from external stimuli.",
      },
      {
        heading: "Test three groups against a no-contact control",
        body: "Over ten days, participants were split into three groups: Group A received simple app-style encouragement by message, Group B received more enthusiastic messages that actively pushed them to increase their goals, and Group C received no contact (simulating no product at all). Both messaged groups saw motivation climb — Group A from 6.6 to 8, Group B from 6.8 to 8.6 — supporting the theory that greater exposure to extrinsic motivation can lift intrinsic motivation.",
      },
      {
        heading: "Ship a guideline, not another gamified feature",
        body: "Rather than designing one more gamified app, I made the deliverable a reusable strategic guideline so the findings could apply across fitness products — and deliberately aligned it with design methods teams already use, such as the Double Diamond, so it slots into existing process rather than replacing it.",
      },
    ],
    shipped:
      "An eight-part strategic guideline for implementing gamification in fitness products: define clear objectives, consider behavioural psychology, use social and visual features, align with users' fitness goals, understand your audience, design notifications and interactions, user-test and iterate, and build on prior design methods such as the Double Diamond.",
    outcome:
      "The guideline was validated by a target user, an avid gym-goer, who called it \"a very detailed strategy\" that would make fitness services more accessible and easier to stay consistent with.",
    reflection:
      "Validation surfaced one real gap: the behavioural-psychology section needed a reward principle covering both tangible rewards (discounts, merch) and virtual ones (badges, levels, rank lists). That's the first thing I'd extend.",
    gallery: [
      {
        src: "/work/dissertation/slide-01.jpg",
        alt: "Dissertation spread on intrinsic versus extrinsic motivation in exercise.",
        width: 2000,
        height: 1414,
        caption: "Secondary research — intrinsic vs. extrinsic motivation in exercise (literature review).",
      },
      {
        src: "/work/dissertation/slide-02.jpg",
        alt: "Dissertation spread defining gamification and why it succeeds in exercise.",
        width: 2000,
        height: 1414,
        caption: "What gamification is, and why it works in exercise: self-tracking, goals, and data visualisation.",
      },
      {
        src: "/work/dissertation/slide-03.jpg",
        alt: "Survey spread showing 80% found existing gamification successful.",
        width: 2000,
        height: 1414,
        caption: "The survey — 80% of 51 participants found existing gamification a successful motivator.",
      },
      {
        src: "/work/dissertation/slide-04.jpg",
        alt: "Survey spread showing 92% preferred to be intrinsically motivated, plus causes of demotivation.",
        width: 2000,
        height: 1414,
        caption: "92% preferred to be intrinsically motivated — and the many pulls behind feeling unmotivated.",
      },
      {
        src: "/work/dissertation/slide-05.jpg",
        alt: "Spread describing the three user-testing groups A, B and a no-contact control.",
        width: 2000,
        height: 1414,
        caption: "Survey conclusions and the user-testing design — three groups, including a no-contact control.",
      },
      {
        src: "/work/dissertation/slide-06.jpg",
        alt: "User-testing results for Groups A and B with rising motivation scores and message examples.",
        width: 2000,
        height: 1414,
        caption: "Results — motivation rose from ~6.7 to 8+ in both messaged groups over ten days.",
      },
      {
        src: "/work/dissertation/slide-08.jpg",
        alt: "Second half of the design guideline covering audience, notifications, iteration and prior methods.",
        width: 2000,
        height: 1414,
        caption: "The guideline continued — audience, notifications, iteration, and building on prior design methods.",
      },
      {
        src: "/work/dissertation/slide-09.jpg",
        alt: "Validation and conclusion spread from the dissertation.",
        width: 2000,
        height: 1414,
        caption: "Validation with a target user, and the thesis conclusion.",
      },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

/**
 * One entry in a case study's table of contents. `id` is the DOM id of the
 * matching <section>; `label` is the section's actual heading text — so a
 * decision shows its specific preview title, never "Decision 1".
 */
export interface CaseStudySection {
  id: string;
  label: string;
}

/** Stable id for a decision section, derived from its position. */
export function decisionId(index: number) {
  return `decision-${index + 1}`;
}

/**
 * Derives the ordered list of sections a project actually has content for.
 * Both the page body and the sidebar TOC are built from this, so the nav can
 * never drift out of sync with what's rendered. Sections with no content are
 * omitted entirely, which keeps sparse/empty projects rendering a valid page.
 */
export function getCaseStudySections(project: Project): CaseStudySection[] {
  const sections: CaseStudySection[] = [];

  if (project.snapshot) sections.push({ id: "snapshot", label: "Snapshot" });
  if (project.problem) sections.push({ id: "problem", label: "Problem" });

  project.decisions?.forEach((decision, index) => {
    sections.push({ id: decisionId(index), label: decision.heading });
  });

  if (project.shipped) sections.push({ id: "shipped", label: "Shipped" });
  if (project.outcome) sections.push({ id: "outcome", label: "Outcome" });
  if (project.reflection) {
    sections.push({ id: "reflection", label: "Reflection" });
  }

  return sections;
}
