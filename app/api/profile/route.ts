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
    const {
        fullName, headline, location, email, phone, website,
        summary, skills, experience, education, languages,
    } = body;

    const profile = await prisma.userProfile.upsert({
        where: { userId },
        update: { fullName, headline, location, email, phone, website, summary, skills, experience, education, languages },
        create: { userId, fullName, headline, location, email, phone, website, summary, skills, experience, education, languages },
    });

    return NextResponse.json(profile);
}