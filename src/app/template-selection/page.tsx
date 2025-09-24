'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResume } from '../../contexts/ResumeContext';
import TemplateSelector from '../../components/TemplateSelector';

export default function TemplateSelectionPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('ats-clean');
  const { resumeData, setSelectedTemplate: setGlobalTemplate } = useResume();
  const router = useRouter();

  // Redirect to home if no resume data
  useEffect(() => {
    if (!resumeData) {
      router.push('/');
    }
  }, [resumeData, router]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleApplyTemplate = (templateId: string) => {
    // Store the selected template globally
    setGlobalTemplate?.(templateId);
    setSelectedTemplate(templateId);
    
    // Navigate to editor with the selected template
    router.push(`/editor?template=${templateId}`);
  };

  const goBackToUpload = () => {
    router.push('/');
  };

  if (!resumeData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose Your Resume Template</h1>
              <p className="mt-2 text-gray-600">
                Select a professional template for <span className="font-semibold">{resumeData.personalInfo.name}</span>'s resume
              </p>
            </div>
            <button
              onClick={goBackToUpload}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Upload
            </button>
          </div>
        </div>

        {/* Resume Data Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resume Preview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <p className="text-gray-600">{resumeData.personalInfo.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Experience:</span>
              <p className="text-gray-600">{resumeData.experience?.length || 0} positions</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Education:</span>
              <p className="text-gray-600">{resumeData.education?.length || 0} entries</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Skills:</span>
              <p className="text-gray-600">{resumeData.skills?.length || 0} skills</p>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-lg shadow-sm">
          <TemplateSelector
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onApplyTemplate={handleApplyTemplate}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={goBackToUpload}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Upload Different Resume
          </button>
          <button
            onClick={() => handleApplyTemplate(selectedTemplate)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Continue with {selectedTemplate === 'ats-clean' ? 'ATS Clean' : 'ATS Two-Column'} Template →
          </button>
        </div>
      </div>
    </main>
  );
}