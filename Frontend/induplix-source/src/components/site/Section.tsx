import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark,
  center,
  as: H = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className={cn("eyebrow mb-3", dark ? "text-teal" : "text-teal-deep")}>{eyebrow}</p>
      )}
      <H
        className={cn(
          "text-balance font-bold tracking-tight",
          H === "h1" ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl",
          dark ? "text-on-dark" : "text-foreground",
        )}
      >
        {title}
      </H>
      {intro && (
        <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-on-dark-muted" : "text-muted-foreground")}>
          {intro}
        </p>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro: ReactNode }) {
  return (
    <section className="bg-hero relative overflow-hidden">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <div className="container-site animate-rise relative py-20 md:py-28">
        <SectionHeading as="h1" dark eyebrow={eyebrow} title={title} intro={intro} />
      </div>
    </section>
  );
}
