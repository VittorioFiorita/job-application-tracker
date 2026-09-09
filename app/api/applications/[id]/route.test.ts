import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, DELETE } from "./route";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOwnedApplication } from "@/lib/get-owned-application";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    application: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/get-owned-application", () => ({
  getOwnedApplication: vi.fn(),
}));

const mockedAuth = vi.mocked(auth);
const mockedGetOwned = vi.mocked(getOwnedApplication);

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makeRequest(body?: unknown) {
  return new Request("http://localhost/api/applications/1", {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/applications/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await GET(makeRequest(), makeParams("1"));

    expect(res.status).toBe(401);
  });

  it("returns 404 when the application isn't owned by the user", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams("1"));

    expect(res.status).toBe(404);
  });

  it("returns the application when owned", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    const app = { id: 1, position: "Dev" };
    mockedGetOwned.mockResolvedValue(app as never);

    const res = await GET(makeRequest(), makeParams("1"));
    const data = await res.json();

    expect(data).toEqual(app);
  });
});

describe("PATCH /api/applications/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await PATCH(makeRequest({ status: "colloquio" }), makeParams("1"));

    expect(res.status).toBe(401);
  });

  it("returns 404 when the application isn't owned by the user", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue(null);

    const res = await PATCH(makeRequest({ status: "colloquio" }), makeParams("1"));

    expect(res.status).toBe(404);
  });

  it("returns 400 when the status is not valid", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue({ id: 1 } as never);

    const res = await PATCH(makeRequest({ status: "in_forno" }), makeParams("1"));

    expect(res.status).toBe(400);
  });

  it("updates the status when valid and owned", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue({ id: 1 } as never);
    vi.mocked(prisma.application.update).mockResolvedValue({ id: 1, status: "colloquio" } as never);

    const res = await PATCH(makeRequest({ status: "colloquio" }), makeParams("1"));
    const data = await res.json();

    expect(data.status).toBe("colloquio");
  });
});

describe("DELETE /api/applications/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as never);

    const res = await DELETE(makeRequest(), makeParams("1"));

    expect(res.status).toBe(401);
  });

  it("returns 404 when the application isn't owned by the user", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue(null);

    const res = await DELETE(makeRequest(), makeParams("1"));

    expect(res.status).toBe(404);
  });

  it("deletes the application when owned", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_1" } as never);
    mockedGetOwned.mockResolvedValue({ id: 1 } as never);

    const res = await DELETE(makeRequest(), makeParams("1"));

    expect(prisma.application.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toBe(200);
  });
});