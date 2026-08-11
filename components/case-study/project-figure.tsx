"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectMedia } from "@/lib/projects";

/*
  A captioned image or screen recording on a case study.

  Images open in a lightbox: hovering (or focusing) shows a "click to view"
  pill, and activating it lifts the image to the centre of a dimmed, blurred
  backdrop. Videos are left alone, since they already own their click target
  through the native controls.

  The dialog renders through a portal so it can never be clipped or repositioned
  by an ancestor's overflow or transform, and it behaves like a real dialog:
  Escape closes, the backdrop closes, focus moves in and returns to the trigger,
  and the page behind it cannot scroll.
*/
export function ProjectFigure({ media }: { media: ProjectMedia }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
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
        <div className="overflow-hidden rounded-xl border border-border bg-background-alt">
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

  return (
    <figure className="flex flex-col gap-3">
      {/*
        Capped to the image's own intrinsic width: without this, a narrow
        portrait screenshot gets stretched up to the full article width and
        renders far larger inline than intended. Capping it means the lightbox
        (which scales up toward the viewport) is always an enlargement, never
        a same-size or smaller view.
      */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        style={{ maxWidth: media.width }}
        className="group relative mx-auto block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-background-alt focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes={`(max-width: 768px) 100vw, ${media.width}px`}
          className="h-auto w-full"
        />
        {/* Appears on hover AND keyboard focus, so it isn't pointer-only. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 bottom-3 rounded-full border border-border bg-background/90 px-3 py-1 font-mono text-[0.68rem] tracking-[0.04em] text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          click to view
        </span>
      </button>
      {caption}

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
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
              className="relative flex max-h-full w-auto flex-col items-center gap-3"
            >
              <Image
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                sizes="92vw"
                className="max-h-[82vh] w-auto max-w-full rounded-xl border border-border object-contain"
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
