import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, RefreshCw, ShieldCheck, Wrench } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/CtaBanner";

const title = "About Induplix — Practical Digital Operations for Industry";
const description =
  "Why Induplix exists: helping industrial businesses improve everyday operations through practical digital solutions, workflow improvements, automation, and AI where appropriate.";

export const Route = createFileRoute("/about")({
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
  component: About,
});

const principles = [
  { icon: Wrench, name: "Practicality", text: "Solve real operational problems." },
  { icon: Lightbulb, name: "Clarity", text: "Make workflows and information easier to understand." },
  { icon: ShieldCheck, name: "Reliability", text: "Build around clear requirements and appropriate checks." },
  { icon: RefreshCw, name: "Continuous improvement", text: "Start with manageable problems and expand when justified." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Induplix"
        title="Better everyday operations for industrial businesses."
        intro="Induplix helps industrial businesses improve everyday operations through practical digital solutions, workflow improvements, automation, and AI where appropriate."
      />

      <section className="container-site grid gap-12 py-20 md:py-28 lg:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow="Why we exist" title="Good businesses deserve smoother operations." />
        </Reveal>
        <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Chemical, engineering, and manufacturing businesses run on detailed, demanding work — yet much of it still
            depends on scattered emails, spreadsheets, and memory. Small gaps in RFQs, follow-ups, and invoices quietly
            cost time and opportunity.
          </p>
          <p>
            Induplix is a new, focused practice, starting with Gujarat's industrial clusters. We don't arrive with a
            platform to sell. We start with how your team works today and recommend the simplest improvement that makes
            a real difference.
          </p>
          <p>
            We're early in our journey, and we'd rather earn trust through clear communication and sound scope than
            through big claims.
          </p>
        </Reveal>
      </section>

      <section className="border-y bg-card py-20 md:py-28">
        <div className="container-site">
          <SectionHeading eyebrow="Operating principles" title="How we approach the work." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(({ icon: Icon, name, text }, i) => (
              <Reveal as="li" key={name} delay={i * 80} className="rounded-2xl border bg-background p-6">
                <span className="bg-gradient-brand grid size-11 place-items-center rounded-xl text-charcoal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
