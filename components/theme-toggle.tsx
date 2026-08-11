"use client";

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

// Matches the 300ms cross-fade in globals.css (both the view transition and
// the `.theme-transition` fallback).
const THEME_TRANSITION_MS = 300;

/*
  Fallback-only buffer: the class-based fade starts a frame or two after the
  click, so removing the class at exactly 300ms would cut it off mid-flight.
*/
const THEME_TRANSITION_BUFFER_MS = 200;

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Server and the first client render must match (theme is unknown
    // server-side), so the real icon only appears once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    const root = document.documentElement;
    const doc = document as ViewTransitionDocument;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
      Preferred path: a View Transition cross-fades a snapshot of the entire
      page in one pass, so text, backgrounds and borders all move together.

      Per-element CSS transitions were unreliable here, React re-renders
      during the switch cancelled and restarted each `color` transition
      mid-flight, so text crawled a few shades then snapped the rest of the way
      at the end. A single snapshot has nothing to restart.

      The class is flipped inside the callback so the "new" snapshot captures
      it; `setTheme` then persists the choice and converges on the same class.
    */
    if (!reducedMotion && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => {
        root.classList.remove("light", "dark");
        root.classList.add(next);
      });
      setTheme(next);
      return;
    }

    // Fallback: flag the switch so elements cross-fade on shared timing, then
    // drop the flag so normal (fast) hover transitions resume.
    root.classList.add("theme-transition");
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, THEME_TRANSITION_MS + THEME_TRANSITION_BUFFER_MS);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle colour theme"
      }
      className="glass relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground-muted text-foreground transition-colors hover:border-brand-strong"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
