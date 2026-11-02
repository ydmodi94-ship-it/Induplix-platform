import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { PUBLIC_SERVICES } from "./services.data.js";
import { Inquiry, SERVICE_INTERESTS, INDUSTRIES } from "../inquiries/inquiry.model.js";
import { publicLimiter } from "../../middleware/rateLimiter.js";
import { AppError } from "../../middleware/error.js";
import { logger } from "../../config/logger.js";

export const publicRouter = Router();

publicRouter.use(publicLimiter);

/**
 * 1. GET /api/v1/public/services
 * Return list of all 4 offered Induplix services
 */
publicRouter.get("/services", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: PUBLIC_SERVICES,
  });
});

/**
 * 2. GET /api/v1/public/services/:slug
 * Return specific service detail
 */
publicRouter.get("/services/:slug", (req: Request, res: Response) => {
  const service = PUBLIC_SERVICES.find((s) => s.slug === req.params.slug);
  if (!service) {
    throw new AppError("Service not found.", 404, "SERVICE_NOT_FOUND");
  }
  res.json({
    success: true,
    data: service,
  });
});

const inquiryInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  company: z.string().trim().min(1, "Company is required").max(160),
  email: z.string().trim().min(1, "Email is required").email("Invalid email format").max(254),
  phone: z
    .string()
    .trim()
    .max(25)
    .optional()
    .or(z.literal("")),
  industry: z.enum(INDUSTRIES).optional(),
  location: z.string().trim().max(120).optional(),
  serviceInterest: z.enum(SERVICE_INTERESTS, {
    errorMap: () => ({ message: "Please select a valid service of interest." }),
  }),
  message: z.string().trim().min(10, "Please provide at least 10 characters describing the workflow challenge").max(3000),
  source: z.string().trim().max(50).optional(),
});

// Alias schema for frontend contact form matching { name, company, email, phone, industry, service, challenge }
const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  company: z.string().trim().min(1, "Company is required").max(160),
  email: z.string().trim().min(1, "Email is required").email("Invalid email format").max(254),
  phone: z.string().trim().max(25).optional().or(z.literal("")),
  industry: z.enum(INDUSTRIES).optional(),
  service: z.enum(SERVICE_INTERESTS, {
    errorMap: () => ({ message: "Please select a valid service of interest." }),
  }),
  challenge: z.string().trim().min(10, "Please describe the challenge in at least 10 characters").max(3000),
});

/**
 * Helper to process and create inquiry safely
 */
async function processInquiryCreation(data: any, req: Request, res: Response) {
  const newInquiry = await Inquiry.create({
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone || undefined,
    industry: data.industry || "Other",
    location: data.location || undefined,
    serviceInterest: data.serviceInterest,
    message: data.message,
    status: "new",
    source: data.source || "website",
  });

  const requestId = (req as any).id || req.headers["x-request-id"];

  logger.info(
    {
      inquiryId: newInquiry._id,
      company: newInquiry.company,
      serviceInterest: newInquiry.serviceInterest,
      requestId,
    },
    "Public inquiry received successfully"
  );

  res.status(201).json({
    success: true,
    message: "Thank you for reaching out. We have received your inquiry and will review your workflow.",
    receipt: {
      referenceId: newInquiry._id.toString(),
      receivedAt: newInquiry.createdAt,
    },
    requestId,
  });
}

/**
 * 3. POST /api/v1/public/inquiries
 */
publicRouter.post("/inquiries", async (req: Request, res: Response, next: import("express").NextFunction) => {
  try {
    const validated = inquiryInputSchema.parse(req.body);
    await processInquiryCreation(validated, req, res);
  } catch (err) {
    next(err);
  }
});

/**
 * 4. POST /api/v1/public/contact
 * Direct integration endpoint compatible with Lovable frontend contact form
 */
publicRouter.post("/contact", async (req: Request, res: Response, next: import("express").NextFunction) => {
  try {
    const validated = contactFormSchema.parse(req.body);
    const normalized = {
      name: validated.name,
      company: validated.company,
      email: validated.email,
      phone: validated.phone,
      industry: validated.industry,
      serviceInterest: validated.service,
      message: validated.challenge,
      source: "contact_page",
    };
    await processInquiryCreation(normalized, req, res);
  } catch (err) {
    next(err);
  }
});

