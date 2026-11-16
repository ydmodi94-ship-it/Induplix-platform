import { Schema, model, type Document } from "mongoose";

export const INQUIRY_STATUSES = ["new", "in_review", "contacted", "qualified", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const SERVICE_INTERESTS = [
  "AI RFQ Intake",
  "Quote Follow-up",
  "Invoice Exception Checker",
  "AI Automations",
  "General Digital Operations Improvement",
  "Not Sure Yet — Help Me Identify the Problem",
] as const;
export type ServiceInterest = (typeof SERVICE_INTERESTS)[number];

export const INDUSTRIES = ["Chemical", "Engineering", "Manufacturing", "Other"] as const;
export type Industry = (typeof INDUSTRIES)[number];

export interface IInquiry extends Document {
  name: string;
  company: string;
  email: string;
  phone?: string;
  industry?: Industry;
  location?: string;
  serviceInterest: ServiceInterest;
  message: string;
  status: InquiryStatus;
  source: string;
  notes?: string;
  assignedTo?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 25,
      default: undefined,
    },
    industry: {
      type: String,
      enum: INDUSTRIES,
      default: "Other",
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: undefined,
    },
    serviceInterest: {
      type: String,
      required: true,
      enum: SERVICE_INTERESTS,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: INQUIRY_STATUSES,
      default: "new",
      index: true,
    },
    source: {
      type: String,
      default: "website",
      maxlength: 50,
    },
    notes: {
      type: String,
      maxlength: 5000,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Optimize Phase 2 newest-first inbox query
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ createdAt: -1 });

export const Inquiry = model<IInquiry>("Inquiry", inquirySchema);

