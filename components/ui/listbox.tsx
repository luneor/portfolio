"use client";

/*
  A listbox, drawn in the folio's own styling.

  Extracted from the Collaboration page's Slack workflow, which is where it was
  first built and which still uses it; the Accessibility page's KLM calculator
  is the second caller. Still hand-built rather than a native `<select>`, for
  the reason it was built that way in the first place: a native one is free
  correctness, but its open list is drawn by the OS in the OS's own styling,
  which is the one part of these panels that couldn't be made to look like the
  rest of the site.

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

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* The shared field skin: the same border, padding and focus ring as the text
   inputs a listbox sits beside, so a trigger and an input read as one kind of
   control. Exported because the Slack workflow's own fields wear it too. */
export const CONTROL =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function Listbox({
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
