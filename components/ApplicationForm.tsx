"use client";

import { useState } from "react";

type ApplicationFormProps = {
  onSubmit: (data: {
    companyName: string;
    position: string;
    jobDescription: string;
  }) => Promise<void>;
  onCancel: () => void;
};

export default function ApplicationForm({ onSubmit, onCancel }: ApplicationFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ companyName, position, jobDescription });
    setCompanyName("");
    setPosition("");
    setJobDescription("");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-gray-900 rounded-xl p-5 flex flex-col gap-3 mb-8">
      <input
        type="text"
        placeholder="Azienda"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Posizione"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
        required
      />
      <textarea
        placeholder="Job description (incolla qui l'annuncio)"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={4}
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Aggiungi
        </button>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-200 px-4 py-2">
          Annulla
        </button>
      </div>
    </form>
  );
}