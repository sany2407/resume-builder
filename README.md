# AI-Powered Resume Builder

A Next.js application that uses Google's Gemini AI to parse existing resumes and transform them into beautiful, editable documents using GrapesJS Studio SDK.

## Features

- 📄 **Resume Upload**: Support for PDF, DOC, DOCX, and TXT files
- 🤖 **AI Parsing**: Uses Google Gemini AI to extract and structure resume data
- ✨ **Visual Editor**: Professional document editor with drag-and-drop functionality
- 🎨 **Professional Templates**: Beautiful, print-ready resume templates
- 🖨️ **Print Support**: Built-in printing functionality for professional output
- 📱 **Responsive**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**To get a Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key to your `.env.local` file

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### 1. Upload Your Resume
- Go to the homepage
- Drag and drop your resume file or click to browse
- Supported formats: PDF, DOC, DOCX, TXT (max 10MB)

### 2. AI Processing
- The system will extract text from your file
- Gemini AI will parse and structure the content
- You'll see a progress indicator during processing

### 3. Edit in Visual Editor
- Once processed, you'll be redirected to the editor
- Use the visual editor to customize your resume
- The left sidebar shows document layers
- Use the print button to export your resume

## Project Structure

```
src/
├── app/
│   ├── api/parse-resume/     # API route for resume parsing
│   ├── editor/               # Visual editor page
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page with upload
├── components/
│   └── ResumeUpload.tsx     # File upload component
├── contexts/
│   └── ResumeContext.tsx    # Global state management
└── utils/
    └── resumeTemplate.ts    # HTML template generation
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **GrapesJS Studio SDK** - Visual editor
- **Google Gemini AI** - Resume parsing
- **PDF-Parse** - PDF text extraction
- **Mammoth** - DOC/DOCX parsing

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your Gemini API key is correctly set in `.env.local`
2. **File Upload Issues**: Ensure files are under 10MB and in supported formats
3. **Editor Not Loading**: Check that the resume was successfully parsed before accessing the editor

## License

This project is for educational and personal use.
