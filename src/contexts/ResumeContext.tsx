'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Re-export the unified ResumeData type from our types module
export interface ResumeData {
  // Basic fields (can come from AI parsing or API)
  _id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  highlights?: string;
  department?: string;
  college?: string;
  
  // Legacy personalInfo structure (for backward compatibility)
  personalInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedIn?: string;
    github?: string;
    professionalTitle?: string;
  };
  
  // Legacy structure (for backward compatibility)
  summary?: string;
  
  // Experience data (flexible structure)
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string[];
  }>;
  experiences?: Array<{
    _id?: string;
    id?: string;
    studentId?: string;
    companyName: string;
    designation: string;
    location?: string;
    employmentType?: string;
    modeOfWork?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    attachments?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  
  // Education data (flexible structure)
  education?: Array<{
    institution: string;
    degree: string;
    duration: string;
    gpa?: string;
  }>;
  
  // Skills data (flexible structure)
  skills?: string[] | Array<{
    _id?: string;
    id?: string;
    name: string;
    logo?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  
  // Projects data (flexible structure)
  projects?: Array<{
    _id?: string;
    id?: string;
    studentId?: string;
    title: string;
    attachmentUrl?: string;
    description: string;
    type?: string;
    role?: string;
    membersType?: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
    link?: string[];
    currentlyWorking?: boolean;
    createdAt?: string;
    updatedAt?: string;
    // Legacy fields
    name?: string;
    technologies?: string[];
  }>;
  
  // Certifications
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  
  // Achievements/Awards
  achievements?: Array<{
    title: string;
    description?: string;
    date?: string;
    issuer?: string;
  }>;
  
  // Languages
  languages?: Array<{
    name: string;
    proficiency: string; // e.g., "Native", "Fluent", "Conversational", "Basic"
  }>;
  
  // Hobbies and Interests
  hobbies?: string[];
  
  // Additional info structure
  additionalInfo?: {
    additional?: Array<{
      _id?: string;
      title: string;
      description: string;
      url: string;
    }>;
    activities?: Array<{
      _id?: string;
      title: string;
      description: string;
    }>;
  };
}

interface ResumeContextType {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData) => void;
  selectedTemplate: string | null;
  setSelectedTemplate: (template: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        selectedTemplate,
        setSelectedTemplate,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}