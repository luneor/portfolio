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
  /**
   * Evidence for this specific call — kept with the decision rather than
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
 * accessible name — these clips are silent, so there's no audio to caption.
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
    project with no content yet still renders a valid (shorter) page — the TOC
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
 * A deliberately visible gap in a write-up — a fact, artefact or asset still to
 * be supplied. Loud on purpose: nothing here should reach a published page, so
 * it should be obvious in review rather than blending into the copy.
 */
function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-brand-strong px-4 py-3 font-mono text-[0.78rem] leading-relaxed text-foreground-muted">
      <strong className="font-bold text-brand-strong">TO ADD — </strong>
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
      role: "UX Designer — Genio Admin (BEAR Squad)",
      // TODO: timeline, team, tools
      statement: (
        <>
          The standard answer here was a date picker. Instead I let each
          institution set its own ranges for what Active, At risk and Inactive
          mean — A/B tested against the date picker with real admins, and now at
          25.4% adoption.
        </>
      ),
    },
    problem: (
      <>
        <p>
          The job admins actually had was hard to do: work out who was genuinely
          inactive so they could bulk deactivate them, and who was genuinely at
          risk so they could get in touch. Admin-facing “last active” data was
          stagnant and binary, so neither group was easy to isolate.
        </p>
        <p>
          RAG last-active statuses already existed, but the thresholds behind
          them were fixed: 0–7 days green, 7–14 amber, 14+ red. Those numbers
          were invisible in the interface, and my read was that few admins knew
          what any of the three colours actually meant — which made a status
          they couldn’t interrogate hard to act on.
        </p>
      </>
    ),
    decisions: [
      {
        heading: "Pass on the date picker for custom ranges",
        body: (
          <>
            <p>
              The standard approach to this problem is a date picker: let the
              admin pick a cut-off and filter against it. It answers the
              question asked, but it hands over no more control than the fixed
              thresholds already did — the admin still has to know which date
              matters before they can choose it.
            </p>
            <p>
              Since the RAG statuses were the thing admins couldn’t see inside,
              the opportunity was to make those definitions editable rather than
              route around them. That meant custom ranges: the admin sets what
              Active, At risk and Inactive mean, and the statuses they already
              see start reflecting their own institution.
            </p>
            <p>
              I A/B tested the two directions in a survey with admins who
              actually use Genio, putting the date picker against custom ranges.
              They preferred custom ranges, and the reason they gave was the
              sense of control and customisation it offered rather than the
              filtering itself.
            </p>
          </>
        ),
      },
      {
        heading: 'Let admins define what "active" means',
        body: 'I introduced RAG-coded status categories — Active, At Risk, Inactive, No Data — and, critically, let admins set their own custom week-thresholds for each category, rather than imposing one fixed definition of "active" across every institution.',
        media: [
          {
            src: "/work/last-active/ideation-icons.png",
            alt: "Five variants of an Activity filter card, each showing the four states — Active, At risk, Inactive, No data — with differently weighted status icons.",
            width: 820,
            height: 565,
            caption:
              "Ideation — icon treatments for the four states, compared at the size they'd actually be read at in the filter.",
          },
          {
            src: "/work/last-active/ideation-thresholds-inputs.png",
            alt: "Threshold editor using numeric stepper inputs, with a segmented colour bar above and a plain-language summary of the resulting logic.",
            width: 599,
            height: 452,
            caption:
              "Ideation — thresholds as numeric inputs, with the resulting logic spelled out in words beside them.",
          },
          {
            src: "/work/last-active/ideation-thresholds-timeline.png",
            alt: "Threshold editor as a timeline with two draggable markers, and the resulting Active, At Risk and Inactive ranges shown beneath.",
            width: 678,
            height: 485,
            caption:
              "Ideation — the same thresholds as draggable markers on a timeline, with each range read back underneath.",
          },
          {
            src: "/work/last-active/ideation-filter-date.png",
            alt: "The users table with a filter panel open, showing a Last Active date picker with a January 2026 calendar.",
            width: 1280,
            height: 720,
            caption:
              "Ideation — filtering the table by a specific last-active date.",
          },
          {
            src: "/work/last-active/ideation-filter-status.png",
            alt: "The users table with a filter panel open, showing a Filter by Last Active Status dropdown listing Green (Active), Amber (At Risk) and Red (Inactive).",
            width: 1280,
            height: 720,
            caption:
              "Ideation — filtering by status rather than by date, which is what the thresholds make possible.",
          },
        ],
      },
      {
        heading: "Run the prototype as scenarios, not a demo",
        body: (
          <>
            <p>
              For the customer calls I ran an interactive prototype, but handed
              it to the admin rather than driving it myself, and read out
              scenarios for them to carry out — “you want to see who’s at risk
              so you can contact them: set the inactive range to 2–4 weeks and
              filter by inactive to see those users.” That tests whether the
              model is usable under a real intent, rather than whether a
              walkthrough is persuasive.
            </p>
            <p>
              It was well received, and it surfaced the thing a demo wouldn’t
              have: once admins could isolate a group, they immediately wanted
              to act on it — export the list, email those users, bulk
              deactivate. That shaped the roadmap beyond this feature.
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
          "Shipped — the Last Active filter, with Edit Ranges sitting next to the states it defines.",
      },
      {
        src: "/work/last-active/final-ranges-modal.png",
        alt: "The Edit Last Active Ranges dialog, with week inputs for Active, At risk and Inactive and a reset to default option.",
        width: 608,
        height: 431,
        caption:
          "Shipped — the range editor: each status spelled out as a sentence that updates with the week values.",
      },
      {
        src: "/work/last-active/final-ranges-in-context.png",
        alt: "The Last Active Ranges dialog open over the users table, defining the range for each status alongside the filter panel.",
        width: 1600,
        height: 900,
        caption:
          "Shipped — setting the ranges in context, over the table whose statuses they re-colour.",
      },
    ],
    outcome: (
      <>
        <p>
          Adoption currently sits at 25.4%*, and admins recorded and shared
          videos unprompted showing appreciation for the feature — validation
          that wasn’t solicited.
        </p>
        <p>
          The prototype calls also moved the roadmap: wanting to act on a
          filtered group, not just see it, pushed exporting filtered lists as
          CSVs further up the priority order. This was the first step toward a
          bigger solution rather than the whole of it.
        </p>
        <p className="font-mono text-[0.78rem] text-foreground-muted">
          * Still growing.
        </p>
      </>
    ),
    reflection: (
      <p>
        The date picker would have been a defensible answer, and it would have
        left the part that actually blocked admins untouched: a status they
        couldn’t see the definition of. The useful move was doubting that the
        fixed thresholds meant anything to the people relying on them — and then
        A/B testing that hunch against the obvious solution instead of shipping
        on it.
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
      role: "UX Designer — Genio Admin (BEAR Squad)",
      timeline: "TODO — confirm dates",
      team: "TODO — confirm names and roles",
      statement: (
        <>
          Admins needed to turn AI features on and off for individual students,
          but the request arrived as two incompatible asks — a competitor-style
          profile system from marketing and exec, and the groups system the
          squad had already built. Shipped as an extension of groups: an
          org-wide baseline with group-level overrides.
        </>
      ),
      overview: (
        <>
          <p>
            Genio Admin is the tooling academic institutions use to manage how
            their students are supported. This work covered per-student control
            of the AI features in Genio Notes, plus filtered exports for
            reporting.
          </p>
          <Placeholder>
            Product, role, timeline and stakeholder list to confirm — names,
            dates and exact titles.
          </Placeholder>
        </>
      ),
    },
    problem: (
      <>
        <p>
          AI tools inside Genio Notes can conflict with a course or
          institution’s academic policy, while some individual students
          genuinely need that support to work. Admins had no way to draw that
          line: they needed to enable and disable AI features for individual
          students, and to pull filtered exports showing where those features
          were switched on.
        </p>
        <p>
          Partway through, the shape of the work changed rather than the problem
          itself. Our PM went on leave, priorities moved while they were out,
          and the stakeholder input arriving in their absence pointed in
          different directions — leadership on when the work should happen,
          marketing and exec on what form it should take.
        </p>
      </>
    ),
    constraints: (
      <>
        <p>
          Two constraints compounded each other, and a third sat on top of
          both.
        </p>
        <p>
          <strong className="font-semibold text-foreground">
            The roadmap was already locked in.
          </strong>{" "}
          Our PM had done solid work nailing it down before going on leave.
          Feature toggles were on it, but further out than the rest of the work
          in front of the squad.
        </p>
        <p>
          <strong className="font-semibold text-foreground">
            A quarterly squad review moved them up.
          </strong>{" "}
          The strong signal coming down from leadership was that feature toggles
          were now the priority, ahead of where the roadmap had placed them —
          with no PM in the room to absorb that signal or translate it into
          something the squad could act on.
        </p>
        <p>
          <strong className="font-semibold text-foreground">
            Marketing and exec wanted to match a competitor.
          </strong>{" "}
          Specifically, they wanted feature management as a standalone
          “profile” system: a different architecture from the groups-based
          system the squad had already built and invested in.
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
              What came out of the quarterly review was a direction, not a
              brief: feature toggles matter more than the roadmap currently
              says. Normally that gets absorbed and translated by a PM before it
              reaches the squad. With no one in that seat, it reached the squad
              as-is, and the gap between “this is the priority” and “this is what
              we build next” had to be closed before any design work meant
              anything.
            </p>
            <p>
              I worked back from the signal to what it implied in practice:
              which parts of the toggle work were actually being asked for
              first, what that displaced on the locked roadmap, and what could
              be delivered without discarding work already underway. That gave
              the squad a scope to commit to rather than a priority to
              interpret.
            </p>
            <Placeholder>
              The specific asks and who they came from — quotes or notes from
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
              The marketing and exec ask was concrete: a standalone profile
              system for managing features, matching what a competitor offered.
              The squad had already built a groups-based system for organising
              students, and profiles would have meant a second, parallel
              architecture for the same job — a from-scratch rebuild alongside
              something that already worked.
            </p>
            <p>
              I made the case for extending groups instead, on the grounds that
              the intent behind the request was competitive capability rather
              than that particular structure: admins being able to manage AI
              features at a level above the individual student. Groups already
              expressed that relationship, so extending them met the intent
              without the squad absorbing a rebuild.
            </p>
            <p>
              The gap between what was requested and what shipped was
              therefore architectural, not functional: no profile system, but
              the feature-management capability the request was after.
            </p>
            <Placeholder>
              The synthesis artefact — profile system vs. groups extension,
              weighed against what exec and marketing actually needed. To find
              or rebuild.
            </Placeholder>
          </>
        ),
        media: [
          {
            src: "/work/feature-toggles/ideation-profiles.png",
            alt: "Ideation screen showing a Profiles page with three preset cards — No AI, No Outlines and All — each toggling Auto Notes, AI Outlines, QuizMe and Captions.",
            width: 1282,
            height: 720,
            caption:
              "Ideation — the profile system explored: named presets, each toggling the same set of features.",
          },
          {
            src: "/work/feature-toggles/ideation-assign-profile.png",
            alt: "Ideation screen showing the Users table with two users selected and an Assign Profile action, with Profiles as its own sidebar section.",
            width: 1600,
            height: 754,
            caption:
              "Ideation — assigning a profile to selected users, with Profiles standing as its own section alongside Groups.",
          },
        ],
      },
      {
        heading: "Split control into an org baseline plus group overrides",
        body: (
          <>
            <p>
              Working inside the scope that came out of the reconciliation
              above, I designed a two-tier control model across the three AI
              features Notes ships: an org-wide baseline setting, plus
              group-level overrides. Institutions set policy once, and a group
              with different needs — a course, a cohort — can depart from it
              without that decision being made for every student at once.
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
              "Ideation — configuring several groups at once, with features sorted into categories and settings copyable between groups.",
          },
          {
            src: "/work/feature-toggles/ideation-feature-conflict.png",
            alt: "Ideation modal titled Feature Conflict, asking which group's settings to use for a user who belongs to two groups.",
            width: 700,
            height: 326,
            caption:
              "Ideation — the case a group-based model has to answer: which settings win when a student belongs to two groups.",
          },
          {
            src: "/work/feature-toggles/ideation-user-matrix.png",
            alt: "Ideation screen for editing a single user, with a Managed Features table showing org-level and group-level state for each feature.",
            width: 1280,
            height: 776,
            caption:
              "Ideation — showing the org-level and group-level state of each feature side by side on a single user.",
          },
        ],
      },
      {
        heading: "Treat the toggle screen as an opportunity for delight",
        body: (
          <>
            <p>
              The control model answered the policy problem, but the screen
              itself was also a chance to push Admin past a purely utilitarian
              feel. Rather than fit the toggles into the existing page
              structure, I built a new layout for them.
            </p>
            <Placeholder>
              Context for this section — what the delight opportunity actually
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
              "Before — the organisation form as it stood: one long stacked column, with nowhere for feature management to live. The overhauled version is under Shipped.",
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
          "Shipped — the organisation baseline, in the overhauled two-column layout: section intent on the left, controls on the right.",
      },
      {
        src: "/work/feature-toggles/final-edit-group.png",
        alt: "The shipped Edit Group screen, with Managed Features set to Customise for this group and each feature labelled with its organisation default.",
        width: 1600,
        height: 898,
        caption:
          "Shipped — the group override. Each feature carries its organisation default in the label, so an admin can see what they're departing from.",
      },
    ],
    outcome: (
      <>
        <p>
          The practical result is that a student who needs the support isn’t
          blocked by a blanket policy decision made elsewhere in the
          organisation, and an institution that needs to restrict a feature can
          do so without exceptions being handled one student at a time.
        </p>
        <Placeholder>
          Adoption or usage figures, if any are available.
        </Placeholder>
      </>
    ),
    reflection: (
      <>
        <p>
          Most of this project wasn’t interface work. Two sets of input —
          leadership on timing, marketing and exec on architecture — arrived
          pointing in different directions, and the person who would normally
          reconcile them was on leave. What I did was turn that into a single
          direction the team could commit to: a scope that answered the priority
          signal, and an architecture that met the intent behind the
          competitor comparison without discarding what the squad had already
          built.
        </p>
        <p>
          The part worth keeping is that the useful question turned out not to
          be “profiles or groups” but “what is the profile system actually
          for” — the request named a solution, and the intent behind it was
          reachable another way. Asking that earlier would have shortened the
          route to the same answer.
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
      role: "UX Designer — Genio Notes, Audio tab",
      timeline: "Sep 2025 – Jan 2026",
      team:
        "Dave Tucker-Diaz (CEO), Paul Davis (Head of UX), Steven (accessibility/dev support), Matt Russell (analytics), Level Access (external WCAG auditor)",
      tools: "Figma, Pendo, a custom bubble playground prototype",
      statement: (
        <>
          Ahead of a VPAT submission, Genio Notes’ audio bubbles failed WCAG 2.1
          AA contrast — brought into compliance with a border-based fix that
          kept the interface quiet, rather than raising saturation until the
          numbers passed.
        </>
      ),
      overview: (
        <>
          Genio Notes uses small “audio bubbles” (with connecting lines) in the
          audio tab to let students navigate and annotate recorded lectures. The
          trigger was an upcoming VPAT (accessibility conformance report).
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
            <strong className="font-semibold text-foreground">
              Dark mode:
            </strong>{" "}
            grey (4.04:1) and yellow (3.5:1) passed. Blue (2.94:1) and red
            (2.42:1) failed.
          </li>
          <li>
            <strong className="font-semibold text-foreground">
              Light mode:
            </strong>{" "}
            every colour except red failed.
          </li>
        </ul>
        <p>
          The brief: bring the interface up to WCAG AA without tipping it into a
          heavier, more clinical UI that increases cognitive load, which was the
          opposite of the design’s original intent (helping students review
          notes without distraction).
        </p>
        <p>
          <strong className="font-semibold text-foreground">
            Why this became a multi-month, closely-tracked piece of work rather
            than a quick contrast fix:
          </strong>{" "}
          the CEO (Dave) was specifically concerned that the obvious fix,
          raising contrast until every colour hit 3:1/4.5:1, would make the
          interface louder and more demanding to look at, undermining the whole
          point of the audio bubbles. That concern was the running theme of the
          project: it’s why a naive “just bump the contrast” pass was tested and
          explicitly rejected on cognitive-load grounds rather than shipped, why
          every subsequent decision (the border-based fix, the line-opacity
          direction, the AI cross-check, the targeted user survey, and
          eventually the external ruling from Level Access) was treated as
          evidence to weigh against that risk rather than a box to tick, and why
          the process below is this thorough. This wasn’t accessibility work
          done in isolation from UX quality, it was an ongoing negotiation
          between the two, with the CEO actively invested in the outcome.
        </p>
        <p className="text-foreground">Constraints:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>
            A hard external deadline (VPAT), later pulled forward from a general
            window to early February, compressing the decision timeline.
          </li>
          <li>
            Any fix had to hold up under a second, separate accessibility
            question: whether the grey connecting lines between bubbles counted
            as decorative or as conveying essential information
            (sequence/grouping), which would determine whether they needed to
            independently meet 3:1 contrast.
          </li>
          <li>
            Limited access to a large testing pool — reliant on Insiders and
            self-selected internal reviewers.
          </li>
        </ul>
      </>
    ),
    decisions: [
      {
        heading: "Reject the contrast bump; fix it with borders",
        body: (
          <>
            <p>
              Tried simply raising saturation on the failing colours to hit 3:1.
              Result: visually “muddy” and a clear increase in cognitive load,
              exactly the tradeoff the CEO had flagged as the risk to avoid, so
              it was rejected on principle rather than just aesthetics.
            </p>
            <p>
              Landed on a border-based approach instead: white/background fill
              for inactive bubbles with a contrast-passing border, a lighter
              fill for active bubbles, line weight dropped from 2px to 1px, and
              bubble height retuned (8px → 5px inactive, 12px → 11px active) to
              center on the thinner lines. Pulled the new grey from the existing
              design system to sit as close to 3:1 as possible without
              overshooting.
            </p>
            <p>
              <strong className="font-semibold text-foreground">
                Cross-check with AI tools:
              </strong>{" "}
              Paul Davis ran the two candidate directions through ChatGPT and
              Gemini blind (no framing bias) to sanity-check the cognitive-load
              read. Both independently favoured the thinner, lower-contrast
              direction, citing lower visual weight, more restrained use of
              alert colour, and easier scannability. Used as a second opinion,
              not a substitute for user testing.
            </p>
            <p>
              <strong className="font-semibold text-foreground">
                Stakeholder input (Dave, CEO):
              </strong>{" "}
              Raised a compliance question worth documenting: does an{" "}
              <em>inactive</em> bubble need to meet 3:1 if it isn’t
              communicating information until interacted with? Also connected
              the new direction back to Genio’s Audio Notetaker heritage (darker
              outlines, lighter fills) and used the redesign as a jumping-off
              point for a longer-term idea, treating bubbles as an extensible
              annotation layer (labels, reactions, AI-driven scaffolding like
              surfacing “unclear” sections). Flagged explicitly as a future
              idea, not a scope addition.
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
              "The rejected direction — raising saturation to force 3:1 read as muddy and visually heavier.",
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
              Tested removing the connecting lines entirely (lost visual
              structure, likely to raise new accessibility concerns), dropping
              them to ~40% opacity (didn’t strictly pass contrast but measurably
              reduced visual weight), and a full-opacity grey line (too heavy,
              drew attention to a non-interactive-feeling zone).
            </p>
            <p>
              Settled on the 40%-opacity direction, with Steven’s support to
              proceed and push back if it got flagged in formal review. Built a
              click-through Figma prototype covering all bubble-fill variants in
              situ, and scoped the immediate goal deliberately narrow: pass WCAG
              AA first, defer feature ideas (like usage-based investment
              decisions) until usage data existed. Matt Russell added logging to
              compare audio-tab vs. transcript-tab engagement to inform that
              later, separate decision.
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
              Deliberately moved away from a general survey toward users who
              actually use the audio tab (cross-referencing Pendo usage data
              against the Insiders panel), reasoning that a general population
              wouldn’t surface a real signal on a feature-specific change.
            </p>
            <p>
              The survey compared current vs. proposed design on two axes: a
              forced-choice cognitive-load question, and agreement with “the
              audio bubble design is both beautiful and minimal, allowing me to
              take and review notes without distraction,” followed by a direct
              preference question with a branching follow-up (why it’s an
              improvement, or what would make the new design better).
            </p>
            <p>
              <strong className="font-semibold text-foreground">
                Results (n=5, explicitly caveated as too small for hard
                conclusions):
              </strong>
            </p>
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>
                Cognitive-load question tied 3/1/1 on both designs.
              </li>
              <li>
                “Beautiful and minimal” agreement: current design 3.8/5, new
                design 3.2/5, though one respondent who was resistant to any
                change scored the new design 1/5, which skewed the small sample
                noticeably.
              </li>
              <li>
                Qualitative positives for the new design: easier to spot where a
                bubble starts/ends, clearer contrast between highlighted and
                non-highlighted sections when reviewing notes, and a less
                visually distracting feel overall.
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
              "The direct preference question — 3 of 5 called the new design an improvement.",
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
              Submitted the design to Level Access, the external WCAG auditor,
              specifically on the open question of whether the connecting lines
              were decorative or functional. Their ruling: if the lines are
              interactive and convey essential context (bubble
              sequence/grouping), they must meet the same 3:1 non-text contrast
              requirement as any other interactive element; only purely
              decorative lines are exempt.
            </p>
            <p>
              Conclusion: because the lines are interactive and act as a
              sequencing aid, they count as essential context, not decoration.
              This reversed the working assumption from October (that softening
              the lines to 40% opacity was viable) — the lines stayed at full
              contrast rather than being lightened further, to avoid inflating
              cognitive load for low-vision users by making the bubble
              relationships illegible.
            </p>
          </>
        ),
      },
    ],
    shipped: (
      <>
        <p>
          The shipped treatment keeps contrast in the border and the weight
          rather than the fill: a background-fill inactive bubble with a
          contrast-passing border, a lighter fill for active bubbles, connecting
          lines at 1px and full contrast (per the Level Access ruling), and
          bubble heights retuned to 5px inactive / 11px active so they centre on
          the thinner line.
        </p>
        <p>
          <strong className="font-semibold text-foreground">
            Corner-radius refinement (Jan 2026):
          </strong>{" "}
          I built an interactive “Bubble Playground” (sliders for corner radius
          at 0.5px increments, line-opacity toggle) so stakeholders could test
          rounding presets directly rather than review static comps. Informal
          testing converged on “Fully rounded” or “Rounded,” with “Rounded”
          offering marginally better segment distinction, though the border
          treatment introduced earlier was judged to already solve that problem
          on its own.
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
          "The Bubble Playground — radius sliders in 0.5px increments, so stakeholders could test presets directly rather than review comps. “Fully rounded” shown here.",
      },
    ],
    outcome: (
      <>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            Bubble colours and borders brought into WCAG 2.1 AA compliance ahead
            of the VPAT deadline, using a border-based contrast strategy rather
            than raising fill saturation, preserving the low-cognitive-load
            intent of the original design.
          </li>
          <li>
            Resolved an ambiguous compliance question (decorative vs. functional
            lines) with an external authority (Level Access) rather than an
            internal guess, and adjusted the design in response even though it
            meant reversing an earlier decision.
          </li>
          <li>
            Validated the design direction with both a lightweight AI
            cross-check and a small but targeted user survey, while being
            explicit about the survey’s limitations rather than overstating a
            5-person sample.
          </li>
          <li>
            Left a clear, logged usage-data trail (audio tab vs. transcript tab)
            to inform whether deeper investment in the audio interface,
            including Dave’s annotation-layer idea, is worth pursuing next.
          </li>
        </ul>
      </>
    ),
    reflection: (
      <>
        <p>
          The throughline worth highlighting: the “make the lines lighter” fix
          looked settled in October, backed by a developer’s informal blessing,
          but got reopened and reversed in January once put in front of the
          actual accessibility authority. Treating that ruling as new
          information rather than defending the earlier call is the more
          interesting design decision here than the visual polish.
        </p>
        <p>
          More broadly, the level of rigor across this whole project (audit →
          explore multiple directions → validate with both a quick AI gut-check
          and real, if small, user data → confirm compliance with an external
          expert → only then refine remaining visual details like rounding)
          exists because of one running tension set by the CEO on day one: don’t
          let compliance quietly make the product worse to use. Every stage of
          the process is really an attempt to answer “did we just trade
          cognitive load for contrast?” with actual evidence instead of a gut
          call. What could have been a colour swap became a more in-depth piece
          of work — and a valuable lesson in treating accessibility as something
          that makes the design better, rather than a constraint to satisfy.
        </p>
      </>
    ),
  },
  {
    slug: "five-whys",
    section: "ai",
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
    // The project was "Tell Me a Story"; "Stori" was the app itself, which is
    // why the slug and in-copy references to Stori still stand.
    title: "Tell Me a Story",
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
