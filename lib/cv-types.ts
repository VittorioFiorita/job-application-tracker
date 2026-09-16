export type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};

export type LanguageEntry = {
  language: string;
  level: string;
};

export type Profile = {
  fullName: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  languages: LanguageEntry[];
};

export const emptyProfile: Profile = {
  fullName: "",
  headline: "",
  location: "",
  email: "",
  phone: "",
  website: "",
  summary: "",
  skills: [],
  experience: [],
  education: [],
  languages: [],
};