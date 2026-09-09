import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOwnedApplication } from "@/lib/get-owned-application";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isRateLimited } from "@/lib/rate-limit";

const anthropic = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY});

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    if(isRateLimited(userId, 5_000)) {
        return NextResponse.json(
            {error: "Troppe richieste, riprova tra qualche secondo"},
            {status: 429},
        )
    }

    const { id } = await params;
    const application = await getOwnedApplication(Number(id), userId);

    if (!application) {
        return NextResponse.json({ error: "Candidatura non trovata" }, { status: 404 });
    }

    const profile = await prisma.userProfile.findUnique({
        where: {userId},
    });

    if (!profile) {
        return NextResponse.json({ error: "Profilo CV mancante" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
        model: "claude-sonnet-5",
        max_tokens: 500,
        messages: [
            {
                role: "user",
                content: `Confronta questo CV con questa job description e valuta il match.
               
CV:
${profile.cvText}

JOB DESCRIPTION:
${application.jobDescription}

Rispondi SOLO con un oggetto JSON valido, senza testo aggiuntivo, in questo identico formato:
{"score": <numero da 0 a 100>, "suggestions": ["suggerimento 1", "suggerimento 2", "suggerimento 3"]}
`,
            },
        ],
    });

    const textBlock = message.content.find((block) => block.type === "text");

    let parsed;
    try {
        parsed = JSON.parse(textBlock?.text ?? "{}");
    } catch {
        return NextResponse.json(
            {error: "Risposta AI non valida, riprova"},
            {status: 502}
        );
    }

    const updated = await prisma.application.update({
        where: {id: Number(id)},
        data: {
            matchScore: parsed.score,
            matchSuggestions: JSON.stringify(parsed.suggestions)
        },
    });

    return NextResponse.json(updated)
}