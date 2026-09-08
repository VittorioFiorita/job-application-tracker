import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const {userId} = await auth();
    
    if(!userId) {
        return NextResponse.json({error: "Non autorizzato"}, {status: 401})
    }

    const byStatus = await prisma.application.groupBy({
        by: ["status"],
        where: {userId},
        _count: true,
    });

    const avgMatch = await prisma.application.aggregate({
        where: {userId, matchScore: {not: null}},
        _avg: {matchScore: true},
    });

    const total = byStatus.reduce((sum, s) => sum + s._count, 0);

    return NextResponse.json({
        total,
        byStatus,
        averageMatch: avgMatch._avg.matchScore
    })
}