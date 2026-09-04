import type { ComponentType } from "react";
import {
  LastActiveArt,
  FeatureTogglesArt,
  AudioBubblesArt,
  FiveWhysArt,
  MemorArt,
  StoriArt,
} from "@/components/project-art";
import { Disclosure } from "@/components/case-study/disclosure";
import { ToneComparison } from "@/components/tone-comparison";
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
   * Which section of the site lists the project. "ai" sits under the AI section
   * rather than Work, since that work puts AI inside the design itself.
   *
   * "accessibility" is its own section on the work page rather than a subsection
   * of Genio Admin: the work is on Genio Notes, not the admin platform, so the
   * Genio Admin intro copy doesn't describe it.
   */
  section: "genio-admin" | "accessibility" | "ai" | "earlier-projects";
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
  /**
   * A second link on the work row, beside "View case study", for work that has
   * a companion page worth reaching directly.
   */
  secondaryAction?: { href: string; label: string };
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
    title:
      "Last Active Filtering: a hidden definition, now admin-controlled",
    summary:
      "Shows how I tested a hunch about the real problem instead of speccing from it, replacing a fixed system with one admins define themselves.",
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
      role:
        "Junior UX Designer on Genio Admin, design lead within a cross-functional trio",
      // TODO: timeline, team, tools
      statement: (
        <>
          Admins couldn&apos;t tell which students were genuinely falling out
          of Genio Notes, so they couldn&apos;t follow up correctly. I let each
          institution define what Active, At Risk and Inactive mean to them.{" "}
          <Emph>
            It beat its 20% Q2 target, sits at 25.4% and climbing, and answered
            a blocker at our largest institutions.
          </Emph>
        </>
      ),
      overview: (
        <p>
          <Emph>There was no way to filter by Last Active status at all</Emph>.
          The RAG statuses behind it were fixed at 0–7, 7–14 and 14+ days, and
          invisible to admins. I suspected few admins knew what the colours
          actually meant. I tested that rather than speccing from it, and it
          held up. The fix wasn&apos;t a better filter, it was handing admins
          the definition itself.
        </p>
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
                I put both solutions head to head in a survey with our Admin
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
            src: "/work/last-active/final-ranges-modal.png",
            alt: "The Edit Last Active Ranges dialog, with week inputs for Active and Inactive, the At risk range in between derived from those two, and a reset to default option.",
            width: 608,
            height: 431,
            caption:
              "Final solution: two input boxes with a middle range that auto-adjusts. The wording spells out exactly what setting that range means.",
          },
        ],
      },
      {
        heading: "What do admins really think about it?",
        body: (
          <>
            <p>
              For extra validation we ran sessions with four institutions
              across the UK and US, all Genio admins working in accessibility
              and disability services. Rather than taking them through it,{" "}
              <Emph>I put them in the driver&apos;s seat</Emph> with a
              high-fidelity prototype I created.
            </p>
            <p>
              Reactions to the filter were immediate: one admin called it{" "}
              <Emph>&ldquo;great&rdquo; and &ldquo;very useful&rdquo;</Emph>{" "}
              on sight. They went on to say the work
              &ldquo;makes the portal more user friendly&rdquo;, and another
              could see it &ldquo;saving quite a bit of time&rdquo;. These were
              reactions to a prototype rather than the shipped feature, but the
              intent landed without me having to explain it.
            </p>
            <p>
              It also surfaced what a demo wouldn&apos;t:{" "}
              <Emph>
                once admins could isolate a group they wanted to act on it
              </Emph>
              , export it, email it, bulk deactivate it.
            </p>
          </>
        ),
      },
    ],
    shipped: (
      <p>
        A Last Active filter in the users table, with the four states as
        checkboxes, each carrying its status icon. An Edit Ranges control opens
        the editor, where an admin sets the week boundaries for Active, At risk
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
          A 20% adoption rate was our key Q2 objective.{" "}
          <Emph>
            It hit 22.7% by review and 25.4% today, all through the academic
            quiet season.
          </Emph>
        </p>
        <p>
          It also answered a blocker at our largest institutions, where IT
          teams doubted they could manage users at that volume. Two deals were
          riding on it, so the PM and I went to them. One was weighing up
          whether to renew at all;{" "}
          <Emph>
            they renewed once they understood what was coming, before a line of
            it shipped
          </Emph>
          . We reached only one of the two, but the objection has an answer now.
        </p>
        <p>
          Before this, an admin sorted by last active, read each date, and
          decided user by user what it meant. Bulk deactivation already
          existed; what it lacked was a list worth running against.{" "}
          <Emph>
            Now the ranges carry that judgement and the filter returns the
            group
          </Emph>
          , the saving admins raised most.
        </p>
        <p>
          Admins went from having no say in that definition to setting it once.{" "}
          <Emph>They stay in the driver&apos;s seat, where they should be.</Emph>
        </p>
      </>
    ),
    reflection: (
      <>
        <p>
          The obvious fix, a date picker, would&apos;ve only solved half the
          problem. What I&apos;d carry forward is the sequence:{" "}
          <Emph>
            treat the hunch as a hypothesis, put it head to head with the
            obvious answer, then spec it.
          </Emph>
        </p>
        <p>
          The other lesson was{" "}
          <Emph>handing the prototype over rather than demoing it</Emph>.
          Watching admins isolate a group and reach straight for exporting,
          emailing and bulk deactivating it taught me more than a walkthrough
          would. It shaped the roadmap beyond this feature.
        </p>
      </>
    ),
  },
  {
    slug: "feature-toggles-for-ai-tools",
    section: "genio-admin",
    art: FeatureTogglesArt,
    tag: "Case study",
    topics: ["Stakeholder Management", "Systems Thinking"],
    title: "AI Feature Toggles: the feature I stopped us overbuilding",
    summary:
      "Shows how I managed cross-functional stakeholder feedback, stepped up to cover PM responsibilities while navigating ambiguity, and used systems thinking to avoid overbuilding a solution.",
    cardImage: {
      src: "/work/feature-toggles/final-org-form.png",
      alt: "The shipped Edit Organisation screen, showing the Manage Features block alongside general details.",
      width: 1311,
      height: 900,
    },
    cover: {
      src: "/work/feature-toggles/final-org-form.png",
      alt: "The shipped Edit Organisation screen, with a Manage Features block marked New! listing Study Notes, QuizMe and Outlines, alongside general details and sharing policy.",
      width: 1311,
      height: 900,
    },
    snapshot: {
      // TODO: exact timeline dates and stakeholder names/roles to confirm.
      role:
        "Junior UX Designer on Genio Admin, design lead within a cross-functional trio, standing in for the PM",
      timeline: "TODO, confirm dates",
      team: "TODO, confirm names and roles",
      statement: (
        <>
          Genio Notes&apos; AI tools help students, but they can conflict with
          a school&apos;s academic policies. Admins had no way to control who
          could access which tools, so schools were stuck choosing between
          blocking AI outright or leaving it wide open.{" "}
          <Emph>
            I designed an org-wide setting with group-level overrides, built on
            the Groups system admins already knew
          </Emph>
          . That was instead of the whole new profiles system we were asked
          for.
        </>
      ),
      overview: (
        <p>
          The work came out of shipping Study Notes, our AI generated
          summaries. Admins needed a way to turn it on or off for people. Our
          PM was on leave, so I carried the role alongside my own: stakeholder
          conversations, scope, and challenging what we had been asked to
          build.{" "}
          <Emph>
            What we shipped is far smaller than what I was handed, and does the
            same job.
          </Emph>
        </p>
      ),
    },
    decisions: [
      {
        heading: "Look past the request to the outcome",
        body: (
          <>
            <p>
              It became clear that stakeholders wanted to match a competitor,
              by delivering feature toggles through a new
              “profiles” system. That meant adding a whole new
              system to the admin platform.
            </p>
            <p>
              Rather than take the request at face value, I dug into what was
              actually being asked for: the outcome stakeholders wanted, not
              the system they had named.
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
              functionality. I made that case in the PM&apos;s place,{" "}
              <Emph>
                attending the meetings and taking the stakeholder conversations
                myself until the room was behind it
              </Emph>
              .
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
        heading: "Org-wide baseline, group-level override",
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
            width: 1175,
            height: 749,
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
            width: 1237,
            height: 900,
            caption:
              "Before: the organisation form as it stood: one long stacked column, with nowhere for feature management to live.",
          },
          {
            src: "/work/feature-toggles/final-org-form.png",
            alt: "The shipped Edit Organisation screen, with a Manage Features block marked New! listing Study Notes, QuizMe and Outlines, alongside general details and sharing policy.",
            width: 1311,
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
        Notes, with group-level overrides on top. It let admins match their
        academic AI policies through a system they already knew.
      </p>
    ),
    gallery: [
      {
        src: "/work/feature-toggles/final-edit-group.png",
        alt: "The shipped Edit Group screen, with Managed Features set to Customise for this group and each feature labelled with its organisation default.",
        width: 1311,
        height: 898,
        caption:
          "Shipped: the group override. Each feature carries its organisation default in the label, so an admin can see what they're departing from.",
      },
    ],
    outcome: (
      <>
        <p>
          The objective was never adoption. It was{" "}
          <Emph>
            cutting the requests reaching support and customer success asking
            for AI features to be turned off
          </Emph>
          . That figure hasn&apos;t come back to me yet, so the headline result
          is still outstanding.
        </p>
        <p>
          What I can report is use:{" "}
          <Emph>11.8% of organisations in the first month</Emph>. Admins were
          changing their toggle settings, not just looking at them. That was
          over the summer break, when most institutions are quiet.
        </p>
        <p>
          <Emph>The bigger result was what we didn&apos;t build.</Emph> A
          profiles system meant a second permission model to design, integrate
          and maintain. We had a conference deadline, and we hit it. It would
          also have left every future feature weighed against three layers
          instead of two.
        </p>
      </>
    ),
    reflection: (
      <>
        <p>
          The value I added here wasn&apos;t in the pixels, it was in the PM
          work: absorbing conflicting stakeholder feedback and steering it
          toward an approach the platform could actually carry.
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
    section: "accessibility",
    art: AudioBubblesArt,
    secondaryAction: {
      href: "/process/accessibility",
      label: "How I approach accessibility",
    },
    tag: "Case study",
    topics: ["Accessibility", "Experimentation"],
    title:
      "Making an audio interface accessible without making it visually loud",
    summary:
      "Shows how I balanced WCAG 2.1 AA compliance with usability testing and iterative design to solve for accessibility without sacrificing UX.",
    snapshot: {
      role:
        "Junior UX Designer on Genio Notes, taking on the more complex WCAG compliance work",
      timeline: "Sep 2025 – Jan 2026",
      team:
        "Dave Tucker-Diaz (CEO), Paul Davis (Head of UX), Steven (accessibility/dev support), Matt Russell (analytics), Level Access (external WCAG auditor)",
      tools: "Figma, Pendo, a custom bubble playground prototype",
      statement: (
        <>
          Genio Notes&apos; audio capture interface (audio bubbles) failed
          WCAG 2.1 AA contrast. Our CEO raised a concern: simply strengthening
          the colour to pass would increase cognitive load for what is mostly a
          background element.{" "}
          <Emph>
            I met contrast in the borders and the weight instead of the fill
          </Emph>
          . That led to a cleaner, lighter interface.
        </>
      ),
      overview: (
        <p>
          Each colour marks a different note type: important notes in red,
          notes flagged for review in yellow, and regular notes in blue. The
          audit found failures in both modes, and not the same ones.{" "}
          <Emph>
            In dark mode grey (4.04:1) and yellow (3.5:1) passed, while blue
            (2.94:1) and red (2.42:1) failed
          </Emph>
          . In light mode only red passed.
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
                alt: "The same three slide sections side by side: the original audio bubbles on the left, and on the right the same bubbles darkened to force 3:1 contrast, where the greys and oranges turn muddy.",
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
              reduced the connecting lines from 2px to 1px, and shrank the
              bubbles themselves, inactive ones from 8px to 5px, active ones
              from 12px to 11px. I kept those sizes odd so the bubbles would
              sit centred on the thinner line.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/audio-bubbles/light-dark-panels.png",
            alt: "Two audio tab panels side by side: the proposed outlined bubbles under a purple header on the left, and the original solid grey bubbles under a teal header on the right.",
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
            height: 401,
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
          Contrast lives in the border and the weight, not the fill. An
          inactive bubble carries a background fill with a contrast-passing
          border, and a lighter fill when active. Lines stay 1px at full
          contrast, per the ruling. Heights of 5px and 11px keep them centred
          on the thinner line.
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
        <p>
          <Emph>
            Every bubble colour now clears 3:1 in both modes, confirmed on
            re-audit
          </Emph>
          , and without the cost our CEO had flagged. Contrast came from the
          borders and the weight rather than the saturation, so a background
          element stayed in the background.
        </p>
        <p>
          That mattered commercially.{" "}
          <Emph>
            WCAG 2.1 AA is a condition of selling into the US market
          </Emph>
          . This was one of the failures standing between Genio Notes and a
          clean VPAT. The deadline driving it later moved, but the requirement
          didn&apos;t.
        </p>
        <p>
          I also left usage logging on the tab in place, so any future
          investment there can be argued from data rather than instinct.
        </p>
      </>
    ),
    reflection: (
      <>
        <p>
          All this experimenting came down to one principle:{" "}
          <Emph>
            treat compliance as a prompt to rethink the design, not a box to
            tick
          </Emph>
          . Forcing the fill to 3:1 would have passed the audit and made the
          product worse. Testing the alternative is what produced a design that
          worked better for everyone.
        </p>
        <p>
          <Emph>
            I took this from a failed audit to an interface that passes and
            looks better for it
          </Emph>
          . That meant managing stakeholder input up to CEO level. It also
          meant bringing in an external authority to settle the one question we
          couldn&apos;t answer internally.
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
    title:
      "Memor: challenging conventional calendars with fluidity and tone of voice",
    summary:
      "Shows how I applied human-centred, 0-to-1 conceptual thinking to challenge convention through fluid visuals and tone of voice.",
    cover: {
      src: "/work/memor/m-14.jpg",
      alt: "The Memor prototype open on a phone on a stand, showing the fluid clock-calendar with red and blue event circles, beside a laptop on a desk.",
      width: 2000,
      height: 1333,
    },
    snapshot: {
      role:
        "Sole designer on my 4th year Honours project: ideation, research, prototyping and every deliverable submitted",
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
                calendars, but physical calendars offer more visibility than
                digital ones.
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
            width: 1581,
            height: 508,
            caption:
              "The shape's progression: rigid squares, softened into an organic blob, then set inside the familiar clock face.",
          },
          {
            src: "/work/memor/fluid-shape-iteration.png",
            alt: "Three framed panels: a dark calendar concept with a glowing outline and event labels, a small dark green-and-white blob study, and the blue-and-orange blob on white.",
            width: 1817,
            height: 514,
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
              keeps you in check. Same nudge, same moment, only the tone
              changes.
            </p>
            <p>
              Which one is more likely to actually get you on a walk?
            </p>
            <ToneComparison />
            <p>
              I did later add two other profiles for those who didn&apos;t
              want the bluntness: one which spoke to you like a supportive
              bestie, and another that told your story in third person.
            </p>
          </>
        ),
      },
      {
        heading: "How do we visualise a week?",
        body: "To compete with existing calendars I added a weekly view by stacking the daily shape into a visually stacked week. This unexpectedly made weekly trends visible: it was easier to spot your busiest and quietest times in a week.",
        media: [
          {
            src: "/work/memor/weekly-radial-view.jpg",
            alt: "A radial weekly calendar on a 00 to 23 hour scale, built by stacking each day's organic shape, with Monday highlighted in blue against the six other days in grey.",
            width: 965,
            height: 950,
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
          I also made a final video showing what the project stands for. It
          follows the experience of productivity guilt, and where the app steps
          in to ease it.
        </p>
      </>
    ),
    shippedLabel: "Submitted",
    outcome: (
      <>
        <p>
          <Emph>The project was awarded a first.</Emph> It was exhibited at the
          DJCAD degree show, in front of an audience that included people
          working in the industry.
        </p>
        <p>
          The reaction that stayed with me came from a visitor with ADHD.{" "}
          <Emph>
            They said the fluid shape made the day feel less cutthroat about
            start and stop times
          </Emph>
          . It would also stop them planning too much, or doing too little.
          That is one conversation, not a finding. But I had designed that
          shape to challenge the grid and take the guilt out of a calendar. It
          turned out to do something I hadn&apos;t designed for.
        </p>
      </>
    ),
    reflection: (
      <>
        <p>
          This was a very fun conceptual project,{" "}
          <Emph>
            pushing the limits of how I could represent a calendar visually
          </Emph>
          . I picked up After Effects and wired it into Protopie to get the
          fluid shape moving. I paired it with a tone of voice no calendar app
          would dare ship.
        </p>
        <p>
          What I took from it is that{" "}
          <Emph>
            the far-out concepts are worth chasing, and approaching something
            in a genuinely new way carries its own value
          </Emph>
          . The degree show was the proof. A grid would never have prompted
          what that visitor told me, because what they responded to was the
          part that broke convention.
        </p>
      </>
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
    title:
      "Tell Me a Story: giving parents a heartstring of attachment in a tough time",
    summary:
      "Shows how I created a 0-to-1 concept relying on human-centred design for parents who were going through a neonatal experience.",
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
      role:
        "UX Designer, sole designer on the continuation: research, design and the written report",
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
            A DJCAD and School of Medicine study on the Ninewells neonatal ward
            had already found that a parent&apos;s presence, and their voice in
            particular, is vital to a baby&apos;s brain development and
            bonding. I picked the project up from there. Tell Me a Story lets
            parents record stories and messages for their baby in a NICU, which
            nurses can then play when parents can&apos;t be there.
          </p>
          <p>
            It tested well with parents who had lived through a NICU stay. What
            I handed over was{" "}
            <Emph>
              a working proof of concept and a research report carrying six
              design implications and five recommendations
            </Emph>
            , for whoever takes the project forward.
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
          <Emph>Safeguarding had to be visible.</Emph>{" "}
          “We&apos;d need a way to check it&apos;s for the right baby”, plus open questions on NHS system
          integration and information governance.
        </p>
        <p>
          <Emph>The prototype had to actually record audio</Emph>, which pushed
          me onto Bubble.io. It handled the recording but restricted the design
          everywhere else, and being web-based added a lag between screens.
        </p>
        <p>
          Worth noting this was <Emph>pre-AI</Emph>, with no assistant to lean
          on for the parts Bubble.io made difficult. Getting voice recording,
          pause, restart and playback genuinely working took longer than the
          design itself. I found every workaround the slow way, and shipped a
          prototype that actually recorded.
        </p>
      </>
    ),
    decisions: [
      {
        heading: "Start from what the class already learned",
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
              the project. All six participants were female and UK-based, since
              the concept targeted the NHS.{" "}
              <Emph>
                That is a real gap: the app speaks to parents, but I only heard
                from mothers.
              </Emph>
            </p>
            <p>
              Each session ran up to an hour, split three ways. Around five
              minutes of icebreaking, to understand that parent&apos;s own
              neonatal experience. Then 10 to 15 minutes of free roam on the
              prototype, thinking aloud. The rest went on{" "}
              <Emph>13 semi-structured questions</Emph>, with follow-ups
              wherever an answer opened something up.
            </p>
            <Disclosure summary="The 13 questions I asked">
              <ol className="flex list-decimal flex-col gap-2 pl-5 text-foreground">
                <li>
                  How did you find the onboarding process? How clear and
                  helpful was it? Why was this so?
                </li>
                <li>
                  How does the ability to record and send audio to the hospital
                  help you overcome communication barriers with your infant?
                </li>
                <li>
                  In what ways did any visual feedback during the recording
                  process affect your approach to recording your voice?
                </li>
                <li>
                  How intuitive was the process of recording and reviewing your
                  audio message?
                </li>
                <li>
                  Did you feel confident that your recording would successfully
                  be played for your baby?
                </li>
                <li>
                  Did the app provide enough information about how your
                  recordings would be managed by the nursing team at the
                  hospital?
                </li>
                <li>
                  What did you think of the different types of stories and how
                  they can be managed?
                </li>
                <li>
                  Do you think the information and stories on the home page
                  were helpful?
                </li>
                <li>What did you think of the language used in the app?</li>
                <li>
                  Were there any of the features in the app that may help you
                  to alleviate stress and anxiety? If so, what were they and
                  why?
                </li>
                <li>
                  Is there anything you would change to help make the
                  experience more comforting for you?
                </li>
                <li>
                  Would you recommend this app to parents of neonatal infants?
                </li>
                <li>
                  Are there any other thoughts you had on the prototype?
                </li>
              </ol>
            </Disclosure>
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
          <Emph>The tone landed exactly as intended.</Emph>{" "}
          One parent described it as “communicated in a compassionate and
          sensitive way”. They set that against an existing neonatal app that
          “wasn&apos;t a very visually pleasing system”. Another
          said that “just knowing they could still hear your voice
          would have helped”.
        </p>
        <p>
          The willingness to take part was its own finding.{" "}
          <Emph>
            Six parents each gave up to an hour to revisit one of the hardest
            periods of their lives
          </Emph>
          . The only incentive was caring about the project.
        </p>
        <p>
          I wrote up the findings as six design implications: bonding through
          audio, the need for normalcy, language, emotional load, guilt, and
          visual design. From those I set out five recommendations and a
          feature shortlist for whoever picks the project up next.
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
        <p>
          The craft lesson was{" "}
          <Emph>designing around a constraint I couldn&apos;t remove</Emph>.
          Playback could never be promised, because clinical duties come first.
          The honest move was to say so in the onboarding rather than let a
          parent assume otherwise. I&apos;d also push harder for time with the
          nurses: I designed the parent side thoroughly and left theirs as
          requirements for someone else to pick up.
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
