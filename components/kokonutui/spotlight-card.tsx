"use client";

/**
 * Adapted from KokonutUI's Spotlight Cards (@kokonutui/spotlight-cards):
 * https://kokonutui.com/docs/cards/spotlight-cards
 *
 * The reference is a whole feature-grid block: dot-grid backdrop, its own
 * eyebrow and heading, six per-item accent colours, a diagonal shimmer sweep,
 * and every sibling card dimming when one is hovered. Pulled down to a single
 * `SpotlightCard`, so it can drop into a section that already has its own
 * heading and grid (see `components/sections/ai.tsx`), and toned down to suit
 * a quieter site:
 *  - Mint at rest, the site's brand gradient hairline on hover (`.brand-ring`
 *    plus `.brand-ring-card` in globals.css). Three of these sit side by side
 *    and are meant to be read as prose, so carrying the full gradient at rest
 *    read as decoration competing with the text inside them; held back for
 *    hover it's the thing that shows up when a card actually gets attention.
 *  - The inner glow is hover-only for the same reason: at rest as well, the
 *    hover state read as barely different from the resting one.
 *  - Tilt kept, since it's what makes a flat card feel like it's under a
 *    spotlight, but shallower (4° vs the reference's 9°), and skipped
 *    entirely under prefers-reduced-motion.
 *  - Shimmer sweep, bottom accent line, icon badge, and sibling-dimming
 *    dropped: incidental chrome that suits a marketing feature grid, too busy
 *    for three principle cards meant to be read as prose. The border and the
 *    glow already say "hovered" on their own.
 */

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const TILT_MAX = 4;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

export interface SpotlightCardProps {
  className?: string;
  children: React.ReactNode;
}

export function SpotlightCard({ className, children }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  // 0 = resting (no glow), 1 = hovered (red glow). The border has its own
  // rest colour via CSS below; this only drives the glow, which has nothing
  // to show at rest.
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((event.clientX - rect.left) / rect.width);
    normY.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => glowOpacity.set(1);

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    /*
      Unless the card is still keyboard-focused. Hovering a focused card and
      then leaving it would otherwise take the glow away while the ring stayed
      lit, which reads as the card half-losing its state.
    */
    if (cardRef.current?.matches(":focus-visible")) return;
    glowOpacity.set(0);
  };

  /*
    The keyboard's half of the hover state.

    The gradient hairline needs nothing here -- `.brand-ring:focus-visible` in
    globals.css already covers it, because unlike the project cards this class
    sits ON the focusable element rather than on a wrapper around it. Only the
    glow is driven from JS, so only the glow needs these.

    Gated on `:focus-visible` rather than plain focus, so it matches what the
    hairline does. Clicking the card focuses it too, now that it is tabbable,
    and without this test the glow would light on that click and then sit there
    lit after the pointer had gone.

    The tilt is deliberately left at rest. It reads a cursor position, and a
    keyboard focus has none; a card that tilted to some invented angle on focus
    would be inventing information.
  */
  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.matches(":focus-visible")) return;
    glowOpacity.set(1);
  };

  const handleBlur = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      /*
        Focusable, so the keyboard can reach the same state the pointer gets.

        Worth being clear that this is a deliberate trade rather than a plain
        win: the card holds a heading and a paragraph and nothing to activate,
        so this adds a tab stop that does not DO anything. It was taken
        knowingly, to put keyboard users on equal footing with the hover state
        rather than leaving the effect pointer-only.
      */
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 900,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        // `brand-ring` supplies the gradient hairline (globals.css). The card
        // sets its own fill through the variable that class paints from, so it
        // keeps sitting a step off the page ground like every other card.
        "brand-ring brand-ring-card overflow-hidden rounded-xl p-5 [--brand-ring-fill:var(--card)] [--brand-ring-rest:0]",
        className
      )}
    >
      {/* Inner glow: invisible at rest, brought in on hover only. An inset
          glow hugging all four edges rather than a single radial spot in one
          corner, and deliberately faint. There are three of these side by
          side and they're meant to be read as prose, so the hover wants to
          be felt more than seen. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          opacity: glowOpacity,
          boxShadow:
            "inset 0 0 36px color-mix(in srgb, var(--brand-grad-4) 12%, transparent)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-2">{children}</div>
    </motion.div>
  );
}

export default SpotlightCard;
