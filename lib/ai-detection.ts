import { NextRequest, NextResponse } from 'next/server';

// Define model path - this will be used by the API
export const AI_DETECTION_MODEL_PATH = "desklib/ai-text-detector-v1.01";

// Interface for AI detection response
export interface AIDetectionResponse {
  probability: number;
  isAIGenerated: boolean;
  confidence: string;
  processingTime: number;
}

// Function to get confidence level based on probability
export function getConfidenceLevel(probability: number): string {
  if (probability >= 0.95) return "Very High";
  if (probability >= 0.85) return "High";
  if (probability >= 0.70) return "Moderate";
  if (probability >= 0.55) return "Low";
  return "Very Low";
}

// Format the response for the client
export function formatDetectionResponse(
  probability: number,
  isAIGenerated: boolean,
  startTime: number
): AIDetectionResponse {
  const endTime = performance.now();
  
  return {
    probability: Number(probability.toFixed(4)),
    isAIGenerated,
    confidence: getConfidenceLevel(isAIGenerated ? probability : 1 - probability),
    processingTime: Number(((endTime - startTime) / 1000).toFixed(2))
  };
} 