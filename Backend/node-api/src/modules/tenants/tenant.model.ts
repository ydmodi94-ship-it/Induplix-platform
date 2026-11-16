import { Schema, model, type Document } from "mongoose";

export const TENANT_STATUSES = ["active", "suspended", "closed"] as const;
export type TenantStatus = (typeof TENANT_STATUSES)[number];

export interface ITenant extends Document {
  name: string;
  slug: string;
  industry?: string;
  contactEmail: string;
  contactPhone?: string;
  status: TenantStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 80,
    },
    industry: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    contactPhone: {
      type: String,
      trim: true,
      maxlength: 25,
    },
    status: {
      type: String,
      enum: TENANT_STATUSES,
      default: "active",
      index: true,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tenant = model<ITenant>("Tenant", tenantSchema);

