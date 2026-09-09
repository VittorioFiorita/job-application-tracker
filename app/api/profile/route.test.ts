import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userProfile: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

const mockedAuth = vi.mocked(auth);

function makeRequest(body?: unknown) {
  return new Request("http://localhost/api/profile", {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/profile", () => {
  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await GET();

    expect(res.status).toBe(401);
  });

  it("returns the user's profile", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    const profile = { userId: "user_1", cvText: "CV di prova" };
    vi.mocked(prisma.userProfile.findUnique).mockResolvedValue(profile as never);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(profile);
  });
});

describe("POST /api/profile", () => {
  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await POST(makeRequest({ cvText: "CV" }));

    expect(res.status).toBe(401);
  });

  it("returns 400 when cvText is empty", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);

    const res = await POST(makeRequest({ cvText: "   " }));

    expect(res.status).toBe(400);
  });

  it("upserts and returns the profile on success", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    const profile = { userId: "user_1", cvText: "CV aggiornato" };
    vi.mocked(prisma.userProfile.upsert).mockResolvedValue(profile as never);

    const res = await POST(makeRequest({ cvText: "CV aggiornato" }));
    const data = await res.json();

    expect(prisma.userProfile.upsert).toHaveBeenCalledWith({
      where: { userId: "user_1" },
      update: { cvText: "CV aggiornato" },
      create: { userId: "user_1", cvText: "CV aggiornato" },
    });
    expect(data).toEqual(profile);
  });
});