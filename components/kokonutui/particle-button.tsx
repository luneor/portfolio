"use client";

/**
 * @author: @dorianbaffier
 * @description: Particle Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { MousePointerClick } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ParticleButtonProps extends ButtonProps {
  onSuccess?: () => void;
  successDuration?: number;
}

function SuccessParticles({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) {
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }, [buttonRef]);

  const [particles] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: (i % 2 ? 1 : -1) * (Math.random() * 50 + 20),
      y: -Math.random() * 50 - 20,
    }))
  );

  if (!origin) return null;

  return (
    <AnimatePresence>
      {particles.map((particle, i) => (
        <motion.div
          animate={{
            scale: [0, 1, 0],
            x: [0, particle.x],
            y: [0, particle.y],
          }}
          className="fixed h-1 w-1 rounded-full bg-black dark:bg-white"
          initial={{
            scale: 0,
            x: 0,
            y: 0,
          }}
          key={particle.id}
          style={{ left: origin.x, top: origin.y }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

export default function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1000,
  className,
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick: NonNullable<ButtonProps["onClick"]> = (e) => {
    onClick?.(e);
    setShowParticles(true);

    setTimeout(() => {
      setShowParticles(false);
      onSuccess?.();
    }, successDuration);
  };

  return (
    <>
      {showParticles && (
        <SuccessParticles
          buttonRef={buttonRef as RefObject<HTMLButtonElement>}
        />
      )}
      <Button
        className={cn(
          "relative",
          showParticles && "scale-95",
          "transition-transform duration-100",
          className
        )}
        onClick={handleClick}
        ref={buttonRef}
        {...props}
      >
        {children}
        <MousePointerClick className="h-4 w-4" />
      </Button>
    </>
  );
}
