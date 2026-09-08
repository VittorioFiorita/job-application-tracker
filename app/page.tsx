"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ApplicationCard from "@/components/ApplicationCard";
import ApplicationForm from "@/components/ApplicationForm";
import Toast from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

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

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchingId, setMatchingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const { isSignedIn, isLoaded } = useUser();
  const [formOpen, setFormOpen] = useState(false);

  const loadApplications = async () => {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadApplications();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async (data: {
    companyName: string;
    position: string;
    jobDescription: string;
  }) => {
    await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    loadApplications();
    showToast("Candidatura aggiunta");
  };

  const handleMatch = async (id: number) => {
    setMatchingId(id);
    await fetch(`/api/applications/${id}/match`, { method: "POST" });
    setMatchingId(null);
    loadApplications();
    showToast("Match valutato");
  };

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadApplications();
    showToast("Status aggiornato");
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (deleteTargetId === null) return;
    await fetch(`/api/applications/${deleteTargetId}`, { method: "DELETE" });
    setDeleteTargetId(null);
    loadApplications();
    showToast("Candidatura eliminata");
  };

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <main className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Job Application Tracker</h1>
        <p className="text-gray-400 mb-6">
          Gestisci le tue candidature di lavoro e scopri quanto il tuo profilo
          combacia con ogni annuncio, grazie a un&apos;analisi automatica basata su AI.
        </p>
        <p className="text-gray-400">
          Accedi o registrati dal pulsante in alto per iniziare.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Le mie candidature</h1>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="self-start bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            + Nuova candidatura
          </button>
        )}
      </div>
      {formOpen && (
        <ApplicationForm onSubmit={handleCreate} onCancel={() => setFormOpen(false)} />
      )}

      {loading ? (
        <p className="text-gray-400">Caricamento...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-400">Nessuna candidatura ancora.</p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onStatusChange={handleStatusChange}
              onMatch={handleMatch}
              onDelete={handleDelete}
              isMatching={matchingId === app.id}
            />
          ))}
        </ul>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {deleteTargetId !== null && (
        <ConfirmModal
          message="Eliminare questa candidatura?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </main>
  );
}