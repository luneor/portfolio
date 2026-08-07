import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/projects";

const projects = PROJECTS.filter((project) => project.section === "genio-admin");

export function GenioAdmin() {
  return (
    <div aria-labelledby="genio-admin-heading" className="bg-background-alt py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHeading
          title="Genio Admin"
          headingId="genio-admin-heading"
        >
          <p>
            I design admin tooling for academic institutions — the software
            that gives school and university staff visibility and control
            over how their students are supported. Increasingly, I&apos;m
            pushing Admin beyond a purely utilitarian feel toward something
            considered and pleasant to use, for its full range of users:
            internal super admins and support staff, organisation admins, and
            account managers.
          </p>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const Art = project.art;
            // A real screenshot wins over the abstract motif where we have one.
            const thumb = project.cardImage ?? project.cover;
            const media = thumb ? (
              <Image
                src={thumb.src}
                alt={thumb.alt}
                width={thumb.width}
                height={thumb.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                className="h-full w-full object-cover"
              />
            ) : (
              <Art />
            );
            return (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                summary={project.summary}
                media={media}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
