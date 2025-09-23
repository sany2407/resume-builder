export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  location?: string;
  description: string[];
  achievements?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  graduationDate: string;
  gpa?: string;
  location?: string;
  relevantCourses?: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  github?: string;
}

export interface ResumeData {
  contactInfo: ContactInfo;
  summary?: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications?: Certification[];
  projects?: Project[];
  languages?: string[];
  awards?: string[];
}

export interface ParsedResumeResult {
  success: boolean;
  data?: ResumeData;
  error?: string;
  rawText?: string;
}