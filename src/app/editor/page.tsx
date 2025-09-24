'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Editor } from 'grapesjs';
import StudioEditor, {
  StudioCommands,
  ToastVariant,
} from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';
import { presetPrintable, canvasFullSize, rteTinyMce } from '@grapesjs/studio-sdk-plugins';
import { useResume } from '../../contexts/ResumeContext';
import { populateEditorWithResumeData, setupResumeComponents } from '../../utils/grapejsComponents';
import TemplateSelector from '../../components/TemplateSelector';

export default function EditorPage() {
  const [editor, setEditor] = useState<Editor>();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const { resumeData, selectedTemplate: globalTemplate, isLoading } = useResume();
  const router = useRouter();
  
  // Initialize selectedTemplate from URL parameters or global context
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateFromUrl = urlParams.get('template');
    
    if (templateFromUrl) {
      console.log('Setting template from URL:', templateFromUrl);
      setSelectedTemplate(templateFromUrl);
    } else if (globalTemplate) {
      console.log('Setting template from global context:', globalTemplate);
      setSelectedTemplate(globalTemplate);
    } else {
      console.log('Setting default template: ats-clean');
      setSelectedTemplate('ats-clean');
    }
  }, [globalTemplate]);

  // React 19 compatibility: Suppress ref warnings from third-party libraries
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('element.ref was removed in React 19')) {
        return; // Suppress React 19 ref warnings from third-party libraries
      }
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  // Redirect based on data availability
  useEffect(() => {
    if (!isLoading) {
      if (!resumeData) {
        router.push('/'); // No resume data, go to upload
      } else if (!globalTemplate && !new URLSearchParams(window.location.search).get('template')) {
        router.push('/template-selection'); // Have resume data but no template selected
      }
    }
  }, [resumeData, globalTemplate, isLoading, router]);

  const onReady = (editor: Editor) => {
    console.log('Editor loaded', editor);
    setEditor(editor);
    
    // Setup custom resume components
    setupResumeComponents(editor);
  };
  
  // Apply template when editor and selectedTemplate are both ready
  useEffect(() => {
    if (editor && resumeData && selectedTemplate) {
      console.log('Applying template to editor:', selectedTemplate);
      
      // Apply the selected template
      import('../../utils/atsTemplates').then(({ generateATSOptimizedHTML }) => {
        try {
          const templateHTML = generateATSOptimizedHTML(resumeData, selectedTemplate);
          
          // Parse and set the HTML content
          const parser = new DOMParser();
          const doc = parser.parseFromString(templateHTML, 'text/html');
          const bodyContent = doc.body.innerHTML;
          const styleContent = doc.head.querySelector('style')?.innerHTML || '';
          
          // Clear existing content first
          editor.setComponents('');
          editor.setStyle('');
          
          // Set the HTML content
          editor.setComponents(bodyContent);
          
          // Set the CSS styles
          if (styleContent) {
            editor.getCss(); // Initialize CSS
            editor.getModel().get('CssComposer').getAll().reset();
            editor.setStyle(styleContent);
          }
          
          console.log(`Applied template: ${selectedTemplate}`);
          
        } catch (templateError) {
          console.error('Error applying template on load:', templateError);
          // Fallback to component-based approach
          populateEditorWithResumeData(editor, resumeData);
        }
      });
    }
  }, [editor, resumeData, selectedTemplate]);

  const showToast = (id: string) =>
    editor?.runCommand(StudioCommands.toastAdd, {
      id,
      header: 'Toast header',
      content: 'Data logged in console',
      variant: ToastVariant.Info,
    });

  const getProjetData = () => {
    if (editor) {
      console.log({ projectData: editor?.getProjectData() });
      showToast('log-project-data');
    }
  };

  const getExportData = () => {
    if (editor) {
      console.log({ html: editor?.getHtml(), css: editor?.getCss() });
      showToast('log-html-css');
    }
  };

  const reloadResumeData = () => {
    if (editor && resumeData) {
      console.log('Reloading resume data into editor');
      populateEditorWithResumeData(editor, resumeData);
      
      editor?.runCommand(StudioCommands.toastAdd, {
        id: 'data-reloaded',
        header: 'Data Reloaded',
        content: 'Resume data has been refreshed in the editor',
        variant: ToastVariant.Success,
      });
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleApplyTemplate = (templateId: string) => {
    if (editor && resumeData) {
      try {
        console.log(`Applying template: ${templateId}`);
        
        // Import the template system
        import('../../utils/atsTemplates').then(({ generateATSOptimizedHTML }) => {
          try {
            // Generate HTML using the selected template
            const templateHTML = generateATSOptimizedHTML(resumeData, templateId);
            
            // Clear editor and set the new HTML content
            editor.setComponents('');
            editor.setStyle('');
            
            // Parse and set the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(templateHTML, 'text/html');
            const bodyContent = doc.body.innerHTML;
            const styleContent = doc.head.querySelector('style')?.innerHTML || '';
            
            // Set the HTML content
            editor.setComponents(bodyContent);
            
            // Set the CSS styles
            if (styleContent) {
              editor.getCss(); // Initialize CSS
              editor.getModel().get('CssComposer').getAll().reset();
              editor.setStyle(styleContent);
            }
            
            setSelectedTemplate(templateId);
            setShowTemplateSelector(false);
            
            editor?.runCommand(StudioCommands.toastAdd, {
              id: 'template-applied',
              header: 'Template Applied',
              content: `Successfully applied ${templateId} template`,
              variant: ToastVariant.Success,
            });
            
            console.log(`Applied template: ${templateId}`);
            
          } catch (templateError) {
            console.error('Error generating template:', templateError);
            // Fallback to component-based approach
            populateEditorWithResumeData(editor, resumeData);
            setSelectedTemplate(templateId);
            setShowTemplateSelector(false);
            
            editor?.runCommand(StudioCommands.toastAdd, {
              id: 'template-fallback',
              header: 'Template Applied',
              content: `Applied ${templateId} template (fallback mode)`,
              variant: ToastVariant.Info,
            });
          }
        });
        
      } catch (error) {
        console.error('Error applying template:', error);
        editor?.runCommand(StudioCommands.toastAdd, {
          id: 'template-error',
          header: 'Template Error',
          content: 'Failed to apply template. Please try again.',
          variant: ToastVariant.Error,
        });
      }
    }
  };

  // Show loading state if no resume data
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return null; // Will redirect to home
  }

  return (
    <main className="flex h-screen flex-col justify-between p-5 gap-2">
      <div className="p-1 flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <button 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            onClick={() => router.push('/')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <div className="font-bold text-gray-800">
            Editing: {resumeData.personalInfo.name}
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            className="bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700"
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
          >
            {showTemplateSelector ? 'Hide Templates' : 'Choose Template'}
          </button>
          <button 
            className="bg-green-600 text-white rounded px-4 py-1 hover:bg-green-700" 
            onClick={reloadResumeData}
            title="Reload the AI-parsed resume data"
          >
            Reload Data
          </button>
          <button className="border border-gray-300 rounded px-4 py-1 hover:bg-gray-50" onClick={getProjetData}>
            Export Data
          </button>
          <button className="border border-gray-300 rounded px-4 py-1 hover:bg-gray-50" onClick={getExportData}>
            Export HTML/CSS
          </button>
        </div>
      </div>
      
      {/* Template Selector Panel */}
      {showTemplateSelector && resumeData && (
        <div className="mb-4">
          <TemplateSelector
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onApplyTemplate={handleApplyTemplate}
          />
        </div>
      )}
      
      <div className="flex-1 w-full h-full overflow-hidden">
        {/* @ts-ignore - React 19 ref compatibility */}
        <StudioEditor
          suppressHydrationWarning={true}
          onReady={onReady}
          options={{
            licenseKey: 'YOUR_LICENSE_KEY',
            plugins: [
              presetPrintable,
              canvasFullSize, // Optional
              rteTinyMce.init({
                enableOnClick: true,
                // Custom TinyMCE configuration for resume editing
                loadConfig: ({ component }) => {
                  const componentType = component.get('type');
                  
                  // Enhanced toolbar for resume components
                  if (componentType === 'resume-summary' || componentType === 'text') {
                    return {
                      toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link | undo redo',
                      menubar: false,
                      plugins: 'lists link autolink autoresize',
                      autoresize_bottom_margin: 10,
                      max_height: 300
                    };
                  }
                  
                  // Simple toolbar for other components
                  return {
                    toolbar: 'bold italic underline | alignleft aligncenter alignright | undo redo',
                    menubar: false,
                    plugins: 'autolink autoresize',
                    autoresize_bottom_margin: 5,
                    max_height: 200
                  };
                }
              })
            ],
            project: {
              type: 'document', // Ensure the project type is set to 'document'
              default: {
pages: [
                  {
                    name: `${resumeData.personalInfo.name} Resume`,
                    component: '', // Will be populated by populateEditorWithResumeData
                  }
                ]
              }
            },
            // Custom layout with RTE container
            layout: {
              default: {
                type: 'row',
                style: { height: '100%' },
                children: [
                  {
                    type: 'sidebarLeft',
                    children: { type: 'panelLayers', header: { label: 'Layers', collapsible: false, icon: 'layers' } }
                  },
                  {
                    type: 'column',
                    style: { flexGrow: 1 },
                    children: [
                      {
                        type: 'canvasSidebarTop',
                        sidebarTop: {
                          rightContainer: {
                            buttons: ({ items }) => [
                              {
                                id: 'print',
                                icon: '<svg viewBox="0 0 24 24"><path d="M18 3H6v4h12m1 5a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1m-3 7H8v-5h8m3-6H5a3 3 0 0 0-3 3v6h4v4h12v-4h4v-6a3 3 0 0 0-3-3Z"/>',
                                onClick: ({ editor }) => editor.runCommand('presetPrintable:print')
                              },
                              ...items.filter(item => !['showImportCode', 'fullscreen'].includes(item.id))
                            ]
                          }
                        }
                      },
                      { type: 'canvas' },
                      // Container for the RTE toolbar when needed
                      { 
                        type: 'row', 
                        className: 'rteContainer', 
                        style: { 
                          justifyContent: 'center',
                          minHeight: '40px',
                          borderTop: '1px solid #ddd'
                        } 
                      }
                    ]
                  },
                  { type: 'sidebarRight' }
                ]
              }
            },
          }}
        />
      </div>
    </main>
  );
}
