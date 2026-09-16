import { describe, it, expect } from "vitest";
import { formatProfileForPrompt } from "./format-profile";

describe("formatProfileForPrompt", () => {
  it("returns an empty string when there is no data at all", () => {
    const result = formatProfileForPrompt({
      cvText: null,
      fullName: null,
      headline: null,
      location: null,
      summary: null,
      skills: null,
      experience: null,
      education: null,
      languages: null,
    });

    expect(result).toBe("");
  });

  it("falls back to the legacy cvText when there is no structured data", () => {
    const result = formatProfileForPrompt({
      cvText: "CV di prova in testo libero",
      fullName: null,
      headline: null,
      location: null,
      summary: null,
      skills: null,
      experience: null,
      education: null,
      languages: null,
    });

    expect(result).toBe("CV di prova in testo libero");
  });

  it("builds a formatted summary from structured data, ignoring cvText when structured data exists", () => {
    const result = formatProfileForPrompt({
      cvText: "vecchio testo che non dovrebbe comparire",
      fullName: "Mario Rossi",
      headline: "Frontend Developer",
      location: "Milano",
      summary: "Sviluppatore con 3 anni di esperienza",
      skills: ["React", "TypeScript"],
      experience: [
        { company: "Acme", role: "Dev", startDate: "2022", endDate: "in corso", description: "Sviluppo frontend" },
      ],
      education: null,
      languages: null,
    });

    expect(result).toContain("Mario Rossi");
    expect(result).toContain("Frontend Developer");
    expect(result).toContain("React, TypeScript");
    expect(result).toContain("Acme");
    expect(result).not.toContain("vecchio testo che non dovrebbe comparire");
  });
});