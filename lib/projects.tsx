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

export interface ProjectField {
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
  /**
   * Full case-study content for the project's detail page — Problem/
   * Approach/Process/Solution/Outcome fields, or plain paragraphs where
   * there's no structured breakdown.
   */
  fields?: ProjectField[];
  paragraphs?: React.ReactNode[];
  /** Wide hero image shown at the top of the detail page in place of the SVG art. */
  cover?: ProjectImage;
  /** Case-study imagery rendered as a captioned column below the write-up. */
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
    fields: [
      {
        heading: "Problem",
        body: 'Admin-facing "last active" data was stagnant and binary. Institutions had no way to define what "active" actually meant for their own students, so at-risk students blended into the noise.',
      },
      {
        heading: "Approach",
        body: 'I introduced RAG-coded status categories — Active, At Risk, Inactive, No Data — and, critically, let admins set their own custom week-thresholds for each category, rather than imposing one fixed definition of "active" across every institution.',
      },
      {
        heading: "Outcome",
        body: "Strong adoption, plus admins recording and sharing videos unprompted showing appreciation for the feature — validation that wasn't solicited.",
      },
    ],
  },
  {
    slug: "feature-toggles-for-ai-tools",
    section: "genio-admin",
    art: FeatureTogglesArt,
    tag: "Case study",
    title: "Feature Toggles for AI Tools",
    summary:
      "A two-tier control model so institution-wide policy doesn't block the students who need support.",
    fields: [
      {
        heading: "Problem",
        body: "AI tools within Genio Notes can conflict with a course or institution's academic policy — but some individual students genuinely need that support.",
      },
      {
        heading: "Approach",
        body: "I designed a two-tier control model — an org-wide baseline setting plus group-level overrides — across the three AI features Notes currently ships, so institutions set policy while individual groups (a course with different needs, for example) can override it.",
      },
      {
        heading: "Outcome",
        body: "A student who needs the support isn't blocked by a blanket policy decision made elsewhere in the organisation.",
      },
    ],
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
    paragraphs: [
      "Current thinking, not a shipped result: giving admins the tools to build efficient, seamless workflows on their home page. I'm revisiting this properly in the second half of the year, so consider this a snapshot of process rather than a finished case study.",
    ],
  },
  {
    slug: "audio-bubbles",
    section: "genio-admin",
    art: AudioBubblesArt,
    tag: "Case study",
    title: "Audio Bubbles: Accessibility-Driven Redesign",
    summary:
      "Getting a lightweight, background UI element to WCAG 2.1 AA without making it visually loud.",
    fields: [
      {
        heading: "Problem",
        body: "The audio-capture interface (\"bubbles\") failed WCAG 2.1 AA colour contrast requirements — but a straightforward contrast fix risked making the redesign visually loud and cognitively heavy for what's meant to be a lightweight, background UI element.",
      },
      {
        heading: "Process",
        body: "I iterated through many design directions over an extended back-and-forth, working closely with stakeholders including direct input from the CEO. Rather than defaulting to consensus, I pushed for the specific direction I believed was right and managed the process through to a concrete decision.",
      },
      {
        heading: "Solution",
        body: "More compact sizing; a border that met contrast requirements without relying on heavier colour; the connecting line reduced to 1px for a sharper, more modern feel.",
      },
      {
        heading: "Outcome",
        body: "A WCAG 2.1 AA–compliant component that reads as light and sleek rather than muddy — appropriate for what should be a quiet background feature.",
      },
    ],
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
    paragraphs: [
      <>
        <em>Working title.</em> A Genio-Notes-adjacent learning-space concept
        built around autonomy and progressive disclosure. Students reveal one
        important sentence or concept at a time, then are prompted to
        articulate <em>why</em> that piece matters — borrowing the &quot;5
        Whys&quot; root-cause technique to build genuine understanding rather
        than passive reading.
      </>,
      "This is an independent concept exploration, not a shipped or employer-attributed project.",
    ],
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
    fields: [
      {
        heading: "Problem",
        body: "Many people struggle with productivity guilt — the sense that they're never doing \"enough,\" and a nagging worry about wasting time. Traditional productivity apps reinforce that feeling by maximising output rather than cultivating a sustainable, fulfilling relationship with work and daily life.",
      },
      {
        heading: "Overview",
        body: "Memor is a conceptual app for overcoming productivity guilt and understanding the value of a mindful approach to work. In place of rigid schedules and task lists, it pairs a reinvented, fluid calendar with interchangeable tone-of-voice profiles that keep the focus on well-being, self-reflection, and work-life balance.",
      },
      {
        heading: "Research",
        body: "Digital calendars offer flexibility; physical calendars offer visibility. I wanted a calendar that kept digital flexibility while leaning into physical visibility, which led me toward data visualisation. To reach the root of why we use calendars at all, I ran IDEO's \"Five Whys\" with several people — the recurring themes were productivity, not letting people down, and a general desire to feel in control.",
      },
      {
        heading: "The reinvented calendar",
        body: "I transformed a static, geometric layout into a fluid, organic shape, keeping a clock face so it stays familiar rather than alien. Events appear as circles around the perimeter at their scheduled hours and blend into the base shape to suggest flexibility in timing; larger circles mean longer events. Adding and removing events is animated to feel dynamic, and the 12/24-hour format is replaced with a simple 0–23 scale to discourage rigidity around time.",
      },
      {
        heading: "Tone of voice",
        body: "I pushed back on \"App Talk\" — the habit of being relentlessly nice to keep users engaged, which does little for real motivation. Instead I explored a brutally honest voice, like a good friend who keeps you in check. Realising bluntness wouldn't suit everyone, I built three interchangeable profiles: The Brutally Honest (a kick up the backside), The Bestie (wholesome \"you can do it\" support), and The Storyteller (something a little more playful).",
      },
      {
        heading: "Testing & refinement",
        body: "User testing praised the calendar as innovative, easy to understand, and effective at combatting feeling overwhelmed — the interventions were seen as genuinely denouncing productivity guilt. The Brutally Honest voice landed hardest, though profiles were sometimes hard to tell apart, and grey events felt unappealing. In response I added a weekly calendar — the daily shape stacked into a swipeable week — which unexpectedly made weekly trends visible and gave a fresh perspective on how a week is really spent.",
      },
    ],
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
    fields: [
      {
        heading: "Problem",
        body: "Having a baby admitted to a Neonatal Intensive Care Unit (NICU) is an intensely stressful, emotionally taxing experience — moving from the intensity of birth, to losing physical contact, to speaking to your baby through an incubator. Parents often struggle to know how to communicate with their baby, and even more so when they can't be at the unit.",
      },
      {
        heading: "Overview",
        body: "Stori lets parents record stories that are sent to the hospital and played to their baby in the NICU. The recording process is tailored to produce the most suitable audio — with paced reading and volume control — and closes the loop by sending a video of the baby listening back to the parent. My role covered app design, concept, and static deliverables.",
      },
      {
        heading: "Research & discovery",
        body: "We visited the NICU at Ninewells Hospital to speak with neonatal staff and see the ward, which is designed at every turn to feel less daunting — from nature illustrations along the walls to a layout built around parents. Once we had a proof of concept, we spoke with parents who'd been through a neonatal experience, NICU staff, and others with relevant knowledge, to make sure the right design choices were being made.",
      },
      {
        heading: "Designing the recording",
        body: "So parents don't slip into their default reading speed, we added a karaoke-style feature that highlights words to encourage a gentle \"reading to a child\" pace. Volume is extremely sensitive in the NICU, so — borrowing the visual language of the ward's SoundEar monitor — recordings use an ear graphic to show levels and keep audio from peaking or getting too loud.",
      },
      {
        heading: "Identity",
        body: "For the logo I wanted something soft and nurturing: a handwritten style that still reads as gentle, with the S formed into a baby wrapped in a blanket. \"Tell Me a Story\" was both the project name and a common request from children to their parents — shortened to \"Stori\" for the app itself.",
      },
      {
        heading: "Status",
        body: "I designed low- and high-fidelity prototypes, ran user interviews, analysed the results, and authored a full research report. My portion of the work is complete; progress on the wider initiative has slowed since, so I consider it paused rather than abandoned or failed.",
      },
    ],
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
    fields: [
      {
        heading: "The question",
        body: "My BSc (Hons) Digital Interaction Design thesis: How gamification influences motivation to exercise through fitness products and services — and how that implementation could be improved. The through-line is the relationship between intrinsic and extrinsic motivation, and whether increasing exposure to extrinsic motivation can, in turn, raise intrinsic motivation.",
      },
      {
        heading: "Secondary research",
        body: "A literature review contrasted intrinsic motivation (self-determination theory; Deci & Ryan) with extrinsic motivation, then defined gamification as design thinking borrowed from video games and applied to non-gaming contexts (Deterding et al., 2011). It identified why gamification works in exercise through three recurring factors: self-tracking, the desire to reach goals, and the visualisation of exercise data.",
      },
      {
        heading: "Primary research — survey",
        body: "A survey of 51 participants found 80% considered existing gamification a successful method of motivation. On motivation type, 35% identified as intrinsically motivated, 47% a mixture, and 18% extrinsically motivated — but 92% said they'd prefer to be intrinsically driven, valuing autonomy and independence from external stimuli.",
      },
      {
        heading: "Primary research — user testing",
        body: "Over ten days, participants were split into three groups: Group A received simple app-style encouragement by message, Group B received more enthusiastic messages that actively pushed them to increase their goals, and Group C received no contact (simulating no product at all). Both messaged groups saw motivation climb — Group A from 6.6 to 8, Group B from 6.8 to 8.6 — supporting the theory that greater exposure to extrinsic motivation can lift intrinsic motivation.",
      },
      {
        heading: "Outcome — a strategic guideline",
        body: "The deliverable was an eight-part strategic guideline for implementing gamification in fitness products: define clear objectives, consider behavioural psychology, use social and visual features, align with users' fitness goals, understand your audience, design notifications and interactions, user-test and iterate, and build on prior design methods such as the Double Diamond.",
      },
      {
        heading: "Validation",
        body: "The guideline was validated by a target user, an avid gym-goer, who called it \"a very detailed strategy\" that would make fitness services more accessible and easier to stay consistent with — and suggested extending the behavioural-psychology section with a reward principle covering both tangible and virtual rewards.",
      },
    ],
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
