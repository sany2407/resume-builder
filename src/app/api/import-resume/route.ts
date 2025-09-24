import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('POST /api/import-resume - Request received');
  
  try {
    const resumeData = await request.json();
    
    console.log('Resume data received:', { 
      id: resumeData.data?._id, 
      name: resumeData.data?.name, 
      hasExperiences: !!(resumeData.data?.experiences?.length),
      hasEducation: !!(resumeData.data?.education?.length),
      hasSkills: !!(resumeData.data?.skills?.length) 
    });
    
    // Validate the incoming data structure
    if (!resumeData.success || !resumeData.data) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data format. Expected success flag and data object.'
      }, { status: 400 });
    }
    
    const data = resumeData.data;
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name and email are required.'
      }, { status: 400 });
    }
    
    // The data is already in the correct format, so we can return it directly
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Resume data imported successfully'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error importing resume data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to import resume data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}