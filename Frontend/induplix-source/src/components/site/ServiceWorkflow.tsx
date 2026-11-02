import { Bell, Check, ClipboardCheck, FileText, Mail, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowPlayback } from "@/hooks/use-workflow-playback";
import { cn } from "@/lib/utils";

const stages = {
  "rfq-intake": ["Technical RFQ arrives", "Details organized", "Missing information flagged", "Prepared for team review"],
  "quote-follow-up": ["Quotation on timeline", "Follow-up date arrives", "Staff reminder prepared", "Status updated"],
  "invoice-exception-checker": ["Invoice received", "Compared with reference", "Discrepancy highlighted", "Staff review required"],
  "ai-automations": ["Information received", "Process connected", "Information routed", "Output prepared"],
} as const;
export type WorkflowKind = keyof typeof stages;

function RfqScene({ stage }: { stage: number }) {
  return <div className="rfq-scene">
    <div className={cn("technical-sheet", stage > 0 && "sheet-organized")}>
      <div className="flex items-center gap-2 border-b border-dark-border pb-3 text-teal"><Mail className="size-4" /><span className="text-xs font-semibold">RFQ · PROCESS VESSEL</span></div>
      <svg viewBox="0 0 240 80" className="my-4 h-20 w-full text-on-dark-muted" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M65 10 Q100 -1 135 10 V65 Q100 80 65 65 Z M65 10 Q100 25 135 10 M65 65 Q100 50 135 65 M82 72 V79 M120 72 V79 M100 2 V0 M135 28 H165 V45 H200 M20 40 H65 M45 20 V60 M40 20 H50 M40 60 H50" />
        <path d="M170 50 H220 M170 57 H210 M170 64 H225" className="text-teal" />
      </svg>
      <div className="flex justify-between gap-2 text-xs text-on-dark-muted"><span>SS316 vessel</span><span>Qty 02</span></div>
      <div className="technical-register mt-4 border-t border-dark-border pt-3 text-xs text-on-dark-muted"><span>DRAWING PV-02</span><span>REV A</span></div>
    </div>
    <div className={cn("rfq-record", stage >= 1 && "scene-revealed")}>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><FileText className="size-4 text-teal" />Structured record</p>
      <dl className="space-y-3 text-xs"><div className="flex justify-between"><dt className="text-on-dark-muted">Material</dt><dd>SS316</dd></div><div className="flex justify-between"><dt className="text-on-dark-muted">Quantity</dt><dd>2 vessels</dd></div><div className={cn("flex justify-between gap-2 border-t border-dark-border pt-3", stage >= 2 && "text-workflow-warning")}><dt>Delivery date</dt><dd>{stage >= 2 ? "Missing" : "—"}</dd></div></dl>
      <p className={cn("scene-note mt-4", stage >= 3 && "scene-revealed")}><ClipboardCheck className="size-4" />Team review prepared</p>
    </div>
  </div>;
}

