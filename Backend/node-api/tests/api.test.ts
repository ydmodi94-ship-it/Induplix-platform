import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import argon2 from "argon2";
import { createApp } from "../src/app.js";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { User } from "../src/modules/auth/user.model.js";
import { Inquiry } from "../src/modules/inquiries/inquiry.model.js";
import { Tenant } from "../src/modules/tenants/tenant.model.js";
import { env } from "../src/config/env.js";

const app = createApp();

describe("Induplix Phase 1 Backend API Integration Test Suite", () => {
  let sessionCookie: string;
  let csrfToken: string;
  let testInquiryId: string;

  beforeAll(async () => {
    await connectDB();

    // Clean up test data if any
    await User.deleteMany({ email: "testadmin@induplix.com" });
    await Inquiry.deleteMany({ email: "testlead@example.com" });
    await Tenant.deleteMany({ slug: "test-corp" });

    // Seed test admin
    const passwordHash = await argon2.hash("TestAdminPass123!");
    await User.create({
      email: "testadmin@induplix.com",
      passwordHash,
      displayName: "Test Administrator",
      role: "owner_admin",
      isActive: true,
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: "testadmin@induplix.com" });
    await Inquiry.deleteMany({ email: "testlead@example.com" });
    await Tenant.deleteMany({ slug: "test-corp" });
    await disconnectDB();
  });

  // 1. Health check
  it("GET /health returns 200 and ok status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("induplix-node-api");
  });

  // 2. Public Services
  it("GET /api/v1/public/services returns the 4 approved services", async () => {
    const res = await request(app).get("/api/v1/public/services");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);
    expect(res.body.data[0].slug).toBe("ai-rfq-intake");
  });

  it("GET /api/v1/public/services/:slug returns single service detail", async () => {
    const res = await request(app).get("/api/v1/public/services/ai-rfq-intake");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("AI RFQ Intake");
  });

  it("GET /api/v1/public/services/unknown returns 404", async () => {
    const res = await request(app).get("/api/v1/public/services/non-existent");
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("SERVICE_NOT_FOUND");
  });

  // 3. Public Inquiry Submissions
  it("POST /api/v1/public/inquiries validates and creates an inquiry", async () => {
    const res = await request(app)
      .post("/api/v1/public/inquiries")
      .send({
        name: "Test Lead",
        company: "Gujarat Polymers Ltd",
        email: "testlead@example.com",
        phone: "+91 98765 12345",
        industry: "Chemical",
        location: "Ankleshwar, Gujarat",
        serviceInterest: "AI RFQ Intake",
        message: "We need automated extraction of specifications from PDF orders.",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.receipt).toBeDefined();
    expect(res.body.receipt.referenceId).toBeDefined();
    testInquiryId = res.body.receipt.referenceId;
  });

  it("POST /api/v1/public/contact creates inquiry compatible with Lovable frontend payload", async () => {
    const res = await request(app)
      .post("/api/v1/public/contact")
      .send({
        name: "Test Frontend User",
        company: "Baroda Engineering Works",
        email: "testlead@example.com",
        phone: "+91 98765 99999",
        industry: "Engineering",
        service: "Quote Follow-up",
        challenge: "Our sales engineers forget to follow up on quotes after 7 days.",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/public/inquiries rejects invalid input with safe validation errors", async () => {
    const res = await request(app)
      .post("/api/v1/public/inquiries")
      .send({
        name: "",
        email: "not-an-email",
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  // 4. Staff Auth & Session Management
  it("POST /api/v1/auth/login succeeds with correct credentials and returns session", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "testadmin@induplix.com",
        password: "TestAdminPass123!",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("testadmin@induplix.com");
    expect(res.body.csrfToken).toBeDefined();

    // Capture cookies
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    sessionCookie = Array.isArray(cookies) ? cookies[0] : cookies;
    csrfToken = res.body.csrfToken;
  });

  it("POST /api/v1/auth/login rejects wrong credentials safely", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "testadmin@induplix.com",
        password: "WrongPassword!",
      });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe("INVALID_CREDENTIALS");
  });

  it("GET /api/v1/auth/me returns authenticated staff identity", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("owner_admin");
  });

  it("GET /api/v1/auth/csrf generates a valid CSRF token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/csrf")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.csrfToken).toBeDefined();
    csrfToken = res.body.csrfToken;
  });

  // 5. Admin Inquiries API & CSRF Enforcement
  it("GET /api/v1/admin/inquiries is forbidden without session", async () => {
    const res = await request(app).get("/api/v1/admin/inquiries");
    expect(res.status).toBe(401);
  });

  it("GET /api/v1/admin/inquiries returns paginated inquiries for authenticated staff", async () => {
    const res = await request(app)
      .get("/api/v1/admin/inquiries?page=1&limit=10")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it("GET /api/v1/admin/inquiries/:id returns single inquiry detail", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/inquiries/${testInquiryId}`)
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(testInquiryId);
  });

  it("PATCH /api/v1/admin/inquiries/:id blocks mutation without CSRF token", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/inquiries/${testInquiryId}`)
      .set("Cookie", sessionCookie)
      .send({ notes: "Attempt without CSRF" });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe("CSRF_TOKEN_INVALID");
  });

  it("PATCH /api/v1/admin/inquiries/:id succeeds with valid CSRF token", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/inquiries/${testInquiryId}`)
      .set("Cookie", sessionCookie)
      .set("x-csrf-token", csrfToken)
      .send({ notes: "Reviewed inquiry with founder." });

    expect(res.status).toBe(200);
    expect(res.body.data.notes).toBe("Reviewed inquiry with founder.");
  });

  it("PATCH /api/v1/admin/inquiries/:id/status updates inquiry workflow status", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/inquiries/${testInquiryId}/status`)
      .set("Cookie", sessionCookie)
      .set("x-csrf-token", csrfToken)
      .send({ status: "in_review" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("in_review");
  });

  // 6. Admin Dashboard Aggregates
  it("GET /api/v1/admin/dashboard/summary returns metrics", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard/summary")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.metrics.totalInquiries).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.data.serviceBreakdown)).toBe(true);
  });

  it("GET /api/v1/admin/dashboard/recent-inquiries returns list", async () => {
    const res = await request(app)
      .get("/api/v1/admin/dashboard/recent-inquiries")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 7. Admin Tenants (Multi-tenant scaffolding for future phases)
  it("POST /api/v1/admin/tenants creates a tenant record with CSRF", async () => {
    const res = await request(app)
      .post("/api/v1/admin/tenants")
      .set("Cookie", sessionCookie)
      .set("x-csrf-token", csrfToken)
      .send({
        name: "Test Corporation",
        slug: "test-corp",
        industry: "Manufacturing",
        contactEmail: "admin@testcorp.example.com",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe("test-corp");
  });

  it("GET /api/v1/admin/tenants lists existing tenants", async () => {
    const res = await request(app)
      .get("/api/v1/admin/tenants")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 8. Delete Inquiry & Logout
  it("DELETE /api/v1/admin/inquiries/:id deletes inquiry record", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/inquiries/${testInquiryId}`)
      .set("Cookie", sessionCookie)
      .set("x-csrf-token", csrfToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/auth/logout invalidates session", async () => {
    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);

    // Subsequent call with same cookie should be unauthorized
    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", sessionCookie);
    expect(meRes.status).toBe(401);
  });
});

