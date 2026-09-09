import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isRateLimited } from "./rate-limit";

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows the first call for a user", () => {
    expect(isRateLimited("user_1", 1000)).toBe(false);
  });

  it("blocks a second call within the interval", () => {
    isRateLimited("user_2", 1000);
    expect(isRateLimited("user_2", 1000)).toBe(true);
  });

  it("allows a call again after the interval has elapsed", () => {
    isRateLimited("user_3", 1000);
    vi.advanceTimersByTime(1001);
    expect(isRateLimited("user_3", 1000)).toBe(false);
  });
});