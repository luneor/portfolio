/*
  DIRECTION 3: "LIVE SYSTEM"
  Boundary-pushing = energetic, product-native, playful-but-sharp. Light ground
  but NOT neutral: a vivid multi-accent system used functionally, nodding to the
  RAG status work (Active / At Risk / Inactive). Escapes the single-accent default
  by treating colour as a working system, not a garnish.
  Production type: Bricolage Grotesque (display) + Inter (body).
*/
export default function SystemDirection() {
  const ink = "#15161B";
  const paper = "#F5F6F8";
  const blue = "#2E5BFF";
  const magenta = "#FF2E9A";
  const lime = "#4BC500";
  const dim = "#5D616B";

  const chips = [
    { label: "Active", c: lime },
    { label: "At Risk", c: magenta },
    { label: "Inactive", c: dim },
  ];

  return (
    <main
      style={{ background: paper, color: ink, fontFamily: "Inter, sans-serif" }}
      className="min-h-screen w-full overflow-hidden"
    >
      <div className="mx-auto flex min-h-screen max-w-[1120px] flex-col px-8">
        {/* top bar */}
        <div className="flex items-center justify-between py-7 text-[0.82rem] font-semibold">
          <span style={{ fontFamily: "var(--f-bric)", fontWeight: 800 }}>Hanru Wehmeyer</span>
          <span style={{ color: dim }}>UX Designer · Genio</span>
        </div>

        <div className="flex flex-1 flex-col justify-center pb-20">
          <span
            className="mb-6 w-fit rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em]"
            style={{ background: "#E9EBF0", color: blue }}
          >
            Why before how
          </span>

          <h1
            style={{ fontFamily: "var(--f-bric)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.02em" }}
            className="max-w-[15ch] text-[clamp(2.8rem,7vw,5.4rem)]"
          >
            I design admin tools that
            {" "}
            <span style={{ position: "relative", whiteSpace: "nowrap" }}>
              refuse
              <span style={{ position: "absolute", left: 0, right: 0, bottom: "0.08em", height: "0.32em", background: lime, zIndex: -1, opacity: 0.85 }} />
            </span>
            {" "}to be boring.
          </h1>

          <p className="mt-7 max-w-[54ch] text-[1.05rem]" style={{ color: dim }}>
            Academic institutions run on admin software. I make it something
            considered and genuinely pleasant to use, and I keep asking{" "}
            <span style={{ color: magenta, fontWeight: 600 }}>why</span> before the
            team commits to <span style={{ color: blue, fontWeight: 600 }}>how</span>.
          </p>

          {/* live RAG chips, signature device nodding to Last Active work */}
          <div className="mt-10 flex flex-wrap items-center gap-2.5">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.82rem] font-semibold"
                style={{ borderColor: "#DEE1E8", background: "#fff" }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 99, background: chip.c }} />
                {chip.label}
              </span>
            ))}
            <span className="text-[0.82rem]" style={{ color: dim }}>← admins set the thresholds, not me</span>
          </div>

          <div className="mt-11 flex gap-3">
            <span className="rounded-lg px-6 py-3.5 text-[0.92rem] font-semibold text-white" style={{ background: blue }}>
              See my work
            </span>
            <span className="rounded-lg px-6 py-3.5 text-[0.92rem] font-semibold" style={{ border: `1.5px solid ${ink}` }}>
              Get in touch
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
