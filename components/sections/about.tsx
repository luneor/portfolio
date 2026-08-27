import Image from "next/image";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24">
      <div className="mx-auto grid max-w-page grid-cols-1 items-center gap-16 px-6 md:grid-cols-[1fr_1.3fr]">
        {/*
          One portrait, square. `md:w-[85%]` rather than a narrower first grid
          track: shrinking the track would hand the freed width to the prose
          column, pushing its measure past ~80 characters. Capping the image
          instead leaves the text column exactly as it was and lets the space
          fall into the gap. Below `md` the layout is one column and the
          portrait still runs its full width.
        */}
        <Image
          src="/assets/about-headshot.png"
          alt="Hanru Wehmeyer, portrait"
          width={1400}
          height={1400}
          sizes="(max-width: 768px) 92vw, 380px"
          className="aspect-square w-full rounded-xl border border-border object-cover md:w-[85%]"
        />
        <div>
          <h2
            id="about-heading"
            className="mb-4 text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.12] font-extrabold tracking-tight text-foreground"
          >
            Hi, I&apos;m Hanru.
          </h2>
          <p className="mb-4 text-foreground">
            I&apos;m 26, based in Scotland, and I&apos;ve been a UX Designer
            at Genio since June 2025, designing admin tools that give
            educators real control over how they support students.
          </p>
          <p className="mb-4 text-foreground">
            I&apos;ve always been interested in art and visuals growing up,
            which took me from an art college course to developing an
            interest in UX design, and eventually a career in it. I&apos;m
            keen to keep developing my skillset, think creatively, and push
            for collaboration.
          </p>
          <p className="text-foreground">
            Outside of work, I&apos;ve been playing field hockey my whole
            life, and recently ran my first half marathon. I&apos;m also a
            keen gamer, my usual way to unwind.
          </p>
        </div>
      </div>
    </section>
  );
}
