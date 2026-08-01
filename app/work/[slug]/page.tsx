import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PROJECTS, getProjectBySlug } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Hanru Wehmeyer`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const Art = project.art;

  return (
    <main id="main" className="py-16">
      <div className="mx-auto max-w-[760px] px-6">
        <Link
          href="/#work"
          className="text-sm font-medium text-foreground-muted underline decoration-brand-strong underline-offset-4 hover:text-foreground"
        >
          ← Back to work
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background-alt">
          {project.cover ? (
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              sizes="(max-width: 760px) 100vw, 760px"
              className="h-auto w-full"
              priority
            />
          ) : (
            <div className="aspect-video [&>svg]:h-full [&>svg]:w-full">
              <Art />
            </div>
          )}
        </div>

        <div className="mt-6">
          <Badge
            variant="outline"
            className={cn(
              "w-fit rounded-full border px-2.5 py-1 font-mono text-[0.7rem] tracking-[0.04em] lowercase",
              project.tagMuted
                ? "border-border text-foreground-muted"
                : "border-brand-weak text-brand-weak"
            )}
          >
            {project.tag}
          </Badge>
          <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.15] font-bold tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="mt-3 text-[1.05rem] text-foreground-muted">
            {project.summary}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-8">
          {project.fields?.map((field) => (
            <div key={field.heading}>
              <h2 className="text-[0.85rem] font-bold tracking-wide text-brand-weak uppercase">
                {field.heading}
              </h2>
              <p className="mt-2 text-foreground-muted">{field.body}</p>
            </div>
          ))}
          {project.paragraphs?.map((paragraph, index) => (
            <p key={index} className="text-foreground-muted">
              {paragraph}
            </p>
          ))}
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-14 flex flex-col gap-12">
            {project.gallery.map((image) => (
              <figure key={image.src} className="flex flex-col gap-3">
                <div className="overflow-hidden rounded-xl border border-border bg-background-alt">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 760px) 100vw, 760px"
                    className="h-auto w-full"
                  />
                </div>
                {image.caption && (
                  <figcaption className="font-mono text-[0.72rem] leading-relaxed tracking-[0.03em] text-foreground-muted">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
