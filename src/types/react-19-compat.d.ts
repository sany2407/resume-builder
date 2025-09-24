// React 19 compatibility types
declare module '@grapesjs/studio-sdk/react' {
  import { ComponentType } from 'react';
  
  interface StudioEditorProps {
    onReady?: (editor: any) => void;
    options?: any;
    [key: string]: any;
  }
  
  const StudioEditor: ComponentType<StudioEditorProps>;
  export default StudioEditor;
  
  export const StudioCommands: any;
  export enum ToastVariant {
    Info = 'info',
    Success = 'success', 
    Warning = 'warning',
    Error = 'error',
  }
}

// Suppress React 19 ref warnings for JSX elements
declare global {
  namespace JSX {
    interface Element {
      ref?: any;
    }
  }
}

export {};