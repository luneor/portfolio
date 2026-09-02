"use client";

import { useId, useState } from "react";
import { Listbox } from "@/components/ui/listbox";
import { cn } from "@/lib/utils";

/*
  The Keystroke Level Model calculator I built while redesigning bulk
  deactivation, rebuilt here in the folio's own design system so it can be
  used rather than screenshotted.

  Same job as CollaborationWorkflow on the other Process page, and the same
  1/3-narration, 2/3-artefact grid: the reader does the thing rather than
  reads about it. There the form shapes the message; here the sequence shapes
  the number, and the point only lands if you can watch it climb.

  What this ISN'T is a before-and-after of the flow. The fixes that came out
  of the project -- a date filter, a RAG status -- belong to the Last Active
  case study. What belongs on an accessibility page is the thing the
  measurement threw up on its way past: the same job costs more without a
  mouse, and the profile switch at the top of the card is where that stops
  being an abstraction.
*/

/*
  Desktop and mobile are two different models, not one model with a couple of
  values swapped, which is why the whole operator set is keyed off the device.
  Note P and S in particular: on a desktop they are Point (1.10s) and Scan
  (2.29s), on a touch screen they are Press (0.10s) and Swipe (0.15s). Same
  letters, different operators, so the sequence is cleared when the device
  changes rather than silently reinterpreted.

  K sits at the 55 wpm skilled-typist rate and R at 0.10s -- the calculator's
  own defaults. Both are adjustable in the real tool; here they're fixed, so
  the card is a profile switch and an operator pad and nothing else to read
  before the number moves.
*/
const DEVICES = {
  desktop: {
    label: "Desktop",
    operators: [
      { key: "K", name: "Keystroke", cost: 0.2 },
      { key: "P", name: "Point to element on screen", cost: 1.1 },
      { key: "B", name: "Press or release mouse button", cost: 0.1 },
      { key: "H", name: "Homing the hand(s)", cost: 0.4 },
      { key: "S", name: "Scan for content", cost: 2.29 },
      { key: "M", name: "Mental preparation", cost: 1.35 },
      { key: "R", name: "System response time", cost: 0.1 },
    ],
  },
  mobile: {
    label: "Mobile",
    operators: [
      { key: "K", name: "Keystroke", cost: 0.2 },
      { key: "T", name: "Tap", cost: 0.2 },
      { key: "P", name: "Press", cost: 0.1 },
      { key: "E", name: "Release", cost: 0.1 },
      { key: "S", name: "Swipe", cost: 0.15 },
      { key: "D", name: "Drag", cost: 0.8 },
      { key: "L", name: "Long press", cost: 0.7 },
      { key: "H", name: "Homing the hand(s)", cost: 0.4 },
      { key: "M", name: "Mental preparation", cost: 1.35 },
      { key: "R", name: "System response time", cost: 0.1 },
    ],
  },
} as const;

type DeviceKey = keyof typeof DEVICES;

/*
  PLACEHOLDER COEFFICIENTS -- replace with the ones the real calculator uses.

  The four profiles and their grouping are taken from the tool; the numbers
  below are stand-ins so the control is wired end to end, NOT measurements. A
  profile scales the operators it actually touches rather than the whole
  sequence, which is the honest shape: a cognitive load doesn't make a mouse
  slower, it makes the pause before the mouse longer.

  `scales` maps an operator key to its multiplier. Anything unlisted is 1.
*/
const PROFILES = [
  /* The label is the identity -- the listbox addresses options by their text,
     so these have to stay unique, which they are. */
  { label: "No impairment", scales: {} },
  {
    label: "Motor impairment",
    scales: { P: 2.5, B: 1.5, T: 2, D: 2.5, L: 1.5, H: 2, K: 1.8 },
  },
  {
    label: "Visual impairment",
    scales: { S: 3, P: 2, K: 1.3 },
  },
  {
    label: "Cognitive impairment",
    scales: { M: 2.5, S: 1.5 },
  },
] as const;

/** A term in the sequence: one operator, and how many of it in a row. Only
    ever built by folding the flat list below -- never stored. */
type Term = { key: string; count: number };

/** Adjacent presses of the same operator read as one term: H, P×6. */
function terms(sequence: string[]) {
  return sequence.reduce<Term[]>((out, key) => {
    const last = out[out.length - 1];
    if (last && last.key === key) last.count += 1;
    else out.push({ key, count: 1 });
    return out;
  }, []);
}

/* Every control in the card wears one of these. Same pair as the work page: a
   hairline pill for the low-emphasis actions, filled for the state that's on. */
