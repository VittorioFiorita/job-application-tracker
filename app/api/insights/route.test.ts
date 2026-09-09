import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    insight: { findFirst: vi.fn(), create: vi.fn() },
    application: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  isRateLimited: vi.fn(),
}));

import { GET, POST } from "./route";

const mockedAuth = vi.mocked(auth);
const mockedIsRateLimited = vi.mocked(isRateLimited);

function aiTextResponse(text: string) {
  return { content: [{ type: "text", text }] };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedIsRateLimited.mockReturnValue(false);
});

describe("GET /api/insights", () => {
  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await GET();

    expect(res.status).toBe(401);
  });

  it("returns the latest insight", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    const insight = { id: 1, content: "..." };
    vi.mocked(prisma.insight.findFirst).mockResolvedValue(insight as never);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(insight);
  });
});

describe("POST /api/insights", () => {
  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await POST();

    expect(res.status).toBe(401);
  });

  it("returns 429 when rate limited", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedIsRateLimited.mockReturnValue(true);

    const res = await POST();

    expect(res.status).toBe(429);
  });

  it("returns 400 when there are no applications to analyze", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    vi.mocked(prisma.application.findMany).mockResolvedValue([]);

    const res = await POST();

    expect(res.status).toBe(400);
  });

  it("creates and returns an insight on success", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    vi.mocked(prisma.application.findMany).mockResolvedValue([
      { position: "Dev", status: "inviata", matchScore: 80, matchSuggestions: null, company: { name: "Acme" } },
    ] as never);
    mockCreate.mockResolvedValue(aiTextResponse("Analisi generata"));
    const insight = { id: 1, userId: "user_1", content: "Analisi generata" };
    vi.mocked(prisma.insight.create).mockResolvedValue(insight as never);

    const res = await POST();
    const data = await res.json();

    expect(prisma.insight.create).toHaveBeenCalledWith({
      data: { userId: "user_1", content: "Analisi generata" },
    });
    expect(data).toEqual(insight);
  });
});