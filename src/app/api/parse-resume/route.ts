import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFParse from 'pdf-parse';
import mammoth from 'mammoth';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper function to extract text from different file types
async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    switch (mimeType) {
      case 'application/pdf':
        const pdfData = await PDFParse(buffer);
        return pdfData.text;
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      
      case 'text/plain':
        return buffer.toString('utf-8');
      
      default:
        // Try to parse as text for other formats
        return buffer.toString('utf-8');
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from file');
  }
}

// Helper function to parse resume using Gemini AI
async function parseResumeWithGemini(resumeText: string) {
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Please parse the following resume text and extract the information into a structured JSON format. 
    Be as accurate as possible and include all available information. If a field is not present, 
    use empty string for strings, empty array for arrays.

    IMPORTANT: Respond with ONLY valid JSON, no markdown formatting, no explanations, no extra text.

    Required JSON structure:
    {
      "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "address": "",
        "linkedIn": "",
        "github": ""
      },
      "summary": "",
      "experience": [
        {
          "company": "",
          "position": "",
          "duration": "",
          "description": []
        }
      ],
      "education": [
        {
          "institution": "",
          "degree": "",
          "duration": "",
          "gpa": ""
        }
      ],
      "skills": [],
      "projects": [
        {
          "name": "",
          "description": "",
          "technologies": []
        }
      ],
      "certifications": [
        {
          "name": "",
          "issuer": "",
          "date": ""
        }
      ]
    }

    Resume text to parse:
    ${resumeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI Response:', text); // Debug logging
    
    // More robust cleaning of the response
    let cleanedText = text.trim();
    
    // Remove common markdown formatting
    cleanedText = cleanedText.replace(/^```json\s*/gi, '');
    cleanedText = cleanedText.replace(/\s*```$/g, '');
    cleanedText = cleanedText.replace(/^```\s*/g, '');
    
    // Remove any leading/trailing non-JSON content
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in AI response');
    }
    
    cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
    
    // Parse JSON with better error handling
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned Text:', cleanedText);
      
      // Fallback: try to create a basic structure
      parsedData = {
        personalInfo: {
          name: 'Unknown',
          email: '',
          phone: '',
          address: '',
          linkedIn: '',
          github: ''
        },
        summary: 'Failed to parse resume content',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: []
      };
    }
    
    // Validate required structure
    if (!parsedData.personalInfo) {
      parsedData.personalInfo = {
        name: 'Unknown',
        email: '',
        phone: '',
        address: '',
        linkedIn: '',
        github: ''
      };
    }
    
    // Ensure arrays exist
    parsedData.experience = parsedData.experience || [];
    parsedData.education = parsedData.education || [];
    parsedData.skills = parsedData.skills || [];
    parsedData.projects = parsedData.projects || [];
    parsedData.certifications = parsedData.certifications || [];
    parsedData.summary = parsedData.summary || '';
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing resume with Gemini:', error);
    throw new Error(`Failed to parse resume with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  console.log('POST /api/parse-resume - Request received');
  
  try {
    // Check if API key is configured first
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.error('Gemini API key not configured');
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please set up your Gemini API key.',
          details: 'GEMINI_API_KEY environment variable is missing or invalid'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    console.log('File received:', { name: file?.name, type: file?.type, size: file?.size });
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max size is 10MB' }, { status: 400 });
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Extracting text from file...');
    // Extract text from file
    const extractedText = await extractTextFromFile(buffer, file.type);

    if (!extractedText || extractedText.trim().length === 0) {
      console.error('No text extracted from file');
      return NextResponse.json(
        { error: 'Could not extract text from the file. The file might be empty or corrupted.' },
        { status: 400 }
      );
    }

    console.log('Text extracted, length:', extractedText.length);
    console.log('Sending to Gemini AI...');
    
    // Parse resume with Gemini AI
    const parsedResume = await parseResumeWithGemini(extractedText);

    console.log('Resume parsed successfully');

    return NextResponse.json({
      success: true,
      data: parsedResume,
      extractedText: extractedText.substring(0, 500) + '...', // Preview of extracted text
      message: 'Resume parsed successfully'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    
    // More specific error handling
    let errorMessage = 'Failed to process resume. Please try again.';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'AI service configuration error. Please check API key.';
        statusCode = 500;
      } else if (error.message.includes('Failed to extract text')) {
        errorMessage = 'Could not read the file content. Please ensure the file is not corrupted.';
        statusCode = 400;
      } else if (error.message.includes('Failed to parse resume with AI')) {
        errorMessage = 'AI service temporarily unavailable. Please try again.';
        statusCode = 503;
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
