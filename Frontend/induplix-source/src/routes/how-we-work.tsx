import { createFileRoute } from "@tanstack/react-router";
import { Eye, MessageSquare, ShieldCheck, Target } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/CtaBanner";
import { stages } from "@/lib/content";

const title = "How We Work — Discover, Design, Implement, Improve | Induplix";
const description =
  "How Induplix engagements work: understand your process first, design a practical solution, implement within an agreed scope, then review and improve.";

export const Route = createFileRoute("/how-we-work")({
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
  component: HowWeWork,
});

const steps = [
  { n: "1", name: "Discover", what: "Understand the current process, operational challenge, constraints, and desired outcome.", expect: "We begin by learning the process and its real requirements." },
  { n: "2", name: "Design", what: "Map the workflow and identify a practical solution.", expect: "The recommended approach should fit the problem and context." },
  { n: "3", name: "Implement", what: "Build, test, and refine the agreed solution within a defined scope.", expect: "Delivery is bounded by an agreed scope and includes testing." },
  { n: "4", name: "Improve", what: "Review the result with you and identify sensible next steps.", expect: "Further work follows review and a clear business reason." },
];

const commitments = [
  { icon: Target, title: "Clear scope", text: "What's included, what isn't, and what we need from you — agreed upfront." },
  { icon: ShieldCheck, title: "Human oversight", text: "Review points wherever an error could affect decisions or transactions." },
  { icon: Eye, title: "Practical delivery", text: "Not every project needs AI, and not every process can be automated safely." },
  { icon: MessageSquare, title: "Transparent communication", text: "Honest updates on progress, limitations, and trade-offs." },
];

function HowWeWork() {
  return (
    <>
      <PageHero
        eyebrow="How we work"
        title="A clear, step-by-step engagement."
        intro="We start with your actual process and recommend the simplest suitable improvement — then build it within an agreed scope."
      />

      <section className="container-site py-20 md:py-28">
        <SectionHeading eyebrow="The process" title="Four steps, no surprises." />
        <ol className="relative mt-14 space-y-6 border-l-2 border-border pl-8 md:pl-12">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 80} className="relative">
              <span className="bg-gradient-brand absolute -left-[3.05rem] top-1 grid size-10 place-items-center rounded-full font-bold text-charcoal shadow-glow md:-left-[4.05rem]">
                {s.n}
              </span>
              <div className="grid gap-4 rounded-2xl border bg-card p-6 shadow-card md:grid-cols-[10rem_1fr_1fr]">
                <h3 className="text-xl font-bold">{s.name}</h3>
                <div>
                  <p className="eyebrow text-muted-foreground">What happens</p>
                  <p className="mt-1">{s.what}</p>
                </div>
                <div>
                  <p className="eyebrow text-muted-foreground">What to expect</p>
                  <p className="mt-1 text-muted-foreground">{s.expect}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-hero relative overflow-hidden py-20 md:py-28">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="container-site relative">
          <SectionHeading dark eyebrow="Where you start" title="Start Where Your Business Is Today." intro="Not every business needs advanced AI first." />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {stages.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 100} className="rounded-2xl border border-dark-border bg-charcoal-soft p-7">
                <span className="text-gradient-brand text-3xl font-extrabold">{s.n}</span>
                <h3 className="mt-2 text-xl font-bold text-on-dark">{s.name}</h3>
                <p className="mt-3 text-sm text-on-dark-muted">{s.help}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-site py-20 md:py-28">
        <SectionHeading eyebrow="Our commitments" title="What you can expect from us." />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {commitments.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 60} className="flex gap-4 rounded-2xl border bg-card p-6">
              <Icon className="size-6 shrink-0 text-teal-deep" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <CtaBanner />
    </>
  );
}
