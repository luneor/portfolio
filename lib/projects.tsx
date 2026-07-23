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
   * there's no structured breakdown. Placeholder home for this text until
   * the individual project pages get proper content.
   */
  fields?: ProjectField[];
  paragraphs?: React.ReactNode[];
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
    paragraphs: [
      "A conceptual app focused on reducing productivity guilt and promoting mindfulness.",
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
    paragraphs: [
      "Began as a 3rd-year university project on neonatal experiences. After graduating, I was contacted and selected — sponsored by Sarra Hoy — to continue it as a proof-of-concept research project targeting NHS neonatal units, enabling parents to send recorded audio messages to premature or hospitalised infants for nurses to play back.",
      "I designed low- and high-fidelity prototypes, ran user interviews, analysed the results, and authored a full research report. My portion of the work is complete; progress on the wider initiative has slowed since, so I consider it paused rather than abandoned or failed.",
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
    paragraphs: [
      "Investigated gamification's effect on motivation in exercise apps, and how to improve gamification's implementation. Produced usage guidelines plus my own user-tested gamified feature concept.",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}
