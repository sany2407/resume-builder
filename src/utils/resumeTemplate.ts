import { ResumeData } from '../contexts/ResumeContext';

export function generateResumeHTML(resumeData: ResumeData): string {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${personalInfo.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .resume-header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .resume-header h1 {
            font-size: 2.5rem;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            font-size: 0.95rem;
            color: #666;
        }
        
        .contact-info span {
            display: flex;
            align-items: center;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            font-size: 1.4rem;
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .summary {
            font-size: 1rem;
            line-height: 1.7;
            color: #555;
            text-align: justify;
        }
        
        .experience-item, .education-item, .project-item, .certification-item {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-left: 4px solid #2563eb;
        }
        
        .experience-header, .education-header, .project-header, .certification-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }
        
        .job-title, .degree, .project-name, .certification-name {
            font-size: 1.1rem;
            font-weight: bold;
            color: #1e40af;
        }
        
        .company, .institution, .issuer {
            font-size: 1rem;
            color: #666;
            margin-top: 2px;
        }
        
        .duration, .date {
            font-size: 0.9rem;
            color: #888;
            font-style: italic;
            white-space: nowrap;
        }
        
        .description {
            margin-top: 10px;
        }
        
        .description ul {
            list-style-type: disc;
            margin-left: 20px;
        }
        
        .description li {
            margin-bottom: 5px;
            color: #555;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
        }
        
        .skill-item {
            background: #e0e7ff;
            color: #3730a3;
            padding: 8px 12px;
            border-radius: 20px;
            text-align: center;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .technologies {
            margin-top: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        
        .tech-tag {
            background: #fef3c7;
            color: #92400e;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .gpa {
            color: #059669;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            body {
                padding: 20px;
            }
            
            .resume-header h1 {
                font-size: 2rem;
            }
            
            .contact-info {
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }
            
            .experience-header, .education-header, .project-header, .certification-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .skills-grid {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            }
        }
        
        @media print {
            body {
                padding: 20px;
                font-size: 12px;
            }
            
            .resume-header h1 {
                font-size: 24px;
            }
            
            .section h2 {
                font-size: 16px;
            }
            
            .experience-item, .education-item, .project-item, .certification-item {
                page-break-inside: avoid;
                margin-bottom: 15px;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <!-- Header Section -->
    <div class="resume-header">
        <h1>${personalInfo.name}</h1>
        <div class="contact-info">
            ${personalInfo.email ? `<span>📧 ${personalInfo.email}</span>` : ''}
            ${personalInfo.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
            ${personalInfo.address ? `<span>📍 ${personalInfo.address}</span>` : ''}
            ${personalInfo.linkedIn ? `<span>🔗 ${personalInfo.linkedIn}</span>` : ''}
            ${personalInfo.github ? `<span>💻 ${personalInfo.github}</span>` : ''}
        </div>
    </div>

    <!-- Summary Section -->
    ${summary ? `
    <div class="section">
        <h2>Professional Summary</h2>
        <div class="summary">${summary}</div>
    </div>
    ` : ''}

    <!-- Experience Section -->
    ${experience && experience.length > 0 ? `
    <div class="section">
        <h2>Work Experience</h2>
        ${experience.map(exp => `
            <div class="experience-item">
                <div class="experience-header">
                    <div>
                        <div class="job-title">${exp.position}</div>
                        <div class="company">${exp.company}</div>
                    </div>
                    <div class="duration">${exp.duration}</div>
                </div>
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

    <!-- Education Section -->
    ${education && education.length > 0 ? `
    <div class="section">
        <h2>Education</h2>
        ${education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <div>
                        <div class="degree">${edu.degree}</div>
                        <div class="institution">${edu.institution}</div>
                        ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                    <div class="duration">${edu.duration}</div>
                </div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <!-- Skills Section -->
    ${skills && skills.length > 0 ? `
    <div class="section">
        <h2>Skills</h2>
        <div class="skills-grid">
            ${skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
        </div>
    </div>
    ` : ''}

    <!-- Projects Section -->
    ${projects && projects.length > 0 ? `
    <div class="section">
        <h2>Projects</h2>
        ${projects.map(project => `
            <div class="project-item">
                <div class="project-header">
                    <div class="project-name">${project.name}</div>
                </div>
                <div class="description">${project.description}</div>
                ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    <!-- Certifications Section -->
    ${certifications && certifications.length > 0 ? `
    <div class="section">
        <h2>Certifications</h2>
        ${certifications.map(cert => `
            <div class="certification-item">
                <div class="certification-header">
                    <div>
                        <div class="certification-name">${cert.name}</div>
                        <div class="issuer">${cert.issuer}</div>
                    </div>
                    <div class="date">${cert.date}</div>
                </div>
            </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;
}

// Alternative simpler template for testing
export function generateSimpleResumeHTML(resumeData: ResumeData): string {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${resumeData.personalInfo.name} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2563eb; text-align: center; }
        h2 { color: #1e40af; border-bottom: 2px solid #e5e7eb; }
        .contact { text-align: center; margin: 20px 0; }
        .section { margin: 30px 0; }
        .item { margin: 15px 0; padding: 10px; background: #f8fafc; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #e0e7ff; padding: 5px 10px; border-radius: 15px; }
    </style>
</head>
<body>
    <h1>${resumeData.personalInfo.name}</h1>
    <div class="contact">
        ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}
        ${resumeData.personalInfo.address ? ` | ${resumeData.personalInfo.address}` : ''}
    </div>
    
    ${resumeData.summary ? `
    <div class="section">
        <h2>Summary</h2>
        <p>${resumeData.summary}</p>
    </div>
    ` : ''}
    
    <div class="section">
        <h2>Experience</h2>
        ${resumeData.experience.map(exp => `
        <div class="item">
            <h3>${exp.position} at ${exp.company}</h3>
            <p><em>${exp.duration}</em></p>
            ${exp.description.map(desc => `<p>• ${desc}</p>`).join('')}
        </div>
        `).join('')}
    </div>
    
    <div class="section">
        <h2>Education</h2>
        ${resumeData.education.map(edu => `
        <div class="item">
            <h3>${edu.degree}</h3>
            <p>${edu.institution} | ${edu.duration}</p>
        </div>
        `).join('')}
    </div>
    
    <div class="section">
        <h2>Skills</h2>
        <div class="skills">
            ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>
</body>
</html>`;
}