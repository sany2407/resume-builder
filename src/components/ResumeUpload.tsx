'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResume, ResumeData } from '../contexts/ResumeContext';

interface APIResponse {
  success: boolean;
  data?: ResumeData;
  error?: string;
  message?: string;
}

interface ResumeUploadProps {
  onUploadComplete?: () => void;
}

export default function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [configStatus, setConfigStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const { setResumeData, isLoading, setIsLoading, error, setError } = useResume();

  // Check API configuration on component mount
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/health');
        const result = await response.json();
        
        if (result.configuration?.geminiApiKey === 'missing') {
          setConfigStatus('API not configured. Please set up your Gemini API key.');
        }
      } catch (error) {
        console.error('Config check failed:', error);
      }
    };
    
    checkConfig();
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    // Prevent duplicate uploads by checking if already loading
    if (isLoading) {
      console.log('Upload already in progress, ignoring duplicate request');
      return;
    }

    // Clear any existing errors
    setError(null);

    console.log('Starting file upload:', { name: file.name, type: file.type, size: file.size });

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file only.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Simulate progress
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      console.log('Sending request to API...');
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      setUploadProgress(100);

      console.log('Response received:', response.status, response.statusText);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let result: APIResponse | null = null;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid response from server. Please try again.');
        }
      } else {
        // If not JSON, get text to see what we received
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        throw new Error('Server returned an invalid response. Please try again.');
      }

      if (!response.ok) {
        const errorMessage = result && typeof result === 'object' && result.error 
          ? result.error 
          : `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      console.log('Parsed result:', { success: result?.success, hasData: !!(result?.data) });
      
      if (result && result.success && result.data) {
        console.log('Setting resume data and navigating to editor');
        setResumeData(result.data);
        
        // Show success message briefly before navigating
        setTimeout(() => {
          onUploadComplete?.();
          router.push('/editor');
        }, 1500);
      } else {
        const errorMessage = result && typeof result === 'object' && result.error 
          ? result.error 
          : 'Failed to parse resume - no data returned';
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('Upload error:', error);
      
      // Clear any running interval
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      let errorMessage = 'Failed to upload and parse resume';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setResumeData, setIsLoading, setError, router, onUploadComplete]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Prevent processing if already uploading
    if (isLoading) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload, isLoading]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent processing if already uploading
    if (isLoading) {
      e.target.value = ''; // Clear the input
      return;
    }
    
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
      e.target.value = ''; // Clear the input after starting upload
    }
  }, [handleFileUpload, isLoading]);

  const handleBrowseClick = useCallback(() => {
    if (isLoading) return; // Prevent clicking if already uploading
    fileInputRef.current?.click();
  }, [isLoading]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg font-semibold text-gray-700">
                Processing your resume...
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">{uploadProgress}% complete</div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <div className="text-xl font-semibold text-gray-700">
                Upload Your Resume
              </div>
              
              <div className="text-gray-500 text-center">
                <p>Drag and drop your resume here, or click to browse</p>
                <p className="text-sm mt-1">
                  Supports PDF, DOC, DOCX, and TXT files (max 10MB)
                </p>
              </div>
              
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling to container
                  handleBrowseClick();
                }}
              >
                Browse Files
              </button>
            </>
          )}
        </div>
      </div>

      {configStatus && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-yellow-800 font-medium">Configuration Required</p>
          </div>
          <p className="text-yellow-700 mt-1">{configStatus}</p>
          <div className="mt-2 text-sm text-yellow-600">
            <p>To get started:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-700">Google AI Studio</a></li>
              <li>Add it to your .env.local file as GEMINI_API_KEY=your_key</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">Error</p>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
          {error.includes('API key') && (
            <div className="mt-2 text-sm text-red-600">
              <p>Please check your Gemini API key configuration.</p>
            </div>
          )}
        </div>
      )}

      {uploadProgress === 100 && !error && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700 font-medium">Success!</p>
          </div>
          <p className="text-green-600 mt-1">Resume parsed successfully. Redirecting to editor...</p>
        </div>
      )}
    </div>
  );
}