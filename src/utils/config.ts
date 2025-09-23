export interface ConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
  warnings: string[];
}

export function checkEnvironmentConfig(): ConfigStatus {
  const requiredKeys = ['GEMINI_API_KEY'];
  const missingKeys: string[] = [];
  const warnings: string[] = [];

  // Check for required environment variables
  requiredKeys.forEach(key => {
    const value = process.env[key];
    if (!value || value === `your_${key.toLowerCase()}_here`) {
      missingKeys.push(key);
    }
  });

  // Add warnings for common issues
  if (process.env.NODE_ENV === 'development' && missingKeys.length > 0) {
    warnings.push('Make sure to create a .env.local file in your project root');
    warnings.push('Get your Gemini API key from https://aistudio.google.com/app/apikey');
  }

  return {
    isConfigured: missingKeys.length === 0,
    missingKeys,
    warnings
  };
}

export function getConfigInstructions(): string {
  return `
To set up your environment:

1. Create a .env.local file in your project root
2. Add your Gemini API key:
   GEMINI_API_KEY=your_actual_api_key_here
3. Get your API key from: https://aistudio.google.com/app/apikey
4. Restart your development server

Example .env.local:
GEMINI_API_KEY=AIza...your_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`.trim();
}