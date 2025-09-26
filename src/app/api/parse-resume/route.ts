import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import PDFParse from 'pdf-parse';
import mammoth from 'mammoth';

// Initialize Gemini AI - The client gets the API key from the environment variable `GEMINI_API_KEY`
const ai = new GoogleGenAI({});

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

  // Using the new API syntax

  const prompt = `
    Please parse the following resume text and extract the information into a structured JSON format. 
    Be as accurate as possible and include all available information. If a field is not present, 
    use empty string for strings, empty array for arrays.
    
    For professionalTitle, look for the candidate's current job title, desired position, or professional role 
    (e.g., "Software Engineer", "Full Stack Developer", "Product Manager", "Data Scientist", etc.). 
    This is often found near the top of the resume, in the summary section, or as the most recent job title.
    
    For projects, extract each project with:
    - title: The project name/title
    - description: A brief description of what the project does
    - role: The person's role in the project (e.g., "Developer", "Lead Engineer", "Team Lead")
    - type: Type of project (e.g., "Web Application", "Mobile App", "API", "Personal Project")
    - duration: How long the project took or when it was completed
    - technologies: Array of technologies/tools used (extract from description if not explicitly listed)
    - links: Array of any URLs mentioned for the project (GitHub, live demo, etc.)
    
    For achievements, extract:
    - Awards, honors, recognitions, competitions won
    - Publications, patents, certifications of merit
    - Notable accomplishments or recognitions
    
    For languages, extract:
    - All languages mentioned with proficiency levels
    - Use standard proficiency terms: "Native", "Fluent", "Conversational", "Basic"
    - If no proficiency is mentioned, infer from context or use "Conversational" as default
    
    For hobbies/interests, extract:
    - Personal interests, hobbies, activities
    - Sports, creative pursuits, volunteer work
    - Any activities that show personality or additional skills

    IMPORTANT: Respond with ONLY valid JSON, no markdown formatting, no explanations, no extra text.

    Required JSON structure:
    {
      "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "address": "",
        "linkedIn": "",
        "github": "",
        "professionalTitle": ""
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
          "title": "",
          "description": "",
          "role": "",
          "type": "",
          "duration": "",
          "technologies": [],
          "links": []
        }
      ],
      "certifications": [
        {
          "name": "",
          "issuer": "",
          "date": ""
        }
      ],
      "achievements": [
        {
          "title": "",
          "description": "",
          "date": "",
          "issuer": ""
        }
      ],
      "languages": [
        {
          "name": "",
          "proficiency": ""
        }
      ],
      "hobbies": []
    }

    Resume text to parse:
    ${resumeText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    if (!response.text) {
      throw new Error('No text response from AI model');
    }
    
    const text = response.text;
    
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
          github: '',
          professionalTitle: ''
        },
        summary: 'Failed to parse resume content',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
        hobbies: []
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
        github: '',
        professionalTitle: ''
      };
    }
    
    // Ensure arrays exist
    parsedData.experience = parsedData.experience || [];
    parsedData.education = parsedData.education || [];
    parsedData.skills = parsedData.skills || [];
    parsedData.projects = parsedData.projects || [];
    parsedData.certifications = parsedData.certifications || [];
    parsedData.achievements = parsedData.achievements || [];
    parsedData.languages = parsedData.languages || [];
    parsedData.hobbies = parsedData.hobbies || [];
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
    
    // For demo purposes, return sample data if parsing fails
    if (process.env.NODE_ENV === 'development') {
      console.log('Returning sample data for development...');
      
      const sampleResumeData = {
        _id: "sample-resume-id",
        name: "Sample User",
        email: "sample@email.com",
        bio: "Experienced developer with expertise in web technologies and AI. Passionate about creating innovative solutions and building scalable applications.",
        highlights: "Full Stack Developer",
        phoneNumber: "1234567890",
        department: "Computer Science",
        college: "Sample University",
        experiences: [
          {
            _id: "exp1",
            companyName: "Sample Company",
            designation: "Software Engineer",
            location: "Remote",
            employmentType: "Full-time",
            modeOfWork: "Remote",
            startDate: "2022-01-01T00:00:00.000Z",
            endDate: "2024-12-01T00:00:00.000Z",
            currentlyWorking: true,
            description: "Developed and maintained web applications using modern technologies. Collaborated with cross-functional teams to deliver high-quality software solutions."
          }
        ],
        projects: [
          {
            _id: "proj1",
            title: "Resume Builder",
            description: "Built a comprehensive resume builder application with AI-powered features for parsing and generating professional resumes.",
            type: "Personal Project",
            role: "Full Stack Developer",
            membersType: "SINGLE",
            startDate: "2023-06-01T00:00:00.000Z",
            endDate: "2024-01-01T00:00:00.000Z",
            currentlyWorking: false,
            link: ["https://github.com/example/resume-builder"]
          }
        ],
        education: [
          {
            _id: "edu1",
            institution: "Sample University",
            fieldOfStudy: "UG",
            course: "Bachelor of Technology",
            specialization: "Computer Science",
            boardOfEducation: "State University",
            yearOfPassing: "2024-05-01T00:00:00.000Z",
            startYear: "2020-08-01T00:00:00.000Z",
            percentage: 85,
            isCurrentEducation: false
          }
        ],
        skills: [
          { _id: "skill1", name: "JavaScript" },
          { _id: "skill2", name: "React" },
          { _id: "skill3", name: "Node.js" },
          { _id: "skill4", name: "Python" },
          { _id: "skill5", name: "TypeScript" }
        ],
        additionalInfo: {
          additional: [
            {
              _id: "add1",
              title: "Portfolio",
              description: "Personal portfolio showcasing projects and skills",
              url: "https://portfolio.example.com"
            }
          ],
          activities: [
            {
              _id: "act1",
              title: "Open Source Contributor",
              description: "Active contributor to various open source projects"
            }
          ]
        }
      };
      
      return NextResponse.json({
        success: true,
        data: sampleResumeData,
        extractedText: "Sample extracted text...",
        message: 'Sample resume data provided for development'
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
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
