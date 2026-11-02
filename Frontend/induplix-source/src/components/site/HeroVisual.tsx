import { CheckCircle2, FileSpreadsheet, Mail, MessageCircle, Phone, TriangleAlert } from "lucide-react";
import { useId } from "react";

const sources = [
  { icon: Mail, label: "RFQ email" },
  { icon: MessageCircle, label: "WhatsApp note" },
  { icon: FileSpreadsheet, label: "Old spreadsheet" },
  { icon: Phone, label: "Phone message" },
];
const rows = [
  { k: "Customer", v: "Acme Polymers", ok: true },
  { k: "Product", v: "Resin grade B-40", ok: true },
  { k: "Quantity", v: "2,000 kg", ok: true },
  { k: "Delivery date", v: "Missing", ok: false },
];
const paths = ["M0 12 C40 12 48 96 90 96", "M0 60 C40 60 50 96 90 96", "M0 120 C40 120 50 96 90 96", "M0 168 C40 168 48 96 90 96"];

/** Illustrative example only; no data is sent or processed. */
export function HeroVisual() {
  const gradientId = useId();
  return (
    <div role="img" aria-label="Illustrative RFQ: emails, chats, spreadsheets and phone messages become a structured record for Acme Polymers, resin grade B-40, 2,000 kg, with a missing delivery date flagged." className="hero-workflow">
      <div className="hero-sources">
        {sources.map(({ icon: Icon, label }, i) => (
          <div key={label} className={`hero-source hero-source-${i} border border-dark-border bg-charcoal-soft text-on-dark-muted`}>
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <svg className="hero-connectors" viewBox="0 0 90 180" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1">
            <stop offset="0" stopColor="var(--teal)" />
            <stop offset="1" stopColor="var(--blue)" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <g key={d} className={`hero-path hero-path-${i}`}>
            <path d={d} fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeDasharray="5 7" />
            <path d={d} fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" pathLength="100" className="hero-pulse" />
          </g>
        ))}
      </svg>
      <div className="hero-rfq border bg-charcoal-soft p-4">
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <span className="eyebrow text-teal">Structured<br />RFQ</span>
          <span className="shrink-0 rounded-full bg-on-dark/10 px-2 py-0.5 text-xs text-on-dark-muted">Example</span>
        </div>
        <dl className="space-y-2">
          {rows.map((row) => (
            <div key={row.k} className="hero-rfq-row bg-charcoal px-3 py-2 text-sm">
              <dt className="min-w-0 text-on-dark-muted">{row.k}</dt>
              <dd className="flex min-w-0 items-center gap-1.5 font-semibold text-on-dark">
                {row.ok ? <CheckCircle2 className="size-3.5 shrink-0 text-teal" aria-hidden="true" /> : <TriangleAlert className="size-3.5 shrink-0 text-blue" aria-hidden="true" />}
                <span>{row.v}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-on-dark-muted">Team notified to confirm the missing field.</p>
      </div>
    </div>
  );
}
