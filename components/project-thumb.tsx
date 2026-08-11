import Image from "next/image";
import type { Project } from "@/lib/projects";

/**
 * Work-card thumbnail. A real screenshot wins over the abstract motif wherever
 * a project has one: `cardImage` first, so a card can differ from the
 * detail-page hero, then `cover` (the first image on the project page), then
 * the motif as a fallback for projects with no imagery yet.
 */
export function ProjectThumb({ project }: { project: Project }) {
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
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
      className="h-full w-full object-cover"
    />
  );
}
