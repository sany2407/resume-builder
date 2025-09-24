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
  const [isExportingPDF, setIsExportingPDF] = useState(false);
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

  const improvedPrint = async () => {
    if (editor) {
      try {
        console.log('Starting improved print...');
        
        // Show loading toast
        editor?.runCommand(StudioCommands.toastAdd, {
          id: 'print-generating',
          header: 'Preparing Print',
          content: 'Capturing editor content for printing...',
          variant: ToastVariant.Info,
        });
        
        // Get the editor canvas frame
        const editorFrame = editor.Canvas.getFrameEl();
        const editorDoc = editorFrame.contentDocument || editorFrame.contentWindow?.document;
        
        if (!editorDoc) {
          throw new Error('Unable to access editor document');
        }
        
        // Get the actual rendered HTML and CSS from the editor canvas
        const editorBody = editorDoc.body;
        const editorStyles = Array.from(editorDoc.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .join('\n');
        
        // Clone the editor content
        const clonedContent = editorBody.cloneNode(true) as HTMLElement;
        
        // Remove GrapesJS editor artifacts
        const removeEditorElements = (element: HTMLElement) => {
          // Remove GrapesJS specific classes and elements
          const elementsToRemove = element.querySelectorAll(
            '[class*="gjs-"], [data-gjs-type], .gjs-dashed, .gjs-freezed, .gjs-selected'
          );
          
          elementsToRemove.forEach(el => {
            if (el.classList.contains('gjs-dashed') || el.classList.contains('gjs-selected')) {
              el.classList.remove('gjs-dashed', 'gjs-selected', 'gjs-freezed');
            }
            if (el.hasAttribute('data-gjs-type') && el.getAttribute('data-gjs-type') === 'wrapper') {
              // Keep wrapper content but remove GJS attributes
              el.removeAttribute('data-gjs-type');
              const gjsClasses = Array.from(el.classList).filter(cls => cls.startsWith('gjs-'));
              gjsClasses.forEach(cls => el.classList.remove(cls));
            }
          });
          
          // Clean up attributes
          Array.from(element.querySelectorAll('*')).forEach(el => {
            const htmlEl = el as HTMLElement;
            // Remove GrapesJS data attributes
            Array.from(htmlEl.attributes).forEach(attr => {
              if (attr.name.startsWith('data-gjs') || attr.name.startsWith('data-highlightable')) {
                htmlEl.removeAttribute(attr.name);
              }
            });
            
            // Remove GrapesJS classes
            const gjsClasses = Array.from(htmlEl.classList).filter(cls => cls.startsWith('gjs-'));
            gjsClasses.forEach(cls => htmlEl.classList.remove(cls));
          });
        };
        
        removeEditorElements(clonedContent);
        
        // Create complete HTML document for printing
        const printHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${resumeData?.personalInfo?.name || 'Resume'} - Resume</title>
              <style>
                /* Reset and base styles */
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                /* Editor styles */
                ${editorStyles}
                
                /* Print-specific styles */
                @media print {
                  body {
                    margin: 0;
                    padding: 0.5in;
                    background: white;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    font-size: 12pt;
                    line-height: 1.4;
                  }
                  
                  @page {
                    size: A4;
                    margin: 0.5in;
                  }
                  
                  /* Hide any remaining editor artifacts */
                  [class*="gjs-"],
                  [data-gjs-type],
                  .gjs-dashed,
                  .gjs-selected,
                  .gjs-freezed {
                    border: none !important;
                    outline: none !important;
                    box-shadow: none !important;
                  }
                  
                  /* Ensure proper spacing */
                  .section {
                    page-break-inside: avoid;
                    margin-bottom: 15px;
                  }
                  
                  /* Prevent widows and orphans */
                  p, li {
                    orphans: 2;
                    widows: 2;
                  }
                  
                  h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid;
                  }
                }
                
                /* Screen styles for preview */
                body {
                  font-family: Arial, sans-serif;
                  color: #000;
                  background: white;
                  max-width: 8.5in;
                  margin: 0 auto;
                  padding: 20px;
                }
              </style>
            </head>
            <body>${clonedContent.innerHTML}</body>
          </html>
        `;
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        
        if (printWindow) {
          printWindow.document.write(printHTML);
          printWindow.document.close();
          
          // Wait for the content to load, then print
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.focus();
              printWindow.print();
              
              editor?.runCommand(StudioCommands.toastAdd, {
                id: 'print-success',
                header: 'Print Ready',
                content: 'Print dialog opened with exact editor content. Choose "Save as PDF" to download!',
                variant: ToastVariant.Success,
              });
              
              // Close the window after printing (optional)
              printWindow.onafterprint = () => {
                setTimeout(() => printWindow.close(), 1000);
              };
            }, 1000);
          };
        } else {
          throw new Error('Unable to open print window');
        }
        
      } catch (error) {
        console.error('Error in improved print:', error);
        
        editor?.runCommand(StudioCommands.toastAdd, {
          id: 'print-error',
          header: 'Print Error',
          content: 'Failed to prepare content for printing. Please try the PDF export instead.',
          variant: ToastVariant.Error,
        });
      }
    }
  };

  const exportToPDF = async () => {
    if (editor && !isExportingPDF) {
      setIsExportingPDF(true);
      
      try {
        console.log('Exporting resume to PDF...');
        
        // Show loading toast
        editor?.runCommand(StudioCommands.toastAdd, {
          id: 'pdf-generating',
          header: 'Generating PDF',
          content: 'Please wait while we generate your PDF...',
          variant: ToastVariant.Info,
        });
        
        // Dynamically import html2pdf
        const html2pdf = (await import('html2pdf.js')).default;
        
        // Get the editor canvas frame for exact content
        const editorFrame = editor.Canvas.getFrameEl();
        const editorDoc = editorFrame.contentDocument || editorFrame.contentWindow?.document;
        
        if (!editorDoc) {
          throw new Error('Unable to access editor document');
        }
        
        // Get the actual rendered HTML and CSS from the editor canvas
        const editorBody = editorDoc.body;
        const editorStyles = Array.from(editorDoc.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .join('\n');
        
        // Clone the editor content and clean it
        const clonedContent = editorBody.cloneNode(true) as HTMLElement;
        
        // Remove GrapesJS editor artifacts
        const removeEditorElements = (element: HTMLElement) => {
          Array.from(element.querySelectorAll('*')).forEach(el => {
            const htmlEl = el as HTMLElement;
            // Remove GrapesJS data attributes
            Array.from(htmlEl.attributes).forEach(attr => {
              if (attr.name.startsWith('data-gjs') || attr.name.startsWith('data-highlightable')) {
                htmlEl.removeAttribute(attr.name);
              }
            });
            
            // Remove GrapesJS classes
            const gjsClasses = Array.from(htmlEl.classList).filter(cls => cls.startsWith('gjs-'));
            gjsClasses.forEach(cls => htmlEl.classList.remove(cls));
          });
        };
        
        removeEditorElements(clonedContent);
        
        // Create a temporary container with the clean content
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = clonedContent.innerHTML;
        
        // Apply CSS styles to the container
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          /* Captured editor styles */
          ${editorStyles}
          
          /* PDF-specific optimizations */
          body, * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .temp-pdf-container {
            font-family: Arial, sans-serif;
            color: #000;
            background: white;
            width: 8.5in;
            margin: 0;
            padding: 0.5in;
            box-sizing: border-box;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .temp-pdf-container * {
            box-sizing: border-box;
          }
        `;
        
        tempContainer.className = 'temp-pdf-container';
        document.head.appendChild(styleElement);
        document.body.appendChild(tempContainer);
        
        // PDF options
        const options = {
          margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
          filename: `${resumeData?.personalInfo?.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            width: 816, // 8.5 inches * 96 DPI
            height: 1056 // 11 inches * 96 DPI
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        };
        
        // Generate PDF
        await html2pdf().set(options).from(tempContainer).save();
        
        // Cleanup
        document.body.removeChild(tempContainer);
        document.head.removeChild(styleElement);
        
        // Show success message
        editor?.runCommand(StudioCommands.toastAdd, {
          id: 'pdf-exported',
          header: 'PDF Downloaded',
          content: 'Your resume has been downloaded as PDF successfully!',
          variant: ToastVariant.Success,
        });
        
        setIsExportingPDF(false);
        
      } catch (error) {
        console.error('Error exporting PDF:', error);
        
        // Fallback to improved print dialog
        console.log('Falling back to improved print dialog...');
        
        try {
          // Use the improved print method as fallback
          await improvedPrint();
          
        } catch (fallbackError) {
          console.error('Improved print fallback also failed:', fallbackError);
          
          editor?.runCommand(StudioCommands.toastAdd, {
            id: 'pdf-error',
            header: 'Export Error',
            content: 'Failed to export PDF. Please try using your browser\'s print function (Ctrl+P) and select "Save as PDF".',
            variant: ToastVariant.Error,
          });
        }
        
        setIsExportingPDF(false);
      }
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
          <button 
            className="bg-purple-600 text-white rounded px-4 py-1 hover:bg-purple-700"
            onClick={improvedPrint}
            title="Print exact editor content"
          >
            🖨️ Print
          </button>
          <button 
            className={`text-white rounded px-4 py-1 font-medium transition-colors ${
              isExportingPDF 
                ? 'bg-red-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
            onClick={exportToPDF}
            disabled={isExportingPDF}
            title={isExportingPDF ? 'Generating PDF...' : 'Download resume as PDF'}
          >
            {isExportingPDF ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              '📄 Export PDF'
            )}
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
                                id: 'improved-print',
                                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 3H6v4h12m1 5a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1m-3 7H8v-5h8m3-6H5a3 3 0 0 0-3 3v6h4v4h12v-4h4v-6a3 3 0 0 0-3-3Z"/></svg>',
                                title: 'Print exact editor content',
                                onClick: () => improvedPrint()
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
