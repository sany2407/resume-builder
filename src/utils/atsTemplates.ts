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
        
        .professional-title {
            font-size: 14pt;
            font-weight: normal;
            color: #2563eb;
            margin-bottom: 8px;
            font-style: italic;
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
        
        .project-role, .project-type {
            font-size: 10pt;
            color: #666666;
            margin: 2px 0;
        }
        
        .project-role {
            font-style: italic;
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
        ${data.personalInfo.professionalTitle ? `<div class="professional-title">${data.personalInfo.professionalTitle}</div>` : ''}
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
                <div class="project-title">${project.title}</div>
                ${project.role ? `<div class="project-role">${project.role}</div>` : ''}
                ${project.type ? `<div class="project-type">${project.type}</div>` : ''}
                ${project.duration ? `<div class="dates">${project.duration}</div>` : ''}
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

    ${data.achievements && data.achievements.length > 0 ? `
    <div class="section">
        <div class="section-title">Achievements & Awards</div>
        ${data.achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-title">${achievement.title}</div>
                ${achievement.issuer ? `<div class="issuer">${achievement.issuer}</div>` : ''}
                ${achievement.date ? `<div class="dates">${achievement.date}</div>` : ''}
                ${achievement.description ? `<div class="description">${achievement.description}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.languages && data.languages.length > 0 ? `
    <div class="section">
        <div class="section-title">Languages</div>
        <div class="languages-list">
            ${data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
        </div>
    </div>
    ` : ''}

    ${data.hobbies && data.hobbies.length > 0 ? `
    <div class="section">
        <div class="section-title">Interests & Hobbies</div>
        <div class="hobbies-list">
            ${data.hobbies.join(', ')}
        </div>
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
        
        .professional-title {
            font-size: 14pt;
            font-weight: normal;
            color: #3498db;
            margin-bottom: 8px;
            font-style: italic;
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
        
        .project-item {
            margin-bottom: 15px;
        }
        
        .project-title {
            font-size: 12pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 4px;
        }
        
        .project-role {
            font-size: 10pt;
            color: #7f8c8d;
            font-style: italic;
            margin: 2px 0;
        }
        
        .project-type {
            font-size: 10pt;
            color: #95a5a6;
            margin: 2px 0;
        }
        
        .project-dates {
            font-size: 9pt;
            color: #95a5a6;
            font-style: italic;
            margin: 2px 0;
        }
        
        .project-description {
            font-size: 10pt;
            color: #444444;
            line-height: 1.4;
            margin: 6px 0;
        }
        
        .project-tech {
            font-size: 9pt;
            color: #1565c0;
            margin-top: 4px;
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
        ${data.personalInfo.professionalTitle ? `<div class="professional-title">${data.personalInfo.professionalTitle}</div>` : ''}
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

            ${data.projects && data.projects.length > 0 ? `
            <div class="section">
                <div class="section-title">Notable Projects</div>
                ${data.projects.map(project => `
                    <div class="project-item">
                        <div class="project-title">${project.title}</div>
                        ${project.role ? `<div class="project-role">${project.role}</div>` : ''}
                        ${project.type ? `<div class="project-type">${project.type}</div>` : ''}
                        ${project.duration ? `<div class="project-dates">${project.duration}</div>` : ''}
                        <div class="project-description">${project.description}</div>
                        ${project.technologies && project.technologies.length > 0 ? `
                        <div class="project-tech">Technologies: ${project.technologies.join(', ')}</div>
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

            ${data.achievements && data.achievements.length > 0 ? `
            <div class="section">
                <div class="section-title">Achievements</div>
                ${data.achievements.map(achievement => `
                    <div class="achievement-item">
                        <div class="achievement-title">${achievement.title}</div>
                        ${achievement.issuer ? `<div class="issuer">${achievement.issuer}</div>` : ''}
                        ${achievement.date ? `<div class="dates">${achievement.date}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.languages && data.languages.length > 0 ? `
            <div class="section">
                <div class="section-title">Languages</div>
                <div class="languages-list">
                    ${data.languages.map(lang => `<div class="language-item">${lang.name}: ${lang.proficiency}</div>`).join('')}
                </div>
            </div>
            ` : ''}

            ${data.hobbies && data.hobbies.length > 0 ? `
            <div class="section">
                <div class="section-title">Interests</div>
                <div class="hobbies-list">
                    ${data.hobbies.join(', ')}
                </div>
            </div>
            ` : ''}
        </div>
    </div>
</body>
</html>`
};

// ATS-Friendly Template 3: Modern Layout
export const atsModernTemplate: ATSTemplate = {
  id: 'ats-modern',
  name: 'ATS Modern',
  description: 'Contemporary design with clean lines and subtle colors while maintaining ATS compatibility',
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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #2d3748;
            background: #ffffff;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .name {
            font-size: 24pt;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .professional-title {
            font-size: 16pt;
            font-weight: 400;
            color: #4a5568;
            margin-bottom: 12px;
            font-style: italic;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #718096;
            line-height: 1.4;
        }
        
        .contact-info div {
            margin-bottom: 3px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: 600;
            color: #2d3748;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            padding-left: 3px;
            border-left: 4px solid #4299e1;
            padding-left: 12px;
        }
        
        .summary {
            font-size: 11pt;
            line-height: 1.6;
            color: #4a5568;
            text-align: justify;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 18px;
            padding-left: 15px;
            border-left: 1px solid #e2e8f0;
        }
        
        .job-title, .degree-title, .project-title {
            font-size: 13pt;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 2px;
        }
        
        .company, .institution {
            font-size: 11pt;
            font-weight: 500;
            color: #4299e1;
            margin-bottom: 4px;
        }
        
        .dates {
            font-size: 10pt;
            color: #718096;
            margin-bottom: 8px;
            font-style: italic;
        }
        
        .description ul {
            margin: 8px 0 0 18px;
            padding: 0;
        }
        
        .description li {
            margin-bottom: 4px;
            font-size: 11pt;
            color: #4a5568;
            line-height: 1.5;
        }
        
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-item {
            background: #edf2f7;
            color: #2d3748;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 10pt;
            font-weight: 500;
            border: 1px solid #e2e8f0;
        }
        
        .project-role {
            font-size: 11pt;
            color: #4299e1;
            margin: 2px 0;
            font-style: italic;
            font-weight: 500;
        }
        
        .project-type {
            font-size: 10pt;
            color: #718096;
            margin: 2px 0;
        }
        
        .project-dates {
            font-size: 10pt;
            color: #718096;
            margin: 2px 0 8px 0;
            font-style: italic;
        }
        
        .project-description {
            font-size: 11pt;
            color: #4a5568;
            line-height: 1.5;
            margin: 8px 0;
        }
        
        .project-tech {
            font-size: 10pt;
            color: #718096;
            margin-top: 6px;
            font-weight: 500;
        }
        
        @media print {
            body {
                padding: 0.25in;
                font-size: 10pt;
            }
            .section {
                page-break-inside: avoid;
            }
            .skill-item {
                background: #f7fafc;
                border: 1px solid #cbd5e0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        ${data.personalInfo.professionalTitle ? `<div class="professional-title">${data.personalInfo.professionalTitle}</div>` : ''}
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
        <div class="section-title">Technical Skills</div>
        <div class="skills-container">
            ${data.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Notable Projects</div>
        ${data.projects.map(project => `
            <div class="project-item">
                <div class="project-title">${project.title}</div>
                ${project.role ? `<div class="project-role">${project.role}</div>` : ''}
                ${project.type ? `<div class="project-type">${project.type}</div>` : ''}
                ${project.duration ? `<div class="project-dates">${project.duration}</div>` : ''}
                <div class="project-description">${project.description}</div>
                ${project.technologies && project.technologies.length > 0 ? `
                <div class="project-tech">Technologies: ${project.technologies.join(', ')}</div>
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
                <div class="cert-title">${cert.name}</div>
                <div class="issuer">${cert.issuer}</div>
                <div class="dates">${cert.date}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.achievements && data.achievements.length > 0 ? `
    <div class="section">
        <div class="section-title">Achievements & Awards</div>
        ${data.achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-title">${achievement.title}</div>
                ${achievement.issuer ? `<div class="issuer">${achievement.issuer}</div>` : ''}
                ${achievement.date ? `<div class="dates">${achievement.date}</div>` : ''}
                ${achievement.description ? `<div class="description">${achievement.description}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.languages && data.languages.length > 0 ? `
    <div class="section">
        <div class="section-title">Languages</div>
        <div class="languages-container">
            ${data.languages.map(lang => `<span class="skill-item">${lang.name} (${lang.proficiency})</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${data.hobbies && data.hobbies.length > 0 ? `
    <div class="section">
        <div class="section-title">Interests & Hobbies</div>
        <div class="hobbies-list">
            ${data.hobbies.join(' • ')}
        </div>
    </div>
    ` : ''}
</body>
</html>`
};

// ATS-Friendly Template 4: Minimal Layout
export const atsMinimalTemplate: ATSTemplate = {
  id: 'ats-minimal',
  name: 'ATS Minimal',
  description: 'Ultra-clean, text-focused design with maximum ATS parsability and zero styling conflicts',
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
            font-size: 12pt;
            line-height: 1.4;
            color: #000000;
            background: #ffffff;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
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
        
        .professional-title {
            font-size: 14pt;
            font-weight: normal;
            color: #000000;
            margin-bottom: 8px;
        }
        
        .contact-info {
            font-size: 11pt;
            color: #000000;
            line-height: 1.3;
        }
        
        .contact-info div {
            margin-bottom: 2px;
        }
        
        .section {
            margin-bottom: 18px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        
        .summary {
            font-size: 12pt;
            line-height: 1.4;
            color: #000000;
            margin-bottom: 10px;
        }
        
        .experience-item, .education-item {
            margin-bottom: 12px;
        }
        
        .job-title, .degree-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 2px;
        }
        
        .company, .institution {
            font-size: 12pt;
            font-weight: normal;
            color: #000000;
            margin-bottom: 2px;
        }
        
        .dates {
            font-size: 11pt;
            color: #000000;
            margin-bottom: 6px;
        }
        
        .description ul {
            margin: 6px 0 0 18px;
            padding: 0;
        }
        
        .description li {
            margin-bottom: 3px;
            font-size: 12pt;
            color: #000000;
            line-height: 1.4;
        }
        
        .skills-list {
            font-size: 12pt;
            line-height: 1.4;
            color: #000000;
        }
        
        .project-item {
            margin-bottom: 12px;
        }
        
        .project-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 4px;
        }
        
        .project-description {
            font-size: 12pt;
            color: #000000;
            margin-bottom: 4px;
            line-height: 1.4;
        }
        
        .project-role {
            font-size: 11pt;
            color: #000000;
            margin: 2px 0;
            font-style: italic;
        }
        
        .project-dates {
            font-size: 11pt;
            color: #000000;
            margin: 2px 0;
        }
        
        .technologies {
            font-size: 11pt;
            color: #000000;
            margin-bottom: 6px;
        }
        
        .cert-item {
            margin-bottom: 8px;
        }
        
        .cert-name {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
        }
        
        .issuer {
            font-size: 11pt;
            color: #000000;
        }
        
        /* Print optimization */
        @media print {
            body {
                padding: 0.25in;
                font-size: 11pt;
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
        ${data.personalInfo.professionalTitle ? `<div class="professional-title">${data.personalInfo.professionalTitle}</div>` : ''}
        <div class="contact-info">
            ${data.personalInfo.email ? `<div>${data.personalInfo.email}</div>` : ''}
            ${data.personalInfo.phone ? `<div>${data.personalInfo.phone}</div>` : ''}
            ${data.personalInfo.address ? `<div>${data.personalInfo.address}</div>` : ''}
            ${data.personalInfo.linkedIn ? `<div>${data.personalInfo.linkedIn}</div>` : ''}
            ${data.personalInfo.github ? `<div>${data.personalInfo.github}</div>` : ''}
        </div>
    </div>

    ${data.summary ? `
    <div class="section">
        <div class="section-title">PROFESSIONAL SUMMARY</div>
        <div class="summary">${data.summary}</div>
    </div>
    ` : ''}

    ${data.experience && data.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">PROFESSIONAL EXPERIENCE</div>
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
        <div class="section-title">EDUCATION</div>
        ${data.education.map(edu => `
            <div class="education-item">
                <div class="degree-title">${edu.degree}</div>
                <div class="institution">${edu.institution}</div>
                <div class="dates">${edu.duration}</div>
                ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.skills && data.skills.length > 0 ? `
    <div class="section">
        <div class="section-title">TECHNICAL SKILLS</div>
        <div class="skills-list">
            ${data.skills.join(' • ')}
        </div>
    </div>
    ` : ''}

    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">PROJECTS</div>
        ${data.projects.map(project => `
            <div class="project-item">
                <div class="project-title">${project.title}</div>
                ${project.role ? `<div class="project-role">${project.role}</div>` : ''}
                ${project.duration ? `<div class="project-dates">${project.duration}</div>` : ''}
                <div class="project-description">${project.description}</div>
                ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies">Technologies: ${project.technologies.join(', ')}</div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.certifications && data.certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">CERTIFICATIONS</div>
        ${data.certifications.map(cert => `
            <div class="cert-item">
                <div class="cert-name">${cert.name}</div>
                <div class="issuer">${cert.issuer}</div>
                <div class="dates">${cert.date}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.achievements && data.achievements.length > 0 ? `
    <div class="section">
        <div class="section-title">ACHIEVEMENTS</div>
        ${data.achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-title">${achievement.title}</div>
                ${achievement.issuer ? `<div class="issuer">${achievement.issuer}</div>` : ''}
                ${achievement.date ? `<div class="dates">${achievement.date}</div>` : ''}
                ${achievement.description ? `<div class="description">${achievement.description}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.languages && data.languages.length > 0 ? `
    <div class="section">
        <div class="section-title">LANGUAGES</div>
        <div class="languages-list">
            ${data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}
        </div>
    </div>
    ` : ''}

    ${data.hobbies && data.hobbies.length > 0 ? `
    <div class="section">
        <div class="section-title">INTERESTS</div>
        <div class="hobbies-list">
            ${data.hobbies.join(' • ')}
        </div>
    </div>
    ` : ''}
</body>
</html>`
};

// ATS-Friendly Template 5: Professional Layout
export const atsProfessionalTemplate: ATSTemplate = {
  id: 'ats-professional',
  name: 'ATS Professional',
  description: 'Classic professional formatting with traditional layout that works perfectly with all ATS systems',
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
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000000;
            background: #ffffff;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000000;
        }
        
        .name {
            font-size: 20pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .professional-title {
            font-size: 14pt;
            font-weight: normal;
            color: #000000;
            margin-bottom: 10px;
            font-style: italic;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #000000;
            line-height: 1.3;
        }
        
        .contact-info div {
            margin-bottom: 2px;
        }
        
        .section {
            margin-bottom: 22px;
        }
        
        .section-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-bottom: 3px;
            border-bottom: 1px solid #000000;
            letter-spacing: 0.5px;
        }
        
        .summary {
            font-size: 11pt;
            line-height: 1.5;
            color: #000000;
            text-align: justify;
            text-indent: 0.25in;
        }
        
        .experience-item, .education-item {
            margin-bottom: 15px;
        }
        
        .job-title, .degree-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 3px;
        }
        
        .company, .institution {
            font-size: 11pt;
            font-weight: normal;
            color: #000000;
            margin-bottom: 3px;
            font-style: italic;
        }
        
        .dates {
            font-size: 10pt;
            color: #000000;
            margin-bottom: 8px;
            text-align: right;
            float: right;
        }
        
        .clear {
            clear: both;
        }
        
        .description ul {
            margin: 8px 0 0 0.25in;
            padding: 0;
        }
        
        .description li {
            margin-bottom: 4px;
            font-size: 11pt;
            color: #000000;
            line-height: 1.4;
        }
        
        .skills-section {
            display: block;
        }
        
        .skills-category {
            font-weight: bold;
            margin-bottom: 6px;
            font-size: 11pt;
        }
        
        .skills-list {
            font-size: 11pt;
            line-height: 1.4;
            color: #000000;
            margin-bottom: 10px;
        }
        
        .project-item {
            margin-bottom: 15px;
        }
        
        .project-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 4px;
        }
        
        .project-role {
            font-size: 11pt;
            color: #000000;
            margin: 3px 0;
            font-style: italic;
            font-weight: 500;
        }
        
        .project-type {
            font-size: 10pt;
            color: #000000;
            margin: 2px 0;
            text-transform: uppercase;
            font-weight: 500;
        }
        
        .project-duration {
            font-size: 10pt;
            color: #000000;
            margin: 2px 0 8px 0;
            font-style: italic;
        }
        
        .project-description {
            font-size: 11pt;
            color: #000000;
            margin-bottom: 6px;
            line-height: 1.4;
        }
        
        .technologies {
            font-size: 10pt;
            color: #000000;
            font-style: italic;
        }
        
        .cert-item {
            margin-bottom: 10px;
        }
        
        .cert-name {
            font-size: 11pt;
            font-weight: bold;
            color: #000000;
            display: inline;
        }
        
        .cert-details {
            font-size: 10pt;
            color: #000000;
            display: inline;
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
            .dates {
                float: none;
                text-align: left;
                display: inline;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        ${data.personalInfo.professionalTitle ? `<div class="professional-title">${data.personalInfo.professionalTitle}</div>` : ''}
        <div class="contact-info">
            ${data.personalInfo.email ? `<div>${data.personalInfo.email}</div>` : ''}
            ${data.personalInfo.phone ? `<div>${data.personalInfo.phone}</div>` : ''}
            ${data.personalInfo.address ? `<div>${data.personalInfo.address}</div>` : ''}
            ${data.personalInfo.linkedIn ? `<div>${data.personalInfo.linkedIn}</div>` : ''}
            ${data.personalInfo.github ? `<div>${data.personalInfo.github}</div>` : ''}
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
                <div class="dates">${exp.duration}</div>
                <div class="job-title">${exp.position}</div>
                <div class="company">${exp.company}</div>
                <div class="clear"></div>
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
                <div class="dates">${edu.duration}</div>
                <div class="degree-title">${edu.degree}</div>
                <div class="institution">${edu.institution}</div>
                <div class="clear"></div>
                ${edu.gpa ? `<div style="margin-top: 4px;">GPA: ${edu.gpa}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.skills && data.skills.length > 0 ? `
    <div class="section">
        <div class="section-title">Technical Skills</div>
        <div class="skills-section">
            <div class="skills-list">
                ${data.skills.join(' • ')}
            </div>
        </div>
    </div>
    ` : ''}

    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Notable Projects</div>
        ${data.projects.map(project => `
            <div class="project-item">
                <div class="project-title">${project.title}</div>
                ${project.role ? `<div class="project-role">${project.role}</div>` : ''}
                ${project.type ? `<div class="project-type">${project.type}</div>` : ''}
                ${project.duration ? `<div class="project-duration">${project.duration}</div>` : ''}
                <div class="project-description">${project.description}</div>
                ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies">Technologies Used: ${project.technologies.join(', ')}</div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.certifications && data.certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Professional Certifications</div>
        ${data.certifications.map(cert => `
            <div class="cert-item">
                <span class="cert-name">${cert.name}</span>
                <span class="cert-details"> - ${cert.issuer} ${cert.date ? `(${cert.date})` : ''}</span>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.achievements && data.achievements.length > 0 ? `
    <div class="section">
        <div class="section-title">Achievements & Awards</div>
        ${data.achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-title">${achievement.title}</div>
                ${achievement.issuer ? `<div class="cert-details">${achievement.issuer}</div>` : ''}
                ${achievement.date ? `<div class="cert-details">${achievement.date}</div>` : ''}
                ${achievement.description ? `<div class="project-description">${achievement.description}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.languages && data.languages.length > 0 ? `
    <div class="section">
        <div class="section-title">Languages</div>
        <div class="skills-list">
            ${data.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}
        </div>
    </div>
    ` : ''}

    ${data.hobbies && data.hobbies.length > 0 ? `
    <div class="section">
        <div class="section-title">Interests</div>
        <div class="skills-list">
            ${data.hobbies.join(' • ')}
        </div>
    </div>
    ` : ''}
</body>
</html>`
};

// ATS-Friendly Template 6: Executive Layout
export const atsExecutiveTemplate: ATSTemplate = {
  id: 'ats-executive',
  name: 'ATS Executive',
  description: 'Sophisticated executive-level design with elegant styling suitable for senior leadership positions',
  category: 'professional',
  generateHTML: (data: ResumeData) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Executive Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1a202c;
            background: #ffffff;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px double #2d3748;
        }
        
        .name {
            font-size: 22pt;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
        }
        
        .professional-title {
            font-size: 16pt;
            font-weight: 500;
            color: #4a5568;
            margin-bottom: 12px;
            font-style: italic;
            text-transform: capitalize;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #718096;
            line-height: 1.4;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .contact-info div {
            margin-bottom: 3px;
        }
        
        .section {
            margin-bottom: 28px;
        }
        
        .section-title {
            font-size: 13pt;
            font-weight: 600;
            color: #2d3748;
            text-transform: uppercase;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #cbd5e0;
            letter-spacing: 0.8px;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 30px;
            height: 2px;
            background: #4a5568;
        }
        
        .summary {
            font-size: 12pt;
            line-height: 1.6;
            color: #2d3748;
            text-align: justify;
            font-style: italic;
            border-left: 3px solid #e2e8f0;
            padding-left: 20px;
            margin-left: 10px;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px dotted #e2e8f0;
        }
        
        .experience-item:last-child, .education-item:last-child {
            border-bottom: none;
        }
        
        .job-title, .degree-title {
            font-size: 13pt;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 4px;
        }
        
        .company, .institution {
            font-size: 12pt;
            font-weight: 500;
            color: #4a5568;
            margin-bottom: 4px;
        }
        
        .dates {
            font-size: 10pt;
            color: #718096;
            margin-bottom: 10px;
            font-style: italic;
            float: right;
            background: #f7fafc;
            padding: 2px 8px;
            border-radius: 4px;
        }
        
        .clear {
            clear: both;
        }
        
        .description ul {
            margin: 10px 0 0 25px;
            padding: 0;
        }
        
        .description li {
            margin-bottom: 6px;
            font-size: 11pt;
            color: #4a5568;
            line-height: 1.5;
        }
        
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }
        
        .skill-group {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 10pt;
            font-weight: 500;
            color: #2d3748;
        }
        
        .project-item {
            margin-bottom: 18px;
            padding: 15px;
            background: #fafafa;
            border-left: 4px solid #cbd5e0;
            border-radius: 0 6px 6px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        
        .project-title {
            font-size: 12pt;
            font-weight: 600;
            color: #2d3748;
            flex: 1;
        }
        
        .project-role {
            font-size: 10pt;
            color: #4299e1;
            font-style: italic;
            font-weight: 500;
            text-align: right;
            padding-left: 15px;
        }
        
        .project-type {
            font-size: 9pt;
            color: #718096;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .project-timeframe {
            font-size: 9pt;
            color: #718096;
            font-style: italic;
            margin-bottom: 8px;
            background: #e2e8f0;
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
        }
        
        .project-description {
            font-size: 11pt;
            color: #4a5568;
            margin-bottom: 8px;
            line-height: 1.5;
        }
        
        .technologies {
            font-size: 9pt;
            color: #718096;
            font-style: italic;
            background: #ffffff;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }
        
        .cert-item {
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #f1f1f1;
        }
        
        .cert-name {
            font-size: 11pt;
            font-weight: 600;
            color: #2d3748;
            display: block;
            margin-bottom: 2px;
        }
        
        .cert-details {
            font-size: 10pt;
            color: #718096;
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
            .dates {
                float: none;
                background: none;
                padding: 0;
                display: inline;
            }
            .project-item {
                background: none;
                border: 1px solid #ccc;
            }
            .skill-group {
                background: none;
                border: 1px solid #ccc;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        ${data.personalInfo.professionalTitle ? `<div class="professional-title">${data.personalInfo.professionalTitle}</div>` : ''}
        <div class="contact-info">
            ${data.personalInfo.email ? `<div>✉ ${data.personalInfo.email}</div>` : ''}
            ${data.personalInfo.phone ? `<div>☎ ${data.personalInfo.phone}</div>` : ''}
            ${data.personalInfo.address ? `<div>⌂ ${data.personalInfo.address}</div>` : ''}
            ${data.personalInfo.linkedIn ? `<div>💼 ${data.personalInfo.linkedIn}</div>` : ''}
            ${data.personalInfo.github ? `<div>⚡ ${data.personalInfo.github}</div>` : ''}
        </div>
    </div>

    ${data.summary ? `
    <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="summary">${data.summary}</div>
    </div>
    ` : ''}

    ${data.experience && data.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Executive Experience</div>
        ${data.experience.map(exp => `
            <div class="experience-item">
                <div class="dates">${exp.duration}</div>
                <div class="job-title">${exp.position}</div>
                <div class="company">${exp.company}</div>
                <div class="clear"></div>
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
        <div class="section-title">Education & Credentials</div>
        ${data.education.map(edu => `
            <div class="education-item">
                <div class="dates">${edu.duration}</div>
                <div class="degree-title">${edu.degree}</div>
                <div class="institution">${edu.institution}</div>
                <div class="clear"></div>
                ${edu.gpa ? `<div style="margin-top: 6px; font-style: italic; color: #718096;">Academic Performance: ${edu.gpa}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.skills && data.skills.length > 0 ? `
    <div class="section">
        <div class="section-title">Core Competencies</div>
        <div class="skills-container">
            ${data.skills.map(skill => `<span class="skill-group">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Strategic Initiatives</div>
        ${data.projects.map(project => `
            <div class="project-item">
                <div class="project-header">
                    <div class="project-title">${project.title}</div>
                    ${project.role ? `<div class="project-role">${project.role}</div>` : ''}
                </div>
                ${project.type ? `<div class="project-type">${project.type}</div>` : ''}
                ${project.duration ? `<div class="project-timeframe">${project.duration}</div>` : ''}
                <div class="project-description">${project.description}</div>
                ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies">Key Technologies: ${project.technologies.join(', ')}</div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.certifications && data.certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Professional Certifications</div>
        ${data.certifications.map(cert => `
            <div class="cert-item">
                <div class="cert-name">${cert.name}</div>
                <div class="cert-details">${cert.issuer} ${cert.date ? `• Earned ${cert.date}` : ''}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.achievements && data.achievements.length > 0 ? `
    <div class="section">
        <div class="section-title">Awards & Recognition</div>
        ${data.achievements.map(achievement => `
            <div class="cert-item">
                <div class="cert-name">${achievement.title}</div>
                <div class="cert-details">
                    ${achievement.issuer ? `${achievement.issuer} ` : ''}
                    ${achievement.date ? `• ${achievement.date}` : ''}
                </div>
                ${achievement.description ? `<div style="margin-top: 6px; font-size: 10pt; color: #4a5568;">${achievement.description}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.languages && data.languages.length > 0 ? `
    <div class="section">
        <div class="section-title">Languages</div>
        <div class="skills-container">
            ${data.languages.map(lang => `<span class="skill-group">${lang.name} (${lang.proficiency})</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${data.hobbies && data.hobbies.length > 0 ? `
    <div class="section">
        <div class="section-title">Personal Interests</div>
        <div style="font-size: 11pt; color: #4a5568; line-height: 1.5;">
            ${data.hobbies.join(' • ')}
        </div>
    </div>
    ` : ''}
</body>
</html>`
};

// Get all available templates
export const atsTemplates: ATSTemplate[] = [
  atsCleanTemplate,
  atsTwoColumnTemplate,
  atsModernTemplate,
  atsMinimalTemplate,
  atsProfessionalTemplate,
  atsExecutiveTemplate
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