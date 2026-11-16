import { createFileRoute, Link } from "@tanstack/react-router";
<<<<<<< HEAD
import { ArrowRight, AlertCircle, Check } from "lucide-react";
=======
import { AlertCircle, ArrowRight, Check } from "lucide-react";
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ServiceWorkflow } from "@/components/site/ServiceWorkflow";
import { CtaBanner } from "@/components/site/CtaBanner";
import { services } from "@/lib/content";

<<<<<<< HEAD
const title = "Industrial Digital Solutions & AI Automation | Induplix";
const description =
  "Explore practical digital solutions for chemical, engineering and manufacturing businesses. Improve RFQ management, quotations, procurement, documentation and invoice workflows with Induplix.";
=======
const title = "Solutions — AI RFQ Intake, Quote Follow-up, Invoice Checks | Induplix";
const description =
  "Explore Induplix services: AI RFQ Intake, Quote Follow-up, Invoice Exception Checker, and AI Automations — with clear deliverables, requirements, and limitations.";
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59

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
<<<<<<< HEAD
  const navLabels: Record<string, string> = {
    "website-presence": "Digital Presence",
    "rfq-intake": "RFQ Intake",
    "quote-follow-up": "Quote Follow-up",
    "chemical-documents": "Chemical Documents",
    "procurement": "Procurement",
    "invoice-exception-checker": "Invoice Checking",
  };

  const heroImage = "/hero-industrial-team.png"; // public path

  return (
    <>
      {/* Hero Section */}
      <PageHero
        eyebrow="DIGITAL SOLUTIONS FOR INDUSTRIAL BUSINESSES"
        title="Smarter Operations. Stronger Businesses."
        intro="We help chemical, engineering and manufacturing businesses organise information, streamline everyday workflows and improve operational efficiency through practical digital solutions, automation and AI‑assisted systems. From building your digital presence to improving internal business processes, Induplix helps make everyday operations work smarter."
        image={heroImage}
        primaryCta={{ label: "Discuss Your Workflow", href: "/contact" }}
        secondaryCta={{ label: "Explore Our Solutions", href: "#overview" }}
      />

      {/* Sticky navigation */}
=======
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Four practical services for everyday operations."
        intro="Each service starts with your actual process. These are proposals, not prebuilt products — feasibility and scope are confirmed with you before anything is promised."
      />

>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
      <nav aria-label="Services on this page" className="sticky top-[var(--site-header-height)] z-40 border-b bg-background/90 backdrop-blur">
        <ul className="container-site flex gap-2 overflow-x-auto py-3">
          {services.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="block whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-teal hover:text-foreground">
<<<<<<< HEAD
                {navLabels[s.id] || s.name}
=======
                {s.name}
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
              </a>
            </li>
          ))}
        </ul>
      </nav>

<<<<<<< HEAD
      {/* Overview cards */}
      <section id="overview" className="container-site py-20" aria-label="Solutions Overview">
        <h2 className="text-3xl font-bold mb-8">Practical Solutions for Everyday Industrial Challenges.</h2>
        <p className="mb-12 text-xl text-muted-foreground">Explore practical digital solutions designed to improve the way industrial businesses manage enquiries, quotations, documentation, procurement and everyday operations.</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}>
              <div className="flex items-center mb-2">
                <s.icon className="size-5 mr-2" />
                <h3 className="font-semibold text-lg">{s.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{s.short}</p>
              <a className="text-teal underline" href={`#${s.id}`}>Explore Solution</a>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed service sections */}
=======
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
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
<<<<<<< HEAD
                <p className="eyebrow text-teal-deep">{navLabels[s.id] || s.name}</p>
              </div>
              <h2 id={`${s.id}-title`} className="mt-4 text-3xl font-bold md:text-4xl">{s.name}</h2>
              <p className="mt-2 text-xl font-medium text-muted-foreground">{s.promise}</p>
            </Reveal>

            {/* Layout: text left, image right for even idx; reverse for odd */}
            <div className="my-8 flex flex-col md:flex-row items-center gap-8">
              {/* Text block */}
              <div className={`flex-1 ${idx % 2 === 0 ? "order-1" : "order-2 md:order-2"}`}>
                <div className="mt-10">
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
                </div>
              </div>
              {/* Image block */}
              <div className={`flex-1 ${idx % 2 === 0 ? "order-2" : "order-1 md:order-1"}`}>
                <img
                  src={
                    s.id === "website-presence" ? "/service-website-rfs.png" :
                    s.id === "rfq-intake" ? "/service-ai-rfq-intake.png" :
                    s.id === "quote-follow-up" ? "/service-quote-followup.png" :
                    s.id === "chemical-documents" ? "/service-chemical-documents.png" :
                    s.id === "procurement" ? "/service-procurement.png" :
                    s.id === "invoice-exception-checker" ? "/service-invoice-checker.png" :
                    ""
                  }
                  alt={s.name}
                  className="max-w-full h-auto rounded"
                />
=======
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
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Reveal className="rounded-2xl border bg-background p-6">
                <h3 className="font-semibold">Potential deliverables</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
<<<<<<< HEAD
                  {s.deliverables?.map((d) => (
=======
                  {s.deliverables.map((d) => (
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
                    <li key={d} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal-deep" aria-hidden="true" />{d}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={80} className="rounded-2xl border bg-background p-6">
                <h3 className="font-semibold">What we need to understand first</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
<<<<<<< HEAD
                  {s.understandFirst?.map((d) => (
=======
                  {s.understandFirst.map((d) => (
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
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
<<<<<<< HEAD
              <Link to="/contact" search={{ service: s.name }}>Discuss {s.name} <ArrowRight /></Link>
=======
              <Link to="/contact" search={{ service: s.name }}>
                Discuss {s.name} <ArrowRight />
              </Link>
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
            </Button>
          </div>
        </section>
      ))}

<<<<<<< HEAD
      {/* Final conversion banner */}
      <CtaBanner
        title="Your Business Has Its Own Challenges. Let's Find the Right Solutions."
        text="Every business works differently. Tell us about your business, your current workflows and the challenges your team faces. We'll help you explore practical digital solutions that make sense for your operations."
        primaryCta={{ label: "Discuss Your Workflow", href: "/contact" }}
        secondaryCta={{ label: "Explore Our Solutions", href: "#overview" }}
      />
=======
      <CtaBanner title="Not sure which service fits?" text="Describe the challenge in your own words. We'll help identify the problem and the simplest suitable next step." />
>>>>>>> 1d26ed534988ebc1b8ac4cd9af1a034a5e8f7a59
    </>
  );
}
