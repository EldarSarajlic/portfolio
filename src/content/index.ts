// Single entry point for all editable site content.
// Components import from here; the CMS edits the .json files these read.
import siteJson from "./site.json";
import experienceJson from "./experience.json";
import skillsJson from "./skills.json";
import projectsJson from "./projects.json";
import educationJson from "./education.json";
import aboutJson from "./about.json";
import type {
  Site,
  ExperienceItem,
  SkillGroup,
  Project,
  EducationItem,
  Fact,
} from "./types";

export const site = siteJson as Site;
export const experience = experienceJson.items as ExperienceItem[];
export const skillsIntro = skillsJson.intro as string;
export const skillGroups = skillsJson.groups as SkillGroup[];
export const projects = projectsJson.items as Project[];
export const education = educationJson.items as EducationItem[];
export const aboutFacts = aboutJson.facts as Fact[];
