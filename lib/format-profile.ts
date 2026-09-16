type ExperienceEntry = { company?: string; role?: string; startDate?: string; endDate?: string; description?: string };
type EducationEntry = { institution?: string; degree?: string; field?: string; startDate?: string; endDate?: string };
type LanguageEntry = { language?: string; level?: string };

type ProfileLike = {
  cvText: string | null;
  fullName: string | null;
  headline: string | null;
  location: string | null;
  summary: string | null;
  skills: unknown;
  experience: unknown;
  education: unknown;
  languages: unknown;
};

export function formatProfileForPrompt(profile: ProfileLike): string {
  const experience = Array.isArray(profile.experience) ? (profile.experience as ExperienceEntry[]) : [];
  const education = Array.isArray(profile.education) ? (profile.education as EducationEntry[]) : [];
  const skills = Array.isArray(profile.skills) ? (profile.skills as string[]) : [];
  const languages = Array.isArray(profile.languages) ? (profile.languages as LanguageEntry[]) : [];

  const hasStructuredData = Boolean(
    profile.fullName || profile.summary || experience.length > 0 || education.length > 0 || skills.length > 0
  );

  if (!hasStructuredData) {
    return profile.cvText?.trim() || "";
  }

  const parts: string[] = [];

  if (profile.fullName || profile.headline) {
    parts.push(`${profile.fullName ?? ""}${profile.headline ? ` — ${profile.headline}` : ""}`.trim());
  }
  if (profile.location) parts.push(`Località: ${profile.location}`);
  if (profile.summary) parts.push(`Sommario: ${profile.summary}`);
  if (skills.length > 0) parts.push(`Competenze: ${skills.join(", ")}`);

  if (experience.length > 0) {
    parts.push("Esperienze lavorative:");
    experience.forEach((exp) => {
      parts.push(`- ${exp.role ?? ""} @ ${exp.company ?? ""} (${exp.startDate ?? ""} - ${exp.endDate || "in corso"}): ${exp.description ?? ""}`);
    });
  }

  if (education.length > 0) {
    parts.push("Istruzione:");
    education.forEach((edu) => {
      parts.push(`- ${edu.degree ?? ""}${edu.field ? ` in ${edu.field}` : ""} @ ${edu.institution ?? ""} (${edu.startDate ?? ""} - ${edu.endDate ?? ""})`);
    });
  }

  if (languages.length > 0) {
    parts.push(`Lingue: ${languages.map((l) => `${l.language ?? ""} (${l.level ?? ""})`).join(", ")}`);
  }

  return parts.join("\n");
}