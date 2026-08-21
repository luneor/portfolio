import type { ComponentType } from "react";
import {
  LastActiveArt,
  FeatureTogglesArt,
  AudioBubblesArt,
  FiveWhysArt,
  MemorArt,
  StoriArt,
} from "@/components/project-art";
import { ProjectFigure } from "@/components/case-study/project-figure";

/**
 * Snapshot / header block for a case study.
 *
 * Snapshot is the WHOLE PROJECT SUMMARISED, for a reader who wants to understand
 * what happened without reading the rest of the page. So it has to carry the
 * outcome, not just the premise: if it only sets up the problem it duplicates the
 * Problem section that follows it and tells that reader nothing.
 *
 * Every field is optional; unknown facts are left out rather than invented.
 */
export interface CaseStudySnapshot {
  role?: string;
  timeline?: string;
  team?: string;
  tools?: string;
  /** One line: what the project was and what came of it. */
  statement?: React.ReactNode;
  /**
   * The summary proper, a few sentences: the context, the key move, and how it
   * turned out. Ends on a result, never on the setup.
   */
  overview?: React.ReactNode;
}

/**
 * One key judgment call on the project. The heading should preview the actual
 * decision (e.g. "Cut onboarding to one step"), never a generic "Decision 1".
 */
export interface Decision {
  heading: string;
  body: React.ReactNode;
  /**
   * Evidence for this specific call, kept with the decision rather than
   * pooled into the gallery, so the artefacts sit beside the reasoning.
   */
  media?: ProjectMedia[];
}

/**
 * A real image asset in `public/work/<slug>/`. Intrinsic `width`/`height`
 * are required so next/image can reserve space and avoid layout shift.
 */
export interface ProjectImage {
  kind?: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/**
 * A screen recording. Rendered with native controls and never autoplayed, so
 * nothing moves until the reader asks for it. `description` carries the
 * accessible name, these clips are silent, so there's no audio to caption.
 */
export interface ProjectVideo {
  kind: "video";
  src: string;
  poster?: string;
  width: number;
  height: number;
  description: string;
  caption?: string;
  /**
   * Plays muted, looping, on load, GIF-style, rather than the default
   * click-to-play. For a short silent loop that IS the content (not a
   * recorded walkthrough), waiting for a click adds friction for nothing.
   * Controls stay on so it can still be paused.
   */
  loop?: boolean;
}

/**
 * An embedded YouTube video, for footage that lives off-site rather than as
 * a local file (e.g. a longer edited video with a voiceover or music, where
 * self-hosting would mean losing that). `id` is just the video id from the
 * watch URL, not the full link.
 */
export interface ProjectYouTubeVideo {
  kind: "youtube";
  id: string;
  title: string;
  caption?: string;
}

export type ProjectMedia = ProjectImage | ProjectVideo | ProjectYouTubeVideo;

export interface Project {
  slug: string;
  /**
   * Which homepage section lists the project. "ai" sits under the AI section
   * rather than Work, since that work puts AI inside the design itself.
   */
  section: "genio-admin" | "ai" | "earlier-projects";
  art: ComponentType;
  tag: string;
  tagMuted?: boolean;
  /** Short skill/theme labels shown at the foot of the work card, 2–3 per project. */
  topics?: string[];
  title: string;
  /** Short one-liner shown on the compact card. */
  summary: string;

  /*
    Standardised case-study sections, rendered in this order on the detail
    page and mirrored by the sidebar table of contents. Each is optional so a
    project with no content yet still renders a valid (shorter) page: the TOC
    lists only the sections actually present.
  */
  /** 1. Snapshot: role, timeline, team, tools, problem → outcome statement. */
  snapshot?: CaseStudySnapshot;
  /** 2. Problem: context and the real constraint. */
  problem?: React.ReactNode;
  /**
   * Optional: the constraints the work had to hold inside, where they carry
   * enough weight to stand apart from the Problem rather than sit inside it.
   */
  constraints?: React.ReactNode;
  /** 3. Decisions: 1–3 key judgment calls, each with a specific heading. */
  decisions?: Decision[];
  /** 4. Shipped: the final solution. */
  shipped?: React.ReactNode;
  /**
   * Heading override for the Shipped section, for projects that never went
   * out the door, e.g. "Submitted" for a coursework/honours piece. Defaults
   * to "Shipped".
   */
  shippedLabel?: string;
  /** 5. Impact: result / outcome. Field kept as `outcome`; renders as "Impact". */
  outcome?: React.ReactNode;
  /** 6. Reflection: one line on what you'd change or learned. */
  reflection?: React.ReactNode;

