"use client";

import type { Profile } from "@/lib/cv-types";

export default function CvView({ profile }: { profile: Profile }) {
  const hasExperience = profile.experience.length > 0;
  const hasEducation = profile.education.length > 0;
  const hasLanguages = profile.languages.length > 0;
  const hasSkills = profile.skills.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5">
        <h2 className="font-serif text-xl font-semibold">{profile.fullName || "Nome non impostato"}</h2>
        {profile.headline && <p className="text-foreground/70">{profile.headline}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-foreground/60 font-mono">
          {profile.location && <span>{profile.location}</span>}
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>{profile.phone}</span>}
          {profile.website && <span>{profile.website}</span>}
        </div>
      </section>

      {profile.summary && (
        <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5">
          <h2 className="font-semibold mb-2">Sommario</h2>
          <p className="text-foreground/80 whitespace-pre-wrap">{profile.summary}</p>
        </section>
      )}

      {hasSkills && (
        <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Competenze</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill} className="bg-accent/10 text-accent text-xs px-2.5 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {hasExperience && (
        <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="font-semibold">Esperienze lavorative</h2>
          {profile.experience.map((exp, i) => (
            <div key={i} className="border-l-2 border-accent/40 pl-4">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium">{exp.role} — {exp.company}</p>
                <p className="text-xs font-mono text-foreground/40">{exp.startDate} – {exp.endDate || "In corso"}</p>
              </div>
              {exp.description && <p className="text-sm text-foreground/70 mt-1 whitespace-pre-wrap">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasEducation && (
        <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="font-semibold">Istruzione</h2>
          {profile.education.map((edu, i) => (
            <div key={i} className="border-l-2 border-accent/40 pl-4">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium">{edu.degree}{edu.field ? ` in ${edu.field}` : ""} — {edu.institution}</p>
                <p className="text-xs font-mono text-foreground/40">{edu.startDate} – {edu.endDate || "In corso"}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {hasLanguages && (
        <section className="bg-foreground/3 border border-foreground/10 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Lingue</h2>
          <ul className="flex flex-col gap-1">
            {profile.languages.map((lang, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{lang.language}</span>
                <span className="text-foreground/60 font-mono">{lang.level}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!profile.fullName && !hasExperience && !hasEducation && (
        <p className="text-foreground/60 text-sm">Nessun dato ancora inserito.</p>
      )}
    </div>
  );
}