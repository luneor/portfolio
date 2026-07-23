"use client";

/**
 * Adapted from KokonutUI's Mouse Effect Card (@kokonutui/mouse-effect-card):
 * https://kokonutui.com/docs/cards/mouse-effect-card
 *
 * Ported from the card into a full-bleed background layer:
 * - No card chrome / text — just the interactive dot field.
 * - Pointer is tracked on `window` (not the element) so dots still react
 *   when the cursor is over the sibling content sitting on top.
 * - The card's "dots fade toward the centred text" logic is KEPT and made
 *   focusable: dots thin out and dim around `focus`, so whatever sits there
 *   (our hero copy) stays high-contrast and readable. Denser toward the edges.
 * - Honours prefers-reduced-motion: no pointer reaction, no pulsing.
 */

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.5 };
const OPACITY_DURATION_BASE = 0.8;
const OPACITY_DURATION_VARIATION = 0.2;
const OPACITY_EASE = [0.4, 0, 0.2, 1] as const;
const OPACITY_DELAY_CYCLE = 1.5;
const OPACITY_DELAY_STEP = 0.02;
const MIN_OPACITY_MULTIPLIER = 0.5;
const MAX_OPACITY_MULTIPLIER = 1.5;
const MIN_OPACITY_FALLBACK = 0.3;
const PROXIMITY_MULTIPLIER = 1.2;
const PROXIMITY_OPACITY_BOOST = 0.8;

interface Dot {
  id: string;
  baseX: number;
  baseY: number;
  opacity: number;
}

function generateDots(
  width: number,
  height: number,
  spacing: number,
  focusX: number,
  focusY: number
): Dot[] {
  const dots: Dot[] = [];
  const cols = Math.ceil(width / spacing);
  const rows = Math.ceil(height / spacing);
  const fx = width * focusX;
  const fy = height * focusY;

  const maxDistance = Math.max(
    Math.hypot(0 - fx, 0 - fy),
    Math.hypot(width - fx, 0 - fy),
    Math.hypot(0 - fx, height - fy),
    Math.hypot(width - fx, height - fy)
  );

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const x = col * spacing;
      const y = row * spacing;

      // 0 at the focus point → 1 at the far edges.
      const distanceFromFocus = Math.hypot(x - fx, y - fy);
      const edgeFactor = Math.min(distanceFromFocus / (maxDistance * 0.7), 1);

      // Skip dots probabilistically near the focus, so text stays clear.
      if (Math.random() > edgeFactor) continue;

      const pattern = (row + col) % 3;
      const baseOpacities = [0.3, 0.5, 0.7];
      const opacity = baseOpacities[pattern] * edgeFactor;

      dots.push({ id: `dot-${row}-${col}`, baseX: x, baseY: y, opacity });
    }
  }

  return dots;
}

interface DotComponentProps {
  dot: Dot;
  index: number;
  dotSize: number;
  opacityScale: number;
  reduce: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  repulsionRadius: number;
  repulsionStrength: number;
}

