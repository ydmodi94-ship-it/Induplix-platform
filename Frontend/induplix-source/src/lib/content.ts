import { Bell, FileSearch, FileText, Inbox, Repeat, Workflow } from "lucide-react";
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
    id: "rfq-intake",
    name: "AI RFQ Intake",
    promise: "No RFQ should be missed or incomplete.",
    short:
      "Capture and organize incoming requests; extract details, flag missing information, and notify the responsible team.",
    icon: Inbox,
    flow: ["RFQ received", "Details extracted", "Missing info flagged", "Team notified"],
    problem:
      "RFQ information may arrive through different channels, be incomplete, difficult to organize, or slow to process.",
    approach:
      "Capture requests from agreed sources, extract relevant details, flag missing information, and make records easier for the team to review.",
    deliverables: [
      "Intake workflow for agreed channels",
      "Configurable field extraction",
      "Missing-information checks",
      "Structured RFQ records",
      "Team notifications",
      "Review path for uncertain or incomplete data",
    ],
    understandFirst: [
      "Where RFQs arrive today",
      "Which information is required",
      "Tools currently in use",
      "How staff review and assign requests",
    ],
    caveats:
      "Depends on channel access, document and email consistency, required field definitions, and review rules. Uncertain extraction needs staff review; there is no guarantee that every RFQ will be captured or complete.",
  },
  {
    id: "quote-follow-up",
    name: "Quote Follow-up",
    promise: "No quotation should die silently.",
    short: "Track outstanding quotations, follow-up dates, reminders, and quotation statuses.",
    icon: Repeat,
    flow: ["Quotation sent", "Follow-up due", "Reminder generated", "Status updated"],
    problem:
      "Quotations are sent, but follow-ups depend on memory, scattered notes, or individual inboxes — so opportunities can quietly go cold.",
    approach:
      "Keep a clear register of outstanding quotations, set follow-up dates and statuses, and prompt the team with timely reminders and draft messages.",
    deliverables: [
      "Quotation register",
      "Follow-up dates and statuses",
      "Reminders for the team",
      "Draft follow-up messages",
      "Response tracking",
    ],
    understandFirst: [
      "How quotations are created and sent",
      "Where quotation records live",
      "Your follow-up rhythm and status rules",
      "Who owns each customer conversation",
    ],
    caveats:
      "Depends on quotation records and agreed status rules. Customer-facing messages stay under human control unless you explicitly approve automation.",
  },
  {
    id: "invoice-exception-checker",
    name: "Invoice Exception Checker",
    promise: "Avoid wrong payments, disputes, and delayed collections.",
    short:
      "Compare available invoice details with agreed references, flag configured discrepancies, and prepare them for staff review.",
    icon: FileSearch,
    flow: ["Invoice received", "Details checked", "Exceptions flagged", "Finance reviews"],
    problem:
      "Invoice discrepancies — quantities, rates, taxes, references — often require slow manual checking against orders and other records.",
    approach:
      "Extract invoice details, compare them against agreed reference records, and flag configured exceptions for your finance team to review.",
    deliverables: [
      "Invoice data extraction",
      "Comparison against agreed reference records",
      "Configured exception flags",
      "Review queue or summary",
    ],
    understandFirst: [
      "Invoice formats you receive or issue",
      "Available reference data (POs, rate lists, delivery records)",
      "Matching rules and tolerances",
      "Who reviews and approves exceptions",
    ],
    caveats:
      "Depends on invoice formats, available reference data, matching rules, and exception thresholds. Flags support staff review; they do not authorize payments or replace financial judgment.",
  },
  {
    id: "ai-automations",
    name: "AI Automations",
    promise: "Reduce repetitive admin work and manual errors.",
    short:
      "Apply suitable automation and AI to document processing, information organization, routine reporting, and other repetitive tasks.",
    icon: Workflow,
    flow: ["Information received", "Processed", "Organized", "Output prepared"],
    problem:
      "Teams lose hours to repetitive admin — re-typing documents, compiling reports, copying data between spreadsheets and emails.",
    approach:
      "Identify well-defined repetitive tasks and apply the simplest suitable automation, using AI only where it adds practical value, with review checkpoints.",
    deliverables: [
      "Document processing",
      "Information organization",
      "Routine reports",
      "Task-specific automations",
      "Review checkpoints",
    ],
    understandFirst: [
      "The task, its steps, and how often it happens",
      "Data sources and their quality",
      "Tools already in use",
      "The cost of an error",
    ],
    caveats:
      "Scope depends on process clarity, data quality, available tools, and the cost of an error. AI outputs should be checked when errors could affect business decisions or transactions.",
  },
];

export const challenges = [
  { icon: Inbox, title: "Incoming RFQs that are difficult to track", text: "Requests arrive by email, phone, and WhatsApp — and details get lost along the way." },
  { icon: Repeat, title: "Quotations that need consistent follow-up", text: "Without a clear register, follow-ups depend on whoever remembers." },
  { icon: FileSearch, title: "Invoice discrepancies that need manual checks", text: "Matching invoices to orders and rates takes careful, slow attention." },
  { icon: FileText, title: "Repetitive administrative tasks", text: "Re-typing, compiling, and copying the same information every week." },
  { icon: Bell, title: "Information spread across tools", text: "Spreadsheets, emails, and chats each hold part of the picture." },
];

export const stages = [
  { n: "01", name: "Organize", forWho: "Rely on paper records, spreadsheets, email, WhatsApp, or fragmented processes.", help: "Structure information, clarify workflows, and establish more reliable digital records." },
  { n: "02", name: "Connect", forWho: "Already use digital tools but have disconnected information or manual handoffs.", help: "Identify opportunities to improve data flow, tracking, reporting, and coordination." },
  { n: "03", name: "Automate & Assist", forWho: "Have sufficiently structured information and clearly defined rules.", help: "Introduce appropriate automation and AI-assisted workflows where they provide practical value." },
];

export const industries = [
  { name: "Chemical", text: "RFQs with detailed specifications, batch documentation, and price-sensitive quotations that need timely follow-up.", apply: "RFQ Intake · Quote Follow-up" },
  { name: "Engineering", text: "Project-based enquiries, drawings and revisions, and invoices that must match agreed scopes and rates.", apply: "RFQ Intake · Invoice Exception Checker" },
  { name: "Manufacturing", text: "Recurring orders, supplier invoices, and routine reports that consume hours of admin time.", apply: "Invoice Exception Checker · AI Automations" },
];

export const industryOptions = ["Chemical", "Engineering", "Manufacturing", "Other"] as const;

export const serviceOptions = [
  "AI RFQ Intake",
  "Quote Follow-up",
  "Invoice Exception Checker",
  "AI Automations",
  "General Digital Operations Improvement",
  "Not Sure Yet — Help Me Identify the Problem",
] as const;
