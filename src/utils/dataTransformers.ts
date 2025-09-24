import { ResumeData } from '../contexts/ResumeContext';

/**
 * Gets formatted contact information
 */
export function getFormattedContact(data: ResumeData): {
  name: string;
  email: string;
  phone: string;
  location: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  professionalTitle?: string;
} {
  const additionalLinks = data.additionalInfo?.additional || [];
  
  // Handle address from different sources
  let address = '';
  if (data.personalInfo?.address) {
    address = data.personalInfo.address;
  } else if (data.department && data.college) {
    address = `${data.department}, ${data.college}`;
  } else if (data.department) {
    address = data.department;
  } else if (data.college) {
    address = data.college;
  }
  
  return {
    name: data.name || data.personalInfo?.name || '',
    email: data.email || data.personalInfo?.email || '',
    phone: data.phoneNumber || data.personalInfo?.phone || '',
    location: address,
    portfolio: additionalLinks.find(item => 
      item.title.toLowerCase().includes('portfolio') || 
      item.url?.includes('netlify') || 
      item.url?.includes('vercel')
    )?.url,
    linkedin: additionalLinks.find(item => 
      item.url?.toLowerCase().includes('linkedin')
    )?.url,
    github: additionalLinks.find(item => 
      item.url?.toLowerCase().includes('github')
    )?.url,
    professionalTitle: data.personalInfo?.professionalTitle || data.highlights || '',
  };
}

/**
 * Gets formatted projects with better structure
 */
export function getFormattedProjects(data: ResumeData): Array<{
  title: string;
  description: string;
  role: string;
  type: string;
  duration: string;
  technologies: string[];
  links: string[];
}> {
  const projects = data.projects || [];
  
  return projects.map(project => {
    // Handle both old and new project structures
    const title = project.title || project.name || 'Untitled Project';
    const description = project.description || 'No description available';
    const role = project.role || '';
    const type = project.type || '';
    
    // Format duration from dates if available
    let duration = '';
    if (project.startDate && project.endDate && !project.currentlyWorking) {
      duration = formatDateRange(project.startDate, project.endDate, false);
    } else if (project.startDate && project.currentlyWorking) {
      duration = formatDateRange(project.startDate, undefined, true);
    } else if (project.duration) {
      duration = project.duration;
    }
    
    // Handle technologies - either from explicit array or extract from description
    let technologies: string[] = [];
    if (project.technologies && Array.isArray(project.technologies)) {
      technologies = project.technologies;
    } else {
      technologies = extractTechnologiesFromDescription(description);
    }
    
    // Handle links
    const links = project.link || [];
    
    return {
      title,
      description,
      role,
      type,
      duration,
      technologies,
      links,
    };
  });
}

/**
 * Extracts portfolio/additional links from resume data
 */
export function extractAdditionalLinks(data: ResumeData): Array<{title: string, url: string, description: string}> {
  return (data.additionalInfo?.additional || []).map(item => ({
    title: item.title || '',
    url: item.url || '',
    description: item.description || '',
  }));
}

/**
 * Extracts activities/certifications from resume data
 */
export function extractActivities(data: ResumeData): Array<{title: string, description: string}> {
  return (data.additionalInfo?.activities || []).map(activity => ({
    title: activity.title || '',
    description: activity.description || '',
  }));
}

/**
 * Gets formatted experiences with better structure
 */
export function getFormattedExperiences(data: ResumeData): Array<{
  company: string;
  position: string;
  duration: string;
  description: string[];
  location?: string;
  employmentType?: string;
}> {
  // Handle both experience and experiences arrays
  const experiences = data.experiences || data.experience || [];
  
  return experiences.map(exp => {
    // Handle both old and new experience structures
    const company = exp.company || (exp as any).companyName || '';
    const position = exp.position || (exp as any).designation || '';
    
    // Format duration
    let duration = exp.duration || '';
    if (!duration && (exp as any).startDate) {
      const startDate = (exp as any).startDate;
      const endDate = (exp as any).endDate;
      const currentlyWorking = (exp as any).currentlyWorking;
      duration = formatDateRange(startDate, endDate, currentlyWorking);
    }
    
    // Handle description - convert string to array if needed
    let description: string[] = [];
    if (Array.isArray(exp.description)) {
      description = exp.description;
    } else if (typeof exp.description === 'string') {
      description = [exp.description];
    } else if ((exp as any).description) {
      description = [String((exp as any).description)];
    }
    
    return {
      company,
      position,
      duration,
      description,
      location: (exp as any).location,
      employmentType: (exp as any).employmentType,
    };
  });
}