  /**
   * Work-card thumbnail, in place of the abstract motif. Separate from `cover`
   * so a card can reuse a shipped screenshot without that image also becoming
   * the detail-page hero and appearing twice on the page. Falls back to
   * `cover`, then to the motif.
   */
  cardImage?: ProjectImage;
  /** Wide hero image for the detail page, in place of the SVG art. */
  cover?: ProjectImage;
  /** Case-study media rendered as a captioned column under "Shipped". */
  gallery?: ProjectMedia[];
}

/**
 * Bolded key phrase. Used sparingly so each block has one thing the eye lands
 * on when skimming: the claim, the figure, or the decision.
 */
function Emph({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}

export const PROJECTS: Project[] = [
  {
    slug: "last-active-filtering",
    section: "genio-admin",
    art: LastActiveArt,
    tag: "Case study",
    topics: ["Innovation", "User Testing"],
    title: "Last Active Filtering",
    summary:
      'Custom, admin-defined thresholds for what "active" means at each institution.',
    cardImage: {
      src: "/work/last-active/final-ranges-in-context.png",
      alt: "The Last Active Ranges dialog open over the users table, defining the range for each status.",
      width: 1600,
      height: 900,
    },
    cover: {
      src: "/work/last-active/final-ranges-in-context.png",
      alt: "The Last Active Ranges dialog open over the users table, defining the range for each status alongside the filter panel.",
      width: 1600,
      height: 900,
    },
    snapshot: {
      role: "UX Designer, Genio Admin (BEAR Squad)",
      // TODO: timeline, team, tools
      statement: (
        <>
          Admins couldn&apos;t tell which students were genuinely falling out
          of using Genio Notes, and couldn&apos;t follow up with them
          correctly. I let each institution define what Active, At Risk and
          Inactive mean to them, giving them more control.{" "}
          <Emph>
            Adoption sits at 25.4% and growing, with vocal video appreciation
            from our customers.
          </Emph>
        </>
      ),
      overview: (
        <>
          <p>
            Admins needed more accurate Last Active statuses to manage
            licenses more efficiently.{" "}
            <Emph>There was no way to filter by Last Active status at all</Emph>
            , and our existing RAG (Red, Amber, Green) statuses were fixed at
            0–7 days (Green), 7–14 days (Amber) and 14+ days (Red), and
            invisible to admins.
          </p>
          <p>
            My gut told me that{" "}
            <Emph>few admins knew what the colours actually meant</Emph>,
            which makes the data hard to act on.
          </p>
        </>
      ),
    },
    decisions: [
      {
        heading: "Why not a date picker?",
        body: (
          <>
            <p>
              Typically, a date picker works for this: pick a cut-off date,
              and act on those users based on that usage info. However,
              admins still had to know what date to pick first: day of the
              week mattered, what time of year it was, and other factors.
            </p>
            <p>
              I saw a gap for a stronger solution:{" "}
              <Emph>
                let admins choose what the RAG statuses meant to them
              </Emph>{" "}
              by deciding the ranges for each status themselves. That extra
              control meant they could set ranges to match their own
              understanding of what active meant to them.
            </p>
            <p>
              <Emph>
                I A/B tested both solutions in a survey with our Admin
                Insiders group
              </Emph>
              . They preferred custom ranges, and the reason they gave was
              the sense of control it offered, not the filtering itself.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/last-active/ideation-filter-date.png",
            alt: "The users table with a filter panel open, showing a Last Active date picker with a January 2026 calendar.",
            width: 1280,
            height: 720,
            caption: "Option A, a traditional date picker.",
          },
          {
            src: "/work/last-active/ideation-filter-status.png",
            alt: "The users table with a filter panel open, showing a Filter by Last Active Status dropdown listing Green (Active), Amber (At Risk) and Red (Inactive).",
            width: 1280,
            height: 720,
            caption: "Option B, filtering by last active statuses.",
          },
        ],
      },
      {
        heading: "Exploring how admins set the ranges",
        body: (
          <>
            <p>
              I wanted the custom ranges to be easy to use and understand,
              and settled on using weeks as a unit of time rather than days
              or months. I did some ideation around visualising the ranges,
              and the interaction of setting them.
            </p>
            <p>
              I eventually <Emph>decided against a visualisation</Emph>, as
              I felt it wasn&apos;t needed to understand the set ranges.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/last-active/ideation-thresholds-inputs.png",
            alt: "Threshold editor using numeric stepper inputs, with a segmented colour bar above and a plain-language summary of the resulting logic.",
            width: 599,
            height: 452,
            caption:
              "Ideation, thresholds as numeric inputs, with the resulting logic spelled out in words beside them.",
          },
          {
            src: "/work/last-active/ideation-thresholds-timeline.png",
            alt: "Threshold editor as a timeline with two draggable markers, and the resulting Active, At Risk and Inactive ranges shown beneath.",
            width: 678,
            height: 485,
            caption:
              "Ideation: the same thresholds as draggable markers on a timeline, with each range read back underneath.",
          },
          {
            src: "/work/last-active/ideation-icons.png",
            alt: "Five variants of an Activity filter card, each showing the four states, Active, At risk, Inactive, No data, with icon and colour treatments checked against colour contrast requirements.",
            width: 820,
            height: 565,
            caption:
              "A small accessibility mini-project alongside the main work: now that the RAG colours carried real meaning, they needed to pass colour contrast too, not just read well as icons.",
          },
          {
            src: "/work/last-active/final-ranges-modal.png",
            alt: "The Edit Last Active Ranges dialog, with week inputs for Active, At risk and Inactive and a reset to default option.",
            width: 608,
            height: 431,
            caption:
              "Final solution: two input boxes with a middle range that auto-adjusts. The wording precisely communicates exactly what setting that range means.",
          },
        ],
      },
      {
        heading: "What do admins really think about it?",
        body: (
          <>
            <p>
              For extra validation, we got in touch with admins who use Genio
              to test the prototype. Rather than taking them through it,{" "}
              <Emph>I put them in the driver&apos;s seat</Emph> with a
              high-fidelity prototype I created.
            </p>
            <p>
              It landed well, and surfaced what a demo wouldn’t: <Emph>once admins
              could isolate a group they wanted to act on it</Emph>, export, email,
              bulk deactivate. This also helped shape the roadmap beyond this
              feature.
            </p>
          </>
        ),
      },
    ],
    shipped: (
      <p>
        A Last Active filter in the users table: the four states as checkboxes,
        each carrying its status icon, with an Edit Ranges control that opens
        the editor where an admin sets the week boundaries for Active, At risk
        and Inactive.
      </p>
    ),
    gallery: [
      {
        src: "/work/last-active/final-filter-panel.png",
        alt: "The users table with the Filters panel open, showing Status and Group dropdowns and a Last Active group with Active, At risk, Inactive and No data checkboxes plus an Edit Ranges button.",
        width: 1280,
        height: 720,
        caption:
          "Shipped: the Last Active filter, with Edit Ranges sitting next to the states it defines.",
      },
    ],
    outcome: (
      <>
        <p>
          <Emph>Adoption currently sits at 25.4% and growing.</Emph> Admins
          shared appreciation for the feature during calls with customer
          success.
        </p>
        <p>
          It helped us define the next projects on the roadmap.{" "}
          <Emph>
            Giving admins control and the ability to isolate a group
          </Emph>{" "}
          left them wanting to action it quickly.
        </p>
      </>
    ),
    reflection: (
      <p>
        The obvious fix, a date picker, would&apos;ve only solved half the
        problem. I dug into what was actually blocking admins: they
        didn&apos;t know what the statuses meant, and had no way to say what
        &ldquo;Last Active&rdquo; should mean for them.{" "}
        <Emph>
          Trusting my gut led to a solution that fixed the real issue.
        </Emph>{" "}
        A/B testing and talking to customers backed up my instinct, so we
        shipped a full solution rather than something half-baked.
      </p>
    ),
  },
  {
    slug: "feature-toggles-for-ai-tools",
    section: "genio-admin",
    art: FeatureTogglesArt,
    tag: "Case study",
    topics: ["Stakeholder Management", "Systems Thinking"],
    title: "Feature Toggles for AI Tools",
    summary:
      "A two-tier control model so institution-wide policy doesn't block the students who need support.",
    cardImage: {
      src: "/work/feature-toggles/final-org-form.png",
      alt: "The shipped Edit Organisation screen, showing the Manage Features block alongside general details.",
      width: 1600,
      height: 900,
    },
    cover: {
      src: "/work/feature-toggles/final-org-form.png",
      alt: "The shipped Edit Organisation screen, with a Manage Features block marked New! listing Study Notes, QuizMe and Outlines, alongside general details and sharing policy.",
      width: 1600,
      height: 900,
    },
    snapshot: {
      // TODO: exact timeline dates and stakeholder names/roles to confirm.
      role: "UX Designer, Genio Admin (BEAR Squad)",
      timeline: "TODO, confirm dates",
      team: "TODO, confirm names and roles",
      statement: (
        <>
          Genio Notes&apos; AI tools help students, but they can sometimes
          conflict with a school&apos;s academic policies. Admins had no way
          to control who could access which tools, so schools were stuck
          choosing between blocking AI outright or leaving it wide open.{" "}
          <Emph>
            I built an org-wide setting with group-level overrides
          </Emph>
          , giving admins full control using a Groups system they already
          know.
        </>
      ),
      overview: (
        <p>
          Our PM was on leave, so I had to cover PM responsibilities and deal
          with varying stakeholder input, including an initial request for a
          more complex profiles system.
        </p>
      ),
    },
    decisions: [
      {
        heading: "A change in priority",
        body: (
          <>
            <p>
              It came clear that stakeholders wanted to match a competitor.
              They wanted feature toggles to be added through a new
              “profile” system. Introducing a new system to the admin
              platform.
            </p>
            <p>
              I looked deeper, what was actually being asked for, and what
              was the right solution?
            </p>
          </>
        ),
      },
      {
        heading: "Add to the existing system, don’t build a new one",
        body: (
          <>
            <p>
              Creating a new profile system to match a competitor would be
              complex.{" "}
              <Emph>
                Profiles meant a whole extra system on top of the existing
                Groups system
              </Emph>
              .
            </p>
            <p>
              I argued for{" "}
              <Emph>giving feature toggles to groups instead</Emph>. They are
              already used and understood by admins, and allow for the same
              functionality. I had to push for this in place of my PM,
              attending meetings and communicating with stakeholders in
              their place.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/feature-toggles/ideation-profiles.png",
            alt: "Ideation screen showing a Profiles page with three preset cards, No AI, No Outlines and All, each toggling Auto Notes, AI Outlines, QuizMe and Captions.",
            width: 1282,
            height: 720,
            caption:
              "Ideation: the profile system explored: named presets, each toggling the same set of features.",
          },
        ],
      },
      {
        heading: "Org-wide baseline, group level override",
        body: (
          <>
            <p>
              Inside that scope, a two-tier model across the three AI features
              Notes ships: an org-wide baseline plus group-level overrides.
              Institutions set policy once, and a course or cohort with
              different needs can depart from it without that call being made
              for everyone.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/feature-toggles/ideation-bulk-config.png",
            alt: "Ideation screen showing four course groups selected with a Feature Configuration panel, features split into AI Features, Recording & Transcription and Note-taking Tools.",
            width: 1617,
            height: 1069,
            caption:
              "Ideation, configuring several groups at once, with features sorted into categories and settings copyable between groups.",
          },
          {
            src: "/work/feature-toggles/ideation-user-matrix.png",
            alt: "Ideation screen for editing a single user, with a Managed Features table showing org-level and group-level state for each feature.",
            width: 1280,
            height: 776,
            caption:
              "Ideation, showing the org-level and group-level state of each feature side by side on a single user.",
          },
        ],
      },
      {
        heading: "Taking the opportunity to improve the form layout",
        body: (
          <>
            <p>
              The existing form layout in Admin was hard to scan and lacked
              structure. Since feature toggles needed to fit into these
              forms, it felt like the right moment to fix that. I
              restructured the layout with dividing lines, clear titles, and
              descriptions.
            </p>
            <p>
              It also made it easier to add new sections to a form, instead
              of hunting for a spot in a long list.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/feature-toggles/old-org-form.png",
            alt: "The previous organisation settings form: a single stacked column of fields with no feature management.",
            width: 1600,
            height: 900,
            caption:
              "Before: the organisation form as it stood: one long stacked column, with nowhere for feature management to live.",
          },
          {
            src: "/work/feature-toggles/final-org-form.png",
            alt: "The shipped Edit Organisation screen, with a Manage Features block marked New! listing Study Notes, QuizMe and Outlines, alongside general details and sharing policy.",
            width: 1600,
            height: 900,
            caption:
              "After: the overhauled two-column layout, section intent on the left, controls on the right, with room for feature management to live.",
          },
        ],
      },
    ],
    shipped: (
      <p>
        Feature toggles shipped as an extension of the existing Groups
        system: an org-wide baseline for each of the three AI features in
        Notes, with group-level overrides on top. Utilising a system they
        were already familiar with to give them the ability to cater to
        their academic AI policies.
      </p>
    ),
    gallery: [
      {
        src: "/work/feature-toggles/final-edit-group.png",
        alt: "The shipped Edit Group screen, with Managed Features set to Customise for this group and each feature labelled with its organisation default.",
        width: 1600,
        height: 898,
        caption:
          "Shipped: the group override. Each feature carries its organisation default in the label, so an admin can see what they're departing from.",
      },
    ],
    outcome: (
      <>
        <p>
          <Emph>A student who needs the support isn’t blocked by a blanket
          policy</Emph> set elsewhere in the organisation, and an institution
          can restrict a feature without handling exceptions one student at
          a time.
        </p>
        <p>
          <Emph>Adoption reached 11.8% within the first month</Emph>, with 52
          unique admins taking action on it. It shipped during summer break,
          when most institutions are quiet, so we expect adoption to grow
          significantly as term starts.
        </p>
      </>
    ),
    reflection: (
      <>
        <p>
          This wasn&apos;t a heavy UX project, it was PM work: taking in
          varying stakeholder feedback and steering it toward the right
          approach.
        </p>
        <p>
          The useful question turned out to be{" "}
          <Emph>“Do we really need a profile system?”</Emph>{" "}
          Once I asked that, it became clear the same solution was reachable
          through an existing system. Clarifying that sooner would&apos;ve
          made the project far more streamlined.
        </p>
      </>
    ),
  },
  {
    slug: "audio-bubbles",
    section: "genio-admin",
    art: AudioBubblesArt,
    tag: "Case study",
    topics: ["Accessibility", "Experimentation"],
    title: "Audio Bubbles: Accessibility Redesign",
    summary:
      "Getting a lightweight, background UI element to WCAG 2.1 AA without making it visually loud.",
    snapshot: {
      role: "UX Designer, Genio Notes, Audio tab",
      timeline: "Sep 2025 – Jan 2026",
      team:
        "Dave Tucker-Diaz (CEO), Paul Davis (Head of UX), Steven (accessibility/dev support), Matt Russell (analytics), Level Access (external WCAG auditor)",
      tools: "Figma, Pendo, a custom bubble playground prototype",
      statement: (
        <>
          Genio Notes&apos; audio capture interface (audio bubbles) failed
          WCAG 2.1 AA contrast. Our CEO voiced his concerns, simply
          strengthening the colour to pass contrast would increase cognitive
          load for a mainly background element.{" "}
          <Emph>
            I came up with a redesign that met colour contrast by focusing
            on the borders, rather than the fill
          </Emph>
          {" "}- leading to a cleaner and lighter interface.
        </>
      ),
      overview: (
        <p>
          Each colour marks a different note type: important notes in red,
          notes flagged for review in yellow, and regular notes in blue. The
          audit found a colour contrast issue:{" "}
          <Emph>in dark mode, grey (4.04:1) and yellow (3.5:1) passed, but
          blue (2.94:1) and red (2.42:1) failed</Emph>; in light mode, every
          colour except red failed.
        </p>
      ),
    },
    cover: {
      src: "/work/audio-bubbles/cover.jpg",
      alt: "The Genio Notes audio tab in light mode, showing the redesigned outlined audio bubbles in the right-hand panel.",
      width: 2000,
      height: 1110,
    },
    decisions: [
      {
        heading: "How do we meet contrast, but keep the UI light?",
        body: (
          <>
            <p>
              Raising the saturation to meet 3:1 contrast{" "}
              <Emph>read as muddy and heavy</Emph>, exactly the tradeoff the
              CEO had flagged.
            </p>
            <ProjectFigure
              media={{
                src: "/work/audio-bubbles/contrast-bump-rejected.png",
                alt: "Two columns of audio bubbles with fully saturated red, orange and purple fills against grey connecting lines.",
                width: 772,
                height: 554,
                caption:
                  "The rejected direction, raising saturation to force 3:1 read as muddy and visually heavier.",
              }}
            />
            <p>
              I tried various approaches, making the bubbles thinner but
              stronger, an empty fill, a light fill, and more. Having a light
              fill for the inactive bubbles and a stronger one when they were
              active hit the sweet spot.
            </p>
            <ProjectFigure
              media={{
                src: "/work/audio-bubbles/fill-variants.png",
                alt: "Three panels comparing audio bubble fill treatments across slide outlines.",
                width: 1236,
                height: 583,
                caption:
                  "Comparing fill treatments for active bubbles against the thinner 1px connecting line.",
              }}
            />
            <p>
              The final solution added a light background fill with a border
              that passes contrast checks. Getting there took a few tweaks: I
              reduced the connecting lines from 2px to 1px, and shrunk the
              bubbles themselves, inactive ones from 8px to 5px, active ones
              from 12px to 11px. I kept those sizes odd so the bubbles would
              sit centered on the thinner line.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/audio-bubbles/light-dark-panels.png",
            alt: "Two audio tab panels side by side, one with a purple header and one with a teal header, showing highlighted bubbles.",
            width: 972,
            height: 772,
            caption: "Comparing the new proposed design to the original.",
          },
          {
            kind: "video",
            src: "/work/audio-bubbles/recording-sep-1.mp4",
            poster: "/work/audio-bubbles/poster-sep-1.png",
            width: 1278,
            height: 718,
            description:
              "Silent screen recording of the Genio Notes audio tab in light mode, showing the redesigned outlined audio bubbles and their connecting lines.",
            caption:
              "The border-based direction in light mode (silent screen recording).",
          },
          {
            kind: "video",
            src: "/work/audio-bubbles/recording-sep-2.mp4",
            poster: "/work/audio-bubbles/poster-sep-2.png",
            width: 1276,
            height: 714,
            description:
              "Silent screen recording of the Genio Notes audio tab in dark mode, with the cursor over a red flagged audio bubble.",
            caption:
              "The same direction in dark mode, where grey and yellow already passed (silent screen recording).",
          },
        ],
      },
      {
        heading: "Pushing for the lowest cognitive load",
        body: (
          <>
            <p>
              To go further, I explored dropping the opacity of the
              connecting line, or removing it entirely. Our accessibility
              expert liked the idea, but suggested I double check first.
            </p>
            <p>
              I put the question to an external WCAG auditor. Their answer:
              decorative lines are exempt, but lines that are interactive and
              convey essential context are not. Since our lines are
              interactive and give context for the empty audio between
              bubbles, <Emph>that reversed my decision</Emph>. I kept them at
              full opacity, with contrast that still passes.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/audio-bubbles/line-opacity.png",
            alt: "Three panels comparing connecting-line treatments at different opacities behind outlined audio bubbles.",
            width: 1236,
            height: 583,
            caption:
              "Line treatments compared: removed entirely, ~40% opacity, and full-opacity grey.",
          },
        ],
      },
      {
        heading: "Testing with power users",
        body: (
          <>
            <p>
              I surveyed our heaviest audio-tab users, cross-referencing usage
              stats against our Insiders group (customers who&apos;ve opted
              in to being contacted). The survey compared the current and
              proposed designs on cognitive load, perceived polish
              (“beautiful and minimal”), and overall preference.
            </p>
            <p>
              With only 5 responses, the sample was too small for hard
              conclusions, but the signal was promising:{" "}
              <Emph>the new design won overall</Emph>. It scored lower on
              “beautiful and minimal”, though that was skewed by a single 1/5
              from a respondent resistant to any change. The clearest win
              was clarity: users found it easier to see where audio starts
              and stops, and felt it was less distracting.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/audio-bubbles/survey-preference.png",
            alt: "Multiple choice survey results: 60% said the new bubble design would be an improvement, 20% wouldn't mind, 20% would miss the old design.",
            width: 797,
            height: 410,
            caption:
              "The direct preference question, 3 of 5 called the new design an improvement.",
          },
          {
            src: "/work/audio-bubbles/survey-why-improvement.png",
            alt: "Survey responses explaining why the new audio bubble design is an improvement, with an AI summary of the themes.",
            width: 786,
            height: 680,
            caption:
              "Why respondents saw it as an improvement: clearer start/end points, less clutter.",
          },
        ],
      },
    ],
    shipped: (
      <>
        <p>
          Contrast lives in the border and the weight, not the fill: a
          background-fill inactive bubble with a contrast-passing border, a
          lighter fill when active, 1px lines at full contrast per the ruling,
          and heights of 5px / 11px so they centre on the thinner line.
        </p>
      </>
    ),
    gallery: [
      {
        src: "/work/audio-bubbles/bubbles-new.png",
        alt: "A tall audio tab panel showing the final bubble treatment across three slide sections.",
        width: 726,
        height: 1329,
        caption: "The final bubble treatment in the audio tab.",
      },
    ],
    outcome: (
      <>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            WCAG 2.1 AA reached ahead of the VPAT deadline via borders rather
            than saturation, keeping the design as quiet as it was meant to be.
          </li>
          <li>
            The decorative-vs-functional question settled by an external
            authority rather than an internal guess, and the design changed in
            response, even though it meant reversing an earlier call.
          </li>
          <li>
            Direction validated by a small, targeted survey, with the
            5-person sample stated as the limitation it is.
          </li>
          <li>
            Usage logging left in place to argue any deeper investment in the
            audio tab from data.
          </li>
        </ul>
      </>
    ),
    reflection: (
      <>
        <p>
          All this experimenting came down to one principle:{" "}
          <Emph>
            approach compliance thoughtfully, not as a box to tick, but as a
            prompt to rethink the design itself
          </Emph>
          . That approach led to a solution that worked better for everyone.
          Moving away from simply increasing the strength of the colour fill,
          trusting that gut instinct, turned out to be the right call. This
          project taught me a lot, including how to manage stakeholder input
          up to CEO level, and sharpened my eye for detail.
        </p>
      </>
    ),
  },
  {
    slug: "five-whys",
    section: "ai",
    art: FiveWhysArt,
    tag: "Independent concept, still taking shape",
    tagMuted: true,
    title: "Five Whys",
    summary:
      "A Genio-Notes-adjacent learning-space concept built around autonomy and progressive disclosure.",
    snapshot: {
      role: "Independent concept, self-directed",
      // TODO: timeline, team, tools
      statement:
        "An independent concept for turning passive reading into something active: reveal one idea at a time, then ask the student why it matters.",
      overview: (
        <>
          <p>
            Reading front to back is passive, and a student can finish a page
            having absorbed very little of it. This concept borrows the{" "}
            <Emph>“5 Whys”</Emph> root-cause technique and applies it to
            studying: material is revealed a concept at a time, and each reveal
            asks the student to articulate <em>why</em> that piece matters before
            moving on.
          </p>
          <p>
            <em>Working title.</em> An exploration on my own time, taken as far as
            the interaction model rather than a build, so there are no adoption
            figures to report. It is not a shipped or employer-attributed project.
          </p>
        </>
      ),
    },
    decisions: [
      {
        heading: "Reveal one concept at a time, then ask why it matters",
        body: (
          <>
            A Genio-Notes-adjacent learning-space concept built around autonomy
            and progressive disclosure. Students reveal one important sentence
            or concept at a time, then are prompted to articulate{" "}
            <em>why</em> that piece matters, borrowing the &quot;5 Whys&quot;
            root-cause technique to build genuine understanding rather than
            passive reading.
          </>
        ),
      },
    ],
    // TODO: shipped, outcome, reflection, concept is still taking shape.
  },
  {
    slug: "memor",
    section: "earlier-projects",
    art: MemorArt,
    tag: "Concept",
    tagMuted: true,
    topics: ["Innovation", "Conceptual"],
    title: "Memor",
    summary:
      "A conceptual app focused on reducing productivity guilt and promoting mindfulness.",
    cover: {
      src: "/work/memor/m-14.jpg",
      alt: "The Memor prototype open on a phone on a stand, showing the fluid clock-calendar with red and blue event circles, beside a laptop on a desk.",
      width: 2000,
      height: 1333,
    },
    snapshot: {
      role: "Concept, research, UX & UI design, self-directed",
      // TODO: timeline, team, tools
      statement:
        "My honours project: a conceptual app that treats productivity guilt as the problem. Replacing the calendar grid with a fluid shape and using tone of voice profiles that talk to you like a friend. Focused on making you mindful of how you're spending your time with custom interventions.",
    },
    decisions: [
      {
        heading: "Digital and physical calendars",
        body: (
          <>
            <p>
              One of the first things I did was walk around the studio and
              ask people, do you use a calendar? I got a mixture of physical
              and digital calendars.
            </p>
            <p>
              What&apos;s the positive of each? Along with some initial
              research I had come to a key insight:{" "}
              <Emph>
                Digital calendars offer more flexibility than physical
                calendars - however, physical calendars offer more
                visibility than digital calendars.
              </Emph>
            </p>
            <p>
              My aim quickly became to create something in the middle
              ground. Creating something which utilised digital flexibility,
              but leans into physical visibility would be the best of both
              worlds for a new innovated calendar. This lead to looking into
              data visualisation, and how we can represent our calendars in
              a new, fluid way.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/memor/m-02.jpg",
            alt: "An iPhone on a stand displaying a calendar app, propped on a windowsill overlooking a city view.",
            width: 2048,
            height: 1365,
            caption:
              "One of the digital calendars found during the studio walkaround.",
          },
          {
            src: "/work/memor/m-03.jpg",
            alt: "A physical paper desk calendar with handwritten notes propped on a windowsill.",
            width: 1200,
            height: 800,
            caption:
              "One of the physical calendars found during the studio walkaround.",
          },
        ],
      },
      {
        heading: "Make the calendar a fluid shape, not a grid",
        body: (
          <>
            <p>
              I started conceptualising how to transform geometric, static
              layouts into fluid and organic shapes while still representing
              a familiar calendar. The first step is shaping the design into
              a fluid yet readable form. To keep it familiar and avoid an
              &quot;alien&quot; feel, I incorporated a clock face into the
              initial concept.{" "}
              <Emph>
                This was a very strong starting point
              </Emph>{" "}
              and allowed me to iterate towards the final look.
            </p>
            <p>
              Achieving the look I wanted was tough, I had to use{" "}
              <Emph>Adobe After Effects</Emph> to generate short clips which
              would be used in the prototyping software Protopie. This was a
              mixture of software I did not intend to explore, but it worked
              really well.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/memor/fluid-shape-strip.png",
            alt: "Three panels showing the shape's progression: four separate squares, the squares melting into an outlined organic blob, and the final blob shape inside a 12-hour clock face.",
            width: 1673,
            height: 600,
            caption:
              "The shape's progression: rigid squares, softened into an organic blob, then set inside the familiar clock face.",
          },
          {
            src: "/work/memor/fluid-shape-iteration.png",
            alt: "Three framed panels: a dark calendar concept with a glowing outline and event labels, a small dark green-and-white blob study, and the blue-and-orange blob on white.",
            width: 1903,
            height: 600,
            caption:
              "Iterating the look in After Effects.",
          },
          {
            kind: "video",
            src: "/work/memor/calendar-loop.mp4",
            width: 1080,
            height: 1080,
            loop: true,
            description:
              "Silent looping animation of the fluid clock-calendar, showing events blending into the base shape.",
            caption: "Adding and removing an event from the fluid calendar.",
          },
        ],
      },
      {
        heading: "Drop \"App Talk\" for a brutally honest voice",
        body: (
          <>
            <p>
              I decided against the usual &quot;app talk&quot;,{" "}
              <Emph>it&apos;s niceness that does little for real motivation</Emph>
              . I instead opted for a brutally honest voice, like a friend who
              keeps you in check.
            </p>
            <p>
              I did later add two other profiles for those who didn&apos;t
              want the bluntness: one which spoke to you like a supportive
              bestie, and another that told your story in third person.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/memor/m-05.png",
            alt: "Two Memor notifications written in a brutally honest tone telling the user to go for a walk.",
            width: 794,
            height: 510,
            caption: "The Brutally Honest voice in action, motivation that reads like a friend keeping you in check.",
          },
        ],
      },
      {
        heading: "How do we visualise a week?",
        body: "To compete with existing calendars I added a weekly view by stacking the daily shape into a visually stacked week. This unexpectedly made weekly trends visible - easier to spot your busiest and quietest times in a week.",
        media: [
          {
            src: "/work/memor/weekly-radial-view.jpg",
            alt: "A radial weekly calendar built by stacking each day's organic shape, with Monday highlighted in blue against the six other days in grey.",
            width: 1041,
            height: 1038,
            caption: "The weekly view, stacking daily shapes made weekly trends visible at a glance.",
          },
        ],
      },
    ],
    shipped: (
      <>
        <p>
          High-fidelity prototypes: the fluid 0–23 clock-calendar with event
          circles, animated event management, three tone-of-voice profiles, a
          stacked weekly view, and notes.
        </p>
        <p>I created 3 different scenarios for the final prototype.</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>
            The user is scrolling on social media and is prompted to do
            something better with their time
          </li>
          <li>The user is working and is prompted to take a break</li>
          <li>
            The user wants to add an event to an already busy day, and the
            calendar rejects it
          </li>
        </ul>
        <p>
          I also had to create a final video showing what the project really
          stands for, showing experiencing productivity guilt and where the
          app would come in to help alleviate that.
        </p>
      </>
    ),
    shippedLabel: "Submitted",
    reflection: (
      <p>
        This was a very fun conceptual project,{" "}
        <Emph>
          pushing the limits of how I could represent a calendar visually
        </Emph>
        , exploring tone of voice led to a project I&apos;m seriously happy
        with.
      </p>
    ),
    gallery: [
      {
        src: "/work/memor/m-13.png",
        alt: "A grid of Memor's screens and assets: the main menu, notifications, event recommendations, the calendar with notes, and the tone-of-voice picker.",
        width: 1200,
        height: 675,
        caption: "A collection of screens and assets from the final version.",
      },
      {
        kind: "youtube",
        id: "xL4u8T9JiBE",
        title: "Memor project video",
        caption: "The project video, walking through the concept end to end.",
      },
    ],
  },
  {
    slug: "stori",
    section: "earlier-projects",
    art: StoriArt,
    tag: "Sponsored research",
    tagMuted: true,
    topics: ["Human-centred Design", "User Research"],
    title: "Tell Me a Story",
    summary:
      "A way for parents to keep bonding with their baby during a NICU stay.",
    cardImage: {
      src: "/work/stori/tmas-build-special.png",
      alt: "Five screens of the Tell Me A Story prototype in a dark purple night-sky theme.",
      width: 2000,
      height: 746,
    },
    cover: {
      src: "/work/stori/tmas-build-special.png",
      alt: "Five screens of the Tell Me A Story high-fidelity prototype: onboarding, story type selection, recording, stories and home.",
      width: 2000,
      height: 746,
    },
    snapshot: {
      role: "UX Designer (internship), sole designer on the continuation",
      timeline: "Jan – Jun 2025, continuing a 2023 university project",
      team:
        "Sponsored by Sarra Hoy (Bliss ambassador) · Dr. Lauren Shaw (Senior Neonatal Nurse) · DJCAD & School of Medicine · Ninewells Hospital NICU",
      tools: "Figma (low-fidelity), Bubble.io (high-fidelity)",
      statement: (
        <>
          In a Neonatal Intensive Care Unit (NICU),{" "}
          <Emph>
            the bond between parent and newborn is disrupted exactly when it
            matters most
          </Emph>
          : you go from birth, to touching your baby through an incubator, to
          leaving them overnight.
        </>
      ),
      overview: (
        <>
          <p>
            A parent&apos;s voice is one of the few known things that support
            brain development and bonding. Tell Me a Story lets parents
            record stories and messages for their baby in a NICU, which
            nurses can then play for the baby when parents can&apos;t be
            there.
          </p>
          <p>
            Feedback was <Emph>overwhelmingly positive</Emph>. Parents with
            real neonatal experience said they would have valued it during
            their own stay.
          </p>
        </>
      ),
    },
    constraints: (
      <>
        <p>
          <Emph>Playback could never be guaranteed.</Emph> As the senior neonatal
          nurse put it, “there would be intent to play the audio, but no
          guarantee, clinical duties come first.” The design had to set that
          expectation rather than hide it.
        </p>
        <p>
          <Emph>Safeguarding had to be visible.</Emph> “We&apos;d need a way to
          check it&apos;s for the right baby”, plus open questions on NHS system
          integration and information governance.
        </p>
        <p>
          <Emph>The prototype had to actually record audio</Emph>, which pushed
          me onto Bubble.io. It handled the recording but restricted the design
          everywhere else, and being web-based added a lag between screens.
        </p>
        <p>
          Worth noting this was <Emph>pre-AI</Emph>. There was no assistant to
          lean on for the parts Bubble.io made difficult, so getting functional
          voice recording, pause, restart and playback working took far longer
          than the design itself, and every workaround had to be found the slow
          way.
        </p>
      </>
    ),
    decisions: [
      {
        heading: "Using what I already knew",
        body: (
          <>
            <p>
              In my 3rd year of University, our class took on this project to
              provide some early proof of concept. I worked with a classmate
              of mine, <Emph>Pavlin Petev</Emph>. We created a simple design,
              record a story, send it to the hospital to play.
            </p>
            <p>
              All of our classes projects were shared with nurses and those
              involved in the accompanying research project, which{" "}
              <Emph>
                gave me the strengths and weaknesses of all the projects to
                start from
              </Emph>
              .
            </p>
          </>
        ),
        media: [
          {
            src: "/work/stori/s-07.png",
            alt: "Exhibition board for the earlier Stori project showing the concept, features and mockups.",
            width: 1200,
            height: 848,
            caption:
              "Before: the 2023 third-year project built with Pavlin Petev, the concept I was asked to continue.",
          },
        ],
      },
      {
        heading: "A special story, and a sweet message",
        body: (
          <>
            <p>
              Testing early versions made it clear that{" "}
              <Emph>one recording flow couldn&apos;t serve both intents</Emph>. A
              parent reading a book needs to pause, restart, and hear it back. A
              parent saying goodnight before they leave needs one tap.
            </p>
            <p>
              So I created two types of recordings: <Emph>Special Story</Emph>{" "}
              carries the full controls, <Emph>Sweet Message</Emph> behaves like
              a voice note. Which one a parent picks depends less on the
              feature, and more on how much you have left in you that day.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/stori/tmas-build-special-4up.png",
            alt: "The Special Story recording flow with restart, pause and stop controls and a live waveform.",
            width: 1600,
            height: 746,
            caption:
              "Special Story, pause, restart and playback, for reading a book.",
          },
          {
            src: "/work/stori/tmas-build-sweet-4up.png",
            alt: "The Sweet Message recording flow with a single stop control.",
            width: 1600,
            height: 746,
            caption: "Sweet Message, one tap, for saying goodnight.",
          },
        ],
      },
      {
        heading: "Make it warm, not medical",
        body: (
          <>
            <p>
              The Ninewells NICU in Dundee is deliberately softened with
              illustrations. I took a similar line:{" "}
              <Emph>nothing that reads as clinical or cold</Emph>. Red was
              ruled out entirely; in that environment, it means emergency.
            </p>
            <p>
              The reference point became children&apos;s books, and the design
              settled on a <Emph>night sky with a glowing yellow</Emph>. The
              onboarding does the expectation-setting the nurse asked for, and
              one of her phrases, “anything that leaves that little heartstring
              of attachment,” made it into the app itself.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/stori/tmas-onboarding-1.jpg",
            alt: "Onboarding screen explaining what Tell Me A Story is, with a line illustration of a parent holding a baby.",
            width: 399,
            height: 804,
            caption: "Onboarding, what the app is for, in plain language.",
          },
          {
            src: "/work/stori/tmas-onboarding-2.jpg",
            alt: "Onboarding screen titled Our Goal, describing leaving a heartstring of attachment.",
            width: 399,
            height: 798,
            caption:
              "The nurse’s phrase, carried straight into the product copy.",
          },
        ],
      },
      {
        heading: "Talking to parents who have been through it",
        body: (
          <>
            <p>
              We ruled out talking to any parents who had a baby currently in
              the NICU,{" "}
              <Emph>it would&apos;ve been invasive and inappropriate</Emph>.
              Recruitment was limited to parents within five years of their
              experience, recent enough to recall.
            </p>
            <p>
              <Emph>17 people showed interest, 11 completed ethics, 6 tested</Emph>
              : a 35% conversion with no incentive offered beyond interest in
              the project. Sessions ran up to an hour as semi-structured
              interviews around the prototype. All six participants were
              female and UK-based as it was targeted for the NHS.
            </p>
          </>
        ),
      },
    ],
    shipped: (
      <>
        <p>
          A working high-fidelity prototype in Bubble.io with{" "}
          <Emph>functional voice recording</Emph>: onboarding, the story-type
          fork, recording with playback, a Stories page (Daytime, Bedtime, A
          Story I Love), and a Home page of storytelling tips.
        </p>
        <p>
          Alongside it, a full research report, protocol, participants, findings,
          emerging themes and recommendations, plus the nurse-side requirements
          that fell out of scope.
        </p>
      </>
    ),
    gallery: [
      {
        src: "/work/stori/tmas-onboarding-3.jpg",
        alt: "Onboarding screen explaining how recording helps the baby's development.",
        width: 405,
        height: 804,
        caption: "Why a parent’s voice matters, for the baby.",
      },
      {
        src: "/work/stori/tmas-onboarding-4.jpg",
        alt: "Onboarding screen explaining how recording helps the parent.",
        width: 399,
        height: 798,
        caption: "And why it matters for the parent.",
      },
      {
        src: "/work/stori/tmas-onboarding-6.jpg",
        alt: "Onboarding screen for saving stories into a rotation of morning, night time and post-feed.",
        width: 405,
        height: 804,
        caption: "Stories as a rotation, borrowing the rhythm of a normal day.",
      },
    ],
    outcome: (
      <>
        <p>
          Feedback was <Emph>overwhelmingly positive</Emph>. Parents said they
          would have valued it during their own stay, “just knowing they could
          still hear your voice would have helped”, and the tone landed as
          intended, described as “communicated in a compassionate and sensitive
          way”, in contrast to existing neonatal apps that “wasn&apos;t a very
          visually pleasing system”.
        </p>
        <p>
          I wrote a report on the findings which brought light to{" "}
          <Emph>6 design implications</Emph>. Bonding through audio, the need
          for normalcy, language, emotional load, guilt, and visual design. I
          created five recommendations and a feature shortlist for the future
          of the project.
        </p>
      </>
    ),
    reflection: (
      <>
        <p>
          This is <Emph>the most human-centred project I&apos;ve ever worked
          on</Emph>. Working so closely with Sarra Hoy, who sponsored the
          project and had not only gone through the experience herself but
          also advocates for others through the Bliss charity, was truly
          special.
        </p>
        <p>
          Testing it with parents who were{" "}
          <Emph>
            so genuinely invested in the project&apos;s success
          </Emph>
          , and who wished they&apos;d had something like it at the time, was
          probably the most rewarding experience of my career so far.
        </p>
      </>
    ),
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

/**
 * One entry in a case study's table of contents. `id` is the DOM id of the
 * matching <section>; `label` is the section's actual heading text, so a
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
  if (project.constraints) {
    sections.push({ id: "constraints", label: "Constraints" });
  }

  project.decisions?.forEach((decision, index) => {
    sections.push({ id: decisionId(index), label: decision.heading });
  });

  if (project.shipped) {
    sections.push({ id: "shipped", label: project.shippedLabel ?? "Shipped" });
  }
  if (project.outcome) sections.push({ id: "impact", label: "Impact" });
  if (project.reflection) {
    sections.push({ id: "reflection", label: "Reflection" });
  }

  return sections;
}
