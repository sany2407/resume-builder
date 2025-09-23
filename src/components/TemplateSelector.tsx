'use client';

import React, { useState } from 'react';
import { atsTemplates, checkATSOptimization, type ATSTemplate } from '../utils/atsTemplates';
import { ResumeData } from '../contexts/ResumeContext';

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
              isSelected={selectedTemplate === template.id}
              onSelect={() => onTemplateSelect(template.id)}
              onApply={() => onApplyTemplate(template.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: ATSTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onApply: () => void;
}

function TemplateCard({ template, isSelected, onSelect, onApply }: TemplateCardProps) {
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
      <div className="aspect-[8.5/11] bg-white border border-gray-200 rounded mb-3 p-2 overflow-hidden">
        <div className="text-[6px] leading-tight">
          <div className="font-bold mb-1">John Doe</div>
          <div className="text-gray-600 mb-1">john.doe@email.com • (555) 123-4567</div>
          <div className="border-b border-gray-300 my-1"></div>
          <div className="font-semibold text-[5px] mb-1">PROFESSIONAL SUMMARY</div>
          <div className="h-2 bg-gray-200 rounded mb-1"></div>
          <div className="font-semibold text-[5px] mb-1">EXPERIENCE</div>
          <div className="space-y-1">
            <div className="h-1 bg-gray-300 rounded"></div>
            <div className="h-1 bg-gray-200 rounded"></div>
          </div>
        </div>
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
              onSelect();
            }}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSelected ? 'Selected' : 'Preview'}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}