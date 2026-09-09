import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchJson } from "./fetch-json";

describe("fetchJson", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the parsed JSON when the response is ok", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ hello: "world" }),
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

    const result = await fetchJson<{ hello: string }>("/api/test");

    expect(result).toEqual({ hello: "world" });
  });

  it("throws when the response is not ok", async () => {
    const mockResponse = { ok: false, status: 500 };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

    await expect(fetchJson("/api/test")).rejects.toThrow("Richiesta fallita (500)");
  });
});