import { type ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  headingId,
  children,
}: {
  eyebrow: string;
  title: string;
  headingId: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10">
      {/* mono `› eyebrow` — the terminal-prompt signature, repeated per section */}
      <span className="mb-4 flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.06em] lowercase">
        <span className="text-brand-weak">›</span>
        <span className="text-foreground-muted">{eyebrow}</span>
      </span>
      <h2
        id={headingId}
        className="text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-foreground"
      >
        {title}
      </h2>
      {children && (
        <div className="mt-4 max-w-[640px] text-foreground">{children}</div>
      )}
    </div>
  );
}
