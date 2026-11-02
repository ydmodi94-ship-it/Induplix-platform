import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Factory, FlaskConical, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/site/HeroVisual";
import chemicalImage from "@/assets/chemical-industry.jpg";
import engineeringImage from "@/assets/engineering-industry.jpg";
import manufacturingImage from "@/assets/manufacturing-industry.jpg";
import { ServiceWorkflow } from "@/components/site/ServiceWorkflow";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/Section";
import { CtaBanner } from "@/components/site/CtaBanner";
import { challenges, industries, services, stages } from "@/lib/content";

const title = "Induplix — Make Your Business Operations Work Smarter";
const description =
  "Induplix is a Digital Operations Partner helping chemical, engineering, and manufacturing businesses streamline workflows, reduce repetitive work, and apply automation and AI where practical.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

const industryIcons = { Chemical: FlaskConical, Engineering: Wrench, Manufacturing: Factory } as const;
const industryImages = { Chemical: chemicalImage, Engineering: engineeringImage, Manufacturing: manufacturingImage } as const;

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="home-hero bg-hero relative overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="home-hero-layout container-site relative">
          <div className="min-w-0">
            <p className="eyebrow mb-4 text-teal">Digital Operations Partner</p>
            <h1 className="home-hero-title font-extrabold text-on-dark">
              Make Your<br />Business<br />Operations<br /><span className="text-gradient-brand whitespace-nowrap">Work Smarter.</span>
            </h1>
            <p className="home-hero-description mt-6 text-lg leading-relaxed text-on-dark-muted">
              Induplix helps chemical, engineering, and manufacturing businesses streamline workflows, reduce
              repetitive work, and apply automation and AI where they make a practical difference.
            </p>
            <div className="home-hero-actions mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/contact">
                  Discuss Your Workflow <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="ghostDark" size="lg">
                <Link to="/solutions">Explore Our Solutions</Link>
              </Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Challenges */}
      <section className="container-site py-12 md:py-28">
        <SectionHeading
          eyebrow="Operational challenges"
          title="Where Everyday Work Gets Complicated."
          intro="Most operational friction isn't dramatic — it's the small, repeated gaps that add up across a week."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 60} className="rounded-2xl border bg-card p-6 shadow-card">
              <Icon className="size-6 text-teal-deep" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Services */}
      <section className="border-y bg-card py-20 md:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Core services"
            title="Practical Solutions for Better Operations."
            intro="Four focused services. Actual deliverables depend on your workflow, available data and tools, and agreed scope."
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 80}>
                <article className="group flex h-full flex-col rounded-2xl border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal hover:shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="bg-gradient-brand grid size-11 place-items-center rounded-xl text-charcoal">
                      <s.icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-bold">{s.name}</h3>
                  </div>
                  <p className="mt-4 font-medium">“{s.promise}”</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
                  <p className="mt-4 text-xs font-medium text-muted-foreground">
                    <span className="sr-only">Illustrative workflow: </span>
                    {s.flow.join(" → ")}
                  </p>
                  <Link
                    to="/solutions"
                    hash={s.id}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-deep group-hover:gap-2.5"
                  >
                    Explore {s.name} <ArrowRight className="size-4 transition-all" aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Workflow demo */}
      <section className="bg-hero relative overflow-hidden py-20 md:py-28">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="container-site relative">
          <SectionHeading
            dark
            eyebrow="How it can look"
            title="From Manual Processes to Smarter Workflows."
            intro="An illustrative RFQ example — the kind of structure we help put in place."
          />
          <div className="mt-12 max-w-3xl">
            <ServiceWorkflow kind="rfq-intake" />
          </div>
        </div>
      </section>

      {/* Delivery approach */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading
          eyebrow="Delivery approach"
          title="Start Where Your Business Is Today."
          intro="Not every business needs advanced AI first. We recommend the simplest solution that addresses the actual problem."
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {stages.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 100} className="rounded-2xl border bg-card p-7 shadow-card">
              <span className="text-gradient-brand text-4xl font-extrabold">{s.n}</span>
              <h3 className="mt-3 text-xl font-bold">{s.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                <strong className="font-semibold text-foreground">For businesses that</strong> {s.forWho.charAt(0).toLowerCase() + s.forWho.slice(1)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                <strong className="font-semibold text-foreground">We help</strong> {s.help.charAt(0).toLowerCase() + s.help.slice(1)}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Industries */}
      <section className="border-t bg-card py-20 md:py-28">
        <div className="container-site">
          <SectionHeading eyebrow="Industries" title="Built Around Industrial Business Needs." />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {industries.map((ind, i) => {
              const Icon = industryIcons[ind.name as keyof typeof industryIcons];
              return (
                <Reveal as="li" key={ind.name} delay={i * 80} className="overflow-hidden rounded-lg border bg-background">
                  <img src={industryImages[ind.name as keyof typeof industryImages]} alt={`Illustrative ${ind.name.toLowerCase()} equipment`} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <div className="p-7">
                  <Icon className="size-7 text-blue" aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-bold">{ind.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ind.text}</p>
                  <p className="mt-4 text-xs font-semibold text-teal-deep">Potential fit: {ind.apply}</p>
                  <p className="mt-3 text-xs text-muted-foreground">Illustrative industry visual</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
