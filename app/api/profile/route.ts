import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth();

    if(!userId) {
        return NextResponse.json({ error: "Non autenticato" }, { status: 401 })
    }
    
    const profile = await prisma.userProfile.findUnique({
        where: { userId },
    });

    return NextResponse.json(profile);
}

export async function POST(request: Request) {
    const { userId } = await auth();

    if(!userId) {
        return NextResponse.json({ error: "Non autenticato" }, { status: 401 })
    }

    const body = await request.json();
    const { cvText } = body;

    if (!cvText?.trim()) {
        return NextResponse.json(
            {error: "cvText obbligatorio"},
            {status: 400},
        );
    }

    const profile = await prisma.userProfile.upsert({
        where: { userId },
        update: { cvText },
        create: { userId, cvText }
    });

    return NextResponse.json(profile);
}