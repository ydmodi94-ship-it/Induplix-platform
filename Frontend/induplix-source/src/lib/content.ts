import { Bell, FileSearch, FileText, Inbox, Repeat, Workflow, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  id: string;
  name: string;
  promise: string;
  short: string;
  icon: LucideIcon;
  flow: string[];
  problem: string;
  approach: string;
  deliverables: string[];
  understandFirst: string[];
  caveats: string;
};

export const services: Service[] = [
  {
    id: "website-presence",
    name: "Website + Google Presence + RFS Inquiry System",
    promise: "A professional online presence that captures enquiries efficiently.",
    short: "Build a professional website, Google profile, and structured RFS form to attract and collect leads.",
    icon: Globe,
    flow: ["Website live", "Google profile created", "RFS form ready"],
    problem: "Potential customers struggle to find information and submit enquiries without a clear digital presence.",
    approach: "Design and launch a responsive website, set up Google Business, and integrate a structured Request for Service form.",
    deliverables: ["Responsive website", "Google Business listing", "RFS inquiry form"],
    understandFirst: ["Current online presence", "Brand assets", "Desired lead capture flow"],
    caveats: "Does not include ongoing SEO or paid advertising campaigns.",
  },
  {
    id: "rfq-intake",
    name: "AI RFQ Intake & Completeness Assistant",
    promise: "No RFQ should be missed or incomplete.",
    short: "Capture and organize incoming requests; extract details, flag missing information, and notify the team.",
    icon: Inbox,
    flow: ["RFQ received", "Details extracted", "Missing info flagged", "Team notified"],
    problem: "RFQ information may arrive through different channels, be incomplete, difficult to organize, or slow to process.",
    approach: "Capture requests from agreed sources, extract relevant details, flag missing information, and make records easier for the team to review.",
    deliverables: ["Intake workflow", "Configurable field extraction", "Missing-information checks", "Structured RFQ records", "Team notifications", "Review path"],
    understandFirst: ["Where RFQs arrive today", "Required information", "Current tools", "Review process"],
    caveats: "Depends on channel access and document consistency; extraction may need human review.",
  },
  {
    id: "quote-follow-up",
    name: "AI Quote Follow-up & Recovery Assistant",
    promise: "No quotation should die silently.",
    short: "Track outstanding quotations, follow-up dates, reminders, and statuses.",
    icon: Repeat,
    flow: ["Quotation sent", "Follow-up due", "Reminder generated", "Status updated"],
    problem: "Quotations are sent, but follow‑ups rely on memory or scattered notes, causing missed opportunities.",
    approach: "Maintain a register of quotations, set follow‑up dates, and trigger timely reminders and draft messages.",
    deliverables: ["Quotation register", "Follow‑up scheduling", "Automated reminders", "Draft follow‑up drafts"],
    understandFirst: ["Quotation creation process", "Storage location", "Follow‑up cadence", "Ownership"],
    caveats: "Automation sends drafts only after explicit approval; no automatic customer emails.",
  },
  {
    id: "chemical-documents",
    name: "AI Chemical Document & COA Manager",
    promise: "Organise critical chemical documentation for easy access.",
    short: "Centralise certificates, data sheets and safety documents, with optional AI extraction.",
    icon: FileText,
    flow: ["Documents uploaded", "Organised by product", "AI extraction (optional)", "Searchable repository"],
    problem: "Chemical documentation is scattered across folders and systems, making retrieval time‑consuming.",
    approach: "Create a structured repository, tag by product/type, and optionally extract key fields via AI.",
    deliverables: ["Document repository", "Product‑wise categorisation", "AI‑assisted extraction", "Search interface"],
    understandFirst: ["Current document storage", "Common document types", "Search needs", "Compliance requirements"],
    caveats: "Extraction is optional and may need manual verification for regulatory compliance.",
  },
  {
    id: "procurement",
    name: "AI Procurement & Supplier Comparison",
    promise: "Make supplier information easy to compare and evaluate.",
    short: "Collect, extract and compare supplier quotations in a structured workflow.",
    icon: Workflow,
    flow: ["Quotations collected", "Data extracted", "Side‑by‑side comparison", "Decision support"],
    problem: "Multiple supplier quotes arrive in varied formats, making manual comparison slow and error‑prone.",
    approach: "Standardise quotation capture, extract key fields, and present a comparison dashboard.",
    deliverables: ["Standardised intake", "Extracted data", "Comparison UI", "Decision workflow"],
    understandFirst: ["Supplier quotation formats", "Key comparison criteria", "Stakeholder decision process", "Existing tools"],
    caveats: "Comparison fields depend on available data; custom fields may require configuration.",
  },
  {
    id: "invoice-exception-checker",
    name: "AI Invoice Exception Checker",
    promise: "Avoid wrong payments, disputes and delayed collections.",
    short: "Compare invoice data against reference records and flag potential discrepancies.",
    icon: FileSearch,
    flow: ["Invoice received", "Details checked", "Exceptions highlighted", "Finance review"],
    problem: "Invoice verification is manual, time‑consuming and error‑prone.",
    approach: "Extract invoice details, match against POs or rate lists, and surface mismatches for review.",
    deliverables: ["Invoice extraction", "Reference matching", "Configurable exception rules", "Review queue"],
    understandFirst: ["Invoice formats", "Reference data availability", "Matching rules", "Review responsibilities"],
    caveats: "Requires consistent invoice structures and accessible reference data; flags are advisory only.",
  },
];

