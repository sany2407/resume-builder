'use client';

import React, { useState, useMemo } from 'react';
import { atsTemplates, checkATSOptimization, type ATSTemplate } from '../utils/atsTemplates';
import { ResumeData, useResume } from '../contexts/ResumeContext';
import { 
  getFormattedContact, 
  getFormattedProjects, 
  getFormattedExperiences, 
  getFormattedEducation, 
  getFormattedSkills 
} from '../utils/dataTransformers';

interface TemplateSelectorProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onApplyTemplate: (templateId: string) => void;
}

export default function TemplateSelector({ 
  resumeData, 
  selectedTemplate, 
  onTemplateSelect, 
  onApplyTemplate 
}: TemplateSelectorProps) {
  const [showATSCheck, setShowATSCheck] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  
  const atsCheck = checkATSOptimization(resumeData);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Resume Templates</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Choose an ATS-friendly template</p>
          <button
            onClick={() => setShowATSCheck(!showATSCheck)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              atsCheck.passed 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}
          >
            ATS Score: {atsCheck.passed ? 'Optimized ✓' : 'Needs Work'}
          </button>
        </div>
      </div>

      {/* ATS Optimization Panel */}
      {showATSCheck && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              ATS Optimization {atsCheck.passed ? 'Passed' : 'Failed'}
            </h4>
            {atsCheck.tips.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-600 mb-2">Recommendations:</p>
                {atsCheck.tips.map((tip, index) => (
                  <div key={index} className="flex items-start text-xs text-gray-700">
                    <span className="inline-block w-4 h-4 rounded-full bg-yellow-400 text-white text-center leading-4 mr-2 text-[10px] font-bold">
                      !
                    </span>
                    {tip}
                  </div>
                ))}
              </div>
            )}
            {atsCheck.passed && (
              <div className="flex items-center text-xs text-green-700">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your resume is optimized for ATS systems!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {atsTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              resumeData={resumeData}
              isSelected={selectedTemplate === template.id}
              onSelect={() => onTemplateSelect(template.id)}
              onApply={() => onApplyTemplate(template.id)}
              onPreview={() => setPreviewTemplate(template.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {atsTemplates.find(t => t.id === previewTemplate)?.name} - Full Preview
              </h3>
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="bg-white shadow-lg mx-auto" style={{ width: '8.5in', minHeight: '11in', transform: 'scale(0.6)', transformOrigin: 'top center' }}>
                <div 
                  className="w-full h-full p-8 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: atsTemplates.find(t => t.id === previewTemplate)?.generateHTML(resumeData) || ''
                  }}
                />
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => {
                    onTemplateSelect(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
                >
                  Select This Template
                </button>
                <button
                  onClick={() => {
                    onApplyTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Preview Content Component with real data
interface PreviewContentProps {
  template: ATSTemplate;
  isSelected: boolean;
}

function PreviewContent({ template, isSelected }: PreviewContentProps) {
  // Get the current resume data from the parent context
  const { resumeData } = useResume();
  
  if (!resumeData) {
    return <div className="text-[6px] text-gray-400 text-center mt-8">No resume data</div>;
  }

  const contact = getFormattedContact(resumeData);
  const projects = getFormattedProjects(resumeData);
  const experiences = getFormattedExperiences(resumeData);
  const education = getFormattedEducation(resumeData);
  const skills = getFormattedSkills(resumeData);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const truncateText = (text: string | undefined | null, maxLength: number) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (template.id === 'ats-clean') {
    return (
      <div className="text-[6px] leading-tight overflow-hidden">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="font-bold text-[7px] text-black">{contact.name || 'Name'}</div>
          {contact.professionalTitle && (
            <div className="text-[6px] text-blue-600 font-medium mt-0.5">
              {truncateText(contact.professionalTitle, 35)}
            </div>
          )}
          <div className="text-[5px] text-gray-600 mt-0.5">
            {contact.email || 'email@example.com'} • {contact.phone || 'Phone'}
            {contact.location && ` • ${truncateText(contact.location, 20)}`}
          </div>
          {(contact.linkedin || contact.portfolio) && (
            <div className="text-[5px] text-gray-600 mt-0.5">
              {contact.linkedin && truncateText(contact.linkedin, 30)}
              {contact.portfolio && contact.linkedin && ' • '}
              {contact.portfolio && truncateText(contact.portfolio, 30)}
            </div>
          )}
        </div>

        {/* Summary */}
        {(resumeData.bio || resumeData.highlights) && (
          <div className="mb-2">
            <div className="font-semibold text-[5px] mb-0.5 border-b border-gray-300 text-black uppercase">Professional Summary</div>
            <div className="text-[5px] text-gray-700">
              {truncateText(resumeData.bio || resumeData.highlights || '', 120)}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-[5px] mb-0.5 border-b border-gray-300 text-black uppercase">Professional Experience</div>
            {experiences.slice(0, 2).map((exp, index) => {
              return (
                <div key={index} className="mb-1">
                  <div className="font-semibold text-[5px] text-black">{truncateText(exp.position || 'Position', 25)}</div>
                  <div className="text-[5px] text-gray-600">{truncateText(exp.company || 'Company', 25)}</div>
                  <div className="text-[4px] text-gray-500">{exp.duration}</div>
                  {exp.description && exp.description.length > 0 && (
                    <div className="text-[4px] text-gray-700 mt-0.5">
                      {truncateText(exp.description[0], 80)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-[5px] mb-0.5 border-b border-gray-300 text-black uppercase">Education</div>
            {education.slice(0, 1).map((edu, index) => {
              return (
                <div key={index} className="mb-1">
                  <div className="font-semibold text-[5px] text-black">{truncateText(edu.degree || 'Degree', 30)}</div>
                  <div className="text-[5px] text-gray-600">{truncateText(edu.institution || 'Institution', 25)}</div>
                  {edu.gpa && (
                    <div className="text-[4px] text-gray-500">{edu.gpa}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-1">
            <div className="font-semibold text-[5px] mb-0.5 border-b border-gray-300 text-black uppercase">Technical Skills</div>
            <div className="text-[4px] text-gray-700">
              {skills.slice(0, 8).join(', ')}
              {skills.length > 8 && '...'}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-1">
            <div className="font-semibold text-[5px] mb-0.5 border-b border-gray-300 text-black uppercase">Projects</div>
            {projects.slice(0, 1).map((project, index) => (
              <div key={index}>
                <div className="font-semibold text-[5px] text-black">{truncateText(project.title || 'Project', 20)}</div>
                <div className="text-[4px] text-gray-700">{truncateText(project.description || 'Project description', 60)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Two-Column Template Preview
  if (template.id === 'ats-two-column') {
    return (
      <div className="text-[6px] leading-tight overflow-hidden">
        {/* Header */}
        <div className="text-center mb-2 bg-gray-50 p-1 rounded">
          <div className="font-bold text-[7px] text-blue-800">{contact.name || 'Name'}</div>
          {contact.professionalTitle && (
            <div className="text-[6px] text-blue-600 font-medium mt-0.5">
              {truncateText(contact.professionalTitle, 35)}
            </div>
          )}
          <div className="text-[5px] text-gray-600 mt-0.5">
            {[contact.email || 'email@example.com', contact.phone || 'Phone', contact.location].filter(Boolean).slice(0, 2).join(' • ')}
          </div>
        </div>

        <div className="flex gap-1 h-full">
          {/* Main Column */}
          <div className="flex-[2]">
            {/* Summary */}
            {(resumeData.bio || resumeData.highlights) && (
              <div className="mb-2">
                <div className="font-semibold text-[5px] mb-0.5 text-blue-700 border-b border-blue-300 uppercase">Summary</div>
                <div className="text-[5px] text-gray-700">
                  {truncateText(resumeData.bio || resumeData.highlights || '', 100)}
                </div>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <div className="mb-2">
                <div className="font-semibold text-[5px] mb-0.5 text-blue-700 border-b border-blue-300 uppercase">Experience</div>
                {experiences.slice(0, 2).map((exp, index) => {
                  return (
                    <div key={index} className="mb-1">
                      <div className="font-semibold text-[5px] text-blue-700">{truncateText(exp.position || 'Position', 20)}</div>
                      <div className="text-[5px] text-gray-600">{truncateText(exp.company || 'Company', 20)}</div>
                      <div className="text-[4px] text-gray-500 italic">{exp.duration}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex-1 bg-gray-50 p-1 rounded">
            {/* Education */}
            {education.length > 0 && (
              <div className="mb-2">
                <div className="font-semibold text-[5px] mb-0.5 text-blue-700 border-b border-blue-200 uppercase">Education</div>
                {education.slice(0, 1).map((edu, index) => {
                  return (
                    <div key={index} className="mb-1">
                      <div className="font-semibold text-[4px] text-blue-600">{truncateText(edu.degree || 'Degree', 15)}</div>
                      <div className="text-[4px] text-gray-600">{truncateText(edu.institution || 'Institution', 15)}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-1">
                <div className="font-semibold text-[5px] mb-0.5 text-blue-700 border-b border-blue-200 uppercase">Skills</div>
                <div className="flex flex-wrap gap-0.5">
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="text-[4px] bg-gray-100 px-1 py-0.5 rounded mr-1">
                {truncateText(skill || 'Skill', 10)}
              </span>
            ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <div className="font-semibold text-[5px] mb-0.5 text-blue-700 border-b border-blue-200 uppercase">Projects</div>
                {projects.slice(0, 2).map((project, index) => (
                  <div key={index} className="mb-1">
                    <div className="font-semibold text-[4px] text-blue-600">{truncateText(project.title || 'Project', 15)}</div>
                    <div className="text-[3px] text-gray-600">{truncateText(project.role || 'Role', 12)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Modern Template Preview
  if (template.id === 'ats-modern') {
    return (
      <div className="text-[6px] leading-tight  overflow-hidden">
        {/* Header */}
        <div className="text-center mb-2 pb-1 border-b-2 border-gray-200">
          <div className="font-bold text-[8px] text-gray-800">{contact.name || 'Name'}</div>
          {contact.professionalTitle && (
            <div className="text-[6px] text-gray-600 font-medium mt-0.5 italic">
              {truncateText(contact.professionalTitle, 35)}
            </div>
          )}
          <div className="text-[5px] text-gray-500 mt-0.5">
            {contact.email || 'email@example.com'} • {contact.phone || 'Phone'}
          </div>
        </div>

        {/* Summary */}
        {(resumeData.bio || resumeData.highlights) && (
          <div className="mb-2">
            <div className="font-semibold text-[5px] mb-0.5 text-gray-800 uppercase pl-1 border-l-2 border-blue-400">Summary</div>
            <div className="text-[5px] text-gray-600">
              {truncateText(resumeData.bio || resumeData.highlights || '', 100)}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-[5px] mb-0.5 text-gray-800 uppercase pl-1 border-l-2 border-blue-400">Experience</div>
            {experiences.slice(0, 2).map((exp, index) => {
              return (
                <div key={index} className="mb-1 pl-2 border-l border-gray-200">
                  <div className="font-semibold text-[5px] text-gray-800">{truncateText(exp.position || 'Position', 25)}</div>
                  <div className="text-[5px] text-blue-600">{truncateText(exp.company || 'Company', 25)}</div>
                  <div className="text-[4px] text-gray-500 italic">{exp.duration}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-1">
            <div className="font-semibold text-[5px] mb-0.5 text-gray-800 uppercase pl-1 border-l-2 border-blue-400">Skills</div>
            <div className="flex flex-wrap gap-0.5">
              {skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="text-[4px] bg-gray-100 text-gray-800 px-1 py-0.5 rounded">
                  {truncateText(skill || 'Skill', 8)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Minimal Template Preview
  if (template.id === 'ats-minimal') {
    return (
      <div className="text-[6px] leading-tight  overflow-hidden">
        {/* Header */}
        <div className="text-left mb-2">
          <div className="font-bold text-[7px] text-black">{contact.name || 'Name'}</div>
          {contact.professionalTitle && (
            <div className="text-[6px] text-black mt-0.5">
              {truncateText(contact.professionalTitle, 35)}
            </div>
          )}
          <div className="text-[5px] text-black mt-0.5">
            {contact.email || 'email@example.com'}
          </div>
          <div className="text-[5px] text-black">
            {contact.phone || 'Phone'}
          </div>
        </div>

        {/* Summary */}
        {(resumeData.bio || resumeData.highlights) && (
          <div className="mb-2">
            <div className="font-bold text-[5px] mb-0.5 text-black uppercase">PROFESSIONAL SUMMARY</div>
            <div className="text-[5px] text-black">
              {truncateText(resumeData.bio || resumeData.highlights || '', 120)}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-2">
            <div className="font-bold text-[5px] mb-0.5 text-black uppercase">PROFESSIONAL EXPERIENCE</div>
            {experiences.slice(0, 1).map((exp, index) => {
              return (
                <div key={index} className="mb-1">
                  <div className="font-bold text-[5px] text-black">{truncateText(exp.position || 'Position', 25)}</div>
                  <div className="text-[5px] text-black">{truncateText(exp.company || 'Company', 25)}</div>
                  <div className="text-[4px] text-black">{exp.duration}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-1">
            <div className="font-bold text-[5px] mb-0.5 text-black uppercase">TECHNICAL SKILLS</div>
            <div className="text-[4px] text-black">
              {skills.slice(0, 6).join(' • ')}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Professional Template Preview
  if (template.id === 'ats-professional') {
    return (
      <div className="text-[6px] leading-tight  overflow-hidden">
        {/* Header */}
        <div className="text-center mb-2 pb-1 border-b-2 border-black">
          <div className="font-bold text-[7px] text-black uppercase tracking-wide">{contact.name || 'NAME'}</div>
          {contact.professionalTitle && (
            <div className="text-[6px] text-black mt-0.5 italic">
              {truncateText(contact.professionalTitle, 35)}
            </div>
          )}
          <div className="text-[5px] text-black mt-0.5">
            {contact.email || 'email@example.com'}
          </div>
          <div className="text-[5px] text-black">
            {contact.phone || 'Phone'}
          </div>
        </div>

        {/* Summary */}
        {(resumeData.bio || resumeData.highlights) && (
          <div className="mb-2">
            <div className="font-bold text-[5px] mb-0.5 text-black uppercase border-b border-black pb-0.5">Professional Summary</div>
            <div className="text-[5px] text-black text-justify">
              {truncateText(resumeData.bio || resumeData.highlights || '', 100)}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-2">
            <div className="font-bold text-[5px] mb-0.5 text-black uppercase border-b border-black pb-0.5">Professional Experience</div>
            {experiences.slice(0, 1).map((exp, index) => {
              return (
                <div key={index} className="mb-1">
                  <div className="flex justify-between">
                    <div className="font-bold text-[5px] text-black">{truncateText(exp.position || 'Position', 20)}</div>
                    <div className="text-[4px] text-black">{exp.duration}</div>
                  </div>
                  <div className="text-[5px] text-black italic">{truncateText(exp.company || 'Company', 25)}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-1">
            <div className="font-bold text-[5px] mb-0.5 text-black uppercase border-b border-black pb-0.5">Technical Skills</div>
            <div className="text-[4px] text-black">
              {skills.slice(0, 6).join(' • ')}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Executive Template Preview
  if (template.id === 'ats-executive') {
    return (
      <div className="text-[6px] leading-tight  overflow-hidden">
        {/* Header */}
        <div className="text-center mb-2 pb-2 border-b-2 border-gray-400">
          <div className="font-bold text-[8px] text-gray-800">{contact.name || 'Name'}</div>
          {contact.professionalTitle && (
            <div className="text-[6px] text-gray-600 font-medium mt-0.5 italic capitalize">
              {truncateText(contact.professionalTitle, 35)}
            </div>
          )}
          <div className="text-[5px] text-gray-500 mt-1">
            ✉ {contact.email || 'email@example.com'}
          </div>
          <div className="text-[5px] text-gray-500">
            ☎ {contact.phone || 'Phone'}
          </div>
        </div>

        {/* Executive Summary */}
        {(resumeData.bio || resumeData.highlights) && (
          <div className="mb-2">
            <div className="font-semibold text-[5px] mb-0.5 text-gray-800 uppercase border-b border-gray-300 pb-0.5 relative">
              Executive Summary
              <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-gray-600"></div>
            </div>
            <div className="text-[5px] text-gray-700 italic border-l-2 border-gray-200 pl-2 ml-1">
              {truncateText(resumeData.bio || resumeData.highlights || '', 90)}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-[5px] mb-0.5 text-gray-800 uppercase border-b border-gray-300 pb-0.5 relative">
              Executive Experience
              <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-gray-600"></div>
            </div>
            {experiences.slice(0, 1).map((exp, index) => {
              return (
                <div key={index} className="mb-1 pb-1 border-b border-gray-100">
                  <div className="flex justify-between">
                    <div className="font-semibold text-[5px] text-gray-800">{truncateText(exp.position || 'Position', 18)}</div>
                    <div className="text-[4px] text-gray-500 bg-gray-50 px-1 rounded">{exp.duration}</div>
                  </div>
                  <div className="text-[5px] text-gray-600 font-medium">{truncateText(exp.company || 'Company', 25)}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-1">
            <div className="font-semibold text-[5px] mb-0.5 text-gray-800 uppercase border-b border-gray-300 pb-0.5 relative">
              Core Competencies
              <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-gray-600"></div>
            </div>
            <div className="flex flex-wrap gap-0.5">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="text-[4px] bg-gray-50 text-gray-800 px-1 py-0.5 rounded border border-gray-200">
                  {truncateText(skill || 'Skill', 8)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default fallback
  return (
    <div className="text-[6px] text-gray-400 text-center mt-8">
      Template preview not available
    </div>
  );
}

interface TemplateCardProps {
  template: ATSTemplate;
  resumeData: ResumeData;
  isSelected: boolean;
  onSelect: () => void;
  onApply: () => void;
  onPreview: () => void;
}

function TemplateCard({ template, resumeData, isSelected, onSelect, onApply, onPreview }: TemplateCardProps) {
  const getCategoryColor = (category: ATSTemplate['category']) => {
    switch (category) {
      case 'ats-optimized':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'professional':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'creative':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Template Preview */}
      <div className="h-40 bg-white border border-gray-200 rounded mb-3 p-2 overflow-hidden">
        <PreviewContent template={template} isSelected={isSelected} />
      </div>

      {/* Template Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-gray-800">{template.name}</h4>
          <span 
            className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(template.category)}`}
          >
            {template.category === 'ats-optimized' ? 'ATS' : 
             template.category === 'professional' ? 'Pro' : 'Creative'}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 leading-relaxed">
          {template.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
         
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="flex-1 px-2 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            🔍 Full Preview
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}