import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { Inquiry, INQUIRY_STATUSES, type InquiryStatus } from "../inquiries/inquiry.model.js";
import { Tenant, TENANT_STATUSES } from "../tenants/tenant.model.js";
import { requireAuth, requireCsrf, requireRole } from "../../middleware/auth.js";
import { AppError } from "../../middleware/error.js";
import { logger } from "../../config/logger.js";

export const adminRouter = Router();

// Protect all /admin routes with authentication and CSRF protection for mutations
adminRouter.use(requireAuth);

const inquiryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(INQUIRY_STATUSES).optional(),
  search: z.string().trim().optional(),
});

/**
 * 9. GET /api/v1/admin/inquiries
 * Paginated list of inquiries with optional status filtering and search
 */
adminRouter.get("/inquiries", async (req: Request, res: Response) => {
  const { page, limit, status, search } = inquiryListQuerySchema.parse(req.query);

  const filter: Record<string, any> = {};
  if (status) {
    filter.status = status;
  }
  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { name: searchRegex },
      { company: searchRegex },
      { email: searchRegex },
      { serviceInterest: searchRegex },
    ];
  }

  const skip = (page - 1) * limit;
  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Inquiry.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: inquiries,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
});

/**
 * 10. GET /api/v1/admin/inquiries/:id
 * Retrieve a single inquiry record by ID
 */
adminRouter.get("/inquiries/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new AppError("Invalid inquiry ID format.", 400, "INVALID_ID");
  }

  const inquiry = await Inquiry.findById(id);
  if (!inquiry) {
    throw new AppError("Inquiry not found.", 404, "INQUIRY_NOT_FOUND");
  }

  res.json({
    success: true,
    data: inquiry,
  });
});

const patchInquirySchema = z.object({
  status: z.enum(INQUIRY_STATUSES).optional(),
  notes: z.string().max(5000).optional(),
  assignedTo: z.string().refine((val) => isValidObjectId(val), "Invalid user ID").optional().nullable(),
});

/**
 * 11. PATCH /api/v1/admin/inquiries/:id
 * Update status, internal notes, or staff assignment
 */
adminRouter.patch("/inquiries/:id", requireCsrf, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new AppError("Invalid inquiry ID format.", 400, "INVALID_ID");
  }

  const updates = patchInquirySchema.parse(req.body);

  const inquiry = await Inquiry.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    throw new AppError("Inquiry not found.", 404, "INQUIRY_NOT_FOUND");
  }

  logger.info({ inquiryId: id, adminUser: req.user?.email, updates }, "Inquiry updated by admin");

  res.json({
    success: true,
    message: "Inquiry updated successfully.",
    data: inquiry,
  });
});

const updateStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUSES),
});

/**
 * 12. PATCH /api/v1/admin/inquiries/:id/status
 * Specific endpoint for workflow status transitions
 */
adminRouter.patch("/inquiries/:id/status", requireCsrf, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new AppError("Invalid inquiry ID format.", 400, "INVALID_ID");
  }

  const { status } = updateStatusSchema.parse(req.body);

  const inquiry = await Inquiry.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );

  if (!inquiry) {
    throw new AppError("Inquiry not found.", 404, "INQUIRY_NOT_FOUND");
  }

  res.json({
    success: true,
    message: `Inquiry status updated to ${status}.`,
    data: inquiry,
  });
});

/**
 * 13. DELETE /api/v1/admin/inquiries/:id
 * Remove an inquiry (restricted to owner_admin role)
 */
adminRouter.delete("/inquiries/:id", requireRole("owner_admin"), requireCsrf, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new AppError("Invalid inquiry ID format.", 400, "INVALID_ID");
  }

  const inquiry = await Inquiry.findByIdAndDelete(id);
  if (!inquiry) {
    throw new AppError("Inquiry not found.", 404, "INQUIRY_NOT_FOUND");
  }

  logger.warn({ inquiryId: id, adminUser: req.user?.email }, "Inquiry deleted by owner");

  res.json({
    success: true,
    message: "Inquiry record deleted successfully.",
  });
});

/**
 * 14. GET /api/v1/admin/dashboard/summary
 * Aggregate counts and pipeline breakdown
 */
adminRouter.get("/dashboard/summary", async (_req: Request, res: Response) => {
  const [totalInquiries, newInquiries, inReviewInquiries, qualifiedInquiries, totalTenants] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "new" }),
    Inquiry.countDocuments({ status: "in_review" }),
    Inquiry.countDocuments({ status: "qualified" }),
    Tenant.countDocuments(),
  ]);

  const serviceBreakdown = await Inquiry.aggregate([
    { $group: { _id: "$serviceInterest", count: { $sum: 1 } } },
    { $project: { service: "$_id", count: 1, _id: 0 } },
  ]);

  res.json({
    success: true,
    data: {
      metrics: {
        totalInquiries,
        newInquiries,
        inReviewInquiries,
        qualifiedInquiries,
        totalTenants,
      },
      serviceBreakdown,
    },
  });
});

/**
 * 15. GET /api/v1/admin/dashboard/recent-inquiries
 * Most recent inquiries for staff review
 */
adminRouter.get("/dashboard/recent-inquiries", async (_req: Request, res: Response) => {
  const recent = await Inquiry.find().sort({ createdAt: -1 }).limit(10);
  res.json({
    success: true,
    data: recent,
  });
});

/**
 * 16. GET /api/v1/admin/tenants
 * List client tenants (isolated client entities)
 */
adminRouter.get("/tenants", async (_req: Request, res: Response) => {
  const tenants = await Tenant.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: tenants,
  });
});

const createTenantSchema = z.object({
  name: z.string().trim().min(1, "Tenant name is required").max(160),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  industry: z.string().trim().max(80).optional(),
  contactEmail: z.string().trim().email("Invalid contact email").max(254),
  contactPhone: z.string().trim().max(25).optional(),
  status: z.enum(TENANT_STATUSES).default("active"),
  notes: z.string().max(2000).optional(),
});

/**
 * 17. POST /api/v1/admin/tenants
 * Create a new tenant record (restricted to owner_admin)
 */
adminRouter.post("/tenants", requireRole("owner_admin"), requireCsrf, async (req: Request, res: Response) => {
  const data = createTenantSchema.parse(req.body);

  const existing = await Tenant.findOne({ slug: data.slug });
  if (existing) {
    throw new AppError("A tenant with this slug already exists.", 409, "TENANT_SLUG_CONFLICT");
  }

  const tenant = await Tenant.create(data);

  logger.info({ tenantId: tenant._id, slug: tenant.slug, adminUser: req.user?.email }, "Tenant created");

  res.status(201).json({
    success: true,
    message: "Tenant created successfully.",
    data: tenant,
  });
});

