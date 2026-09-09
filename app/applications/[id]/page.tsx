"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MatchBar from "@/components/MatchBar";
import { fetchJson } from "@/lib/fetch-json";

type Application = {
  id: number;
  position: string;
  status: string;
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
    return <p className="max-w-5xl mx-auto p-8 text-gray-400">Caricamento...</p>;
  }

  if (!application) {
    return <p className="max-w-5xl mx-auto p-8 text-gray-400">Candidatura non trovata</p>;
  }

  const suggestions: string[] = application.matchSuggestions
    ? JSON.parse(application.matchSuggestions)
    : [];

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">{application.position}</h1>
      <p className="text-gray-400 mb-6">{application.company.name}</p>

      {application.matchScore !== null && (
        <div className="bg-white/[0.02] border border-gray-900 rounded-xl p-5 mb-6">
          <div className="mb-4">
            <MatchBar score={application.matchScore} />
          </div>
          <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="font-semibold mb-2">Job description</h2>
      <div className="bg-white/[0.02] border border-gray-900 rounded-xl p-5">
        <p className="text-gray-300 whitespace-pre-wrap">{application.jobDescription}</p>
      </div>
    </main>
  );
}