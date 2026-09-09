import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "./route";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    company: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    application: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const mockedAuth = vi.mocked(auth);

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/applications", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/applications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await POST(makeRequest({}));

    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);

    const res = await POST(makeRequest({ companyName: "", position: "Dev", jobDescription: "desc" }));

    expect(res.status).toBe(400);
  });

  it("reuses an existing company instead of creating a new one", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    vi.mocked(prisma.company.findFirst).mockResolvedValue({ id: 1, name: "Google" } as never);
    vi.mocked(prisma.application.create).mockResolvedValue({ id: 10, companyId: 1 } as never);

    await POST(makeRequest({ companyName: "google", position: "Dev", jobDescription: "desc" }));

    expect(prisma.company.create).not.toHaveBeenCalled();
    expect(prisma.application.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ companyId: 1 }) })
    );
  });

  it("creates a new company when none matches", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    vi.mocked(prisma.company.findFirst).mockResolvedValue(null as never);
    vi.mocked(prisma.company.create).mockResolvedValue({ id: 2, name: "NewCo" } as never);
    vi.mocked(prisma.application.create).mockResolvedValue({ id: 11, companyId: 2 } as never);

    await POST(makeRequest({ companyName: "NewCo", position: "Dev", jobDescription: "desc" }));

    expect(prisma.company.create).toHaveBeenCalledWith({ data: { name: "NewCo" } });
  });
});

describe("GET /api/applications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await GET();

    expect(res.status).toBe(401);
  });

  it("returns the user's applications", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    const apps = [{ id: 1, position: "Dev" }];
    vi.mocked(prisma.application.findMany).mockResolvedValue(apps as never);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(apps);
  });
});