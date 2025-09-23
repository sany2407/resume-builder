'use client';

import React from 'react';
import ResumeUpload from '../components/ResumeUpload';
import Link from 'next/link';
import { useResume } from '../contexts/ResumeContext';

export default function HomePage() {
  const { resumeData } = useResume();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            AI-Powered ATS-Friendly Resume Builder
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your existing resume and let our AI transform it into a beautiful, 
            ATS-optimized document that passes through applicant tracking systems.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ATS-Optimized Templates
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!resumeData ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
                Get Started
              </h2>
              <ResumeUpload />
              
              {/* Features */}
              <div className="mt-12 grid md:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">AI-Powered Parsing</h3>
                  <p className="text-sm text-gray-600">Advanced AI extracts and structures your resume content automatically.</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">ATS-Optimized</h3>
                  <p className="text-sm text-gray-600">Templates designed to pass through applicant tracking systems.</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Visual Editor</h3>
                  <p className="text-sm text-gray-600">Customize your resume with our powerful GrapeJS editor.</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Export Ready</h3>
                  <p className="text-sm text-gray-600">Download your resume as PDF or HTML for any application.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Resume Loaded State */
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Resume Successfully Processed!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Your resume has been parsed and is ready for editing with ATS-friendly templates. 
                You can now customize it in our visual editor.
              </p>
              
              <div className="space-y-3">
                <Link 
                  href="/editor"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Open in Editor
                </Link>
                
                <div className="text-sm text-gray-500">
                  or{' '}
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    upload a different resume
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Powered by AI • Your data is processed securely and not stored
          </p>
        </div>
      </div>
    </div>
  );
}
