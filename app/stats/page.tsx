"use client"

import { useEffect, useState } from "react"
import { fetchJson } from "@/lib/fetch-json";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";

type Stats = {
    total: number,
    byStatus: {status: string, _count: number}[];
    averageMatch: number | null;
};

type Insight ={
    id: number;
    content: string;
    createdAt: string;
};

export default function StatsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [insight, setInsight] = useState<Insight | null>(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchJson<Stats>("/api/stats");
                setStats(data);
            } catch {
                setStats(null);
            } finally{
                setLoading(false);
            }

            try{
                const insightData = await fetchJson<Insight | null>("/api/insights");
                setInsight(insightData);
            } catch {
                setInsight(null);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return <p className="p-8 text-foreground/60">Caricamento...</p>;
    }

    if (!stats) {
        return <p className="p-8 text-foreground/60">Impossibile caricare le statistiche</p>;
    }

    const handleGenerateInsight = async () => {
        setGenerating(true);
        try {
            const data = await fetchJson<Insight>("/api/insights", {method: "POST"});
            setInsight(data);
        } catch {
            // nessun Toast su questa pagina: fallimento silenzioso, insight resta quello precedente
        }
        setGenerating(false);
    };

    const getCount = (status: string) => stats.byStatus.find((s) => s.status === status)?._count ?? 0;

    return (
        <main className="max-w-5xl mx-auto p-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Statistiche</h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <StatCard label="Candidature totali" value={stats.total} />
                <StatCard
                    label="Match medio"
                    value={stats.averageMatch !== null ? `${Math.round(stats.averageMatch)}%` : "—"}
                />
                <StatCard label="In colloquio" value={getCount("colloquio")} variant="amber" />
                <StatCard label="Accettate" value={getCount("accettata")} variant="seal" />
            </div>

            <h2 className="font-semibold mb-3">Distribuzione per status</h2>
            <ul className="space-y-2">
                {stats.byStatus.map((s) => (
                    <li key={s.status} className="flex justify-between border-b border-foreground/10 pb-2">
                        <span className="capitalize">{s.status}</span>
                        <span className="font-mono text-foreground/60">{s._count}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-foreground/10">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold">Analisi AI</h2>
                    <Button onClick={handleGenerateInsight} disabled={generating} size="sm">
                        {generating ? "Analisi in corso..." : "Genera Analisi"}
                    </Button>
                </div>
                {insight ? (
                    <div className="bg-foreground/5 rounded p-4">
                        <p className="text-sm text-foreground">{insight.content}</p>
                        <p className="text-xs font-mono text-foreground/40 mt-3">
                            Generata il {new Date(insight.createdAt).toLocaleString("it-IT")}
                        </p>
                    </div>
                ) : (
                    <p className="text-foreground/60 text-sm">Nessuna analisi generata ancora.</p>
                )}
            </div>
        </main>
    );
}