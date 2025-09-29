'use client';

import React, { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import Link from 'next/link';
import { useResume } from '../contexts/ResumeContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { resumeData, setResumeData, isLoading, setIsLoading, setError } = useResume();
  const [selectedOption, setSelectedOption] = useState<'upload' | 'create' | null>(null);
  const router = useRouter();

  // If resume data exists, show success state
  if (resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Resume Successfully Created!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Your resume is ready for editing with ATS-friendly templates. 
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
                    start over
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Square Bridge AI-Powered Resume Builder
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional, ATS-optimized resume that passes through applicant tracking systems.
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
        <div className="max-w-6xl mx-auto">
          {!selectedOption ? (
            /* Option Selection */
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Existing Resume */}
              <div 
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-200"
                onClick={() => setSelectedOption('upload')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Already Have a Resume?
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    Upload your existing resume and let our AI transform it into an ATS-optimized format with enhanced formatting and structure.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      AI-powered content extraction
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Supports PDF, DOC, DOCX, TXT
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Instant formatting upgrade
                    </div>
                  </div>
                  
                  <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                    Upload Resume
                  </button>
                </div>
              </div>

              {/* Generate Resume From Student Profile */}
              <div 
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-green-200"
                onClick={() => setSelectedOption('create')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Generate From Student Profile
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    We will fetch your details from the configured endpoint and generate an ATS-optimized resume automatically.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      No forms to fill
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      ATS-optimized content
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Choose template and download
                    </div>
                  </div>
                  
                  <button
                    className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      const run = async () => {
                        try {
                          setIsLoading(true);
                          setError(null);
                          const res = await fetch('/api/generate-resume', { method: 'POST' });
                          const result = await res.json();
                          if (!res.ok || !result.success || !result.data) {
                            throw new Error(result?.error || 'Failed to generate resume');
                          }
                          setResumeData(result.data);
                          router.push('/template-selection');
                        } catch (err) {
                          const msg = err instanceof Error ? err.message : 'Failed to generate resume';
                          setError(msg);
                        } finally {
                          setIsLoading(false);
                        }
                      };
                      run();
                    }}
                  >
                    {isLoading ? 'Generating...' : 'Generate Resume'}
                  </button>
                </div>
              </div>
            </div>
          ) : selectedOption === 'upload' ? (
            /* Upload Section */
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setSelectedOption(null)}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Upload Your Existing Resume
                  </h2>
                </div>
                <ResumeUpload />
              </div>
            </div>
          ) : (
            /* Generate Section */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setSelectedOption(null)}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Generate From Student Profile
                  </h2>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-4">We will fetch your details from the backend and create an ATS-friendly resume.</p>
                  <button
                    className={`mt-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        setError(null);
                        const res = await fetch('/api/generate-resume', { method: 'POST' });
                        const result = await res.json();
                        if (!res.ok || !result.success || !result.data) {
                          throw new Error(result?.error || 'Failed to generate resume');
                        }
                        setResumeData(result.data);
                        router.push('/template-selection');
                      } catch (err) {
                        const msg = err instanceof Error ? err.message : 'Failed to generate resume';
                        setError(msg);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Generating...' : 'Generate Resume'}
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
