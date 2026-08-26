import Image from "next/image";
import type { Project } from "@/lib/projects";

/**
 * Work-card thumbnail. A real screenshot wins over the abstract motif wherever
 * a project has one: `cardImage` first, so a card can differ from the
 * detail-page hero, then `cover` (the first image on the project page), then
 * the motif as a fallback for projects with no imagery yet.
 *
 * `sizes` defaults to the multi-column card grid's own width; the single-
 * column work-page layout passes its own, since there the image runs the
 * full content width instead of a third of it.
 */
export function ProjectThumb({
  project,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px",
}: {
  project: Project;
  sizes?: string;
}) {
  const image = project.cardImage ?? project.cover;

  if (!image) {
    const Art = project.art;
    return <Art />;
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      className="h-full w-full object-cover"
    />
  );
}
