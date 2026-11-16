import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowPlayback } from "@/hooks/use-workflow-playback";
import { cn } from "@/lib/utils";

/** Sequential, illustrative workflow. Nodes light up one after another. */
export function WorkflowDemo({
  steps,
  dark = true,
  label = "Illustrative example",
}: {
  steps: { title: string; text?: string }[];
  dark?: boolean;
  label?: string;
}) {
  const { ref, stage: active, reduced, replay } = useWorkflowPlayback();

  return (
    <figure ref={ref} aria-label={`${label}: ${steps.map((s) => s.title).join(", then ")}`}>
      <ol className="grid gap-3 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:gap-0" style={{ ["--n" as string]: steps.length }}>
        {steps.map((s, i) => {
          const on = i <= active;
          return (
            <li key={s.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              {/* connector */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-5 top-10 h-[calc(100%-1.75rem)] w-px md:left-1/2 md:top-5 md:h-px md:w-full",
                    dark ? "bg-dark-border" : "bg-border",
                  )}
                >
                  <span
                    className="bg-gradient-brand absolute inset-0 origin-top transition-transform duration-700 md:origin-left"
                    style={{ transform: i < active ? "scale(1)" : "scale(0)" }}
                  />
                </span>
              )}
              <span
                className={cn(
                  "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border text-sm font-bold transition-all duration-500",
                  on
                    ? "bg-gradient-brand border-transparent text-charcoal shadow-glow"
                    : dark
                      ? "border-dark-border bg-charcoal-soft text-on-dark-muted"
                      : "border-border bg-card text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <div className="pb-4 md:px-3 md:pb-0 md:pt-4">
                <p className={cn("font-semibold transition-colors", dark ? (on ? "text-on-dark" : "text-on-dark-muted") : "text-foreground")}>
                  {s.title}
                </p>
                {s.text && (
                  <p className={cn("mt-1 text-sm", dark ? "text-on-dark-muted" : "text-muted-foreground")}>{s.text}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <figcaption className={cn("eyebrow mt-6", dark ? "text-on-dark-muted" : "text-muted-foreground")}>
        {label} — not a live deployment
      </figcaption>
      <Button variant={dark ? "ghostDark" : "outline"} size="icon" onClick={replay} disabled={reduced} aria-label="Replay workflow" title="Replay workflow" className="mt-3"><RotateCcw /></Button>
    </figure>
  );
}
