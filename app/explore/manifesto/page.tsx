/*
  DIRECTION 2 — "MANIFESTO"
  Boundary-pushing = loud, opinionated, unafraid of scale. Energy comes from
  oversized condensed type and one aggressive colour field, not decoration.
  Deliberately breaks the "quiet cream + serif" default with a big colour block.
  Production type: Anton (display) + Archivo (body).
*/
export default function ManifestoDirection() {
  const ink = "#131210";
  const paper = "#F6F3EC";
  const tang = "#FF5B2E";

  return (
    <main
      style={{ background: ink, color: paper, fontFamily: "var(--f-archivo)" }}
      className="min-h-screen w-full overflow-hidden"
    >
      <div className="mx-auto flex min-h-screen max-w-[1240px] flex-col px-8">
        {/* top bar */}
        <div className="flex items-center justify-between py-7 text-[0.74rem] font-semibold tracking-[0.16em] uppercase">
          <span>Hanru Wehmeyer</span>
          <span style={{ color: tang }}>UX Designer</span>
        </div>

        {/* wall of type */}
        <div className="flex flex-1 flex-col justify-center pb-16">
          <div
            style={{ fontFamily: "var(--f-anton)", lineHeight: 0.86, letterSpacing: "0.005em" }}
            className="text-[clamp(3.5rem,15vw,12rem)] uppercase"
          >
            <div>Ask</div>
            <div style={{ color: tang }}>Why</div>
            <div className="flex items-end gap-[0.3em]">
              <span>Before</span>
            </div>
            <div style={{ WebkitTextStroke: `2px ${paper}`, color: "transparent" }}>How</div>
          </div>

          <div className="mt-10 flex max-w-[720px] flex-wrap items-end justify-between gap-6">
            <p className="max-w-[42ch] text-[1.05rem] leading-snug">
              I design admin tooling for academic institutions — and I push
              teams to interrogate the <em style={{ color: tang, fontStyle: "normal" }}>why</em> behind
              a request before committing to a how. Pro-AI, wary of shortcuts
              that skip the thinking.
            </p>
            <span
              className="whitespace-nowrap px-6 py-4 text-[0.9rem] font-bold uppercase tracking-wide"
              style={{ background: tang, color: ink }}
            >
              See the work →
            </span>
          </div>
        </div>

        {/* ticker footer */}
        <div
          className="flex gap-8 border-t py-5 text-[0.78rem] font-semibold uppercase tracking-[0.14em]"
          style={{ borderColor: "#2a2825", color: "#9a968d" }}
        >
          <span>Last Active Filtering</span>
          <span style={{ color: tang }}>/</span>
          <span>AI Feature Toggles</span>
          <span style={{ color: tang }}>/</span>
          <span>Audio Bubbles · WCAG AA</span>
          <span style={{ color: tang }}>/</span>
          <span>Five Whys</span>
        </div>
      </div>
    </main>
  );
}
