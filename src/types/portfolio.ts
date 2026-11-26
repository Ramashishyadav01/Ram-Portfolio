export interface SkillItem {
  _id: string;
  category: string;
  name: string;
  level?: string;
  order: number;
}

export interface AboutData {
  title?: string;
  subtitle?: string;
  description?: string[];
  highlights?: Array<{ icon: string; title: string; desc: string }>;
  stats?: Array<{ value: string; label: string }>;
}

export interface EducationData {
  degree: string;
  major: string;
  institution: string;
  duration: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface ExperienceData {
  _id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
  order: number;
}

export interface ProjectData {
  _id: string;
  title: string;
  description: string[];
  tech: string[];
  image: string;
  github: string;
  demo: string;
  status: string;
  order: number;
}

export interface ContactData {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  additionalLinks?: Array<{ label: string; url: string }>;
}

export interface ResumeData {
  url?: string;
  originalName?: string;
  uploadedAt?: string;
  fileSize?: number;
  fileType?: string;
}

export interface PortfolioData {
  about: AboutData | null;
  skills: SkillItem[] | null;
  experience?: ExperienceData[] | null;
  education?: EducationData | null;
  projects: ProjectData[] | null;
  contact: ContactData | null;
  resume: ResumeData | null;
}
