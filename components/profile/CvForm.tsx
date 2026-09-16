"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { Profile, Experience, Education, LanguageEntry } from "@/lib/cv-types";

type CvFormProps = {
  initialProfile: Profile;
  onSave: (profile: Profile) => Promise<void>;
  onCancel?: () => void;
};

const inputClass =
  "bg-foreground/5 border border-foreground/15 rounded-lg px-3 py-2 placeholder:text-foreground/40 focus:outline-none focus:border-accent w-full";

export default function CvForm({ initialProfile, onSave, onCancel }: CvFormProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !profile.skills.includes(value)) {
      update("skills", [...profile.skills, value]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    update("skills", profile.skills.filter((s) => s !== skill));
  };

  const addExperience = () => {
    update("experience", [
      ...profile.experience,
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const next = [...profile.experience];
    next[index] = { ...next[index], [field]: value };
    update("experience", next);
  };

  const removeExperience = (index: number) => {
    update("experience", profile.experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    update("education", [
      ...profile.education,
      { institution: "", degree: "", field: "", startDate: "", endDate: "" },
    ]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const next = [...profile.education];
    next[index] = { ...next[index], [field]: value };
    update("education", next);
  };

  const removeEducation = (index: number) => {
    update("education", profile.education.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    update("languages", [...profile.languages, { language: "", level: "" }]);
  };

  const updateLanguage = (index: number, field: keyof LanguageEntry, value: string) => {
    const next = [...profile.languages];
    next[index] = { ...next[index], [field]: value };
    update("languages", next);
  };

  const removeLanguage = (index: number) => {
    update("languages", profile.languages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(profile);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-3">
        <h2 className="font-semibold">Intestazione</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Nome e cognome" value={profile.fullName} onChange={(e) => update("fullName", e.target.value)} />
          <input className={inputClass} placeholder="Titolo professionale (es. Frontend Developer)" value={profile.headline} onChange={(e) => update("headline", e.target.value)} />
          <input className={inputClass} placeholder="Località" value={profile.location} onChange={(e) => update("location", e.target.value)} />
          <input className={inputClass} type="email" placeholder="Email" value={profile.email} onChange={(e) => update("email", e.target.value)} />
          <input className={inputClass} placeholder="Telefono" value={profile.phone} onChange={(e) => update("phone", e.target.value)} />
          <input className={inputClass} placeholder="LinkedIn / portfolio (URL)" value={profile.website} onChange={(e) => update("website", e.target.value)} />
        </div>
      </section>

      <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-3">
        <h2 className="font-semibold">Sommario</h2>
        <textarea className={inputClass} rows={4} placeholder="Breve presentazione professionale..." value={profile.summary} onChange={(e) => update("summary", e.target.value)} />
      </section>

      <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-3">
        <h2 className="font-semibold">Competenze</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span key={skill} className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs px-2.5 py-1 rounded-full">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} aria-label={`Rimuovi ${skill}`} className="hover:opacity-70">✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Aggiungi una competenza e premi Invio"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" variant="ghost" onClick={addSkill}>Aggiungi</Button>
        </div>
      </section>

      <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-4">
        <h2 className="font-semibold">Esperienze lavorative</h2>
        {profile.experience.map((exp, i) => (
          <div key={i} className="border border-foreground/10 rounded-lg p-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className={inputClass} placeholder="Azienda" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
              <input className={inputClass} placeholder="Ruolo" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} />
              <input className={inputClass} placeholder="Data inizio (es. Gen 2022)" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} />
              <input className={inputClass} placeholder="Data fine (o 'In corso')" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} />
            </div>
            <textarea className={inputClass} rows={3} placeholder="Descrizione" value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
            <Button type="button" variant="danger-ghost" size="sm" onClick={() => removeExperience(i)} className="self-end">Rimuovi esperienza</Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addExperience} className="self-start">+ Aggiungi esperienza</Button>
      </section>

      <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-4">
        <h2 className="font-semibold">Istruzione</h2>
        {profile.education.map((edu, i) => (
          <div key={i} className="border border-foreground/10 rounded-lg p-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className={inputClass} placeholder="Istituto" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
              <input className={inputClass} placeholder="Titolo di studio" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
              <input className={inputClass} placeholder="Ambito di studio" value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} />
              <div className="flex gap-2">
                <input className={inputClass} placeholder="Inizio" value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} />
                <input className={inputClass} placeholder="Fine" value={edu.endDate} onChange={(e) => updateEducation(i, "endDate", e.target.value)} />
              </div>
            </div>
            <Button type="button" variant="danger-ghost" size="sm" onClick={() => removeEducation(i)} className="self-end">Rimuovi istruzione</Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addEducation} className="self-start">+ Aggiungi istruzione</Button>
      </section>

      <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-4">
        <h2 className="font-semibold">Lingue</h2>
        {profile.languages.map((lang, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input className={inputClass} placeholder="Lingua" value={lang.language} onChange={(e) => updateLanguage(i, "language", e.target.value)} />
            <input className={inputClass} placeholder="Livello (es. B2, madrelingua)" value={lang.level} onChange={(e) => updateLanguage(i, "level", e.target.value)} />
            <Button type="button" variant="danger-ghost" size="sm" onClick={() => removeLanguage(i)}>Rimuovi</Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addLanguage} className="self-start">+ Aggiungi lingua</Button>
      </section>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Salvataggio..." : "Salva profilo"}</Button>
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Annulla</Button>}
      </div>
    </form>
  );
}