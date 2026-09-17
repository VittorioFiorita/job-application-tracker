"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/fetch-json";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/layout/SectionHeader";
import CvForm from "@/components/profile/CvForm";
import CvView from "@/components/profile/CvView";
import type { Profile } from "@/lib/cv-types";
import { emptyProfile } from "@/lib/cv-types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "edit">("edit");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchJson<Partial<Profile> | null>("/api/profile");
        if (data) {
          const merged: Profile = {
            fullName: data.fullName ?? "",
            headline: data.headline ?? "",
            location: data.location ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            website: data.website ?? "",
            summary: data.summary ?? "",
            skills: data.skills ?? [],
            experience: data.experience ?? [],
            education: data.education ?? [],
            languages: data.languages ?? [],
          };
          setProfile(merged);
          const hasContent = Boolean(merged.fullName || merged.summary || merged.experience.length > 0);
          if (hasContent) {
            setMode("view");
          }
        }
      } catch {
        // nessun profilo salvato, resta in modalità modifica
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (updated: Profile) => {
    try {
      await fetchJson("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setProfile(updated);
      setMode("view");
    } catch {
      // nessun Toast su questa pagina: salvataggio fallito senza feedback visivo, come già discusso
    }
  };

  if (loading) {
    return <p className="max-w-5xl mx-auto p-6 text-foreground/60">Caricamento...</p>;
  }

  return (
    <>
      <SectionHeader title="Profilo">
        {mode === "view" && (
          <Button variant="ghost" onClick={() => setMode("edit")}>
            Modifica
          </Button>
        )}
      </SectionHeader>
      <main className="max-w-5xl mx-auto p-6">
        {mode === "edit" ? (
          <CvForm
            initialProfile={profile}
            onSave={handleSave}
            onCancel={profile.fullName ? () => setMode("view") : undefined}
          />
        ) : (
          <CvView profile={profile} />
        )}
      </main>
    </>
  );
}