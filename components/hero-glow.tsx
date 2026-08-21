"use client";

import { useCallback, useState } from "react";
import { HeroGradient } from "@/components/hero-gradient";

/*
  The hero's background layer.

  Normally this is `HeroGradient`, a WebGL domain-warped gradient field (see
  that file for what it does and why it isn't CSS). This component owns the one
  decision around it: what to show when a WebGL context can't be created.

  The fallback is a static arrangement of the same five brand colours as
  blurred orbs. It is deliberately NOT animated. An earlier version of this
  file drove drifting orbs from a requestAnimationFrame loop, and the honest
  assessment was that it always read as "a few blurred circles moving", which
  is the exact thing the shader exists to avoid. As a still, the same orbs read
  as a composed gradient wash, which is a much better failure state than a
  worse imitation of the real one.
*/

interface Orb {
  key: string;
  colour: string;
  strength: string;
  size: number;
  blur: number;
  x: number;
  y: number;
}

const FALLBACK_ORBS: Orb[] = [
  { key: "red", colour: "var(--brand-grad-1)", strength: "58%", size: 62, blur: 80, x: 0.26, y: 0.24 },
  { key: "yellow", colour: "var(--brand-grad-2)", strength: "30%", size: 48, blur: 90, x: 0.62, y: 0.16 },
  { key: "green", colour: "var(--brand-grad-3)", strength: "48%", size: 62, blur: 85, x: 0.30, y: 0.70 },
  { key: "teal", colour: "var(--brand-grad-4)", strength: "62%", size: 70, blur: 75, x: 0.74, y: 0.58 },
  { key: "cream", colour: "var(--brand-grad-5)", strength: "12%", size: 32, blur: 70, x: 0.50, y: 0.44 },
];

export function HeroGlow({
  randomizeRef,
}: {
  /** Passed straight through to HeroGradient, which fills it in with its
   *  reshuffle function for the hero's button to call. */
  randomizeRef?: React.MutableRefObject<(() => void) | null>;
}) {
  const [webglFailed, setWebglFailed] = useState(false);
  const onUnsupported = useCallback(() => setWebglFailed(true), []);

  return (
    // Decorative, so hidden from assistive tech.
    <div aria-hidden="true" className="hero-glow">
      {webglFailed ? (
        FALLBACK_ORBS.map((orb) => (
          <span
            key={orb.key}
            className="hero-orb"
            style={{
              width: `${orb.size}%`,
              left: `${orb.x * 100}%`,
              top: `${orb.y * 100}%`,
              filter: `blur(${orb.blur}px)`,
              ["--orb-colour" as string]: orb.colour,
              ["--orb-strength" as string]: orb.strength,
            }}
          />
        ))
      ) : (
        <HeroGradient onUnsupported={onUnsupported} randomizeRef={randomizeRef} />
      )}
      {/* Frames the field back into the page. See .hero-vignette. */}
      <span className="hero-vignette" />
    </div>
  );
}
