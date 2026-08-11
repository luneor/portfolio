"use client";

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

// Matches the `.theme-transition` cross-fade in globals.css.
const THEME_TRANSITION_MS = 300;

/*
  The fade starts a frame or two after the click, so removing the class at
  exactly 300ms would cut it off mid-flight.
*/
const THEME_TRANSITION_BUFFER_MS = 200;

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

    /*
      Flag the switch so every element eases its colours on shared 300ms timing
      (see `.theme-transition` in globals.css), then drop the flag so normal,
      snappier hover transitions resume.
    */
    root.classList.add("theme-transition");

    /*
      Force a style flush before the theme flips. A CSS transition only runs if
      the browser has computed a "before" value with that transition already in
      effect; adding the class and changing the colours within a single recalc
      gives it nothing to animate from, and the switch snaps.
    */
    void window.getComputedStyle(root).backgroundColor;

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
      className="glass relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground-muted/40 text-foreground transition-colors hover:border-brand-strong"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: THEME_TRANSITION_MS / 1000, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
