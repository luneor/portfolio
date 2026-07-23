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
      <span className="mb-4 inline-block text-[0.8rem] font-bold tracking-[0.08em] text-brand-weak uppercase">
        {eyebrow}
      </span>
      <h2 id={headingId} className="text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.15] font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {children && (
        <div className="mt-4 max-w-[640px] text-foreground-muted">{children}</div>
      )}
    </div>
  );
}
