import { prisma } from "@/lib/prisma";

export async function getOwnedApplication(
    id: number,
    userId: string,
    options?: {includeCompany?: boolean}
) {
    const application = await prisma.application.findUnique({
        where: {id},
        include: options?.includeCompany ? {company: true} : undefined,
    });

    if (!application || application.userId !== userId) {
        return null;
    }

    return application;
}