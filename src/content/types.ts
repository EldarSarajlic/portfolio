// Type definitions for the JSON content in this folder.
// The .json files are what the CMS edits; these interfaces keep the
// components type-safe when they import that content through ./index.ts.

export interface Social {
  github: string;
  githubUser: string;
  linkedin: string;
  linkedinLabel: string;
}

export interface Site {
  name: string;
  role: string;
  email: string;
  social: Social;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  date: string;
  logo: string;
  initials: string;
  website: string;
  bullets: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface ProjectStatus {
  label: string;
  /** "amber" | "mint" — controls the status pill colour. */
  tone: string;
}

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  highlights: string[];
  /** Either an external URL (https…) or an internal route ("/projects/…"). */
  href: string;
  status?: ProjectStatus;
}

export interface EducationItem {
  title: string;
  org: string;
  date: string;
  logo: string;
  logoAlt: string;
  courses: string[];
}

export interface Fact {
  label: string;
  value: string;
}
