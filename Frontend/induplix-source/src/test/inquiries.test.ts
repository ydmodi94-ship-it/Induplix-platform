import { afterEach, describe, expect, it, vi } from "vitest";
import { isMockMode, submitInquiry } from "@/lib/api/inquiries";
import type { ContactInput } from "@/lib/contact-schema";

const input: ContactInput = { name: "Test Visitor", company: "Test Engineering", email: "visitor@example.com", phone: "", industry: "Engineering", service: "AI RFQ Intake", challenge: "Organize incoming requests for staff review." };
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("frontend-only inquiry boundary", () => {
  it("resolves mock entries after loading without making a network request", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.fn(); vi.stubGlobal("fetch", fetchSpy);
    const pending = submitInquiry(input);
    await vi.advanceTimersByTimeAsync(1100);
    expect(isMockMode).toBe(true);
    expect(await pending).toEqual({ mode: "mock" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it("supports the mock error path without sending the inquiry", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.fn(); vi.stubGlobal("fetch", fetchSpy);
    const pending = submitInquiry({ ...input, email: "fail@example.com" });
    const assertion = expect(pending).rejects.toThrow("Simulated error");
    await vi.advanceTimersByTimeAsync(1100);
    await assertion;
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});