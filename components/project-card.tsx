"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  media: ReactNode;
  className?: string;
}

export function ProjectCard({
  slug,
  tag,
  title,
  summary,
  media,
  className,
}: ProjectCardProps) {
  return (
    <motion.div
      className={cn("h-full", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        whileHover={{ boxShadow: "0 16px 32px -12px rgba(27, 24, 21, 0.18)" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ boxShadow: "0 1px 2px rgba(27, 24, 21, 0.04)" }}
        className="h-full overflow-hidden rounded-xl border border-border bg-card"
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
            <Badge className="w-fit rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-secondary-foreground uppercase">
              {tag}
            </Badge>
            <h3 className="text-base font-bold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-foreground-muted">
              {summary}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
