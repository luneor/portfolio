import Image from "next/image";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-[1fr_1.3fr]">
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/assets/about-portrait-1.png"
            alt="Hanru Wehmeyer, portrait"
            width={1875}
            height={1886}
            sizes="(max-width: 768px) 45vw, 220px"
            className="aspect-[3/4] w-full rounded-xl border border-border object-cover"
          />
          <Image
            src="/assets/about-portrait-2.png"
            alt="Hanru Wehmeyer, portrait"
            width={4272}
            height={1693}
            sizes="(max-width: 768px) 92vw, 460px"
            className="col-span-2 aspect-[4272/1693] w-full rounded-xl border border-border object-cover"
          />
        </div>
        <div>
          <span className="mb-4 flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.06em] lowercase">
            <span className="text-brand-weak">›</span>
            <span className="text-foreground-muted">about</span>
          </span>
          <h2
            id="about-heading"
            className="mb-4 text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.15] font-bold tracking-tight text-foreground"
          >
            Hi, I&apos;m Hanru.
          </h2>
          <p className="mb-4 text-foreground-muted">
            I ask why more than I ask how. Before a feature, a workflow, or a
            piece of AI-generated output gets signed off, I want to know why
            we&apos;re doing it this way, and whether that reasoning
            actually holds up. That same instinct shapes how I use AI: I
            lean into it for the speed it offers, but I stay wary of what
            speed quietly skips, authentic collaboration between people, and
            decisions that hold up because they&apos;ve been checked, not
            just assumed.
          </p>
          <p className="mb-4 text-foreground-muted">
            I&apos;m 26, based in Scotland, and I&apos;ve been a UX Designer
            at Genio since June 2025, designing admin tools that give
            educators real control over how they support students.
          </p>
          <p className="text-foreground-muted">
            Outside of work: graphic design, video games, and field hockey.
          </p>
        </div>
      </div>
    </section>
  );
}