const PILL =
  "inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none";

const SEGMENT =
  "block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring";

/* Archivo, the heading face, and the button's own size. These were mono at
   0.8rem, which read as a third typeface sitting inside a pill of body copy;
   the letters are names, not code. The sequence readout keeps mono, because
   there they ARE a formula. */
const KEY_GLYPH = "font-heading font-bold tracking-[-0.02em] text-brand-weak";

const FIELD_LABEL = "text-sm font-semibold text-foreground";

/*
  Native radios, visually hidden, with the pill drawn by the label beside each.
  A segmented control is a radio group wearing a different coat, and rebuilding
  it from buttons would mean reimplementing arrow-key roving and the group's
  accessible name for no gain.
*/
function Segmented<T extends string>({
  name,
  legend,
  value,
  onChange,
  options,
  className,
}: {
  name: string;
  legend: string;
  value: T;
  onChange: (next: T) => void;
  options: readonly { key: T; label: string }[];
  className?: string;
}) {
  return (
    <fieldset>
      <legend className={cn(FIELD_LABEL, "mb-2")}>{legend}</legend>
      <div
        /* Concentric with the pills inside it: their radius is half their
           height, plus the 4px of padding, which is what `rounded-full`
           resolves to on a box this tall. It was `rounded-2xl` while the four
           profiles lived in one of these and stacked on a phone; they're a
           dropdown now, and two short pills never wrap. */
        className={cn(
          "inline-flex flex-wrap gap-1 rounded-full border border-border p-1",
          className
        )}
      >
        {options.map((option) => (
          <label key={option.key} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.key}
              checked={option.key === value}
              onChange={() => onChange(option.key)}
              className="peer sr-only"
            />
            {/* The ring has to live here: the input it belongs to is
                `sr-only`, so its own would be drawn offscreen. */}
            <span
              className={cn(
                SEGMENT,
                option.key === value
                  ? "bg-brand-weak text-background"
                  : "text-foreground hover:bg-accent"
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function KeystrokeModel() {
  const baseId = useId();
  const [profileLabel, setProfileLabel] = useState<string>(PROFILES[0].label);
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [sequence, setSequence] = useState<string[]>([]);

  const profile =
    PROFILES.find((p) => p.label === profileLabel) ?? PROFILES[0];
  const scales: Record<string, number> = profile.scales;

  /** An operator's cost is its base value for this device, scaled by whatever
      the chosen profile does to that operator. */
  const operators = DEVICES[device].operators;
  const costs = Object.fromEntries(
    operators.map((op) => [op.key, op.cost * (scales[op.key] ?? 1)])
  );

  const shown = terms(sequence);
  const seconds = sequence.reduce((sum, key) => sum + (costs[key] ?? 0), 0);

  /*
    Switching device clears the sequence. P and S mean different operators on
    the two models, so carrying a sequence across would keep the letters and
    silently change what they cost -- a wrong number that looks right.
  */
  const changeDevice = (next: DeviceKey) => {
    setDevice(next);
    setSequence([]);
  };

  /** Spoken form, so the live region reads "P times 6" rather than "P
      multiplication sign 6". */
  const spoken = shown.length
    ? shown
        .map((t) => (t.count > 1 ? `${t.key} times ${t.count}` : t.key))
        .join(", ")
    : "empty";

  return (
    <div className="mt-20">
      <h3 className="text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.2] font-bold tracking-tight text-foreground">
        Finding an accessibility gap
      </h3>

      {/* Full container width, no measure cap -- the rule SectionHeading
          states for section intros, which is what this is. */}
      <p className="mt-3 text-[1.05rem] text-foreground">
        When I was designing improvements to how long it takes to bulk
        deactivate users in Genio Admin, I needed a number. Counting clicks
        gives you one, but it treats every action as the same size.{" "}
        <strong className="font-semibold">Keystroke Level Modelling</strong>{" "}
        puts a real duration on each one, which is a far better indication of
        where the friction is, so I built a calculator for it.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
        <div className="md:col-span-1">
          {/* Both column headings wear the accent and the same size: they're
              peers, the two halves of what this column says. */}
          <h4 className="text-[1.05rem] font-bold tracking-tight text-brand-weak">
            Try it
          </h4>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-foreground">
            Take a journey you know well. One part of a website to another, or
            the same thing in an app. Note down every action it takes, build it
            here, and see what it really costs.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground">
            Then switch the profile and watch that number move. The same
            journey costs one person twice what it costs another, and the
            interface has no idea.
          </p>

          {/*
            "How I used it" sits in this column rather than under the grid.
            Below the card it read as a conclusion the reader reaches after
            they've finished playing; beside it, it's the reason to start.
          */}
          <h4 className="mt-8 text-[1.05rem] font-bold tracking-tight text-brand-weak">
            How I used it
          </h4>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-foreground">
            Running the Admin flows through it turned up something I
            wasn&apos;t looking for: keyboard users hadn&apos;t really been
            considered. Repetitive actions with nothing to skip, a focus order
            that walks every cell of a table, nothing to jump between.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground">
            Every route cost more without a mouse, so keyboard improvements
            went in.
          </p>
        </div>

        <div className="md:col-span-2">
          {/* No `overflow-hidden`: the profile listbox has to be able to
              paint its open list past the card's edge. Nothing else here
              bleeds into the rounded corners, so the footer squares itself
              off explicitly instead. */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex flex-col gap-5 border-b border-border p-5">
              {/*
                Profile takes the flexible column and device the one it needs.
                Four profiles as pills wrapped to four stacked rows on a phone
                and swamped the two controls beside them; as a dropdown it's
                one line at every width, which also puts the emphasis back on
                the operator pad below rather than on the settings above it.
              */}
              <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto]">
                <Listbox
                  id={`${baseId}-profile`}
                  label="User profile"
                  value={profileLabel}
                  onChange={setProfileLabel}
                  options={PROFILES.map((p) => p.label)}
                />

                <Segmented
                  name={`${baseId}-device`}
                  legend="Device"
                  value={device}
                  onChange={changeDevice}
                  options={[
                    { key: "desktop", label: DEVICES.desktop.label },
                    { key: "mobile", label: DEVICES.mobile.label },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 p-5">
              <div>
                <p className={FIELD_LABEL}>Operators</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {operators.map((op) => (
                    <button
                      key={op.key}
                      type="button"
                      onClick={() =>
                        setSequence((current) => [...current, op.key])
                      }
                      className={PILL}
                    >
                      {/* The explicit spaces are load-bearing. `gap-2` is a
                          visual gap only, so without them the accessible name
                          concatenates to "KKeystroke0.20s". */}
                      <span className={KEY_GLYPH}>{op.key}</span> {op.name}{" "}
                      <span className="tabular-nums text-foreground-muted">
                        {costs[op.key].toFixed(2)}s
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className={FIELD_LABEL}>
                    Sequence
                    {sequence.length > 0 && (
                      <span className="ml-2 font-normal tabular-nums text-foreground-muted">
                        {sequence.length} operator
                        {sequence.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSequence((c) => c.slice(0, -1))}
                      disabled={!sequence.length}
                      className={PILL}
                    >
                      Undo
                    </button>
                    <button
                      type="button"
                      onClick={() => setSequence([])}
                      disabled={!sequence.length}
                      className={PILL}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* `min-h` for two lines, so the box doesn't grow the moment
                    the sequence wraps and shove the total down the card. */}
                <div className="mt-2 flex min-h-20 flex-wrap content-start items-start gap-x-3 gap-y-2 rounded-lg border border-input bg-background p-3">
                  {shown.length === 0 ? (
                    <p className="font-mono text-[0.8rem] text-foreground-muted">
                      Nothing yet. Press an operator above.
                    </p>
                  ) : (
                    shown.map((term, i) => (
                      <span
                        key={`${term.key}-${i}`}
                        className="font-mono text-[0.9rem] tracking-[0.03em] text-foreground"
                      >
                        <span className="font-bold text-brand-weak">
                          {term.key}
                        </span>
                        {term.count > 1 && (
                          <span className="text-foreground-muted">
                            ×{term.count}
                          </span>
                        )}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-b-2xl border-t border-border bg-background-alt px-5 py-4">
              <p className={FIELD_LABEL}>Predicted time</p>
              {/* The one number the whole thing exists to produce, so it gets
                  to be the biggest thing in the card. Size and weight do that
                  on their own; it was coral, which read as a warning about a
                  number that is just a number. */}
              <p className="text-[clamp(1.6rem,3vw,2.1rem)] leading-none font-extrabold tracking-tight tabular-nums text-foreground">
                {seconds.toFixed(2)}s
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*
        Announced politely rather than by moving focus. Focus stays on whatever
        was pressed, so the whole calculator can be worked from the keyboard;
        without this the sequence and the total would change in silence.
      */}
      <p aria-live="polite" className="sr-only">
        {profile.label}, {DEVICES[device].label}. Sequence: {spoken}. Predicted
        time {seconds.toFixed(2)} seconds.
      </p>
    </div>
  );
}
