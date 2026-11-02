import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/Section";
import { contactSchema } from "@/lib/contact-schema";
import { industryOptions, serviceOptions } from "@/lib/content";
import { isMockMode, submitInquiry } from "@/lib/api/inquiries";
import { cn } from "@/lib/utils";

const title = "Contact Induplix — Discuss Your Workflow";
const description =
  "Tell Induplix about a repetitive task, an inefficient process, or an operational challenge, and start a conversation about a practical improvement.";

export const Route = createFileRoute("/contact")({
  validateSearch: z.object({ service: z.string().optional() }),
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
  component: Contact,
});

type Status = "idle" | "loading" | "success" | "error";
type Fields = Record<"name" | "company" | "email" | "phone" | "industry" | "service" | "challenge", string>;

const empty: Fields = { name: "", company: "", email: "", phone: "", industry: "", service: "", challenge: "" };

const selectCls =
  "flex h-11 w-full rounded-md border border-input bg-card px-3 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm";

function Contact() {
  const { service } = Route.useSearch();
  const initialService = service && (serviceOptions as readonly string[]).includes(service) ? service : "";
  const [values, setValues] = useState<Fields>({ ...empty, service: initialService });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fe: Partial<Fields> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Fields;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      const first = Object.keys(fe)[0] as string | undefined;
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setStatus("loading");
    try {
      await submitInquiry(parsed.data);
      setStatus("success");
      setValues(empty);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const field = (k: keyof Fields) => ({
    id: k,
    name: k,
    value: values[k],
    onChange: set(k),
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  const Err = ({ k }: { k: keyof Fields }) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 text-sm text-destructive">{errors[k]}</p>
    ) : null;

  const inputCls = (k: keyof Fields) => cn("h-11 bg-card", errors[k] && "border-destructive");

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's discuss your workflow."
        intro="Tell us about a repetitive task, an inefficient process, or an operational challenge. We'll discuss the problem and explore whether a practical digital solution could help."
      />

      <section className="container-site grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.6fr]">
        <aside className="space-y-6">
          <h2 className="text-2xl font-bold">What happens next</h2>
          <ol className="space-y-4 text-muted-foreground">
            <li><strong className="text-foreground">1. </strong>We read your description of the challenge.</li>
            <li><strong className="text-foreground">2. </strong>We arrange a short conversation to understand the process.</li>
            <li><strong className="text-foreground">3. </strong>We suggest whether — and how — a practical improvement could help.</li>
          </ol>
          <p className="text-sm text-muted-foreground">No obligation. If we're not the right fit, we'll say so.</p>
        </aside>

        <div className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
          {isMockMode && (
            <p className="mb-6 flex gap-2 rounded-lg border border-blue/30 bg-blue/5 p-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden="true" />
              Preview mode: this form checks your entries but does not send or store them yet.
            </p>
          )}

          {status === "success" ? (
            <div role="status" className="py-10 text-center">
              <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-bold">
                {isMockMode ? "Your details look good" : "Thank you — we'll be in touch"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                {isMockMode
                  ? "This is a preview. Your message was not sent or stored."
                  : "We've received your message and will reply to discuss your workflow."}
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
                Start another inquiry
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" aria-busy={status === "loading"}>
              <div>
                <Label htmlFor="name">Name <span aria-hidden="true">*</span></Label>
                <Input {...field("name")} autoComplete="name" required maxLength={100} className={inputCls("name")} />
                <Err k="name" />
              </div>
              <div>
                <Label htmlFor="company">Company <span aria-hidden="true">*</span></Label>
                <Input {...field("company")} autoComplete="organization" required maxLength={150} className={inputCls("company")} />
                <Err k="company" />
              </div>
              <div>
                <Label htmlFor="email">Work email <span aria-hidden="true">*</span></Label>
                <Input {...field("email")} type="email" autoComplete="email" required maxLength={255} className={inputCls("email")} />
                <Err k="email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone number <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <Input {...field("phone")} type="tel" autoComplete="tel" maxLength={20} className={inputCls("phone")} />
                <Err k="phone" />
              </div>
              <div>
                <Label htmlFor="industry">Industry <span aria-hidden="true">*</span></Label>
                <select {...field("industry")} required className={cn(selectCls, errors.industry && "border-destructive")}>
                  <option value="">Select an industry</option>
                  {industryOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
                <Err k="industry" />
              </div>
              <div>
                <Label htmlFor="service">Service of interest <span aria-hidden="true">*</span></Label>
                <select {...field("service")} required className={cn(selectCls, errors.service && "border-destructive")}>
                  <option value="">Choose an option</option>
                  {serviceOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
                <Err k="service" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="challenge">Describe the challenge <span aria-hidden="true">*</span></Label>
                <Textarea
                  {...field("challenge")}
                  required
                  rows={6}
                  maxLength={2000}
                  placeholder="e.g. RFQs arrive by email and WhatsApp, and we often miss required details before quoting."
                  className={cn("bg-card", errors.challenge && "border-destructive")}
                />
                <Err k="challenge" />
              </div>

              {status === "error" && (
                <p role="alert" className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive sm:col-span-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {errorMsg} Please try again.
                </p>
              )}

              <div className="sm:col-span-2">
                <Button type="submit" variant="hero" size="lg" disabled={status === "loading"} className="w-full sm:w-auto">
                  {status === "loading" ? (<><Loader2 className="animate-spin" aria-hidden="true" /> Checking…</>) : "Discuss My Workflow"}
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">Fields marked * are required.</p>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
