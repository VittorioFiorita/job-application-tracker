"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/fetch-json";
import Button from "@/components/Button";

export default function ProfilePage() {
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchJson<{cvText: string} | null>("/api/profile");
        if (data?.cvText) {
          setCvText(data.cvText)
        }
      } catch {
        //nessun profilo caricato, il form resta vuoto
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchJson("/api/profile", {
        method:"POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({cvText})
      });
    } catch {
      //nessun Toast su questa pagina: salvataggio fallito senza feedback visivo
    }
    setSaving(false);
  };

  if (loading) {
    return <p className="max-w-5xl mx-auto p-8 text-foreground/60">Caricamento...</p>;
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">Il mio profilo</h1>
      <p className="text-foreground/60 mb-6">
        Incolla qui il testo del tuo CV. Verrà usato per valutare il match con le candidature.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-3"
      >
        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          rows={12}
          className="bg-foreground/5 border border-foreground/15 rounded-lg p-3 placeholder:text-foreground/40 focus:outline-none focus:border-accent"
          placeholder="Incolla qui il tuo CV..."
        />
        <Button type="submit" disabled={saving} className="self-start">
          {saving ? "Salvataggio..." : "Salva profilo"}
        </Button>
      </form>
    </main>
  );
}