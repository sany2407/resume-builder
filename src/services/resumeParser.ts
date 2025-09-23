import pdf from 'pdf-parse';
import { ResumeData, ParsedResumeResult, ContactInfo, WorkExperience, Education, Skill } from '../types/resume';

export class ResumeParser {
  
  /**
   * Extract text from PDF buffer
   */
  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error}`);
    }
  }

  /**
   * Parse raw text into structured resume data
   */
  parseResumeText(text: string): ResumeData {
    const sections = this.identifySections(text);
    
    return {
      contactInfo: this.extractContactInfo(text, sections),
      summary: this.extractSummary(text, sections),
      workExperience: this.extractWorkExperience(text, sections),
      education: this.extractEducation(text, sections),
      skills: this.extractSkills(text, sections),
      projects: this.extractProjects(text, sections),
      certifications: this.extractCertifications(text, sections),
      languages: this.extractLanguages(text, sections),
      awards: this.extractAwards(text, sections)
    };
  }

  /**
   * Main parsing function
   */
  async parseResume(buffer: Buffer): Promise<ParsedResumeResult> {
    try {
      const rawText = await this.extractTextFromPDF(buffer);
      const data = this.parseResumeText(rawText);
      
      return {
        success: true,
        data,
        rawText
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        rawText: undefined
      };
    }
  }

  /**
   * Identify different sections in the resume
   */
  private identifySections(text: string): Map<string, { start: number; end: number }> {
    const sections = new Map();
    const lines = text.split('\n');
    
    const sectionKeywords = [
      'experience', 'work experience', 'professional experience', 'employment',
      'education', 'academic background', 'qualifications',
      'skills', 'technical skills', 'core competencies',
      'projects', 'personal projects', 'key projects',
      'certifications', 'certificates', 'licenses',
      'summary', 'profile', 'objective', 'about',
      'awards', 'achievements', 'honors',
      'languages', 'language proficiency'
    ];

    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase().trim();
      sectionKeywords.forEach(keyword => {
        if (lowerLine === keyword || 
            lowerLine.startsWith(keyword) && lowerLine.length <= keyword.length + 3) {
          sections.set(keyword, { start: index, end: lines.length });
        }
      });
    });

    return sections;
  }

  /**
   * Extract contact information
   */
  private extractContactInfo(text: string, _sections: Map<string, { start: number; end: number }>): ContactInfo {
    const lines = text.split('\n').slice(0, 10); // Usually in first 10 lines
    
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/;
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/;
    const githubRegex = /github\.com\/[\w-]+/;

    let name = '';
    let email = '';
    let phone = '';
    let linkedin = '';
    let github = '';

    // Extract name (usually the first non-empty line)
    for (const line of lines) {
      if (line.trim() && !emailRegex.test(line) && !phoneRegex.test(line)) {
        name = line.trim();
        break;
      }
    }

    // Extract other contact info
    const fullText = lines.join(' ');
    const emailMatch = fullText.match(emailRegex);
    const phoneMatch = fullText.match(phoneRegex);
    const linkedinMatch = fullText.match(linkedinRegex);
    const githubMatch = fullText.match(githubRegex);

    if (emailMatch) email = emailMatch[0];
    if (phoneMatch) phone = phoneMatch[0];
    if (linkedinMatch) linkedin = linkedinMatch[0];
    if (githubMatch) github = githubMatch[0];

    return {
      name,
      email,
      phone,
      linkedin,
      github
    };
  }

  /**
   * Extract professional summary
   */
  private extractSummary(text: string, sections: Map<string, { start: number; end: number }>): string | undefined {
    const summarySection = sections.get('summary') || sections.get('profile') || sections.get('objective');
    if (!summarySection) return undefined;

    const lines = text.split('\n');
    const summaryLines = lines.slice(summarySection.start + 1, summarySection.start + 5);
    
    return summaryLines
      .filter(line => line.trim().length > 0)
      .join(' ')
      .trim() || undefined;
  }

  /**
   * Extract work experience
   */
  private extractWorkExperience(text: string, sections: Map<string, { start: number; end: number }>): WorkExperience[] {
    const experienceSection = sections.get('experience') || 
                             sections.get('work experience') || 
                             sections.get('professional experience');
    
    if (!experienceSection) return [];

    const lines = text.split('\n');
    const experienceLines = lines.slice(experienceSection.start + 1, experienceSection.end);
    
    const experiences: WorkExperience[] = [];
    let currentExperience: Partial<WorkExperience> = {};
    let collectingDescription = false;
    let descriptions: string[] = [];

    for (const line of experienceLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Check if this looks like a job title/company line
      if (this.looksLikeJobTitle(trimmedLine)) {
        // Save previous experience
        if (currentExperience.jobTitle && currentExperience.company) {
          experiences.push({
            jobTitle: currentExperience.jobTitle,
            company: currentExperience.company,
            startDate: currentExperience.startDate || '',
            endDate: currentExperience.endDate || '',
            location: currentExperience.location,
            description: descriptions
          });
        }

        // Parse new job info
        const jobInfo = this.parseJobLine(trimmedLine);
        currentExperience = jobInfo;
        descriptions = [];
        collectingDescription = true;
      } else if (collectingDescription && (trimmedLine.startsWith('•') || trimmedLine.startsWith('-'))) {
        descriptions.push(trimmedLine.substring(1).trim());
      } else if (collectingDescription && trimmedLine.length > 20) {
        descriptions.push(trimmedLine);
      }
    }

    // Don't forget the last experience
    if (currentExperience.jobTitle && currentExperience.company) {
      experiences.push({
        jobTitle: currentExperience.jobTitle,
        company: currentExperience.company,
        startDate: currentExperience.startDate || '',
        endDate: currentExperience.endDate || '',
        location: currentExperience.location,
        description: descriptions
      });
    }

    return experiences;
  }

  /**
   * Extract education information
   */
  private extractEducation(text: string, sections: Map<string, { start: number; end: number }>): Education[] {
    const educationSection = sections.get('education') || sections.get('academic background');
    if (!educationSection) return [];

    const lines = text.split('\n');
    const educationLines = lines.slice(educationSection.start + 1, educationSection.end);
    
    const educations: Education[] = [];
    
    for (const line of educationLines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length < 10) continue;

      if (this.looksLikeEducation(trimmedLine)) {
        const education = this.parseEducationLine(trimmedLine);
        if (education.degree && education.institution) {
          educations.push(education);
        }
      }
    }

    return educations;
  }

  /**
   * Extract skills
   */
  private extractSkills(text: string, sections: Map<string, { start: number; end: number }>): Skill[] {
    const skillsSection = sections.get('skills') || 
                         sections.get('technical skills') || 
                         sections.get('core competencies');
    
    if (!skillsSection) return [];

    const lines = text.split('\n');
    const skillsLines = lines.slice(skillsSection.start + 1, skillsSection.start + 10);
    
    const skills: Skill[] = [];
    
    for (const line of skillsLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Check if line contains a category and skills
      if (trimmedLine.includes(':')) {
        const [category, skillsText] = trimmedLine.split(':');
        const skillItems = skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        if (skillItems.length > 0) {
          skills.push({
            category: category.trim(),
            items: skillItems
          });
        }
      } else {
        // Treat as general skills
        const skillItems = trimmedLine.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (skillItems.length > 0) {
          skills.push({
            category: 'Technical Skills',
            items: skillItems
          });
        }
      }
    }

    return skills;
  }

  /**
   * Extract projects (placeholder - you can expand this)
   */
  private extractProjects(_text: string, _sections: Map<string, { start: number; end: number }>): undefined {
    // Implementation for projects extraction
    return undefined;
  }

  /**
   * Extract certifications (placeholder - you can expand this)
   */
  private extractCertifications(_text: string, _sections: Map<string, { start: number; end: number }>): undefined {
    // Implementation for certifications extraction
    return undefined;
  }

  /**
   * Extract languages (placeholder - you can expand this)
   */
  private extractLanguages(_text: string, _sections: Map<string, { start: number; end: number }>): undefined {
    // Implementation for languages extraction
    return undefined;
  }

  /**
   * Extract awards (placeholder - you can expand this)
   */
  private extractAwards(_text: string, _sections: Map<string, { start: number; end: number }>): undefined {
    // Implementation for awards extraction
    return undefined;
  }

  // Helper methods
  private looksLikeJobTitle(line: string): boolean {
    // Simple heuristic - contains company indicators
    const companyIndicators = ['inc', 'corp', 'llc', 'ltd', 'company', 'technologies', 'systems'];
    return companyIndicators.some(indicator => 
      line.toLowerCase().includes(indicator)
    ) || line.includes(' at ') || line.includes(' - ');
  }

  private parseJobLine(line: string): Partial<WorkExperience> {
    // Parse job title, company, dates from a line
    // This is a simplified parser - you might want to enhance it
    const parts = line.split(' - ').map(p => p.trim());
    
    if (parts.length >= 2) {
      return {
        jobTitle: parts[0],
        company: parts[1],
        // You can add date parsing logic here
      };
    }

    return {};
  }

  private looksLikeEducation(line: string): boolean {
    const educationKeywords = ['university', 'college', 'institute', 'school', 'bachelor', 'master', 'degree', 'phd'];
    return educationKeywords.some(keyword => 
      line.toLowerCase().includes(keyword)
    );
  }

  private parseEducationLine(line: string): Education {
    // Simple education parsing - you can enhance this
    return {
      degree: line.split(',')[0] || line,
      institution: line.split(',')[1] || 'Unknown',
      graduationDate: ''
    };
  }
}