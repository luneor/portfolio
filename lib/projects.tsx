import type { ComponentType } from "react";
import {
  LastActiveArt,
  FeatureTogglesArt,
  AudioBubblesArt,
  FiveWhysArt,
  MemorArt,
  StoriArt,
} from "@/components/project-art";

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
}

export type ProjectMedia = ProjectImage | ProjectVideo;

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
  /** 5. Outcome: result / impact. */
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

/**
 * A deliberately visible gap in a write-up: a fact, artefact or asset still to
 * be supplied. Loud on purpose: nothing here should reach a published page, so
 * it should be obvious in review rather than blending into the copy.
 */
function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-brand-strong px-4 py-3 font-mono text-[0.78rem] leading-relaxed text-foreground-muted">
      <strong className="font-bold text-brand-strong">TO ADD, </strong>
      {children}
    </p>
  );
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
    cardImage: {
      src: "/work/last-active/final-ranges-in-context.png",
      alt: "The Last Active Ranges dialog open over the users table, defining the range for each status.",
      width: 1600,
      height: 900,
    },
    snapshot: {
      role: "UX Designer, Genio Admin (BEAR Squad)",
      // TODO: timeline, team, tools
      statement: (
        <>
          Admins couldn&apos;t tell who had genuinely gone quiet, so I let each
          institution define what Active, At risk and Inactive mean for them,
          chosen over the obvious date picker after testing both with real
          admins. <Emph>Adoption sits at 25.4% and is still growing.</Emph>
        </>
      ),
      overview: (
        <>
          <p>
            Genio Admin&apos;s user table reported last activity as a fixed,
            binary status, so neither the students who had stopped engaging nor
            the ones drifting toward it could be isolated. The obvious fix was a
            date picker, which would have made every admin do the arithmetic
            themselves and still not agree on what &quot;active&quot; meant.
          </p>
          <p>
            Instead the thresholds became <Emph>admin-defined</Emph>: each
            institution sets its own week boundaries for the four states, filters
            on them, and edits them in place. I put that against the date picker
            in an A/B survey and in prototype calls before building it.
          </p>
          <p>
            It shipped as a Last Active filter with an Edit Ranges editor.{" "}
            <Emph>Admins recorded and shared videos praising it unprompted</Emph>,
            and their wish to act on a filtered group rather than just see it
            pushed CSV export up the roadmap.
          </p>
        </>
      ),
    },
    problem: (
      <>
        <p>
          Admins needed to find <Emph>who was genuinely inactive</Emph>, to bulk
          deactivate them, and <Emph>who was genuinely at risk</Emph>, to get in
          touch. The “last active” data was stagnant and binary, so neither group
          was easy to isolate.
        </p>
        <p>
          RAG statuses existed, but <Emph>their thresholds were fixed and
          invisible</Emph>, 0–7 days green, 7–14 amber, 14+ red. My read was that
          few admins knew what the colours meant, which makes a status hard to act
          on.
        </p>
      </>
    ),
    decisions: [
      {
        heading: "Pass on the date picker for custom ranges",
        body: (
          <>
            <p>
              The standard answer is a date picker: pick a cut-off, filter
              against it. But <Emph>it hands over no more control than the fixed
              thresholds did</Emph>, you still have to know which date matters
              first.
            </p>
            <p>
              The statuses were the thing admins couldn’t see inside, so the
              opportunity was to make those definitions editable rather than
              route around them: the admin sets what Active, At risk and
              Inactive mean, and the statuses start reflecting their own
              institution.
            </p>
            <p>
              I <Emph>A/B tested both in a survey with admins who actually use
              Genio</Emph>. They preferred custom ranges, and the reason they gave
              was the sense of control it offered, not the filtering itself.
            </p>
          </>
        ),
      },
      {
        heading: 'Let admins define what "active" means',
        body:
          'I introduced four RAG-coded status categories (Active, At Risk, Inactive, No Data) and, critically, let admins set their own week-thresholds for each one, rather than imposing a single fixed definition of "active" across every institution.',
        media: [
          {
            src: "/work/last-active/ideation-icons.png",
            alt: "Five variants of an Activity filter card, each showing the four states, Active, At risk, Inactive, No data, with differently weighted status icons.",
            width: 820,
            height: 565,
            caption:
              "Ideation, icon treatments for the four states, compared at the size they'd actually be read at in the filter.",
          },
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
            src: "/work/last-active/ideation-filter-date.png",
            alt: "The users table with a filter panel open, showing a Last Active date picker with a January 2026 calendar.",
            width: 1280,
            height: 720,
            caption:
              "Ideation, filtering the table by a specific last-active date.",
          },
          {
            src: "/work/last-active/ideation-filter-status.png",
            alt: "The users table with a filter panel open, showing a Filter by Last Active Status dropdown listing Green (Active), Amber (At Risk) and Red (Inactive).",
            width: 1280,
            height: 720,
            caption:
              "Ideation, filtering by status rather than by date, which is what the thresholds make possible.",
          },
        ],
      },
      {
        heading: "Run the prototype as scenarios, not a demo",
        body: (
          <>
            <p>
              On the customer calls I handed the prototype to the admin rather
              than driving it, and read out scenarios, “you want to see who’s at
              risk so you can contact them: set the inactive range to 2–4 weeks
              and filter by inactive.” That tests whether the model works under a
              real intent, not whether a walkthrough is persuasive.
            </p>
            <p>
              It landed well, and surfaced what a demo wouldn’t: <Emph>once admins
              could isolate a group they wanted to act on it</Emph>, export, email,
              bulk deactivate. That shaped the roadmap beyond this feature.
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
      {
        src: "/work/last-active/final-ranges-modal.png",
        alt: "The Edit Last Active Ranges dialog, with week inputs for Active, At risk and Inactive and a reset to default option.",
        width: 608,
        height: 431,
        caption:
          "Shipped: the range editor: each status spelled out as a sentence that updates with the week values.",
      },
      {
        src: "/work/last-active/final-ranges-in-context.png",
        alt: "The Last Active Ranges dialog open over the users table, defining the range for each status alongside the filter panel.",
        width: 1600,
        height: 900,
        caption:
          "Shipped, setting the ranges in context, over the table whose statuses they re-colour.",
      },
    ],
    outcome: (
      <>
        <p>
          <Emph>Adoption currently sits at 25.4%*</Emph>, and admins recorded and
          shared videos unprompted showing appreciation for the feature, validation that wasn’t solicited.
        </p>
        <p>
          The calls also moved the roadmap: wanting to act on a filtered group,
          not just see it, pushed CSV export of filtered lists further up the
          order. A first step toward a bigger solution rather than the whole of
          it.
        </p>
        <p className="font-mono text-[0.78rem] text-foreground-muted">
          * Still growing.
        </p>
      </>
    ),
    reflection: (
      <p>
        The date picker would have been defensible, and would have left the part
        actually blocking admins untouched: a status whose definition they
        couldn’t see. The useful move was doubting those fixed thresholds meant
        anything to the people relying on them, then A/B testing that hunch
        against the obvious answer instead of shipping on it.
      </p>
    ),
  },
  {
    slug: "feature-toggles-for-ai-tools",
    section: "genio-admin",
    art: FeatureTogglesArt,
    tag: "Case study",
    title: "Feature Toggles for AI Tools",
    summary:
      "A two-tier control model so institution-wide policy doesn't block the students who need support.",
    cardImage: {
      src: "/work/feature-toggles/final-org-form.png",
      alt: "The shipped Edit Organisation screen, showing the Manage Features block alongside general details.",
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
          A request for per-student AI controls arrived as two incompatible asks,
          and shipped as{" "}
          <Emph>an org-wide baseline with group-level overrides</Emph>, built on
          the groups system that already existed rather than the parallel profile
          architecture originally proposed.
        </>
      ),
      overview: (
        <>
          <p>
            Genio Admin is the tooling academic institutions use to manage how
            their students are supported. The AI features in Genio Notes can cut
            across a course&apos;s academic policy, while some students rely on
            them to work at all, and admins had no way to draw that line.
          </p>
          <p>
            The ask came in two forms that couldn&apos;t both be built: a
            competitor-style profile system from marketing and exec, and the
            groups system the squad had already shipped. Settling that model was
            most of the work. An organisation sets a baseline per feature, groups
            override it where needed, and reporting comes from filtered exports.
          </p>
          <p>
            The result is that{" "}
            <Emph>
              an institution can restrict a feature without handling exceptions
              one student at a time
            </Emph>
            , and a student who needs the support isn&apos;t blocked by a policy
            set elsewhere in the organisation. No parallel architecture was built.
          </p>
          <Placeholder>
            Adoption or usage figures, plus timeline and stakeholder names, to
            confirm.
          </Placeholder>
        </>
      ),
    },
    problem: (
      <>
        <p>
          AI tools in Genio Notes can conflict with a course’s academic policy,
          while <Emph>some students genuinely need that support to work</Emph>.
          Admins had no way to draw the line, they needed to switch AI features
          on and off per student, plus filtered exports showing where they were
          on.
        </p>
        <p>
          Partway through, <Emph>the shape of the work changed rather than the
          problem</Emph>. Our PM went on leave, priorities moved while they were
          out, and the input arriving in their absence pointed two ways:
          leadership on when the work should happen, marketing and exec on what
          form it should take.
        </p>
      </>
    ),
    constraints: (
      <>
        <p>
          <Emph>
            The roadmap was already locked in.
          </Emph>{" "}
          Our PM had nailed it down before going on leave. Feature toggles were
          on it, but further out.
        </p>
        <p>
          <Emph>
            A quarterly review moved them up.
          </Emph>{" "}
          Leadership signalled that toggles were now the priority, with no PM
          in the room to translate that into something the squad could act on.
        </p>
        <p>
          <Emph>
            Marketing and exec wanted to match a competitor.
          </Emph>{" "}
          They wanted feature management as a standalone “profile” system: a
          different architecture from the groups system the squad had already
          built.
        </p>
        <Placeholder>
          Exact names, dates and roles for the review and the
          marketing/exec ask.
        </Placeholder>
      </>
    ),
    decisions: [
      {
        heading: "Turn an ambiguous priority signal into scoped work",
        body: (
          <>
            <p>
              The review produced a direction, not a brief: toggles matter more
              than the roadmap says. Normally a PM absorbs that before it reaches
              the squad; with no one in the seat it arrived raw, and the gap
              between “this is the priority” and “this is what we build next” had
              to be closed before any design work meant anything.
            </p>
            <p>
              So I worked back from the signal: which parts were actually being
              asked for first, what that displaced on the locked roadmap, and
              what could ship without discarding work underway. That gave the
              squad a scope to commit to rather than a priority to interpret.
            </p>
            <Placeholder>
              The specific asks and who they came from, quotes or notes from
              the quarterly review, and what was displaced on the roadmap.
            </Placeholder>
          </>
        ),
      },
      {
        heading: "Extend the groups system instead of building profiles",
        body: (
          <>
            <p>
              The ask was concrete: a standalone profile system, matching a
              competitor. But <Emph>profiles meant a second parallel architecture
              for the same job</Emph>: a rebuild alongside the groups system the
              squad had already built.
            </p>
            <p>
              I argued for <Emph>extending groups instead</Emph>, on the grounds
              that the intent was competitive capability rather than that specific
              structure: managing AI features above the individual student. Groups
              already expressed that relationship.
            </p>
            <p>
              So the gap between what was requested and what shipped was
              architectural, not functional, no profile system, but the
              capability the request was after.
            </p>
            <Placeholder>
              The synthesis artefact, profile system vs. groups extension,
              weighed against what exec and marketing actually needed. To find
              or rebuild.
            </Placeholder>
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
          {
            src: "/work/feature-toggles/ideation-assign-profile.png",
            alt: "Ideation screen showing the Users table with two users selected and an Assign Profile action, with Profiles as its own sidebar section.",
            width: 1600,
            height: 754,
            caption:
              "Ideation, assigning a profile to selected users, with Profiles standing as its own section alongside Groups.",
          },
        ],
      },
      {
        heading: "Split control into an org baseline plus group overrides",
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
            src: "/work/feature-toggles/ideation-feature-conflict.png",
            alt: "Ideation modal titled Feature Conflict, asking which group's settings to use for a user who belongs to two groups.",
            width: 700,
            height: 326,
            caption:
              "Ideation: the case a group-based model has to answer: which settings win when a student belongs to two groups.",
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
        heading: "Treat the toggle screen as an opportunity for delight",
        body: (
          <>
            <p>
              The control model answered the policy problem, but the screen was
              also a chance to push Admin past a purely utilitarian feel, so
              rather than fit the toggles into the existing page structure, I
              built a new layout for them.
            </p>
            <Placeholder>
              Context for this section, what the delight opportunity actually
              was, and what specifically the new layout set out to fix.
            </Placeholder>
          </>
        ),
        media: [
          {
            src: "/work/feature-toggles/old-org-form.png",
            alt: "The previous organisation settings form: a single stacked column of fields with no feature management.",
            width: 1600,
            height: 900,
            caption:
              "Before: the organisation form as it stood: one long stacked column, with nowhere for feature management to live. The overhauled version is under Shipped.",
          },
        ],
      },
    ],
    shipped: (
      <p>
        Feature toggles shipped as an extension of the existing groups system:
        an org-wide baseline for each of the three AI features in Notes, with
        group-level overrides on top, alongside the filtered exports admins
        needed for reporting. No parallel profile architecture was built.
      </p>
    ),
    gallery: [
      {
        src: "/work/feature-toggles/final-org-form.png",
        alt: "The shipped Edit Organisation screen, with a Manage Features block marked New! listing Study Notes, QuizMe and Outlines, alongside general details and sharing policy.",
        width: 1600,
        height: 900,
        caption:
          "Shipped: the organisation baseline, in the overhauled two-column layout: section intent on the left, controls on the right.",
      },
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
          policy</Emph> set elsewhere in the organisation, and an institution can
          restrict a feature without handling exceptions one student at a time.
        </p>
        <Placeholder>
          Adoption or usage figures, if any are available.
        </Placeholder>
      </>
    ),
    reflection: (
      <>
        <p>
          Most of this wasn’t interface work. Leadership set the timing,
          marketing and exec set the architecture, they pointed different ways,
          and the person who’d normally reconcile them was on leave. What I did
          was turn that into one direction the team could commit to.
        </p>
        <p>
          The useful question turned out not to be “profiles or groups” but
          “what is the profile system actually for”: the request named a
          solution, and its intent was reachable another way. Asking that sooner
          would have got us here faster.
        </p>
      </>
    ),
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
      role: "UX Designer, Genio Notes, Audio tab",
      timeline: "Sep 2025 – Jan 2026",
      team:
        "Dave Tucker-Diaz (CEO), Paul Davis (Head of UX), Steven (accessibility/dev support), Matt Russell (analytics), Level Access (external WCAG auditor)",
      tools: "Figma, Pendo, a custom bubble playground prototype",
      statement: (
        <>
          Genio Notes&apos; audio bubbles failed WCAG 2.1 AA contrast ahead of a
          VPAT submission.{" "}
          <Emph>
            AA was reached before the deadline by moving contrast into the border
            and the weight rather than the fill
          </Emph>
          , so the element stayed as quiet as it was meant to be.
        </>
      ),
      overview: (
        <>
          <p>
            Genio Notes uses small “audio bubbles”, with connecting lines, in the
            audio tab to let students navigate and annotate recorded lectures. An
            external audit ahead of a VPAT found most of their colours short of
            AA, and the obvious fix, more saturation, would have dragged a
            background element into the foreground.
          </p>
          <p>
            Contrast went into the border and the weight instead. Along the way an
            external ruling that the connecting lines were{" "}
            <Emph>functional rather than decorative</Emph> reversed an earlier
            call of mine, and the direction was checked with an AI cross-check and
            a small five-person survey, a sample stated as the limitation it is.
          </p>
          <p>
            It shipped compliant and visually unchanged in character, with usage
            logging left in place to argue any deeper investment in the audio tab
            from data. What began as a colour swap became{" "}
            <Emph>
              a lesson in accessibility improving a design rather than
              constraining it
            </Emph>
            .
          </p>
        </>
      ),
    },
    cover: {
      src: "/work/audio-bubbles/cover.jpg",
      alt: "The Genio Notes audio tab in light mode, showing the redesigned outlined audio bubbles in the right-hand panel.",
      width: 2000,
      height: 1110,
    },
    problem: (
      <>
        <p>The audit found a colour contrast issue:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>
            <Emph>
              Dark mode:
            </Emph>{" "}
            grey (4.04:1) and yellow (3.5:1) passed. Blue (2.94:1) and red
            (2.42:1) failed.
          </li>
          <li>
            <Emph>
              Light mode:
            </Emph>{" "}
            every colour except red failed.
          </li>
        </ul>
        <p>
          The brief: reach WCAG AA without turning a deliberately quiet
          background element into a heavier, more clinical UI: the opposite of
          its purpose.
        </p>
        <p>
          <Emph>
            Why this ran for months rather than an afternoon:
          </Emph>{" "}
          the CEO was concerned that raising contrast until every colour passed
          would make the interface louder and undermine the point of the
          bubbles. That tension set the whole project, every decision below was
          weighed as evidence against that risk, not ticked off.
        </p>
        <p className="text-foreground">Constraints:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>A hard VPAT deadline, later pulled forward to early February.</li>
          <li>
            An unresolved second question: were the grey connecting lines
            decorative, or did they convey sequence and so need to meet 3:1 on
            their own?
          </li>
          <li>No large testing pool, only Insiders and internal reviewers.</li>
        </ul>
      </>
    ),
    decisions: [
      {
        heading: "Reject the contrast bump; fix it with borders",
        body: (
          <>
            <p>
              Raising saturation to force 3:1 <Emph>read as muddy and measurably
              heavier</Emph>, exactly the tradeoff the CEO had flagged, so it was
              rejected on principle, not taste.
            </p>
            <p>
              The border-based approach instead: background fill for inactive
              bubbles with a contrast-passing border, a lighter fill when
              active, lines from 2px to 1px, and heights retuned (8→5px
              inactive, 12→11px active) to centre on the thinner line. The new
              grey came from the design system, sitting as close to 3:1 as
              possible without overshooting.
            </p>
            <p>
              <Emph>
                Cross-checks:
              </Emph>{" "}
              Paul ran both directions through ChatGPT and Gemini blind, and
              both favoured the thinner, lower-contrast one on visual weight and
              scannability: a second opinion, not a substitute for testing.
              Dave also raised a question worth recording: does an{" "}
              <em>inactive</em> bubble need 3:1 at all, if it communicates
              nothing until you interact with it?
            </p>
          </>
        ),
        media: [
          {
            src: "/work/audio-bubbles/contrast-bump-rejected.png",
            alt: "Two columns of audio bubbles with fully saturated red, orange and purple fills against grey connecting lines.",
            width: 772,
            height: 554,
            caption:
              "The rejected direction, raising saturation to force 3:1 read as muddy and visually heavier.",
          },
          {
            src: "/work/audio-bubbles/fill-variants.png",
            alt: "Three panels comparing audio bubble fill treatments across slide outlines.",
            width: 1236,
            height: 583,
            caption:
              "Comparing fill treatments for active bubbles against the thinner 1px connecting line.",
          },
          {
            src: "/work/audio-bubbles/light-dark-panels.png",
            alt: "Two audio tab panels side by side, one with a purple header and one with a teal header, showing highlighted bubbles.",
            width: 972,
            height: 772,
            caption:
              "The border-based treatment checked across themes, where the light-mode failures were worst.",
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
        heading: "Soften the connecting lines to 40% opacity",
        body: (
          <>
            <p>
              Three options: remove the lines (lost the structure), drop them to
              ~40% opacity (didn’t strictly pass, but visibly lighter), or leave
              them at full opacity (too heavy for a zone that isn’t
              interactive).
            </p>
            <p>
              Went with 40%, with Steven backing it and the plan to push back if
              formal review flagged it. Scope stayed deliberately narrow, pass
              AA first, and Matt added logging on audio-tab vs. transcript-tab
              use so any deeper investment could be argued from data later.
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
          {
            src: "/work/audio-bubbles/progression.png",
            alt: "Three panels showing the progression of bubble and line styling across red, orange and purple states.",
            width: 1268,
            height: 563,
            caption:
              "The progression across states, checking that sequence stayed readable as line weight dropped.",
          },
        ],
      },
      {
        heading: "Survey only the students who use the audio tab",
        body: (
          <>
            <p>
              I surveyed people who actually use the audio tab, cross-referencing
              Pendo usage against the Insiders panel: a general population
              wouldn’t give a real signal on a feature-specific change. It
              compared current vs. proposed on cognitive load and on whether the
              design felt “beautiful and minimal”, then asked outright which they
              preferred.
            </p>
            <p>
              <Emph>
                Results (n=5, too small for hard conclusions):
              </Emph>
            </p>
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>Cognitive load tied 3/1/1 across both designs.</li>
              <li>
                “Beautiful and minimal”: current 3.8/5, new 3.2/5, though one
                respondent resistant to any change scored the new design 1/5,
                which skews a sample this size.
              </li>
              <li>
                Qualitatively, the new design made it easier to see where a
                bubble starts and ends, and felt less distracting.
              </li>
            </ul>
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
      {
        heading: "Reverse the line decision on the auditor’s ruling",
        body: (
          <>
            <p>
              I put the open question to Level Access, the external WCAG
              auditor: decorative lines are exempt from 3:1, but lines that are
              interactive and convey essential context are not.
            </p>
            <p>
              The lines are interactive and act as a sequencing aid, so they
              count as context. <Emph>That reversed October’s assumption</Emph>, they stayed at full contrast rather than being lightened, since
              making the bubble relationships illegible would raise cognitive load
              for the low-vision users the fix was for.
            </p>
          </>
        ),
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
        <p>
          <Emph>
            Corner radius (Jan 2026):
          </Emph>{" "}
          I built a “Bubble Playground” with 0.5px radius sliders so
          stakeholders could test presets rather than review comps. It landed on
          “Fully rounded” or “Rounded”, though the border treatment had already
          solved the segment-distinction problem on its own.
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
      {
        src: "/work/audio-bubbles/playground-55px.png",
        alt: "The Bubble Playground with corner radius set to 5.5px, fully rounded, for selected bubbles.",
        width: 1600,
        height: 796,
        caption:
          "The Bubble Playground, radius sliders in 0.5px increments, so stakeholders could test presets directly rather than review comps. “Fully rounded” shown here.",
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
            Direction validated by an AI cross-check and a small, targeted
            survey, with the 5-person sample stated as the limitation it is.
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
          The “lighter lines” fix looked settled in October and got reversed in
          January once an actual authority looked at it. <Emph>Treating that as new
          information rather than defending the earlier call</Emph> is the more
          interesting decision here than the visual polish.
        </p>
        <p>
          The rigour existed because of one tension set on day one: don’t let
          compliance quietly make the product worse to use. Every stage was
          really answering “did we just trade cognitive load for contrast?” with
          evidence instead of a gut call, which is how a colour swap became a
          lesson in accessibility improving a design rather than constraining
          it.
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
    title: "Memor",
    summary:
      "A conceptual app focused on reducing productivity guilt and promoting mindfulness.",
    cover: {
      src: "/work/memor/m-13.png",
      alt: "Overview of Memor's screens: the fluid clock-calendar, blunt notifications, a weekly view, and the three tone-of-voice profiles.",
      width: 1200,
      height: 675,
    },
    snapshot: {
      role: "Concept, research, UX & UI design, self-directed",
      // TODO: timeline, team, tools
      statement:
        "My honours project: a conceptual app that treats productivity guilt as the problem, replacing the calendar grid with a fluid shape and app-speak with a voice that talks to you like a friend.",
      overview: (
        <>
          <p>
            Productivity apps tend to reinforce guilt by optimising for output.
            Research sharpened the tension rather than resolving it: digital
            calendars offer flexibility, physical ones visibility, and running
            IDEO&apos;s “Five Whys” kept surfacing the same roots, productivity,
            not letting people down, and wanting to feel in control.
          </p>
          <p>
            Memor answers it with{" "}
            <Emph>a fluid 0 to 23 clock-calendar</Emph> whose events bleed into
            the base shape to suggest flexible timing, animated event management,
            and three interchangeable tone-of-voice profiles in place of
            relentless niceness.
          </p>
          <p>
            Testing found the calendar{" "}
            <Emph>innovative, easy to understand and effective against feeling
            overwhelmed</Emph>, with the Brutally Honest voice landing hardest.
            It also found the profiles hard to tell apart and the grey events
            unappealing.
          </p>
        </>
      ),
    },
    problem: (
      <p>
        <Emph>Productivity guilt, never doing “enough”</Emph>, is reinforced by
        apps that maximise output. Research sharpened the constraint: digital
        calendars offer flexibility, physical ones visibility. Running IDEO’s
        “Five Whys” surfaced the same roots each time: productivity, not letting
        people down, and wanting to feel in control.
      </p>
    ),
    decisions: [
      {
        heading: "Make the calendar a fluid shape, not a grid",
        body: "A static grid became a fluid, organic shape, keeping a clock face so it stays familiar rather than alien. Events sit as circles at their scheduled hours and bleed into the base shape to suggest flexible timing; bigger circle, longer event. A 0–23 scale replaces 12/24-hour to discourage rigidity about time.",
      },
      {
        heading: "Drop \"App Talk\" for a brutally honest voice",
        body: "I pushed back on \"App Talk\", relentless niceness that does little for real motivation, for a brutally honest voice, like a friend who keeps you in check. Since bluntness won't suit everyone, three interchangeable profiles: The Brutally Honest, The Bestie, and The Storyteller.",
      },
      {
        heading: "Stack the daily shape into a week",
        body: "To compete with existing calendars I added a weekly view by stacking the daily shape into a swipeable week, rather than inventing a second visual language. That unexpectedly made weekly trends visible.",
      },
    ],
    shipped:
      "High-fidelity prototypes: the fluid 0–23 clock-calendar with event circles, animated event management, three tone-of-voice profiles, a stacked weekly view, and notes.",
    outcome: (
      <p>
        Testing praised the calendar as <Emph>innovative, easy to understand, and
        effective against feeling overwhelmed</Emph>. The Brutally Honest voice
        landed hardest, though the profiles were hard to tell apart, and grey
        events felt unappealing.
      </p>
    ),
    reflection: (
      <p>
        <Emph>The three tone-of-voice profiles were hard to tell apart</Emph> in
        testing, given another pass I’d differentiate them much more sharply, and
        revisit the grey used for events.
      </p>
    ),
    gallery: [
      {
        src: "/work/memor/m-04.png",
        alt: "A chat-style exchange applying the Five Whys technique to why people use calendars.",
        width: 1055,
        height: 1200,
        caption: "Research, running IDEO's \"Five Whys\" to reach the real reasons behind calendar use.",
      },
      {
        src: "/work/memor/m-03.jpg",
        alt: "A physical paper desk calendar with handwritten notes propped on a windowsill.",
        width: 1200,
        height: 800,
        caption: "Physical calendars trade flexibility for visibility: the tension Memor set out to resolve.",
      },
      {
        src: "/work/memor/m-08.png",
        alt: "A blue organic blob sitting inside a twelve-point clock face.",
        width: 974,
        height: 975,
        caption: "Turning a static, geometric layout into a fluid organic shape, kept familiar by the clock face.",
      },
      {
        src: "/work/memor/m-01.png",
        alt: "Memor's main screen: the fluid clock-calendar with a blunt message and a main menu.",
        width: 540,
        height: 1200,
        caption: "The main screen, events as circles around the hours, with a characteristically blunt nudge.",
      },
      {
        src: "/work/memor/m-05.png",
        alt: "Two Memor notifications written in a brutally honest tone telling the user to go for a walk.",
        width: 794,
        height: 510,
        caption: "The Brutally Honest voice in action, motivation that reads like a friend keeping you in check.",
      },
      {
        src: "/work/memor/m-11.png",
        alt: "A radial weekly calendar built by stacking each day's organic shape.",
        width: 1200,
        height: 1200,
        caption: "The weekly view, stacking daily shapes made weekly trends visible at a glance.",
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
    tag: "Sponsored research",
    tagMuted: true,
    title: "Tell Me a Story",
    summary:
      "Contacted after graduating to continue a neonatal project, taken from paper to a tested, working prototype.",
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
        "Sponsored by Sarra Hoy · Dr. Lauren Shaw (Senior Neonatal Nurse) · DJCAD & School of Medicine · Ninewells Hospital NICU",
      tools: "Figma (low-fidelity), Bubble.io (high-fidelity)",
      statement: (
        <>
          After graduating I was <Emph>contacted to continue a neonatal project
          I&apos;d worked on as a student</Emph>, taking it from a paper prototype
          to a working voice-recording prototype, testing it with six parents who
          had lived through NICU care and writing it up as a full research report.
        </>
      ),
      overview: (
        <>
          <p>
            Tell Me A Story lets parents record stories and messages for their
            baby in a Neonatal Intensive Care Unit, so their voice reaches the cot
            when they can&apos;t be there. A paired university project in 2023 had
            taken the idea as far as a paper prototype; I was asked to continue it
            afterwards.
          </p>
          <p>
            What I added was the thing the concept had never been able to prove:{" "}
            <Emph>a working prototype that actually records</Emph>, built in
            Bubble.io with onboarding, a story-type fork, playback and a stories
            library, then tested with parents and documented as a research report.
          </p>
          <p>
            Feedback was <Emph>overwhelmingly positive</Emph>. Parents said they
            would have valued it during their own stay, and the tone landed as
            intended, described as compassionate and sensitive where existing
            neonatal apps had not been. Testing produced six themes with design
            implications and five recommendations, plus nurse-side requirements
            that fell outside this scope.
          </p>
        </>
      ),
    },
    problem: (
      <>
        <p>
          In a NICU the bond between parent and newborn is disrupted exactly when
          it matters most: you go from birth, to touching your baby through an
          incubator, to leaving them overnight.{" "}
          <Emph>Parents get updates but have no way to reach their baby</Emph>, and a parent&apos;s voice is one of the few things known to support
          both brain development and bonding.
        </p>
        <p>
          I was brought back in to continue the work, which meant starting from
          what already existed rather than a blank page:{" "}
          <Emph>a DJCAD and School of Medicine study on the Ninewells neonatal
          ward</Emph>, and <Emph>a 2023 third-year project I&apos;d built with
          Pavlin Petev</Emph>: the paired work that first proposed recording
          stories for playback at the cot. Seven prototypes from that phase had
          been shown to six experts, pointing at four areas to develop: recording
          support, memories and metadata, a custom avatar, and signposting to
          support information.
        </p>
      </>
    ),
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
        heading: "Continue the paired concept, don’t restart it",
        body: (
          <>
            <p>
              The 2023 project already had a defensible core, record a story,
              send it to the ward, play it at the cot. Rather than redesign that,
              I <Emph>treated it as the starting position</Emph> and spent the
              time on what it still lacked: a real recording flow, an emotional
              register, and evidence from parents.
            </p>
            <p>
              First move was a <Emph>paper prototype</Emph>, to make the concept
              tangible enough to react to before committing to a build.
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
          {
            src: "/work/stori/tmas-lofi-wireframes.png",
            alt: "Five hand-drawn wireframe screens covering recording, saving a story and a journal of recordings.",
            width: 2000,
            height: 750,
            caption:
              "The low-fidelity paper prototype, cheap to change, and the base the high-fidelity build grew from.",
          },
        ],
      },
      {
        heading: "Split recording into a story and a quick message",
        body: (
          <>
            <p>
              Testing the paper version made it clear that{" "}
              <Emph>one recording flow couldn&apos;t serve both intents</Emph>. A
              parent reading a book needs to pause, restart and hear it back. A
              parent saying goodnight before they leave needs one tap.
            </p>
            <p>
              So the flow forks: <Emph>Special Story</Emph> carries the full
              controls, <Emph>Sweet Message</Emph> behaves like a voice note.
              Which one you pick depends less on the feature than on how much you
              have left in you that day.
            </p>
          </>
        ),
        media: [
          {
            src: "/work/stori/tmas-build-special.png",
            alt: "The Special Story recording flow with restart, pause and stop controls and a live waveform.",
            width: 2000,
            height: 746,
            caption:
              "Special Story, pause, restart and playback, for reading a book.",
          },
          {
            src: "/work/stori/tmas-build-sweet.png",
            alt: "The Sweet Message recording flow with a single stop control.",
            width: 2000,
            height: 746,
            caption: "Sweet Message, one tap, for saying goodnight.",
          },
        ],
      },
      {
        heading: "Design it away from anything medical",
        body: (
          <>
            <p>
              The Ninewells NICU is deliberately softened with illustrations by
              Freya Cumming, and I took the same line:{" "}
              <Emph>nothing that reads as clinical or cold</Emph>. Red was ruled
              out entirely, in that environment it means emergency.
            </p>
            <p>
              The reference point became children&apos;s books, and the design
              settled on a <Emph>night sky with a glowing yellow</Emph>. The
              onboarding does the expectation-setting the nurse asked for, and
              one of her phrases, “anything that leaves that little heartstring
              of attachment”, made it into the app itself.
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
          {
            src: "/work/stori/tmas-onboarding-7.jpg",
            alt: "Onboarding screen titled Before You Start, explaining that nurses may not be able to play every recording.",
            width: 399,
            height: 801,
            caption:
              "Setting the expectation honestly: quiet sleep matters, and nurses may not manage every recording.",
          },
        ],
      },
      {
        heading: "Recruit parents who’ve been through it, never those still in it",
        body: (
          <>
            <p>
              Asking a parent to evaluate a prototype while their baby is in
              intensive care would have been invasive, so{" "}
              <Emph>current NICU parents were ruled out</Emph>. Recruitment was
              limited to parents within five years of their experience, recent
              enough to recall clearly, and to the UK, since the NHS was the
              target context.
            </p>
            <p>
              <Emph>17 people showed interest, 11 completed ethics, 6 tested</Emph>{" "}: a 35% conversion with no incentive offered beyond interest in the
              project. Sessions ran up to an hour as semi-structured interviews
              around the prototype. All six participants were female and UK-based.
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
        src: "/work/stori/tmas-build-1.png",
        alt: "The full prototype flow: onboarding, story type selection, recording, stories and home.",
        width: 2000,
        height: 748,
        caption:
          "The tested flow: onboarding → story type → record → stories → home.",
      },
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
        src: "/work/stori/tmas-onboarding-5.jpg",
        alt: "Onboarding screen offering a test recording to check device permissions.",
        width: 402,
        height: 801,
        caption: "A test recording, so device permissions fail early rather than mid-story.",
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
          Testing produced <Emph>six themes with design implications</Emph>, bonding through audio, the need for normalcy, language, emotional load,
          guilt, and visual design, plus five recommendations and a feature
          shortlist (a priority “special request”, and stories from wider family).
          Three further participants were tested after the internship ended.
        </p>
      </>
    ),
    reflection: (
      <>
        <p>
          The most useful finding was the one I hadn&apos;t designed for:{" "}
          <Emph>parents didn&apos;t always know what to say</Emph>. “I felt really
          self-conscious about talking or reading,” one said; another wanted
          “something to jog your brain a little bit so you get comfy.” The app
          made recording possible without making it easy to start, prompts would
          be the first thing I&apos;d add.
        </p>
        <p>
          The nurse-side interface also fell out of scope as the parent flow grew,
          and it&apos;s the half that decides whether any of this works on a ward.
          My part is complete; the wider initiative has slowed since, so I treat
          it as <Emph>paused rather than abandoned</Emph>.
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

  if (project.shipped) sections.push({ id: "shipped", label: "Shipped" });
  if (project.outcome) sections.push({ id: "outcome", label: "Outcome" });
  if (project.reflection) {
    sections.push({ id: "reflection", label: "Reflection" });
  }

  return sections;
}
