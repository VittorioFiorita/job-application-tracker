import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isRateLimited } from "@/lib/rate-limit";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET() {
    const {userId} = await auth();

    if(!userId) {
        return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const latest = await prisma.insight.findFirst({
        where: {userId},
        orderBy: {createdAt: "desc"},
    });

    return NextResponse.json(latest);
}

export async function POST() {
    const {userId} = await auth();

    if(!userId) {
        return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    if(isRateLimited(userId, 60_000)) {
        return NextResponse.json(
            {error: "Troppe richieste, riprova tra qualche minuto"},
            {status: 429}
        )
    }

    const applications = await prisma.application.findMany({
        where: {userId},
        include: {company: true},
    });

    if(applications.length === 0) {
        return NextResponse.json(
            {error: "Nessuna candidatura da analizzare"},
            {status: 400},
        );
    }

    const summary = applications
        .map((app) => {
            const suggestions = app.matchSuggestions ? JSON.parse(app.matchSuggestions) : [];
            return `- ${app.position} @ ${app.company.name} | status: ${app.status} | match: ${app.matchScore ?? "non valutato"} | suggerimenti: ${suggestions.join("; ") || "nessuno"}`;
        })
        .join("\n");

    const message = await anthropic.messages.create({
        model: "claude-sonnet-5",
        max_tokens: 1500,
        messages: [
            {
                role: "user",
                content: `Analizza queste candidature di lavoro e dammi 2-3 osservazioni utili sull'andamento generale (pattern ricorrenti, punti deboli, consigli strategici). Sii specifico e concreto, non generico

CANDIDATURE:
${summary}

Rispondi con un testo in italiano di massimo 600 caratteri, senza formattazione markdown. Sii conciso: meglio 2-3 osservazioni dense che un'analisi esaustiva.`,
            },
        ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const content = textBlock?.text ?? "Analisi non disponibile.";

    const insight = await prisma.insight.create({
        data: {userId, content}
    });

    return NextResponse.json(insight)
}