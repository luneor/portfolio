/*
  DIRECTION 1 — "QUERY"  (rev 2)
  Boundary-pushing = interrogating the reasoning behind a product, whatever the
  domain. Deliberately NOT pinned to admin tooling. The descending five-whys
  stack is the signature device (universal product-decision content).
  Clean dark ground + a subtle cobalt/coral energy glow (no grid). Higher text
  contrast for legibility.
  Production type: JetBrains Mono (display/labels) + Inter (body).
*/
export default function QueryDirection() {
  const ink = "#0B0C0F";
  const paper = "#ECEBE6";
  const cobalt = "#3D5AFF";
  const coral = "#FF5A47";
  const textMid = "#A6A9B0"; // body — strong contrast on ink
  const textDim = "#83868E"; // labels

  return (
    <main
      style={{
        background: `radial-gradient(58% 50% at 12% 18%, rgba(61,90,255,0.20), transparent 68%), radial-gradient(48% 46% at 92% 88%, rgba(255,90,71,0.14), transparent 66%), ${ink}`,
        color: paper,
        fontFamily: "var(--f-mono)",
      }}
      className="min-h-screen w-full overflow-hidden"
    >
      <div className="relative mx-auto flex min-h-screen max-w-[1120px] flex-col px-8">
        {/* top bar */}
        <div className="flex items-center justify-between py-7 text-[0.72rem] tracking-[0.18em]" style={{ color: textDim }}>
          <span style={{ color: paper }}>HANRU WEHMEYER</span>
          <span>UX DESIGNER</span>
        </div>

        {/* hero */}
        <div className="flex flex-1 flex-col justify-center pb-20">
          <div className="mb-6 flex items-center gap-3 text-[0.8rem] tracking-[0.1em]" style={{ color: textDim }}>
            <span style={{ color: cobalt }}>~/hanru</span>
            <span>›</span>
            <span style={{ color: paper }}>why</span>
            <span style={{ background: coral, width: 10, height: 20, display: "inline-block" }} />
          </div>

          <h1
            style={{ fontFamily: "Inter, system-ui, sans-serif", lineHeight: 1.04, letterSpacing: "-0.03em" }}
            className="max-w-[16ch] text-[clamp(2.6rem,6.6vw,5.2rem)] font-extrabold"
          >
            I interrogate the{" "}
            <span style={{ color: cobalt }}>why</span>
            <br />
            before anyone builds
            <br />
            the <span style={{ color: coral }}>how</span>.
          </h1>

          <p className="mt-8 max-w-[54ch] text-[0.98rem] leading-relaxed" style={{ color: textMid, fontFamily: "Inter, system-ui, sans-serif" }}>
            UX designer. I pressure-test why a product should exist before the
            team argues about how to build it. Pro-AI, allergic to shipping
            assumptions nobody actually verified.
          </p>

          {/* five-whys interrogation stack — the signature device (domain-agnostic) */}
          <div className="mt-12 max-w-[600px] text-[0.82rem]" style={{ color: textMid }}>
            {[
              ["why build this?", "it's on the roadmap"],
              ["why's it on the roadmap?", "…someone assumed"],
              ["why ship an assumption?", "we don't."],
            ].map(([q, a], i) => {
              const last = i === 2;
              return (
                <div
                  key={i}
                  className="flex items-baseline gap-3 border-l-2 py-1.5 pl-4"
                  style={{ borderColor: last ? coral : "#2b2d34", marginLeft: i * 22 }}
                >
                  <span style={{ color: cobalt }}>why?</span>
                  <span style={{ color: last ? paper : textMid }}>{q}</span>
                  <span style={{ color: last ? coral : textDim }}>→ {a}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex gap-3 text-[0.82rem]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            <span className="px-5 py-3 font-semibold" style={{ background: coral, color: ink }}>
              See the work →
            </span>
            <span className="px-5 py-3 font-semibold" style={{ border: `1px solid ${textDim}`, color: paper }}>
              Get in touch
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
