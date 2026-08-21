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
 *  - Two colours, not six: brand-weak (the site's cool accent, teal on cream,
 *    mint on near-black) on the border at rest, swapping to brand-strong red
 *    on hover, which also brings in the radial glow. The glow is hover-only:
 *    having it at rest too made the hover state read as barely different, so
 *    it's held in reserve as the one thing that shows up when a card actually
 *    gets attention, instead of just swapping which colour is already there.
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
    glowOpacity.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 900,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-brand-weak/50 bg-card p-5",
        "transition-colors duration-300 hover:border-brand-strong",
        className
      )}
    >
      {/* Red shine: invisible at rest, brought in on hover only, see the
          file header for why. An inset glow hugging all four edges rather
          than a single radial spot in one corner, and dialled down so it
          reads as a subtle lift rather than a coloured wash. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          opacity: glowOpacity,
          boxShadow:
            "inset 0 0 48px color-mix(in srgb, var(--brand-strong) 10%, transparent)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-2">{children}</div>
    </motion.div>
  );
}

export default SpotlightCard;
