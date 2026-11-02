import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const valid = {
  name: "Asha Patel",
  company: "Patel Chemicals",
  email: "asha@patelchem.in",
  phone: "",
  industry: "Chemical",
  service: "AI RFQ Intake",
  challenge: "RFQs arrive by email and WhatsApp and details go missing.",
};

describe("contact form rules", () => {
  it("accepts a complete inquiry with no phone (phone is optional)", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it("requires a name", () => {
    expect(contactSchema.safeParse({ ...valid, name: " " }).success).toBe(false);
  });
  it("requires a valid work email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });
  it("only allows the six listed services", () => {
    expect(contactSchema.safeParse({ ...valid, service: "Web Design" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, service: "Not Sure Yet — Help Me Identify the Problem" }).success).toBe(true);
  });
});
