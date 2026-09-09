import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOwnedApplication } from "./get-owned-application";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    application: {
      findUnique: vi.fn(),
    },
  },
}));

describe("getOwnedApplication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the application when the userId matches", async () => {
    const app = { id: 1, userId: "user_1", position: "Dev" };
    vi.mocked(prisma.application.findUnique).mockResolvedValue(app as never);

    const result = await getOwnedApplication(1, "user_1");

    expect(result).toEqual(app);
  });

  it("returns null when the application belongs to a different user", async () => {
    const app = { id: 1, userId: "user_2", position: "Dev" };
    vi.mocked(prisma.application.findUnique).mockResolvedValue(app as never);

    const result = await getOwnedApplication(1, "user_1");

    expect(result).toBeNull();
  });

  it("returns null when the application doesn't exist", async () => {
    vi.mocked(prisma.application.findUnique).mockResolvedValue(null as never);

    const result = await getOwnedApplication(999, "user_1");

    expect(result).toBeNull();
  });
});