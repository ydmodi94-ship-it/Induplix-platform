import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner({
  title = "Let's Find the Right Workflow to Improve.",
  text = "Tell us about a repetitive task, an inefficient process, or an operational challenge. We'll discuss the problem and explore whether a practical digital solution could help.",
  primaryCta,
  secondaryCta,
}: {
  title?: string;
  text?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section className="container-site py-20">
      <div className="bg-hero relative overflow-hidden rounded-3xl px-6 py-14 text-center md:px-16">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-on-dark md:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-on-dark-muted">{text}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <a href={primaryCta?.href ?? "/contact"}>
                {primaryCta?.label ?? "Discuss Your Workflow"} <ArrowRight />
              </a>
            </Button>
            {secondaryCta && (
              <Button asChild variant="ghostDark" size="lg">
                <a href={secondaryCta.href}>{secondaryCta.label}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
