"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export type ApplicationFormData = {
  companyName: string;
  position: string;
  jobDescription: string;
  jobUrl: string;
  location: string;
  employmentType: string;
  seniority: string;
  salaryRange: string;
  source: string;
  notes: string;
};

type ApplicationFormProps = {
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  onCancel: () => void;
};

const inputClass =
  "bg-foreground/5 border border-foreground/15 rounded-lg px-3 py-2 placeholder:text-foreground/40 focus:outline-none focus:border-accent w-full";

const emptyForm: ApplicationFormData = {
  companyName: "",
  position: "",
  jobDescription: "",
  jobUrl: "",
  location: "",
  employmentType: "",
  seniority: "",
  salaryRange: "",
  source: "",
  notes: "",
};

export default function ApplicationForm({ onSubmit, onCancel }: ApplicationFormProps) {
  const [form, setForm] = useState<ApplicationFormData>(emptyForm);
  const [showDetails, setShowDetails] = useState(false);

  const update = <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    setForm(emptyForm);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-3 mb-8">
      <input className={inputClass} type="text" placeholder="Azienda" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} required />
      <input className={inputClass} type="text" placeholder="Posizione" value={form.position} onChange={(e) => update("position", e.target.value)} required />
      <textarea className={inputClass} placeholder="Job description (incolla qui l'annuncio)" value={form.jobDescription} onChange={(e) => update("jobDescription", e.target.value)} rows={4} required />

      {showDetails && (
        <div className="flex flex-col gap-3 pt-2 border-t border-foreground/10">
          <input className={inputClass} type="url" placeholder="URL annuncio" value={form.jobUrl} onChange={(e) => update("jobUrl", e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className={inputClass} placeholder="Località (es. Milano, Remoto)" value={form.location} onChange={(e) => update("location", e.target.value)} />
            <select className={`${inputClass} text-foreground`} value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)}>
              <option value="" className="bg-background text-foreground">Tipo di contratto</option>
              <option value="full-time" className="bg-background text-foreground">Full-time</option>
              <option value="part-time" className="bg-background text-foreground">Part-time</option>
              <option value="stage" className="bg-background text-foreground">Stage/Tirocinio</option>
              <option value="apprendistato" className="bg-background text-foreground">Apprendistato</option>
              <option value="freelance" className="bg-background text-foreground">Freelance/Contratto</option>
            </select>
            <select className={`${inputClass} text-foreground`} value={form.seniority} onChange={(e) => update("seniority", e.target.value)}>
              <option value="" className="bg-background text-foreground">Livello di seniority</option>
              <option value="stage" className="bg-background text-foreground">Stage</option>
              <option value="junior" className="bg-background text-foreground">Junior</option>
              <option value="mid" className="bg-background text-foreground">Mid</option>
              <option value="senior" className="bg-background text-foreground">Senior</option>
              <option value="lead" className="bg-background text-foreground">Lead/Manager</option>
            </select>
            <input className={inputClass} placeholder="Range salariale (es. 30-35k)" value={form.salaryRange} onChange={(e) => update("salaryRange", e.target.value)} />
            <input className={inputClass} placeholder="Fonte (es. LinkedIn, referral)" value={form.source} onChange={(e) => update("source", e.target.value)} />
          </div>
          <textarea className={inputClass} placeholder="Note personali" value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} />
        </div>
      )}

      <Button type="button" variant="ghost" size="sm" onClick={() => setShowDetails((v) => !v)} className="self-start">
        {showDetails ? "− Nascondi altri dettagli" : "+ Aggiungi altri dettagli"}
      </Button>

      <div className="flex gap-2">
        <Button type="submit">Aggiungi</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Annulla</Button>
      </div>
    </form>
  );
}