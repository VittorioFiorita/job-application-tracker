"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MatchBar from "@/components/MatchBar";
import { fetchJson } from "@/lib/fetch-json";

type Application = {
  id: number;
  position: string;
  status: string;
  createdAt: string;
  jobDescription: string;
  matchScore: number | null;
  matchSuggestions: string | null;
  company: { name: string };
};

export default function ApplicationDetail() {
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await fetchJson<Application>(`/api/applications/${params.id}`);
        setApplication(data);
      } catch {
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };
    loadApplication();
  }, [params.id]);

  if (loading) {
    return <p className="max-w-5xl mx-auto p-8 text-foreground/60">Caricamento...</p>;
  }

  if (!application) {
    return <p className="max-w-5xl mx-auto p-8 text-foreground/60">Candidatura non trovata</p>;
  }

  const suggestions: string[] = application.matchSuggestions
    ? JSON.parse(application.matchSuggestions)
    : [];

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">{application.position}</h1>
      <p className="text-foreground/60 mb-1">{application.company.name}</p>

      <div className="flex items-center gap-2 text-xs font-mono text-foreground/40 mb-6">
        <span>#{String(application.id).padStart(5, "0")}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={application.createdAt}>
          {new Date(application.createdAt).toLocaleDateString("it-IT")}
        </time>
      </div>

      {application.matchScore !== null && (
        <div className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 mb-6">
          <div className="mb-4">
            <MatchBar score={application.matchScore} />
          </div>
          <ul className="list-disc list-inside text-foreground/80 text-sm space-y-1">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="font-semibold mb-2">Job description</h2>
      <div className="bg-foreground/3 border border-foreground/10 rounded-xl p-5">
        <p className="text-foreground/80 whitespace-pre-wrap">{application.jobDescription}</p>
      </div>
    </main>
  );
}