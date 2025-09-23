import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasApiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      configuration: {
        geminiApiKey: hasApiKey ? 'configured' : 'missing',
      },
      message: hasApiKey 
        ? 'All services are properly configured' 
        : 'Missing required API configuration'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}