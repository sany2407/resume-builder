# AI-Powered ATS-Friendly Resume Builder

A Next.js application that uses AI to parse existing resumes and transform them into ATS-optimized documents using GrapeJS Studio for visual editing.

## 🚀 Features

- **AI-Powered Resume Parsing**: Uses Google Gemini AI to extract and structure resume content from PDF, DOC, DOCX, and TXT files
- **ATS-Optimized Templates**: Pre-designed templates that pass through Applicant Tracking Systems
- **Visual Editor**: Powered by GrapeJS Studio for drag-and-drop resume customization
- **Multiple File Support**: Supports PDF, Word documents, and plain text files
- **Real-time Preview**: See your changes instantly in the editor
- **Export Options**: Download as PDF or HTML
- **ATS Score Checker**: Validates your resume against ATS best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with React 19
- **Editor**: GrapeJS Studio SDK
- **AI**: Google Gemini Pro API
- **File Parsing**: pdf-parse, mammoth (for Word docs)
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini AI API key (free)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd grape-resume
npm install
```

### 2. Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. Add your API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 How It Works

### 1. Resume Upload & Parsing
- Upload your existing resume (PDF, DOC, DOCX, or TXT)
- AI extracts text content using pdf-parse or mammoth
- Google Gemini AI structures the content into organized sections

### 2. ATS Template Application
- Choose from ATS-optimized templates
- Templates are designed to pass through ATS systems
- Clean formatting with standard section headers

### 3. Visual Editing
- Use GrapeJS Studio for drag-and-drop editing
- Modify text, styling, and layout
- Real-time preview of changes

### 4. ATS Optimization Check
- Built-in ATS score checker
- Provides recommendations for improvement
- Validates standard sections and formatting

## 🎨 ATS Templates

### ATS Clean Template
- Simple, clean layout
- Standard fonts and formatting
- Optimized for ATS parsing
- Black text on white background

### ATS Two-Column Template
- Professional two-column design
- ATS-friendly structure
- Sidebar for education and skills
- Main column for experience

## 🔧 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── parse-resume/     # Resume parsing API endpoint
│   ├── editor/               # GrapeJS editor page
│   └── page.tsx             # Home page
├── components/
│   ├── ResumeUpload.tsx     # File upload component
│   └── TemplateSelector.tsx # Template selection UI
├── contexts/
│   └── ResumeContext.tsx    # Resume data context
├── services/
│   └── resumeParser.ts      # Resume parsing service
├── types/
│   └── resume.ts            # TypeScript interfaces
└── utils/
    ├── atsTemplates.ts      # ATS-optimized templates
    └── resumeTemplate.ts    # Template utilities
```

## 📝 API Endpoints

### POST /api/parse-resume
Parses uploaded resume files using AI.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'resume' file

**Response:**
```json
{
  "success": true,
  "data": {
    "personalInfo": { ... },
    "summary": "...",
    "experience": [...],
    "education": [...],
    "skills": [...]
  }
}
```

## 🎯 ATS Optimization Features

### ATS Score Checker
Validates resumes against 8 key criteria:
1. Contact information completeness
2. Professional summary presence
3. Detailed work experience
4. Education section
5. Skills section with 3+ items
6. Consistent date formatting
7. Quantifiable achievements
8. Standard section names

### Template Guidelines
- Uses standard fonts (Arial)
- Black text on white background
- Standard section headers
- Proper heading hierarchy
- Clean, simple formatting
- No images or graphics
- Consistent date formats

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment
```bash
npm run build
npm start
```

## 🛠️ Development

### Adding New Templates
1. Create template in `src/utils/atsTemplates.ts`
2. Add to `atsTemplates` array
3. Template will appear in selector automatically

### Customizing AI Parsing
Modify the parsing logic in `src/services/resumeParser.ts` or update the AI prompt in `src/app/api/parse-resume/route.ts`.

## 🔍 Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Ensure GEMINI_API_KEY is set in .env.local
   - Restart the development server

2. **File upload fails**
   - Check file size (max 10MB)
   - Ensure file type is PDF, DOC, DOCX, or TXT

3. **Template not applying**
   - Check browser console for errors
   - Ensure resume data is loaded

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js, GrapeJS Studio, and Google Gemini AI**