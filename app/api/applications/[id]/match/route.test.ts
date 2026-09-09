import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOwnedApplication } from "@/lib/get-owned-application";
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
    userProfile: { findUnique: vi.fn() },
    application: { update: vi.fn() },
  },
}));

vi.mock("@/lib/get-owned-application", () => ({
  getOwnedApplication: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  isRateLimited: vi.fn(),
}));

import { POST } from "./route";

const mockedAuth = vi.mocked(auth);
const mockedGetOwned = vi.mocked(getOwnedApplication);
const mockedIsRateLimited = vi.mocked(isRateLimited);

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makeRequest() {
  return new Request("http://localhost/api/applications/1/match", { method: "POST" });
}

function aiTextResponse(text: string) {
  return { content: [{ type: "text", text }] };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedIsRateLimited.mockReturnValue(false);
});

describe("POST /api/applications/[id]/match", () => {
  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await POST(makeRequest(), makeParams("1"));

    expect(res.status).toBe(401);
  });

  it("returns 429 when rate limited", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedIsRateLimited.mockReturnValue(true);

    const res = await POST(makeRequest(), makeParams("1"));

    expect(res.status).toBe(429);
  });

  it("returns 404 when the application isn't owned by the user", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams("1"));

    expect(res.status).toBe(404);
  });

  it("returns 400 when the user has no CV profile", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue({ id: 1, jobDescription: "desc" } as never);
    vi.mocked(prisma.userProfile.findUnique).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams("1"));

    expect(res.status).toBe(400);
  });

  it("returns 502 when the AI response isn't valid JSON", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue({ id: 1, jobDescription: "desc" } as never);
    vi.mocked(prisma.userProfile.findUnique).mockResolvedValue({ userId: "user_1", cvText: "CV" } as never);
    mockCreate.mockResolvedValue(aiTextResponse("questo non è JSON"));

    const res = await POST(makeRequest(), makeParams("1"));

    expect(res.status).toBe(502);
  });

  it("updates the match score and suggestions on success", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue({ id: 1, jobDescription: "desc" } as never);
    vi.mocked(prisma.userProfile.findUnique).mockResolvedValue({ userId: "user_1", cvText: "CV" } as never);
    mockCreate.mockResolvedValue(aiTextResponse(JSON.stringify({ score: 80, suggestions: ["ok"] })));
    vi.mocked(prisma.application.update).mockResolvedValue({ id: 1, matchScore: 80 } as never);

    const res = await POST(makeRequest(), makeParams("1"));
    const data = await res.json();

    expect(prisma.application.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { matchScore: 80, matchSuggestions: JSON.stringify(["ok"]) },
    });
    expect(data.matchScore).toBe(80);
  });
});