function QuoteScene({ stage }: { stage: number }) {
  return <div className="quote-scene">
    <div className="flex items-center justify-between border-b border-dark-border pb-4"><div><p className="text-xs text-on-dark-muted">QUOTATION · Q-024</p><p className="mt-1 font-semibold">Machined flange assembly</p></div><FileText className="size-6 text-teal" /></div>
    <div className="quote-timeline"><div className={cn("quote-cursor", `quote-cursor-${stage}`)} /><div className="quote-track" />{["Sent", "Due date", "Reminder", "Review"].map((label, i) => <div key={label} className={cn("quote-milestone", i <= stage && "milestone-active")}><span /><p>{label}</p></div>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-on-dark-muted">Status</span><span className={cn("workflow-status", stage >= 3 && "status-ready")}>{stage >= 3 ? "Follow-up pending staff action" : "Awaiting customer response"}</span></div>
    <div className={cn("quote-reminder", stage >= 2 && "scene-revealed")}><Bell className="size-5 text-workflow-warning" /><div><p className="text-sm font-semibold">Follow-up is due</p><p className="mt-1 text-xs text-on-dark-muted">Reminder for the quotation owner</p></div></div>
  </div>;
}

function InvoiceScene({ stage }: { stage: number }) {
  return <div className="invoice-scene">
    <div className="invoice-comparison">{["Invoice", "PO reference"].map((label, i) => <div key={label} className={cn("invoice-sheet", i === 1 && stage < 1 && "scene-pending")}><p className="mb-5 flex items-center gap-2 text-sm font-semibold"><FileText className="size-4 text-teal" />{label}</p><p className="text-xs text-on-dark-muted">Flange · SS316</p><div className="invoice-line" /><div className="invoice-line short" /><div className={cn("mt-5 flex flex-wrap justify-between gap-1 border-t border-dark-border pt-3 text-sm", stage >= 2 && "invoice-discrepancy")}><span>Quantity</span><strong>{i === 0 ? "24 units" : "20 units"}</strong></div></div>)}</div>
    <div className="mt-5 flex items-center justify-between gap-3 text-xs"><span className={cn("flex items-center gap-2", stage >= 2 ? "text-workflow-warning" : "text-on-dark-muted")}><TriangleAlert className="size-4" />{stage >= 2 ? "Quantity mismatch · +4 units" : "Reference comparison pending"}</span><Check className={cn("size-4 text-teal", stage < 1 && "opacity-0")} /></div>
    <p className={cn("scene-note mt-4", stage >= 3 && "scene-revealed")}><ClipboardCheck className="size-4" />Exception queued for staff review</p>
    <p className="mt-3 text-xs text-on-dark-muted">Review support only. No payment authorization.</p>
  </div>;
}

function AutomationScene({ stage }: { stage: number }) {
  return <div className="automation-scene">
    <svg viewBox="0 0 400 190" className="w-full text-on-dark-muted" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5"><path d="M35 38 H70 V20 H92 V72 H35 Z M35 38 H70 V20 M45 50 H80 M45 60 H70 M35 118 H90 V160 H35 Z M45 128 H80 M45 139 H70" />
      <path d="M92 48 H140 V96 H175 M90 140 H140 V96 M225 96 H270 V48 H315 M270 96 V145 H315" className={cn("process-pipe", stage >= 1 && "pipe-connected")} />
      <rect x="175" y="71" width="50" height="50" rx="4" /><path d="M186 83 H214 V109 H186 Z M193 83 V109 M186 96 H214" />
      <rect x="315" y="25" width="57" height="46" rx="4" /><path d="M328 38 H358 M328 48 H350 M328 58 H355" />
      <rect x="315" y="124" width="57" height="43" rx="4" /><path d="M327 140 L336 149 L357 132" /></g>
      <circle cx="0" cy="0" r="5" className={cn("process-packet", `process-packet-${stage}`)} />
      <g fill="currentColor" stroke="none" fontSize="10"><text x="35" y="88">Documents</text><text x="35" y="180">Process data</text><text x="174" y="142">Organize</text><text x="315" y="88">Report</text><text x="312" y="184">Review task</text></g>
    </svg>
    <div className={cn("automation-output", stage >= 3 && "scene-revealed")}><ClipboardCheck className="size-5 text-teal" /><div><p className="text-sm font-semibold">Prepared output</p><p className="mt-1 text-xs text-on-dark-muted">Organized report + assigned review task</p></div></div>
  </div>;
}

export function ServiceWorkflow({ kind }: { kind: string }) {
  const { ref, stage, playing, reduced, replay } = useWorkflowPlayback();
  const key: WorkflowKind = kind === "quote-follow-up" || kind === "invoice-exception-checker" || kind === "ai-automations" ? kind : "rfq-intake";
  return <figure ref={ref} className="service-workflow" aria-label={`${key}: illustrative workflow`} data-workflow={key} data-stage={stage} data-playing={playing}>
    <div className="mb-5 flex items-center justify-between gap-3"><span className="eyebrow text-teal">Illustrative workflow</span><Button variant="ghostDark" size="icon" onClick={replay} disabled={reduced} aria-label="Replay workflow" title={reduced ? "Static example: reduced motion enabled" : "Replay workflow"}><RotateCcw /></Button></div>
    <div className="workflow-scene">{key === "rfq-intake" ? <RfqScene stage={stage} /> : key === "quote-follow-up" ? <QuoteScene stage={stage} /> : key === "invoice-exception-checker" ? <InvoiceScene stage={stage} /> : <AutomationScene stage={stage} />}</div>
    <ol className="workflow-stage-list">{stages[key].map((label, i) => <li key={label} className={cn(i <= stage && "stage-active")} aria-current={stage === i ? "step" : undefined}><span>{i + 1}</span>{label}</li>)}</ol>
    <figcaption className="mt-5 text-xs text-on-dark-muted">Illustrative example — not a live deployment</figcaption>
  </figure>;
}