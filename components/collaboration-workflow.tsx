"use client";

import {
  Check,
  ChevronDown,
  Hash,
  Maximize2,
  MessagesSquare,
  Video,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
  A playable walkthrough of the Slack collaboration workflow, rebuilt in the
  folio's own design system rather than pasted in as screenshots.

  Rebuilt for three reasons. Slack's chrome would drag a foreign palette into
  the middle of the page; a screenshot of a form is a flat image that can't
  reflow on a phone; and, mainly, the thing worth showing is that the FORM
  SHAPES THE MESSAGE. Choosing "Quick call" instead of "In thread" changes what
  the workflow posts, and no still image can make that point.

  So the choices carry through: whatever you pick in step 1 is what appears in
  the posted message in step 3 and in the archive in step 4. Filling it in is
  optional -- untouched fields fall back to EXAMPLE, so Next alone still tells
  a coherent story.

  The dropdowns are a hand-built listbox rather than a native `<select>`. A
  native one is free correctness, but its open list is drawn by the OS in the
  OS's own styling, which is the one part of this that couldn't be made to look
  like the rest of the site. So the keyboard contract a select gives away is
  reimplemented here instead: see Listbox.
*/

const TYPES = [
  "Design Critique",
  "Idea Generation",
  "Research & Surveys",
  "Copy Critique",
  "Quickfire Collab",
] as const;

const MODES = ["In thread", "Quick call"] as const;

/** Used wherever the reader has left a field alone. */
const EXAMPLE = {
  type: "Design Critique",
  need: "Been designing my folio, what do we think?",
  mode: "In thread" as (typeof MODES)[number],
};

const STEPS = [
  {
    key: "request",
    title: "Frame the ask",
    body: "The type of collaboration and how you want to run it are both set before anything is written. An ask arrives already scoped, so nobody has to work out what kind of help is wanted.",
    hint: "Try the dropdowns and the summary field — or just hit Next.",
  },
  {
    key: "context",
    title: "Add context",
    body: "Links and files are a separate, optional step. A request isn't held up waiting on assets that might not exist yet, and the ask itself is already complete without them.",
  },
  {
    key: "posted",
    title: "It lands in the channel",
    body: "The workflow posts into the channel itself, so the ask is visible to the whole team rather than sitting in someone's DMs. In thread, the replies collect underneath it. Over a quick call, it generates a Google Meet link instead, so the answer can happen live.",
  },
  {
    key: "archive",
    title: "And it stays there",
    body: "Every request is also written to a Slack canvas, automatically. Nobody maintains it, and it lives in the channel rather than in someone's notes, so the whole team can search past asks by date, person and type long after a thread has gone quiet.",
  },
] as const;

/*
  Anonymised. The real archive carries colleagues' names against live product
  work; the point being made here is the cadence and the range of request
  types, not who posted. Hanru's own rows keep his name.
*/
const ARCHIVE = [
  {
    date: "3 April 2026",
    who: "@designer",
    type: "Idea Generation",
    mode: "In thread",
    ask: "HMW make the act of annotating more enjoyable?",
  },
  {
    date: "13 April 2026",
    who: "@design-lead",
    type: "Design Critique",
    mode: "In thread",
    ask: "Screens for a new sign-up flow, after last week's collab. Looking for feedback on these.",
  },
  {
    date: "26 May 2026",
    who: "@researcher",
    type: "Research & Surveys",
    mode: "Quick call",
    ask: "A survey draft, checking the questions land before it goes out.",
  },
];

/** Slack's modal chrome, redrawn with the folio's surfaces. */
function Modal({
  title,
  children,
  onSubmit,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
}) {
  return (
    /* No `overflow-hidden`: an open dropdown has to be able to paint past
       the modal's edge. Nothing here bleeds into the rounded corners, so the
       clip was only ever belt-and-braces. */
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4">
        <p className="text-lg font-bold tracking-tight text-foreground">
          {title}
        </p>
        {/* Chrome only -- the real modal's expand and close controls. */}
        <div aria-hidden="true" className="flex items-center gap-3 text-foreground-muted">
          <Maximize2 className="size-4" />
          <X className="size-4" />
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-5">{children}</div>

      <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
        {/*
          Close is chrome, so it's a span rather than a dead button: a real
          button announced as "Close" that closes nothing is worse than no
          control at all. Submit IS live -- it advances the walkthrough, which
          is what submitting does in the real workflow.
        */}
        <span className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium text-foreground-muted">
          Close
        </span>
        <button type="button" onClick={onSubmit} className={PRIMARY}>
          Submit
        </button>
      </div>
    </div>
  );
}

function FieldShell({
  label,
  optional,
  helper,
  htmlFor,
  children,
}: {
  label: string;
  optional?: boolean;
  helper?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
        {optional && (
          <span className="font-normal text-foreground-muted"> (optional)</span>
        )}
      </label>
      {children}
      {helper && <p className="text-xs text-foreground-muted">{helper}</p>}
    </div>
  );
}

/*
  The site's primary action: no fill, a flat `--border` hairline at rest, and
  the brand gradient ring arriving on the button's OWN hover or focus. Same
  pair the work page's "View case study" wears (`.brand-ring-reveal` in
  globals.css). The coral fill these used to carry is gone from the site.
*/
const PRIMARY = cn(
  buttonVariants({ variant: "gradient", size: "lg" }),
  "brand-ring-reveal h-10 px-5"
);

/* Lower emphasis, matching the secondary pill on the work page. */
const SECONDARY =
  "inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const CONTROL =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/*
  A listbox, drawn in the folio's own styling.

  Everything a native `<select>` would have given for free has to be rebuilt,
  and the list below is what that actually costs: open on Enter/Space/Arrow,
  Arrow to move, Home/End to jump, type-ahead to skip, Enter/Space to commit,
  Escape to abandon, Tab to leave, pointer-down elsewhere to dismiss.

  Focus never leaves the TRIGGER. The active option is pointed at with
  `aria-activedescendant` instead, which is the listbox pattern's way of
  keeping one tab stop: moving DOM focus into the list would mean the trigger
  loses it, and the reader would have to tab back out.

  `aria-labelledby` rather than a `<label for>`: the trigger is a button, and
  while a button is labelable, wiring it that way makes clicking the label
  toggle the list, which reads as a stray open rather than a focus move.
*/
function Listbox({
  id,
  label,
  helper,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  helper?: string;
  value: string;
  onChange: (next: string) => void;
  options: readonly string[];
}) {
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  /** Type-ahead buffer, cleared once typing stops. */
  const typed = useRef({ buffer: "", at: 0 });

  const openAt = (index: number) => {
    setActive(index);
    setOpen(true);
  };

  const commit = (index: number) => {
    onChange(options[index]);
    setOpen(false);
  };

  // Keep the active option in view when arrowing past the visible edge.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`#${CSS.escape(`${id}-opt-${active}`)}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  // Pointer down outside dismisses, like any other menu on the page.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const selected = Math.max(0, options.indexOf(value));

    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openAt(selected);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        return;
      case "Tab":
        // Let focus move on, but don't leave the list hanging open behind it.
        setOpen(false);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(active);
        return;
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 1));
        return;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        return;
      case "Home":
        e.preventDefault();
        setActive(0);
        return;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        return;
    }

    // Type-ahead. Single printable characters only, so modifier combinations
    // and named keys fall through to the browser.
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      typed.current.buffer =
        now - typed.current.at > 600 ? e.key : typed.current.buffer + e.key;
      typed.current.at = now;
      const match = options.findIndex((o) =>
        o.toLowerCase().startsWith(typed.current.buffer.toLowerCase())
      );
      if (match >= 0) setActive(match);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-sm font-semibold text-foreground">
        {label}
      </span>

      <div ref={wrapRef} className="relative">
        <button
          type="button"
          id={id}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${labelId} ${id}`}
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          onClick={() => (open ? setOpen(false) : openAt(Math.max(0, options.indexOf(value))))}
          onKeyDown={onKeyDown}
          className={cn(
            CONTROL,
            "flex items-center justify-between gap-3 text-left",
            !value && "text-foreground-muted"
          )}
        >
          {value || "Select an option"}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-foreground-muted transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            className="absolute top-full right-0 left-0 z-20 mt-1.5 max-h-56 overflow-auto rounded-lg border border-border bg-card p-1 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.22)] dark:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.45)]"
          >
            {options.map((option, i) => {
              const isSelected = option === value;
              return (
                /*
                  `onPointerDown` with preventDefault, not onClick: a click
                  fires after the pointerdown that would otherwise blur the
                  trigger and close the list out from under it.
                */
                <li
                  key={option}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    commit(i);
                  }}
                  onPointerEnter={() => setActive(i)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm",
                    i === active ? "bg-accent text-foreground" : "text-foreground",
                    isSelected && "font-semibold"
                  )}
                >
                  {option}
                  {isSelected && (
                    <Check aria-hidden="true" className="size-4 shrink-0 text-brand-weak" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {helper && <p className="text-xs text-foreground-muted">{helper}</p>}
    </div>
  );
}

/** The message the workflow posts, which differs by collaboration mode. */
function PostedMessage({
  type,
  need,
  mode,
}: {
  type: string;
  need: string;
  mode: string;
}) {
  const isCall = mode === "Quick call";

  return (
    <div className="rounded-2xl border border-border bg-card">
      {/*
        A channel header, so the message reads as sitting IN a channel rather
        than floating on its own. That's the point step 3 is making: the ask is
        posted where the team is, not into a DM.
      */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <Hash aria-hidden="true" className="size-4 shrink-0 text-foreground-muted" />
        <span className="text-sm font-semibold text-foreground">ux-collab</span>
        {/* Five, matching the real UX team the workflow was built for. */}
        <span className="text-xs text-foreground-muted">· 5 members</span>
      </div>

      <div className="flex gap-3 p-5">
        {/*
          The workflow's own avatar. A blank square left the column looking
          unfinished, and a bot posting a message is the one thing in this
          mockup that has no human behind it, so a chat glyph says what it is.
        */}
        <div
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-weak/15 text-brand-weak"
        >
          <MessagesSquare className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-foreground">Collaboration Request</span>
            <span className="rounded bg-background-alt px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-foreground-muted uppercase">
              Workflow
            </span>
            <span className="text-xs text-foreground-muted">10:38</span>
          </div>

          <p className="mt-2 text-sm text-foreground">
            <span className="rounded bg-brand-strong/15 px-1 font-medium text-brand-strong">
              @Hanru Wehmeyer
            </span>{" "}
            {isCall ? (
              <>
                is requesting a quick{" "}
                <span className="font-bold">{type}</span> call!
              </>
            ) : (
              <>
                started a <span className="font-bold">{type}</span> Thread
              </>
            )}
          </p>

          <p className="mt-3 text-sm font-bold text-foreground">
            Here&apos;s the problem...
          </p>
          <p className="text-sm text-foreground">{need}</p>

          {isCall ? (
            /*
              The branch worth showing. Picking a call makes the workflow
              generate a Google Meet link, so the message carries a way into
              the call rather than a thread to reply in.
            */
            <div className="mt-4 border-l-2 border-border pl-4">
              <span className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-background">
                <Video aria-hidden="true" className="size-4" />
                Join Call
              </span>
              <p className="mt-2 text-xs text-foreground-muted">
                Google Meet link, added by Collaboration Request
              </p>
            </div>
          ) : (
            <>
              <p className="mt-2 truncate text-sm text-brand-weak underline underline-offset-4">
                hanruwehmeyer.com
              </p>

              {/*
                The thread's reply count, which is the whole payoff of choosing
                "In thread": the discussion collects under the message instead
                of scattering. Stand-in avatars are plain circles -- the people
                in the real thread are anonymised here.
              */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div aria-hidden="true" className="flex -space-x-1.5">
                  {["bg-brand-weak", "bg-brand-strong", "bg-brand-accent"].map(
                    (tone) => (
                      <span
                        key={tone}
                        className={cn(
                          "size-5 rounded-full ring-2 ring-card",
                          tone
                        )}
                      />
                    )
                  )}
                </div>
                <span className="text-sm font-semibold text-brand-weak">
                  14 replies
                </span>
                <span className="text-xs text-foreground-muted">
                  Last reply 2 hours ago
                </span>
              </div>
            </>
          )}

          {/* Reactions. Chrome, but it's what a message that got engagement
              actually looks like, and the row would read as dead without it. */}
          <div aria-hidden="true" className="mt-4 flex flex-wrap gap-1.5">
            {[
              { emoji: "👀", count: 4 },
              { emoji: "😍", count: 2 },
            ].map((r) => (
              <span
                key={r.emoji}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-xs text-foreground"
              >
                <span>{r.emoji}</span>
                {r.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchiveRow({
  date,
  who,
  type,
  mode,
  ask,
  isSelf,
}: {
  date: string;
  who: string;
  type: string;
  mode: string;
  ask: string;
  isSelf?: boolean;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-sm text-foreground-muted">
        {date} <span className="px-0.5">|</span>{" "}
        <span
          className={cn(
            "rounded px-1 font-medium",
            isSelf
              ? "bg-brand-strong/15 text-brand-strong"
              : "bg-background-alt text-brand-weak"
          )}
        >
          {who}
        </span>{" "}
        <span className="px-0.5">|</span> {type} <span className="px-0.5">|</span>{" "}
        {mode}
      </p>
      <p className="mt-1 text-sm text-foreground">{ask}</p>
    </div>
  );
}

export function CollaborationWorkflow() {
  const baseId = useId();
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [need, setNeed] = useState("");
  const [mode, setMode] = useState("");
  const [links, setLinks] = useState("");

  // What the reader chose, or the example where they left a field alone.
  const shownType = type || EXAMPLE.type;
  const shownNeed = need.trim() || EXAMPLE.need;
  const shownMode = mode || EXAMPLE.mode;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const reset = () => {
    setStep(0);
    setType("");
    setNeed("");
    setMode("");
    setLinks("");
  };

  return (
    <div className="mt-20">
      <h3 className="text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.2] font-bold tracking-tight text-foreground">
        Filling the gap
      </h3>
      {/* Full container width, no measure cap -- the same rule SectionHeading
          states for section intros, which is what this is. A `max-w` here left
          it stopping halfway across while the intro above it ran the full
          width. */}
      <p className="mt-3 text-[1.05rem] text-foreground">
        Being more aware of collaboration in a team, I spotted a real gap in
        our process, and I wanted to fix it. So I created a{" "}
        <strong className="font-semibold">Slack workflow</strong>{" "}
        for the UX team, standing in for the &ldquo;quick question&rdquo; habit remote
        working took away. It&apos;s built around framing the problem and saying
        exactly what feedback is needed, so a request costs the person answering
        it as little as possible.
      </p>

      {/*
        A third for the narration, two thirds for the thing being narrated.
        Below `md` it stacks and the text leads, which is the right order to
        read it in anyway.
      */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
        <div className="md:col-span-1">
          <p className="text-xs font-semibold tracking-wide text-brand-weak uppercase">
            Step {step + 1} of {STEPS.length}
          </p>

          {/*
            All four narrations live in ONE grid cell, with the three inactive
            ones held invisible. The cell is therefore always as tall as the
            longest of them, so Back and Next sit at a fixed point instead of
            jumping as the copy changes length -- it moved 87px between the
            shortest step and the longest before this.

            A stacked ghost rather than a `min-h-[...]`: a fixed height is a
            guess that only holds at one column width, and this copy rewraps
            every time the grid does. The tallest block measures itself.

            `aria-hidden` on the inactive ones, or a screen reader would read
            all four steps at once.
          */}
          <div className="mt-2 grid">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                aria-hidden={i !== step}
                className={cn(
                  "col-start-1 row-start-1",
                  i !== step && "invisible"
                )}
              >
                <p className="text-lg font-bold tracking-tight text-foreground">
                  {s.title}
                </p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-foreground">
                  {s.body}
                </p>
                {"hint" in s && s.hint && (
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground-muted">
                    {s.hint}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/*
            Announced politely rather than by moving focus. Next keeps focus on
            Next, so a keyboard reader can walk the whole thing with repeated
            presses; without this the panel beside them would change silently.
          */}
          <p aria-live="polite" className="sr-only">
            Step {step + 1} of {STEPS.length}: {current.title}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={SECONDARY}
            >
              Back
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={reset}
                className={PRIMARY}
              >
                Start again
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className={PRIMARY}
              >
                Next
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          {step === 0 && (
            <Modal title="Start a Collaboration" onSubmit={() => setStep(1)}>
              <Listbox
                id={`${baseId}-type`}
                label="What type of collaboration are you starting?"
                value={type}
                onChange={setType}
                options={TYPES}
              />
              <FieldShell
                label="What do you need help with?"
                helper="Give a short summary of what you are working on, and what you need help with."
                htmlFor={`${baseId}-need`}
              >
                <input
                  id={`${baseId}-need`}
                  type="text"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder="Write something"
                  className={CONTROL}
                />
              </FieldShell>
              <Listbox
                id={`${baseId}-mode`}
                label="How do you want to collab?"
                helper="If you want to start a thread, attach your designs in the next step."
                value={mode}
                onChange={setMode}
                options={MODES}
              />
            </Modal>
          )}

          {step === 1 && (
            <Modal title="Media/Links" onSubmit={() => setStep(2)}>
              <FieldShell
                label="Upload any relevant links"
                optional
                htmlFor={`${baseId}-links`}
              >
                <input
                  id={`${baseId}-links`}
                  type="text"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="Write something"
                  className={CONTROL}
                />
              </FieldShell>
              <p className="text-sm text-foreground-muted">
                The real step also takes file uploads. Nothing to upload here —
                just hit Submit.
              </p>
            </Modal>
          )}

          {step === 2 && (
            <PostedMessage type={shownType} need={shownNeed} mode={shownMode} />
          )}

          {step === 3 && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="divide-y divide-border">
                {/* The request just made, sitting at the top of the archive. */}
                <ArchiveRow
                  date="Today"
                  who="@Hanru Wehmeyer"
                  type={shownType}
                  mode={shownMode}
                  ask={shownNeed}
                  isSelf
                />
                {ARCHIVE.map((entry) => (
                  <ArchiveRow key={entry.date} {...entry} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