function DotComponent({
  dot,
  index,
  dotSize,
  opacityScale,
  reduce,
  mouseX,
  mouseY,
  repulsionRadius,
  repulsionStrength,
}: DotComponentProps) {
  const posX = useTransform([mouseX, mouseY], () => {
    const mx = mouseX.get();
    const my = mouseY.get();
    if (!(Number.isFinite(mx) && Number.isFinite(my))) return 0;
    const dx = dot.baseX - mx;
    const dy = dot.baseY - my;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < repulsionRadius) {
      const force = (1 - distance / repulsionRadius) * repulsionStrength;
      return Math.cos(Math.atan2(dy, dx)) * force;
    }
    return 0;
  });

  const posY = useTransform([mouseX, mouseY], () => {
    const mx = mouseX.get();
    const my = mouseY.get();
    if (!(Number.isFinite(mx) && Number.isFinite(my))) return 0;
    const dx = dot.baseX - mx;
    const dy = dot.baseY - my;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < repulsionRadius) {
      const force = (1 - distance / repulsionRadius) * repulsionStrength;
      return Math.sin(Math.atan2(dy, dx)) * force;
    }
    return 0;
  });

  const opacityBoost = useTransform([mouseX, mouseY], () => {
    const mx = mouseX.get();
    const my = mouseY.get();
    if (!(Number.isFinite(mx) && Number.isFinite(my))) return 0;
    const dx = dot.baseX - mx;
    const dy = dot.baseY - my;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = repulsionRadius * PROXIMITY_MULTIPLIER;
    if (distance < maxDistance) {
      return (1 - distance / maxDistance) * PROXIMITY_OPACITY_BOOST * opacityScale;
    }
    return 0;
  });

  const x = useSpring(posX, SPRING_CONFIG);
  const y = useSpring(posY, SPRING_CONFIG);

  const baseMinOpacity =
    Math.max(dot.opacity * MIN_OPACITY_MULTIPLIER, MIN_OPACITY_FALLBACK) *
    opacityScale;
  const baseMaxOpacity =
    Math.min(dot.opacity * MAX_OPACITY_MULTIPLIER, 1) * opacityScale;

  const boostedOpacity = useTransform(opacityBoost, (boost) =>
    Math.min(baseMinOpacity + boost, 1)
  );
  const opacitySpring = useSpring(boostedOpacity, {
    stiffness: 150,
    damping: 25,
  });

  const delay = (index * OPACITY_DELAY_STEP) % OPACITY_DELAY_CYCLE;

  return (
    <motion.div
      className="absolute rounded-full bg-brand-green will-change-transform"
      initial={{ opacity: baseMinOpacity }}
      animate={
        reduce
          ? { opacity: baseMinOpacity }
          : { opacity: [baseMinOpacity, baseMaxOpacity, baseMinOpacity] }
      }
      transition={
        reduce
          ? undefined
          : {
              opacity: {
                duration:
                  OPACITY_DURATION_BASE +
                  (index % 4) * OPACITY_DURATION_VARIATION,
                repeat: Number.POSITIVE_INFINITY,
                ease: OPACITY_EASE,
                delay,
                times: [0, 0.5, 1],
              },
            }
      }
      style={{
        width: dotSize,
        height: dotSize,
        left: dot.baseX,
        top: dot.baseY,
        x: reduce ? 0 : x,
        y: reduce ? 0 : y,
        opacity: reduce ? baseMinOpacity : opacitySpring,
      }}
    />
  );
}

interface MouseEffectBackgroundProps {
  className?: string;
  dotSize?: number;
  dotSpacing?: number;
  repulsionRadius?: number;
  repulsionStrength?: number;
  /** Point the dot field fades around, as fractions of width/height. */
  focus?: { x: number; y: number };
  /** Scales overall dot opacity (keep it a subtle background). */
  opacityScale?: number;
}

export default function MouseEffectBackground({
  className,
  dotSize = 2,
  dotSpacing = 28,
  repulsionRadius = 90,
  repulsionStrength = 24,
  focus = { x: 0.5, y: 0.5 },
  opacityScale = 0.6,
}: MouseEffectBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const mouseY = useMotionValue(Number.POSITIVE_INFINITY);
  const [dots, setDots] = useState<Dot[]>([]);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateDots = () => {
      const rect = el.getBoundingClientRect();
      setDots(
        generateDots(rect.width, rect.height, dotSpacing, focus.x, focus.y)
      );
    };

    updateDots();
    const resizeObserver = new ResizeObserver(updateDots);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [dotSpacing, focus.x, focus.y]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduce) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    const onLeave = () => {
      mouseX.set(Number.POSITIVE_INFINITY);
      mouseY.set(Number.POSITIVE_INFINITY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {dots.map((dot, index) => (
        <DotComponent
          key={dot.id}
          dot={dot}
          index={index}
          dotSize={dotSize}
          opacityScale={opacityScale}
          reduce={reduce}
          mouseX={mouseX}
          mouseY={mouseY}
          repulsionRadius={repulsionRadius}
          repulsionStrength={repulsionStrength}
        />
      ))}
    </div>
  );
}
