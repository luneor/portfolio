import { type ReactNode } from "react";

export function SectionHeading({
  title,
  headingId,
  children,
}: {
  title: string;
  headingId: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2
        id={headingId}
        className="text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-brand-weak"
      >
        {title}
      </h2>
      {/* Intro copy runs the full container width, no measure cap. */}
      {children && <div className="mt-4 text-foreground">{children}</div>}
    </div>
  );
}
