import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI - The client gets the API key from the environment variable `GEMINI_API_KEY`
const ai = new GoogleGenAI({});

async function fetchStudentResumeJSON() {
  const apiUrl = process.env.STUDENT_RESUME_API_URL || 'http://localhost:5000/api/v1/student/resume';
  const token = process.env.STUDENT_RESUME_API_TOKEN;

  if (!token) {
    throw new Error('Student resume API token not configured. Please set STUDENT_RESUME_API_TOKEN in your environment variables.');
  }

  const res = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
    // Avoid caching to always fetch latest details
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch student resume data: ${res.status} ${res.statusText} - ${text?.slice(0, 300)}`);
  }

  return res.json();
}

async function generateATSResumeFromProfile(profileJson: unknown) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.');
  }

  // Using the new API syntax

  const prompt = `
You are an expert ATS optimization assistant. Using the provided student profile JSON, produce an ATS-optimized resume JSON strictly matching the schema below. Keep content concise, use action verbs, quantify impact where possible, and avoid fancy symbols. If a field is unavailable, use empty string for strings and empty array for arrays.

Schema (return EXACTLY this structure):
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
    { "company": "", "position": "", "duration": "", "description": [] }
  ],
  "education": [
    { "institution": "", "degree": "", "duration": "", "gpa": "" }
  ],
  "skills": [],
  "projects": [
    { "title": "", "description": "", "role": "", "type": "", "duration": "", "technologies": [], "links": [] }
  ],
  "certifications": [
    { "name": "", "issuer": "", "date": "" }
  ],
  "achievements": [
    { "title": "", "description": "", "date": "", "issuer": "" }
  ],
  "languages": [
    { "name": "", "proficiency": "" }
  ],
  "hobbies": []
}

Guidelines:
- Map profile fields like name, email, phone, bio/summary, experiences, education, skills, projects, and links appropriately.
- Convert any date ranges to a simple string duration like "Jan 2023 - Present".
- Convert rich descriptions into 3-6 crisp bullet points per experience with measurable outcomes when possible.
- Flatten skills to a string array (e.g., ["JavaScript", "React", "Node.js"]).
- For links, include GitHub/portfolio/Project links if present.

Return ONLY valid JSON (no markdown, no backticks, no commentary).

Student profile JSON:
${JSON.stringify(profileJson, null, 2)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  
  if (!response.text) {
    throw new Error('No text response from AI model');
  }
  
  const text = response.text;

  // Clean potential code fences
  let cleanedText = text.trim();
  cleanedText = cleanedText.replace(/^```json\s*/i, '');
  cleanedText = cleanedText.replace(/^```\s*/i, '');
  cleanedText = cleanedText.replace(/\s*```\s*$/i, '');

  const jsonStart = cleanedText.indexOf('{');
  const jsonEnd = cleanedText.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No valid JSON found in AI response');
  }

  cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);

  let parsed;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (e) {
    throw new Error('Failed to parse AI JSON output');
  }

  // Ensure required properties exist
  parsed.personalInfo = parsed.personalInfo || { name: 'Unknown', email: '', phone: '', address: '', linkedIn: '', github: '', professionalTitle: '' };
  parsed.summary = parsed.summary || '';
  parsed.experience = parsed.experience || [];
  parsed.education = parsed.education || [];
  parsed.skills = parsed.skills || [];
  parsed.projects = parsed.projects || [];
  parsed.certifications = parsed.certifications || [];
  parsed.achievements = parsed.achievements || [];
  parsed.languages = parsed.languages || [];
  parsed.hobbies = parsed.hobbies || [];

  return parsed;
}

export async function POST(_request: NextRequest) {
  try {
    // 1) Fetch raw student profile JSON from external API
    const profileJson = await fetchStudentResumeJSON();

    // 2) Generate ATS-optimized resume JSON from profile via Gemini
    const atsResume = await generateATSResumeFromProfile(profileJson);

    return NextResponse.json({
      success: true,
      data: atsResume,
      message: 'Resume generated from student profile successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating resume from student profile:', error);
    let message = 'Failed to generate resume from student profile';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}