/**
 * Gets formatted education with better structure
 */
export function getFormattedEducation(data: ResumeData): Array<{
  institution: string;
  degree: string;
  duration: string;
  gpa?: string;
  fieldOfStudy?: string;
  course?: string;
  percentage?: number;
}> {
  const education = data.education || [];
  
  return education.map(edu => {
    // Handle both old and new education structures
    const institution = edu.institution || '';
    let degree = edu.degree || '';
    
    // Build degree from course and specialization if available
    if ((edu as any).course && (edu as any).fieldOfStudy) {
      degree = `${(edu as any).course} in ${(edu as any).fieldOfStudy}`;
      if ((edu as any).specialization) {
        degree += ` - ${(edu as any).specialization}`;
      }
    } else if ((edu as any).course) {
      degree = (edu as any).course;
    } else if ((edu as any).fieldOfStudy) {
      degree = (edu as any).fieldOfStudy;
    }
    
    // Format duration
    let duration = edu.duration || '';
    if (!duration && (edu as any).startYear && (edu as any).yearOfPassing) {
      const startYear = new Date((edu as any).startYear).getFullYear();
      const endYear = new Date((edu as any).yearOfPassing).getFullYear();
      duration = `${startYear} - ${endYear}`;
    }
    
    // Handle GPA/Percentage
    let gpa = edu.gpa;
    if (!gpa && (edu as any).percentage) {
      gpa = `${(edu as any).percentage}%`;
    }
    
    return {
      institution,
      degree,
      duration,
      gpa,
      fieldOfStudy: (edu as any).fieldOfStudy,
      course: (edu as any).course,
      percentage: (edu as any).percentage,
    };
  });
}

/**
 * Gets formatted skills array
 */
export function getFormattedSkills(data: ResumeData): string[] {
  const skills = data.skills || [];
  
  // Handle both string array and object array formats
  if (Array.isArray(skills)) {
    return skills.map(skill => {
      if (typeof skill === 'string') {
        return skill;
      } else if (skill && typeof skill === 'object' && 'name' in skill) {
        return skill.name;
      }
      return String(skill);
    }).filter(Boolean);
  }
  
  return [];
}

/**
 * Formats date range for experience entries
 */
function formatDateRange(startDate: string, endDate?: string, currentlyWorking?: boolean): string {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const start = startDate ? formatDate(startDate) : '';
  
  if (currentlyWorking) {
    return `${start} - Present`;
  }
  
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} - ${end}`;
}

/**
 * Extracts technologies from project description
 */
function extractTechnologiesFromDescription(description: string): string[] {
  // Common technology patterns to extract
  const techPatterns = [
    /React\.?js?/gi, /Node\.?js?/gi, /Express\.?js?/gi, /MongoDB/gi, /MySQL/gi,
    /JavaScript/gi, /TypeScript/gi, /Python/gi, /Java/gi, /PHP/gi,
    /HTML5?/gi, /CSS3?/gi, /Bootstrap/gi, /Tailwind/gi, /SCSS/gi,
    /Three\.js/gi, /GSAP/gi, /WordPress/gi, /Vue\.?js?/gi, /Angular/gi,
    /Docker/gi, /AWS/gi, /Firebase/gi, /Netlify/gi, /Vercel/gi,
  ];
  
  const extractedTechs: string[] = [];
  
  techPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const normalizedTech = match.replace(/\.js?$/i, '.js');
        if (!extractedTechs.includes(normalizedTech)) {
          extractedTechs.push(normalizedTech);
        }
      });
    }
  });
  
  return extractedTechs.slice(0, 5); // Limit to top 5 technologies
}