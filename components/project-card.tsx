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
        whileHover={{
          boxShadow: "0 18px 40px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(36,161,130,0.5)",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
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
            <Badge className="w-fit rounded-full border border-border bg-secondary px-2.5 py-0.5 font-mono text-[0.62rem] tracking-[0.04em] text-brand-weak lowercase">
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
