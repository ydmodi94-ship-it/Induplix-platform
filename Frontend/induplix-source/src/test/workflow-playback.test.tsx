import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useWorkflowPlayback, WORKFLOW_DURATION_MS } from "@/hooks/use-workflow-playback";

let enterView: (entries: { isIntersecting: boolean }[]) => void;
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: typeof enterView) { enterView = callback; }
    observe() {} disconnect() {} unobserve() {}
  });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("deliberate workflow playback", () => {
  it("keeps each four-stage sequence within the requested 7–10 seconds", () => {
    expect(WORKFLOW_DURATION_MS).toBeGreaterThanOrEqual(7000);
    expect(WORKFLOW_DURATION_MS).toBeLessThanOrEqual(10000);
  });
  it("waits for entry, plays once for 8.8 seconds, and can replay", () => {
    const { result } = renderHook(useWorkflowPlayback);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(result.current.playing).toBe(false);
    expect(result.current.stage).toBe(0);
    act(() => { enterView([{ isIntersecting: true }]); });
    expect(result.current.playing).toBe(true);
    act(() => { vi.advanceTimersByTime(2199); });
    expect(result.current.stage).toBe(0);
    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current.stage).toBe(1);
    act(() => { vi.advanceTimersByTime(6600); });
    expect(result.current.stage).toBe(3);
    expect(result.current.playing).toBe(false);
    act(() => { vi.advanceTimersByTime(20000); });
    expect(result.current.stage).toBe(3);
    act(() => { result.current.replay(); });
    expect(result.current.stage).toBe(0);
    expect(result.current.playing).toBe(true);
  });

  it("shows the complete still with reduced motion and never plays on replay", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    const { result } = renderHook(useWorkflowPlayback);
    expect(result.current.stage).toBe(3);
    act(() => { enterView([{ isIntersecting: true }]); result.current.replay(); vi.advanceTimersByTime(10000); });
    expect(result.current.stage).toBe(3);
    expect(result.current.playing).toBe(false);
  });
});