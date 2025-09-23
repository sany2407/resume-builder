import { ResumeData } from '../contexts/ResumeContext';

export interface ATSTemplate {
  id: string;
  name: string;
  description: string;
  category: 'ats-optimized' | 'creative' | 'professional';
  generateHTML: (data: ResumeData) => string;
  previewImage?: string;
}

// ATS-Friendly Template 1: Clean & Simple
export const atsCleanTemplate: ATSTemplate = {
  id: 'ats-clean',
  name: 'ATS Clean',
  description: 'Clean, simple layout optimized for ATS parsing',
  category: 'ats-optimized',
  generateHTML: (data: ResumeData) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000000;
            background: #ffffff;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        /* ATS-friendly styling */
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            border-bottom: 1px solid #000000;
            margin-bottom: 10px;
            padding-bottom: 2px;
        }
        
        .header {
            text-align: left;
            margin-bottom: 20px;
        }
        
        .name {
            font-size: 18pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 5px;
        }
        
        .contact-info {
            font-size: 10pt;
            line-height: 1.3;
            color: #000000;
        }
        
        .contact-info div {
            margin-bottom: 2px;
        }
        
        .summary {
            text-align: left;
            font-size: 11pt;
            line-height: 1.4;
            color: #000000;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 15px;
        }
        
        .job-title, .degree-title, .project-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
        }
        
        .company, .institution {
            font-size: 11pt;
            font-weight: normal;
            color: #000000;
            margin: 2px 0;
        }
        
        .dates {
            font-size: 10pt;
            color: #000000;
            margin: 2px 0;
        }
        
        .location {
            font-size: 10pt;
            color: #000000;
        }
        
        .description ul {
            margin: 5px 0 0 15px;
            padding: 0;
        }
        
        .description li {
            margin-bottom: 3px;
            font-size: 11pt;
            color: #000000;
        }
        
        .skills-list {
            font-size: 11pt;
            line-height: 1.4;
            color: #000000;
        }
        
        .skills-category {
            font-weight: bold;
            margin-right: 8px;
        }
        
        /* Print optimization */
        @media print {
            body {
                padding: 0.25in;
                font-size: 10pt;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        <div class="contact-info">
            ${data.personalInfo.email ? `<div>Email: ${data.personalInfo.email}</div>` : ''}
            ${data.personalInfo.phone ? `<div>Phone: ${data.personalInfo.phone}</div>` : ''}
            ${data.personalInfo.address ? `<div>Address: ${data.personalInfo.address}</div>` : ''}
            ${data.personalInfo.linkedIn ? `<div>LinkedIn: ${data.personalInfo.linkedIn}</div>` : ''}
            ${data.personalInfo.github ? `<div>GitHub: ${data.personalInfo.github}</div>` : ''}
        </div>
    </div>

    ${data.summary ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${data.summary}</div>
    </div>
    ` : ''}

    ${data.experience && data.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Professional Experience</div>
        ${data.experience.map(exp => `
            <div class="experience-item">
                <div class="job-title">${exp.position}</div>
                <div class="company">${exp.company}</div>
                <div class="dates">${exp.duration}</div>
                ${exp.description && exp.description.length > 0 ? `
                <div class="description">
                    <ul>
                        ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.education && data.education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${data.education.map(edu => `
            <div class="education-item">
                <div class="degree-title">${edu.degree}</div>
                <div class="institution">${edu.institution}</div>
                <div class="dates">${edu.duration}</div>
                ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.skills && data.skills.length > 0 ? `
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">
            ${data.skills.join(', ')}
        </div>
    </div>
    ` : ''}

    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${data.projects.map(project => `
            <div class="project-item">
                <div class="project-title">${project.name}</div>
                <div class="description">${project.description}</div>
                ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies">Technologies: ${project.technologies.join(', ')}</div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.certifications && data.certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Certifications</div>
        ${data.certifications.map(cert => `
            <div class="certification-item">
                <div class="certification-title">${cert.name}</div>
                <div class="issuer">${cert.issuer}</div>
                <div class="dates">${cert.date}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`
};

// ATS-Friendly Template 2: Two-Column Layout
export const atsTwoColumnTemplate: ATSTemplate = {
  id: 'ats-two-column',
  name: 'ATS Two-Column',
  description: 'Professional two-column layout that remains ATS-friendly',
  category: 'ats-optimized',
  generateHTML: (data: ResumeData) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333333;
            background: #ffffff;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .container {
            display: flex;
            gap: 20px;
        }
        
        .main-column {
            flex: 2;
        }
        
        .sidebar {
            flex: 1;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        
        .header {
            margin-bottom: 20px;
            text-align: center;
        }
        
        .name {
            font-size: 20pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #666666;
            line-height: 1.3;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #3498db;
        }
        
        .sidebar .section-title {
            font-size: 12pt;
            border-bottom: 1px solid #bdc3c7;
        }
        
        .experience-item, .education-item {
            margin-bottom: 15px;
        }
        
        .job-title, .degree {
            font-size: 12pt;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .company, .institution {
            font-size: 11pt;
            color: #7f8c8d;
            margin: 2px 0;
        }
        
        .dates {
            font-size: 10pt;
            color: #95a5a6;
            font-style: italic;
        }
        
        .description ul {
            margin: 8px 0 0 15px;
        }
        
        .description li {
            margin-bottom: 4px;
            color: #444444;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: #e3f2fd;
            color: #1565c0;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 9pt;
            font-weight: 500;
        }
        
        @media print {
            .container {
                display: block;
            }
            .sidebar {
                background: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        <div class="contact-info">
            ${[
                data.personalInfo.email,
                data.personalInfo.phone,
                data.personalInfo.address,
                data.personalInfo.linkedIn,
                data.personalInfo.github
            ].filter(Boolean).join(' • ')}
        </div>
    </div>

    <div class="container">
        <div class="main-column">
            ${data.summary ? `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${data.summary}</div>
            </div>
            ` : ''}

            ${data.experience && data.experience.length > 0 ? `
            <div class="section">
                <div class="section-title">Professional Experience</div>
                ${data.experience.map(exp => `
                    <div class="experience-item">
                        <div class="job-title">${exp.position}</div>
                        <div class="company">${exp.company}</div>
                        <div class="dates">${exp.duration}</div>
                        ${exp.description && exp.description.length > 0 ? `
                        <div class="description">
                            <ul>
                                ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>

        <div class="sidebar">
            ${data.education && data.education.length > 0 ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${data.education.map(edu => `
                    <div class="education-item">
                        <div class="degree">${edu.degree}</div>
                        <div class="institution">${edu.institution}</div>
                        <div class="dates">${edu.duration}</div>
                        ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.skills && data.skills.length > 0 ? `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            ${data.certifications && data.certifications.length > 0 ? `
            <div class="section">
                <div class="section-title">Certifications</div>
                ${data.certifications.map(cert => `
                    <div class="cert-item">
                        <div class="cert-name">${cert.name}</div>
                        <div class="issuer">${cert.issuer}</div>
                        <div class="dates">${cert.date}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </div>
</body>
</html>`
};

// Get all available templates
export const atsTemplates: ATSTemplate[] = [
  atsCleanTemplate,
  atsTwoColumnTemplate
];

// Get template by ID
export function getTemplateById(id: string): ATSTemplate | undefined {
  return atsTemplates.find(template => template.id === id);
}

// Generate optimized HTML for ATS
export function generateATSOptimizedHTML(data: ResumeData, templateId: string = 'ats-clean'): string {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }
  
  return template.generateHTML(data);
}

// ATS optimization tips and checks
export interface ATSOptimizationTips {
  passed: boolean;
  tips: string[];
}

export function checkATSOptimization(data: ResumeData): ATSOptimizationTips {
  const tips: string[] = [];
  let score = 0;
  const totalChecks = 8;

  // Check 1: Contact information
  if (!data.personalInfo.email || !data.personalInfo.phone) {
    tips.push("Include both email and phone number in contact information");
  } else {
    score++;
  }

  // Check 2: Professional summary
  if (!data.summary || data.summary.length < 50) {
    tips.push("Add a professional summary (50+ characters) to improve ATS parsing");
  } else {
    score++;
  }

  // Check 3: Work experience with descriptions
  const hasDetailedExperience = data.experience?.some(exp => 
    exp.description && exp.description.length > 0
  );
  if (!hasDetailedExperience) {
    tips.push("Include bullet points describing your achievements in work experience");
  } else {
    score++;
  }

  // Check 4: Education information
  if (!data.education || data.education.length === 0) {
    tips.push("Include education information for better ATS compatibility");
  } else {
    score++;
  }

  // Check 5: Skills section
  if (!data.skills || data.skills.length < 3) {
    tips.push("Add at least 3 relevant skills to improve keyword matching");
  } else {
    score++;
  }

  // Check 6: Date formats
  const hasProperDates = data.experience?.every(exp => 
    exp.duration && exp.duration.includes('-')
  );
  if (!hasProperDates) {
    tips.push("Use consistent date formats (e.g., 'Jan 2020 - Dec 2021') in experience");
  } else {
    score++;
  }

  // Check 7: Quantifiable achievements
  const hasQuantifiableAchievements = data.experience?.some(exp =>
    exp.description?.some(desc => 
      /\d+/.test(desc) || /%/.test(desc) || /\$/.test(desc)
    )
  );
  if (!hasQuantifiableAchievements) {
    tips.push("Include quantifiable achievements (numbers, percentages, dollar amounts) in your experience");
  } else {
    score++;
  }

  // Check 8: Standard section names
  const hasStandardSections = data.experience && data.education && data.skills;
  if (!hasStandardSections) {
    tips.push("Include standard sections: Experience, Education, and Skills for optimal ATS parsing");
  } else {
    score++;
  }

  return {
    passed: score >= (totalChecks * 0.7), // 70% pass rate
    tips: tips
  };
}