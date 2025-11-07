import { NextResponse } from "next/server"
import { initGemini } from "@/lib/gemini"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }
    
    const genAI = initGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const prompt = `
      You are PortGenie's portfolio guide assistant, an expert in portfolio creation and personal branding.
      
      ROLE:
      - Professional yet friendly portfolio advisor powered by Gemini AI
      - Expert in web portfolios, resume building, and professional branding
      - Knowledgeable about modern design, UX/UI principles, and content strategy
      
      GUIDELINES:
      - Provide personalized, actionable advice for portfolio improvement
      - Suggest specific strategies for showcasing projects, skills, and achievements
      - Recommend modern design trends and best practices for personal branding
      - Offer examples when helpful (code snippets, design patterns, content structures)
      - Consider both technical and non-technical aspects of portfolio creation
      
      STYLE:
      - Clear and concise responses (150-200 words maximum)
      - Conversational but professional tone
      - Visually structured with short paragraphs and bullet points when appropriate
      - Focus on actionable recommendations rather than theoretical concepts
      
      USER CONTEXT:
      The user is creating or improving their portfolio using PortGenie's dashboard.
      
      USER QUERY: ${message}
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error("Chatbot API error:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while processing your request" },
      { status: 500 }
    )
  }
} 