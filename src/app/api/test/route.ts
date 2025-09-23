import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      message: 'API is working correctly',
      timestamp: new Date().toISOString(),
      success: true 
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function POST() {
  return NextResponse.json(
    { 
      message: 'POST endpoint is working',
      timestamp: new Date().toISOString(),
      success: true 
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}