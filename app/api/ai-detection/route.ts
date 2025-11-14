import { NextRequest, NextResponse } from 'next/server';
import { formatDetectionResponse } from '@/lib/ai-detection';

// AI detection service URL - In production, this would be an actual service endpoint
const AI_DETECTION_SERVICE_URL = process.env.AI_DETECTION_SERVICE_URL || 'https://portgenie.vercel.app';

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { text, threshold = 0.5 } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    
    if (text.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Text must be at least 50 characters long for accurate analysis' 
      }, { status: 400 });
    }

    // In a production environment, you would call the AI detection service
    // For this implementation, we're simulating the response for demonstration purposes
    let response;
    
    try {
      response = await fetch(AI_DETECTION_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, threshold }),
      });
      
      if (!response.ok) {
        throw new Error(`AI detection service returned ${response.status}`);
      }
      
      const result = await response.json();
      
      return NextResponse.json(formatDetectionResponse(
        result.probability,
        result.is_ai_generated,
        startTime
      ));
      
    } catch (serviceError) {
      console.error('AI detection service error:', serviceError);
      
      // Fallback to mock response for demonstration
      // This would not be in a production implementation
      const mockProbability = Math.random();
      const isAIGenerated = mockProbability > threshold;
      
      return NextResponse.json(
        formatDetectionResponse(mockProbability, isAIGenerated, startTime),
        { status: 200 }
      );
    }
    
  } catch (error: any) {
    console.error('AI detection API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during AI detection' },
      { status: 500 }
    );
  }
} 