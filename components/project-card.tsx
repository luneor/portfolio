"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
  The `tag` badge is intentionally not rendered for now. `tag`/`tagMuted` stay
  on the Project type so the data isn't lost and the badge can come back.
*/
interface ProjectCardProps {
  slug: string;
  title: string;
  summary: string;
  media: ReactNode;
  className?: string;
}

export function ProjectCard({
  slug,
  title,
  summary,
  media,
  className,
}: ProjectCardProps) {
  return (
    <motion.div
      className={cn("group h-full", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/*
        The shadow eases via CSS, not Motion. Motion can't cleanly interpolate
        two box-shadows with different numbers of length values (3 vs 4), which
        made it lurch dark on the way back out. Depths stay soft so they read on
        cream as well as near-black.
      */}
      <div
        className="h-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] transition-shadow duration-300 ease-out group-hover:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.28)]"
      >
        <Link href={`/work/${slug}`} className="flex h-full flex-col">
          <div className="relative aspect-video overflow-hidden border-b border-border bg-background-alt">
            <motion.div
              className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {media}
            </motion.div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <h3 className="text-base font-bold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-foreground">
              {summary}
            </p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
