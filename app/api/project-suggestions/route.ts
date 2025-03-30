import { NextResponse } from "next/server"
import { generateProjectSuggestions } from "@/lib/gemini"

export async function POST(request: Request) {
  try {
    const { userData } = await request.json()
    
    if (!userData) {
      return NextResponse.json(
        { error: "User data is required" },
        { status: 400 }
      )
    }
    
    const suggestions = await generateProjectSuggestions(userData)
    
    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error("Project suggestions API error:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while generating project suggestions" },
      { status: 500 }
    )
  }
} 