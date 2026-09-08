"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data?.cvText) {
        setCvText(data.cvText);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText }),
    });
    setSaving(false);
  };

  if (loading) {
    return <p className="max-w-5xl mx-auto p-8 text-gray-400">Caricamento...</p>;
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">Il mio profilo</h1>
      <p className="text-gray-400 mb-6">
        Incolla qui il testo del tuo CV. Verrà usato per valutare il match con le candidature.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white/[0.02] border border-gray-900 rounded-xl p-5 flex flex-col gap-3"
      >
        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          rows={12}
          className="bg-gray-900 border border-gray-700 rounded-lg p-3"
          placeholder="Incolla qui il tuo CV..."
        />
        <button
          type="submit"
          disabled={saving}
          className="self-start bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Salvataggio..." : "Salva profilo"}
        </button>
      </form>
    </main>
  );
}