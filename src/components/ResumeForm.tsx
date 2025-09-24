'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useResume, ResumeData } from '../contexts/ResumeContext';

interface FormStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedIn?: string;
  github?: string;
}

interface Experience {
  position: string;
  company: string;
  duration: string;
  description: string[];
}

interface Education {
  degree: string;
  institution: string;
  duration: string;
  gpa?: string;
}

export default function ResumeForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setResumeData } = useResume();
  const router = useRouter();

  // Form data
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedIn: '',
    github: ''
  });

  const [summary, setSummary] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([
    { position: '', company: '', duration: '', description: [''] }
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { degree: '', institution: '', duration: '', gpa: '' }
  ]);
  const [skills, setSkills] = useState<string[]>(['']);
  const [projects, setProjects] = useState<Array<{name: string; description: string; technologies: string[]}>>([]);
  const [certifications, setCertifications] = useState<Array<{name: string; issuer: string; date: string}>>([]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Clean and format the data
      const cleanExperiences = experiences
        .filter(exp => exp.position && exp.company)
        .map(exp => ({
          ...exp,
          description: exp.description.filter(desc => desc.trim())
        }));

      const cleanEducations = educations.filter(edu => edu.degree && edu.institution);
      const cleanSkills = skills.filter(skill => skill.trim());

      // Create resume data object
      const resumeData: ResumeData = {
        personalInfo: {
          name: personalInfo.name,
          email: personalInfo.email,
          phone: personalInfo.phone,
          address: personalInfo.address,
          linkedIn: personalInfo.linkedIn,
          github: personalInfo.github
        },
        summary,
        experience: cleanExperiences,
        education: cleanEducations,
        skills: cleanSkills,
        projects: projects.length > 0 ? projects : undefined,
        certifications: certifications.length > 0 ? certifications : undefined
      };

      // Set the resume data in context
      setResumeData(resumeData);

      // Navigate to editor after a brief delay
      setTimeout(() => {
        router.push('/editor');
      }, 1000);

    } catch (error) {
      console.error('Error creating resume:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [personalInfo, summary, experiences, educations, skills, projects, certifications, setResumeData, router]);

  // Step components
  const PersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={personalInfo.address}
            onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City, State"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={personalInfo.linkedIn}
            onChange={(e) => setPersonalInfo({ ...personalInfo, linkedIn: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Profile
          </label>
          <input
            type="url"
            value={personalInfo.github}
            onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/johndoe"
          />
        </div>
      </div>
    </div>
  );

  const SummaryStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Write a brief overview of your professional background, key skills, and career objectives. This should be 2-4 sentences.
        </p>
        <textarea
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Experienced software developer with 5+ years in full-stack development, specializing in React and Node.js. Passionate about creating efficient, scalable solutions and leading cross-functional teams to deliver high-quality products."
        />
      </div>
    </div>
  );

  const ExperienceStep = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Add your work experience, starting with your most recent position.
      </p>
      {experiences.map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">Experience #{index + 1}</h4>
            {experiences.length > 1 && (
              <button
                onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => {
                  const updated = [...experiences];
                  updated[index].position = e.target.value;
                  setExperiences(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => {
                  const updated = [...experiences];
                  updated[index].company = e.target.value;
                  setExperiences(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tech Corp"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => {
                const updated = [...experiences];
                updated[index].duration = e.target.value;
                setExperiences(updated);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jan 2022 - Present"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <p className="text-sm text-gray-500 mb-2">Add bullet points describing your achievements and responsibilities</p>
            {exp.description.map((desc, descIndex) => (
              <div key={descIndex} className="flex mb-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => {
                    const updated = [...experiences];
                    updated[index].description[descIndex] = e.target.value;
                    setExperiences(updated);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Developed and maintained web applications using React and Node.js"
                />
                {exp.description.length > 1 && (
                  <button
                    onClick={() => {
                      const updated = [...experiences];
                      updated[index].description = updated[index].description.filter((_, i) => i !== descIndex);
                      setExperiences(updated);
                    }}
                    className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...experiences];
                updated[index].description.push('');
                setExperiences(updated);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Description Point
            </button>
          </div>
        </div>
      ))}
      
      <button
        onClick={() => setExperiences([...experiences, { position: '', company: '', duration: '', description: [''] }])}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Add Another Experience
      </button>
    </div>
  );

  const EducationStep = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Add your educational background, starting with your most recent degree.
      </p>
      {educations.map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">Education #{index + 1}</h4>
            {educations.length > 1 && (
              <button
                onClick={() => setEducations(educations.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => {
                  const updated = [...educations];
                  updated[index].degree = e.target.value;
                  setEducations(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution *
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => {
                  const updated = [...educations];
                  updated[index].institution = e.target.value;
                  setEducations(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="University of Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={edu.duration}
                onChange={(e) => {
                  const updated = [...educations];
                  updated[index].duration = e.target.value;
                  setEducations(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2018 - 2022"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => {
                  const updated = [...educations];
                  updated[index].gpa = e.target.value;
                  setEducations(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3.8"
              />
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={() => setEducations([...educations, { degree: '', institution: '', duration: '', gpa: '' }])}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Add Another Education
      </button>
    </div>
  );

  const SkillsStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Add your technical and professional skills. Include both hard and soft skills relevant to your target position.
        </p>
        {skills.map((skill, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => {
                const updated = [...skills];
                updated[index] = e.target.value;
                setSkills(updated);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="JavaScript, React, Node.js, Problem Solving, etc."
            />
            {skills.length > 1 && (
              <button
                onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setSkills([...skills, ''])}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Skill
        </button>
      </div>
    </div>
  );

  const steps: FormStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Let&apos;s start with your contact details',
      component: <PersonalInfoStep />
    },
    {
      id: 'summary',
      title: 'Professional Summary',
      description: 'Tell us about your professional background',
      component: <SummaryStep />
    },
    {
      id: 'experience',
      title: 'Work Experience',
      description: 'Add your professional experience',
      component: <ExperienceStep />
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Include your educational background',
      component: <EducationStep />
    },
    {
      id: 'skills',
      title: 'Skills',
      description: 'List your technical and professional skills',
      component: <SkillsStep />
    }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return personalInfo.name && personalInfo.email && personalInfo.phone;
      case 1: // Summary
        return true; // Summary is optional
      case 2: // Experience
        return experiences.some(exp => exp.position && exp.company);
      case 3: // Education
        return educations.some(edu => edu.degree && edu.institution);
      case 4: // Skills
        return skills.some(skill => skill.trim());
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mt-1">{currentStepData.description}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        {currentStepData.component}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentStep === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </span>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`px-4 py-2 rounded-lg font-medium ${
              canProceed()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium flex items-center ${
              canProceed() && !isSubmitting
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Creating...
              </>
            ) : (
              'Create Resume'
            )}
          </button>
        )}
      </div>
    </div>
  );
}