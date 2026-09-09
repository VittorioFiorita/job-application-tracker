import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Non autenticato" }, {status: 401});
    }

    const body = await request.json();
    const { companyName, position, jobDescription } = body;

    if(!companyName?.trim() || !position?.trim() || !jobDescription?.trim()) {
        return NextResponse.json(
            {error: "companyName, position e jobDescription sono obbligatori"},
            {status: 400}
        );
    }

    const company = await prisma.company.findFirst({
        where: {name: {equals: companyName.trim(), mode: "insensitive"}},
    }) ?? await prisma.company.create({
        data: {name: companyName.trim()},
    });

    const application = await prisma.application.create({
        data: {
            companyId: company.id,
            position,
            jobDescription,
            userId,
        },
    });

    return NextResponse.json(application);
}

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
        where: { userId },
        include: { company: true },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(applications);
}