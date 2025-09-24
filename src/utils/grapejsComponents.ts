import type { Editor } from 'grapesjs';
import { ResumeData } from '../contexts/ResumeContext';

// Define GrapeJS component types for resume sections
export const setupResumeComponents = (editor: Editor) => {
  
  // Header Component with direct editing
  editor.DomComponents.addType('resume-header', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['resume-header'],
        droppable: true,
        editable: true,
        style: {
          'text-align': 'center',
          'margin-bottom': '30px',
          'padding-bottom': '20px',
          'border-bottom': '2px solid #2563eb',
          'cursor': 'pointer',
          'position': 'relative'
        },
        attributes: {
          'data-gjs-highlightable': 'true',
          'data-gjs-hoverable': 'true'
        }
      },
      
      init() {
        this.updateContent();
        
        // Add click handler for inline editing
        this.view?.on('click', () => {
          this.enableInlineEditing();
        });
      },
      
      enableInlineEditing() {
        const element = this.view?.el;
        if (!element) return;
        
        // Create editable form overlay
        const overlay = document.createElement('div');
        overlay.className = 'inline-edit-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 1000;
        `;
        
        const attrs = this.getAttributes();
        overlay.innerHTML = `
          <h4 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Edit Header Information</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <input type="text" id="edit-name" placeholder="Full Name" value="${attrs.name || ''}" 
                   style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
            <input type="email" id="edit-email" placeholder="Email" value="${attrs.email || ''}" 
                   style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
            <input type="tel" id="edit-phone" placeholder="Phone" value="${attrs.phone || ''}" 
                   style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
            <input type="text" id="edit-address" placeholder="Address" value="${attrs.address || ''}" 
                   style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
            <input type="url" id="edit-linkedin" placeholder="LinkedIn URL" value="${attrs.linkedin || ''}" 
                   style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
            <input type="url" id="edit-github" placeholder="GitHub URL" value="${attrs.github || ''}" 
                   style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancel-edit" style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            <button id="save-edit" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
          </div>
        `;
        
        element.appendChild(overlay);
        
        // Handle save
        overlay.querySelector('#save-edit')?.addEventListener('click', () => {
          const newAttrs = {
            name: (overlay.querySelector('#edit-name') as HTMLInputElement)?.value || '',
            email: (overlay.querySelector('#edit-email') as HTMLInputElement)?.value || '',
            phone: (overlay.querySelector('#edit-phone') as HTMLInputElement)?.value || '',
            address: (overlay.querySelector('#edit-address') as HTMLInputElement)?.value || '',
            linkedin: (overlay.querySelector('#edit-linkedin') as HTMLInputElement)?.value || '',
            github: (overlay.querySelector('#edit-github') as HTMLInputElement)?.value || ''
          };
          
          this.setAttributes(newAttrs);
          this.updateContent();
          overlay.remove();
        });
        
        // Handle cancel
        overlay.querySelector('#cancel-edit')?.addEventListener('click', () => {
          overlay.remove();
        });
        
        // Close on click outside
        setTimeout(() => {
          document.addEventListener('click', function closeOverlay(e) {
            if (!overlay.contains(e.target as Node)) {
              overlay.remove();
              document.removeEventListener('click', closeOverlay);
            }
          });
        }, 100);
      },
      
      updateContent() {
        const attrs = this.getAttributes();
        const name = attrs.name || 'Click to edit your name';
        const email = attrs.email || '';
        const phone = attrs.phone || '';
        const address = attrs.address || '';
        const linkedin = attrs.linkedin || '';
        const github = attrs.github || '';
        
        const contactInfo = [email, phone, address, linkedin, github]
          .filter(item => item)
          .join(' • ') || 'Click to add contact information';
        
        this.set('content', `
          <div class="name" style="font-size: 2.5rem; font-weight: bold; color: #1e40af; margin-bottom: 10px; cursor: pointer;">
            ${name}
          </div>
          <div class="contact-info" style="font-size: 0.95rem; color: #666; cursor: pointer;">
            ${contactInfo}
          </div>
          <div style="position: absolute; top: 5px; right: 5px; background: rgba(59, 130, 246, 0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; opacity: 0; transition: opacity 0.3s;">✏️ Click to edit</div>
        `);
      }
    },
    
    view: {
      events: {
        mouseenter: 'showEditHint',
        mouseleave: 'hideEditHint',
        click: 'handleClick'
      },
      
      showEditHint() {
        const hint = this.el.querySelector('div[style*="position: absolute"]');
        if (hint) (hint as HTMLElement).style.opacity = '1';
      },
      
      hideEditHint() {
        const hint = this.el.querySelector('div[style*="position: absolute"]');
        if (hint) (hint as HTMLElement).style.opacity = '0';
      },
      
      handleClick(e: Event) {
        e.stopPropagation();
        this.model.enableInlineEditing();
      }
    }
  });

  // Summary Component
  editor.DomComponents.addType('resume-summary', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['resume-section', 'summary-section'],
        droppable: false,
        traits: [
          { type: 'textarea', name: 'summary', label: 'Professional Summary' }
        ],
        style: {
          'margin-bottom': '25px'
        }
      },
      
      init() {
        this.on('change:attributes', this.updateContent);
        this.updateContent();
      },
      
      updateContent() {
        const attrs = this.getAttributes();
        const summary = attrs.summary || 'Add your professional summary here...';
        
        this.set('content', `
          <h2 class="section-title" style="font-size: 1.4rem; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase;">
            Professional Summary
          </h2>
          <div class="summary-content" data-gjs-type="text" data-gjs-editable="true" style="font-size: 1rem; line-height: 1.7; color: #555;">
            ${summary}
          </div>
        `);
      }
    }
  });

  // Experience Component
  editor.DomComponents.addType('resume-experience', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['resume-section', 'experience-section'],
        droppable: true,
        style: {
          'margin-bottom': '25px'
        }
      },
      
      init() {
        this.set('content', `
          <h2 class="section-title" style="font-size: 1.4rem; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase;">
            Professional Experience
          </h2>
          <div class="experience-items"></div>
        `);
      }
    }
  });

  // Individual Experience Item Component
  editor.DomComponents.addType('experience-item', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['experience-item'],
        droppable: false,
        traits: [
          { type: 'text', name: 'position', label: 'Job Title' },
          { type: 'text', name: 'company', label: 'Company' },
          { type: 'text', name: 'duration', label: 'Duration' },
          { type: 'text', name: 'location', label: 'Location' },
          { type: 'textarea', name: 'description', label: 'Job Description (separate bullets with |)' }
        ],
        style: {
          'margin-bottom': '20px',
          'padding': '15px',
          'background': '#f8fafc',
          'border-left': '4px solid #2563eb',
          'border-radius': '4px'
        }
      },
      
      init() {
        this.on('change:attributes', this.updateContent);
        this.updateContent();
      },
      
      updateContent() {
        const attrs = this.getAttributes();
        const position = attrs.position || 'Job Title';
        const company = attrs.company || 'Company Name';
        const duration = attrs.duration || 'Start Date - End Date';
        const location = attrs.location || '';
        const description = attrs.description || '';
        
        const bullets = description.split('|').filter((item: string) => item.trim()).map((item: string) => 
          `<li style="margin-bottom: 5px; color: #555;">${item.trim()}</li>`
        ).join('');
        
        this.set('content', `
          <div class="job-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap;">
            <div>
              <div class="job-title" data-gjs-type="text" data-gjs-editable="true" style="font-size: 1.1rem; font-weight: bold; color: #1e40af;">${position}</div>
              <div class="company" data-gjs-type="text" data-gjs-editable="true" style="font-size: 1rem; color: #666; margin-top: 2px;">${company}</div>
              ${location ? `<div class="location" data-gjs-type="text" data-gjs-editable="true" style="font-size: 0.9rem; color: #888;">${location}</div>` : ''}
            </div>
            <div class="duration" data-gjs-type="text" data-gjs-editable="true" style="font-size: 0.9rem; color: #888; font-style: italic; white-space: nowrap;">${duration}</div>
          </div>
          ${bullets ? `<div data-gjs-type="text" data-gjs-editable="true" style="margin-top: 10px;"><ul style="list-style-type: disc; margin-left: 20px;">${bullets}</ul></div>` : ''}
        `);
      }
    }
  });

  // Education Component
  editor.DomComponents.addType('resume-education', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['resume-section', 'education-section'],
        droppable: true,
        style: {
          'margin-bottom': '25px'
        }
      },
      
      init() {
        this.set('content', `
          <h2 class="section-title" style="font-size: 1.4rem; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase;">
            Education
          </h2>
          <div class="education-items"></div>
        `);
      }
    }
  });

  // Individual Education Item Component
  editor.DomComponents.addType('education-item', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['education-item'],
        droppable: false,
        traits: [
          { type: 'text', name: 'degree', label: 'Degree' },
          { type: 'text', name: 'institution', label: 'Institution' },
          { type: 'text', name: 'duration', label: 'Duration' },
          { type: 'text', name: 'gpa', label: 'GPA' }
        ],
        style: {
          'margin-bottom': '15px',
          'padding': '15px',
          'background': '#f8fafc',
          'border-left': '4px solid #2563eb',
          'border-radius': '4px'
        }
      },
      
      init() {
        this.on('change:attributes', this.updateContent);
        this.updateContent();
      },
      
      updateContent() {
        const attrs = this.getAttributes();
        const degree = attrs.degree || 'Degree';
        const institution = attrs.institution || 'Institution';
        const duration = attrs.duration || 'Start - End';
        const gpa = attrs.gpa || '';
        
        this.set('content', `
          <div class="education-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap;">
            <div>
              <div class="degree-title" data-gjs-type="text" data-gjs-editable="true" style="font-size: 1.1rem; font-weight: bold; color: #1e40af;">${degree}</div>
              <div class="institution" data-gjs-type="text" data-gjs-editable="true" style="font-size: 1rem; color: #666; margin-top: 2px;">${institution}</div>
              ${gpa ? `<div class="gpa" data-gjs-type="text" data-gjs-editable="true" style="color: #059669; font-weight: 600; font-size: 0.9rem;">GPA: ${gpa}</div>` : ''}
            </div>
            <div class="duration" data-gjs-type="text" data-gjs-editable="true" style="font-size: 0.9rem; color: #888; font-style: italic; white-space: nowrap;">${duration}</div>
          </div>
        `);
      }
    }
  });

  // Skills Component
  editor.DomComponents.addType('resume-skills', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['resume-section', 'skills-section'],
        droppable: false,
        traits: [
          { type: 'textarea', name: 'skills', label: 'Skills (comma-separated)' }
        ],
        style: {
          'margin-bottom': '25px'
        }
      },
      
      init() {
        this.on('change:attributes', this.updateContent);
        this.updateContent();
      },
      
      updateContent() {
        const attrs = this.getAttributes();
        const skills = attrs.skills || '';
        
        const skillTags = skills.split(',').filter((skill: string) => skill.trim()).map((skill: string) =>
          `<span class="skill-tag" style="background: #e0e7ff; color: #3730a3; padding: 8px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 500; margin: 4px; display: inline-block;">
            ${skill.trim()}
          </span>`
        ).join('');
        
        this.set('content', `
          <h2 class="section-title" style="font-size: 1.4rem; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase;">
            Skills
          </h2>
          <div class="skills-grid" style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${skillTags}
          </div>
        `);
      }
    }
  });

  // Projects Component
  editor.DomComponents.addType('resume-projects', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['resume-section', 'projects-section'],
        droppable: true,
        style: {
          'margin-bottom': '25px'
        }
      },
      
      init() {
        this.set('content', `
          <h2 class="section-title" style="font-size: 1.4rem; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase;">
            Projects
          </h2>
          <div class="projects-items"></div>
        `);
      }
    }
  });

  // Individual Project Item Component
  editor.DomComponents.addType('project-item', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['project-item'],
        droppable: false,
        traits: [
          { type: 'text', name: 'name', label: 'Project Name' },
          { type: 'textarea', name: 'description', label: 'Description' },
          { type: 'text', name: 'technologies', label: 'Technologies (comma-separated)' },
          { type: 'text', name: 'url', label: 'Project URL' },
          { type: 'text', name: 'github', label: 'GitHub URL' }
        ],
        style: {
          'margin-bottom': '20px',
          'padding': '15px',
          'background': '#f8fafc',
          'border-left': '4px solid #2563eb',
          'border-radius': '4px'
        }
      },
      
      init() {
        this.on('change:attributes', this.updateContent);
        this.updateContent();
      },
      
      updateContent() {
        const attrs = this.getAttributes();
        const name = attrs.name || 'Project Name';
        const description = attrs.description || 'Project description...';
        const technologies = attrs.technologies || '';
        const url = attrs.url || '';
        const github = attrs.github || '';
        
        const techTags = technologies.split(',').filter((tech: string) => tech.trim()).map((tech: string) =>
          `<span class="tech-tag" style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; margin: 2px;">
            ${tech.trim()}
          </span>`
        ).join('');
        
        const links = [];
        if (url) links.push(`<a href="${url}" target="_blank" style="color: #2563eb; text-decoration: none;">Demo</a>`);
        if (github) links.push(`<a href="${github}" target="_blank" style="color: #2563eb; text-decoration: none;">GitHub</a>`);
        
        this.set('content', `
          <div class="project-header" style="margin-bottom: 8px;">
            <div class="project-name" data-gjs-type="text" data-gjs-editable="true" style="font-size: 1.1rem; font-weight: bold; color: #1e40af;">${name}</div>
            ${links.length > 0 ? `<div class="project-links" data-gjs-type="text" data-gjs-editable="true" style="margin-top: 4px; font-size: 0.9rem;">${links.join(' | ')}</div>` : ''}
          </div>
          <div class="project-description" data-gjs-type="text" data-gjs-editable="true" style="margin-bottom: 8px; color: #555; line-height: 1.5;">${description}</div>
          ${techTags ? `<div class="technologies" style="margin-top: 8px;">${techTags}</div>` : ''}
        `);
      }
    }
  });

  // Base resume container
  editor.DomComponents.addType('resume-container', {
    model: {
      defaults: {
        tagName: 'div',
        classes: ['resume-container'],
        droppable: true,
        style: {
          'max-width': '800px',
          'margin': '0 auto',
          'padding': '40px',
          'font-family': 'Arial, sans-serif',
          'line-height': '1.6',
          'color': '#333',
          'background': 'white'
        }
      }
    }
  });

  // Add custom blocks to the block manager
  editor.BlockManager.add('resume-header', {
    label: 'Header',
    category: 'Resume Sections',
    content: { type: 'resume-header' },
    media: '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
  });

  editor.BlockManager.add('resume-summary', {
    label: 'Summary',
    category: 'Resume Sections',
    content: { type: 'resume-summary' },
    media: '<svg viewBox="0 0 24 24"><path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,5 21,5 21,5A2,2 0 0,0 19,3Z"/></svg>',
  });

  editor.BlockManager.add('experience-item', {
    label: 'Experience Item',
    category: 'Resume Sections',
    content: { type: 'experience-item' },
    media: '<svg viewBox="0 0 24 24"><path d="M14,6V4H10V6H8V10H6V12H8V16H10V18H14V16H16V12H18V10H16V6H14M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/></svg>',
  });

  editor.BlockManager.add('education-item', {
    label: 'Education Item',
    category: 'Resume Sections',
    content: { type: 'education-item' },
    media: '<svg viewBox="0 0 24 24"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/></svg>',
  });

  editor.BlockManager.add('resume-skills', {
    label: 'Skills',
    category: 'Resume Sections',
    content: { type: 'resume-skills' },
    media: '<svg viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>',
  });

  editor.BlockManager.add('project-item', {
    label: 'Project Item',
    category: 'Resume Sections',
    content: { type: 'project-item' },
    media: '<svg viewBox="0 0 24 24"><path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,5 21,5 21,5A2,2 0 0,0 19,3H18V1M17,12H12V17H17V12Z"/></svg>',
  });

  // Add simple text block for additional content
  editor.BlockManager.add('resume-text', {
    label: 'Text Block',
    category: 'Resume Sections',
    content: {
      type: 'text',
      content: 'Click here to edit text content...',
      style: {
        'padding': '10px',
        'margin': '10px 0',
        'min-height': '50px',
        'border': '1px dashed #ccc'
      },
      attributes: {
        'data-gjs-type': 'text',
        'data-gjs-editable': 'true'
      }
    },
    media: '<svg viewBox="0 0 24 24"><path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z"/></svg>',
  });

  // Add divider block
  editor.BlockManager.add('resume-divider', {
    label: 'Divider',
    category: 'Resume Sections',
    content: {
      tagName: 'hr',
      style: {
        'border': 'none',
        'border-top': '1px solid #ddd',
        'margin': '20px 0',
        'height': '1px'
      }
    },
    media: '<svg viewBox="0 0 24 24"><path d="M19,13H5V11H19V13Z"/></svg>',
  });
};

// Function to populate GrapeJS editor with parsed resume data
export const populateEditorWithResumeData = (editor: Editor, resumeData: ResumeData) => {
  // Setup custom components first
  setupResumeComponents(editor);

  // Clear existing content
  editor.setComponents('');

  // Create the main container
  const container = editor.addComponents({
    type: 'resume-container'
  })[0];

  // Add header section
  container.append({
    type: 'resume-header',
    attributes: {
      name: resumeData.personalInfo.name,
      email: resumeData.personalInfo.email,
      phone: resumeData.personalInfo.phone,
      address: resumeData.personalInfo.address,
      linkedin: resumeData.personalInfo.linkedIn || '',
      github: resumeData.personalInfo.github || ''
    }
  });

  // Add summary section if available
  if (resumeData.summary) {
    container.append({
      type: 'resume-summary',
      attributes: {
        summary: resumeData.summary
      }
    });
  }

  // Add experience section
  if (resumeData.experience && resumeData.experience.length > 0) {
    const experienceSection = container.append({
      type: 'resume-experience'
    })[0];

    // Add experience items directly to the experience section
    resumeData.experience.forEach(exp => {
      experienceSection.append({
        type: 'experience-item',
        attributes: {
          position: exp.position,
          company: exp.company,
          duration: exp.duration,
          description: exp.description.join(' | ')
        }
      });
    });
  }

  // Add education section
  if (resumeData.education && resumeData.education.length > 0) {
    const educationSection = container.append({
      type: 'resume-education'
    })[0];

    // Add education items directly to the education section
    resumeData.education.forEach(edu => {
      educationSection.append({
        type: 'education-item',
        attributes: {
          degree: edu.degree,
          institution: edu.institution,
          duration: edu.duration,
          gpa: edu.gpa || ''
        }
      });
    });
  }

  // Add skills section
  if (resumeData.skills && resumeData.skills.length > 0) {
    container.append({
      type: 'resume-skills',
      attributes: {
        skills: resumeData.skills.join(', ')
      }
    });
  }

  // Add projects section if available
  if (resumeData.projects && resumeData.projects.length > 0) {
    const projectsSection = container.append({
      type: 'resume-projects'
    })[0];

    // Add project items directly to the projects section
    resumeData.projects.forEach(project => {
      projectsSection.append({
        type: 'project-item',
        attributes: {
          name: project.name,
          description: project.description,
          technologies: project.technologies.join(', ')
        }
      });
    });
  }

  // Refresh the editor
  editor.refresh();
};

// Function to extract resume data from GrapeJS editor
export const extractResumeDataFromEditor = (editor: Editor): Partial<ResumeData> => {
  const components = editor.getComponents();
  const resumeData: Partial<ResumeData> = {};

  // Extract data from components
  components.each((component: unknown) => {
    const comp = component as { get: (key: string) => string; getAttributes: () => Record<string, string> };
    const type = comp.get('type');
    const attrs = comp.getAttributes();

    switch (type) {
      case 'resume-header':
        resumeData.personalInfo = {
          name: attrs.name || '',
          email: attrs.email || '',
          phone: attrs.phone || '',
          address: attrs.address || '',
          linkedIn: attrs.linkedin || '',
          github: attrs.github || ''
        };
        break;

      case 'resume-summary':
        resumeData.summary = attrs.summary || '';
        break;

      case 'resume-skills':
        resumeData.skills = attrs.skills ? attrs.skills.split(',').map((s: string) => s.trim()) : [];
        break;
    }
  });

  return resumeData;
};