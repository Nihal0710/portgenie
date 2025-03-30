import { NextResponse } from "next/server"
import { generateContentImprovements } from "@/lib/gemini"

export async function POST(request: Request) {
  try {
    const { sectionType, content, userData } = await request.json()
    
    if (!content || !sectionType) {
      return NextResponse.json(
        { error: "Content and section type are required" },
        { status: 400 }
      )
    }
    
    // Validate section type
    if (!['about', 'overview', 'description', 'project', 'skills'].includes(sectionType)) {
      return NextResponse.json(
        { error: "Invalid section type" },
        { status: 400 }
      )
    }
    
    const improvements = await generateContentImprovements(
      sectionType as 'about' | 'overview' | 'description' | 'project' | 'skills',
      content,
      userData
    )
    
    return NextResponse.json({ improvements })
  } catch (error: any) {
    console.error("Content improvements API error:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while generating content improvements" },
      { status: 500 }
    )
  }
} 