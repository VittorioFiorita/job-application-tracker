import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOwnedApplication } from "@/lib/get-owned-application";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {params}: {params: Promise<{id: string}>}
) {
  const {userId} = await auth();

  if(!userId) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const {id} = await params;
  const application = await getOwnedApplication(Number(id), userId, {includeCompany: true});

  if (!application) {
    return NextResponse.json({ error: "Candidatura non trovata" }, { status: 404 });
  }

  return NextResponse.json(application);
}

export async function PATCH(
  request: Request,
  {params}: {params: Promise<{id: string}>}
) {
  const {userId} = await auth();

  if(!userId) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const {id} = await params;
  const existing = await getOwnedApplication(Number(id), userId);

  if (!existing) {
    return NextResponse.json({ error: "Candidatura non trovata" }, { status: 404 });
  }

  const body = await request.json();
  const {status} = body;

  const validStatuses = ["inviata", "colloquio", "rifiutata", "accettata"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "status non valido" }, { status: 400 });
  }

  const updated = await prisma.application.update({
    where: {id: Number(id)},
    data: {status}
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  {params}: {params: Promise<{id: string}>}
) {
  const {userId} = await auth();

  if(!userId) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const {id} = await params;
  const existing = await getOwnedApplication(Number(id), userId);

  if (!existing) {
    return NextResponse.json({ error: "Candidatura non trovata" }, { status: 404 });
  }

  await prisma.application.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}