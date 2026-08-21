"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectMedia } from "@/lib/projects";

// Matches `md`, the same line the case-study rail collapses on.
const LIGHTBOX_MIN_WIDTH = "(min-width: 768px)";

/**
 * Whether the viewport is wide enough to bother with the lightbox.
 *
 * Starts false so the server render and the first client render agree, then
 * upgrades after mount. That makes the lightbox a progressive enhancement: below
 * the breakpoint the image is never wrapped in a control at all, rather than
 * being wrapped in one that's been neutered, which would still be focusable and
 * announced as a button that does nothing.
 */
function useLightboxEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(LIGHTBOX_MIN_WIDTH);
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return enabled;
}

/*
  A captioned image or screen recording on a case study.

  On wide viewports images open in a lightbox: hovering (or focusing) shows a
  "click to view" pill, and activating it lifts the image to the centre of a
  dimmed, blurred backdrop. Below `md` that's dropped entirely, since a
  touchscreen already offers pinch-to-zoom and does it better than a modal can.
  Videos are always left alone, since they own their click target through the
  native controls.

  The dialog renders through a portal so it can never be clipped or repositioned
  by an ancestor's overflow or transform, and it behaves like a real dialog:
  Escape closes, the backdrop closes, focus moves in and returns to the trigger,
  and the page behind it cannot scroll.
*/
export function ProjectFigure({
  media,
  priority,
}: {
  media: ProjectMedia;
  /** For the one figure above the fold, the Snapshot cover: skips lazy
   * loading so it doesn't delay LCP. Never needed by a gallery figure
   * further down the page. */
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lightboxEnabled = useLightboxEnabled();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Portals need a DOM; the first client render must match the server's.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    // Hold the page still while the dialog is up.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  const caption = media.caption && (
    <figcaption className="font-mono text-[0.72rem] leading-relaxed tracking-[0.03em] text-foreground-muted">
      {media.caption}
    </figcaption>
  );

  if (media.kind === "video") {
    return (
      <figure className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-lg border border-border bg-background-alt">
          {/*
            Never autoplayed: nothing moves until the reader presses play, so
            the page stays calm and reduced-motion needs no special case. These
            recordings are silent, so `description` is the accessible name and
            there's no audio to caption.
          */}
          <video
            src={media.src}
            poster={media.poster}
            width={media.width}
            height={media.height}
            controls
            playsInline
            preload="metadata"
            aria-label={media.description}
            className="h-auto w-full"
          />
        </div>
        {caption}
      </figure>
    );
  }

  const image = (
    <Image
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={`(max-width: 768px) 100vw, ${media.width}px`}
      className="h-auto w-full"
      priority={priority}
    />
  );

  /*
    Sizing is driven by WIDTH alone, with the image's own aspect ratio folded
    into the expression, so height follows automatically and the box always hugs
    the image (no letterboxing inside a wider border).

    A width cap alone isn't enough. Capping a 726x1329 screenshot to its natural
    width still renders it ~1245px tall in the article, taller than the viewport,
    and it made the lightbox SMALLER than the inline copy. Expressing a height
    budget as `budget * ratio` bounds the height without a separate max-height
    that would break the ratio.
  */
  const ratio = (media.width / media.height).toFixed(4);

  /*
    Inline: never wider than its natural size (upscaling a screenshot in the body
    of an article just softens it) and never taller than 60% of the viewport, so
    a tall portrait can't dominate the read.
  */
  const inlineWidth = `min(100%, ${media.width}px, calc(60vh * ${ratio}))`;

  /*
    Lightbox: as large as the three limits allow. The padded viewport width, so
    big sources (most are 1200-2000px) fill the screen; 80vh of height, which is
    what stops the very tall portraits (the bubble treatment, the Tell Me a Story
    onboarding screens, all around 2:1) running the full height of the screen; and
    the source's own resolution.

    That last cap means small assets don't fill the width, deliberately. These are
    screenshots with UI text in them, and the smallest are only ~730-800px wide,
    so stretching one to fill a 1184px column on a 2x display is roughly 3x
    interpolation and the text goes to mush. A crisp smaller image is the better
    view, and it's still larger than the inline copy in every case, because that
    one is additionally capped at 60vh and the article's column width.
  */
  const lightboxWidth = `min(100%, ${media.width}px, calc(80vh * ${ratio}))`;

  /*
    Left-aligned, not centred. A landscape image fills the column so it makes no
    difference, but a narrow portrait floated in the middle of the measure breaks
    the reading edge the rest of the article holds to.
  */
  const frame = "block overflow-hidden rounded-lg border border-border bg-background-alt";

  return (
    <figure className="flex flex-col gap-3">
      {lightboxEnabled ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          style={{ width: inlineWidth }}
          className={`group relative cursor-zoom-in focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${frame}`}
        >
          {image}
          {/* Appears on hover AND keyboard focus, so it isn't pointer-only. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 bottom-3 rounded-full border border-border bg-background/90 px-3 py-1 font-mono text-[0.68rem] tracking-[0.04em] text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            click to view
          </span>
        </button>
      ) : (
        // Plain frame, no control: pinch-to-zoom is the affordance here.
        <div style={{ width: inlineWidth }} className={frame}>
          {image}
        </div>
      )}
      {caption}

      {mounted &&
        open &&
        createPortal(
          // Generous gutters, so the image never runs to the screen edge.
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            {/* Dimmed, blurred backdrop. Clicking it closes. */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={close}
              aria-hidden="true"
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label={media.alt}
              className="relative flex w-full max-w-full flex-col items-center gap-3"
            >
              <Image
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                sizes="92vw"
                style={{ width: lightboxWidth }}
                className="h-auto rounded-lg border border-border"
              />
              {media.caption && (
                <p className="max-w-[70ch] text-center font-mono text-[0.72rem] leading-relaxed tracking-[0.03em] text-foreground">
                  {media.caption}
                </p>
              )}

              {/*
                Solid, not `glass`: over a blurred backdrop a translucent
                button reads as a smudge rather than a control. A plain card
                fill and a standard border keep it in line with the rest of
                the site's chrome.
              */}
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="absolute -top-3 -right-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                <span className="sr-only">Close image</span>
                <span aria-hidden="true">✕</span>
              </button>
            </div>
          </div>,
          document.body
        )}
    </figure>
  );
}
