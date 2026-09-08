"use client"

import { useEffect, useState } from "react"
import StatCard from "@/components/StatCard";

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
            const res = await fetch("/api/stats");
            const data = await res.json();
            setStats(data);
            setLoading(false);

            const insightRes = await fetch("/api/insights");
            const insightData = await insightRes.json();
            setInsight(insightData);
        };
        loadStats();
    }, []);

    if (loading) {
        return <p className="p-8 text-gray-500">Caricamento...</p>;
    }

    if (!stats) {
        return <p className="p-8 text-gray-500">Impossibile caricare le statistiche</p>;
    }

    const handleGenerateInsight = async () => {
        setGenerating(true);
        const res = await fetch("/api/insights", { method: "POST" });
        const data = await res.json();
        setInsight(data);
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
                <StatCard label="In colloquio" value={getCount("colloquio")} variant="accent" />
                <StatCard label="Accettate" value={getCount("accettata")} variant="success" />
            </div>

            <h2 className="font-semibold mb-3">Distribuzione per status</h2>
            <ul className="space-y-2">
                {stats.byStatus.map((s) => (
                    <li key={s.status} className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="capitalize">{s.status}</span>
                        <span className="text-gray-400">{s._count}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold">Analisi AI</h2>
                    <button
                        onClick={handleGenerateInsight}
                        disabled={generating}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {generating ? "Analisi in corso..." : "Genera Analisi"}
                    </button>
                </div>
                {insight ? (
                    <div className="bg-gray-800 rounded p-4">
                        <p className="text-sm text-gray-200">{insight.content}</p>
                        <p className="text-xs text-gray-500 mt-3">
                            Generata il {new Date(insight.createdAt).toLocaleString("it-IT")}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">Nessuna analisi generata ancora.</p>
                )}
            </div>
        </main>
    );
}