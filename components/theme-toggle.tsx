"use client";

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

// Matches the 500ms cross-fade defined for `.theme-transition` in globals.css.
const THEME_TRANSITION_MS = 500;

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
    // Flag the switch so EVERY element cross-fades on the same 500ms timing,
    // then drop the flag so normal (fast) hover transitions resume.
    const root = document.documentElement;
    root.classList.add("theme-transition");
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, THEME_TRANSITION_MS + 50);
    setTheme(isDark ? "light" : "dark");
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
      className="glass relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-foreground transition-colors hover:border-brand-strong"
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