export const challenges = [
  { icon: Inbox, title: "Incoming RFQs that are difficult to track", text: "Requests arrive by email, phone, and WhatsApp — and details get lost along the way." },
  { icon: Repeat, title: "Quotations that need consistent follow-up", text: "Without a clear register, follow-ups depend on whoever remembers." },
  { icon: FileSearch, title: "Invoice discrepancies that need manual checks", text: "Matching invoices to orders and rates takes careful, slow attention." },
  { icon: FileText, title: "Repetitive administrative tasks", text: "Re‑typing, compiling, and copying the same information every week." },
  { icon: Bell, title: "Information spread across tools", text: "Spreadsheets, emails, and chats each hold part of the picture." },
];

export const stages = [
  { n: "01", name: "Organize", forWho: "Rely on paper records, spreadsheets, email, WhatsApp, or fragmented processes.", help: "Structure information, clarify workflows, and establish more reliable digital records." },
  { n: "02", name: "Connect", forWho: "Already use digital tools but have disconnected information or manual handoffs.", help: "Identify opportunities to improve data flow, tracking, reporting, and coordination." },
  { n: "03", name: "Automate & Assist", forWho: "Have sufficiently structured information and clearly defined rules.", help: "Introduce appropriate automation and AI‑assisted workflows where they provide practical value." },
];

export const industries = [
  { name: "Chemical", text: "RFQs with detailed specifications, batch documentation, and price‑sensitive quotations that need timely follow‑up.", apply: "RFQ Intake · Quote Follow‑up" },
  { name: "Engineering", text: "Project‑based enquiries, drawings and revisions, and invoices that must match agreed scopes.", apply: "RFQ Intake · Invoice Exception Checker" },
  { name: "Manufacturing", text: "Recurring orders, supplier invoices, and routine reports that consume admin time.", apply: "Invoice Exception Checker · AI Automations" },
];

export const industryOptions = ["Chemical", "Engineering", "Manufacturing", "Other"] as const;

export const serviceOptions = [
  "Website + Google Presence + RFS Inquiry System",
  "AI RFQ Intake & Completeness Assistant",
  "AI Quote Follow-up & Recovery Assistant",
  "AI Chemical Document & COA Manager",
  "AI Procurement & Supplier Comparison",
  "AI Invoice Exception Checker",
] as const;
