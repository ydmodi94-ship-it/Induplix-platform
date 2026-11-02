import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ServiceWorkflow } from "@/components/site/ServiceWorkflow";
import { CtaBanner } from "@/components/site/CtaBanner";
import { services } from "@/lib/content";

const title = "Solutions — AI RFQ Intake, Quote Follow-up, Invoice Checks | Induplix";
const description =
  "Explore Induplix services: AI RFQ Intake, Quote Follow-up, Invoice Exception Checker, and AI Automations — with clear deliverables, requirements, and limitations.";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Solutions,
});

function Solutions() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Four practical services for everyday operations."
        intro="Each service starts with your actual process. These are proposals, not prebuilt products — feasibility and scope are confirmed with you before anything is promised."
      />

      <nav aria-label="Services on this page" className="sticky top-[var(--site-header-height)] z-40 border-b bg-background/90 backdrop-blur">
        <ul className="container-site flex gap-2 overflow-x-auto py-3">
          {services.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="block whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-teal hover:text-foreground">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {services.map((s, idx) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-title`}
          className={`scroll-mt-32 py-20 ${idx % 2 ? "bg-card border-y" : ""}`}
        >
          <div className="container-site">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="bg-gradient-brand grid size-12 place-items-center rounded-xl text-charcoal">
                  <s.icon className="size-6" aria-hidden="true" />
                </span>
                <p className="eyebrow text-teal-deep">Service 0{idx + 1}</p>
              </div>
              <h2 id={`${s.id}-title`} className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{s.name}</h2>
              <p className="mt-2 text-xl font-medium text-muted-foreground">“{s.promise}”</p>
            </Reveal>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <Reveal className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">The business problem</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.problem}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">How the solution works</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.approach}</p>
                </div>
              </Reveal>
              <div className="min-w-0 bg-charcoal p-5 md:p-7">
                <ServiceWorkflow kind={s.id} />
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Reveal className="rounded-2xl border bg-background p-6">
                <h3 className="font-semibold">Potential deliverables</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal-deep" aria-hidden="true" />{d}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={80} className="rounded-2xl border bg-background p-6">
                <h3 className="font-semibold">What we need to understand first</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {s.understandFirst.map((d) => (
                    <li key={d} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue" aria-hidden="true" />{d}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={160} className="rounded-2xl border border-blue/30 bg-blue/5 p-6">
                <h3 className="flex items-center gap-2 font-semibold"><AlertCircle className="size-4 text-blue" aria-hidden="true" /><span className="text-blue-text">Limitations &amp; dependencies</span></h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.caveats}</p>
              </Reveal>
            </div>

            <Button asChild variant="hero" size="lg" className="mt-8">
              <Link to="/contact" search={{ service: s.name }}>
                Discuss {s.name} <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      ))}

      <CtaBanner title="Not sure which service fits?" text="Describe the challenge in your own words. We'll help identify the problem and the simplest suitable next step." />
    </>
  );
}
