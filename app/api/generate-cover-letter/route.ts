import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { jobTitle, companyName, jobDescription, experience, skills, tone, length } = body

    if (!jobTitle || !companyName || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Construct the prompt for the model
    const fullPrompt = `
      Create a professional cover letter for the following job:
      
      Job Title: ${jobTitle}
      Company: ${companyName}
      Job Description/Requirements: ${jobDescription}
      
      Candidate's Experience: ${experience || "Not specified, please be generic but convincing"}
      Candidate's Skills: ${skills || "Not specified, please be generic but convincing"}
      
      Tone: ${tone || "professional"}
      Length: ${length || 0.5} (0-1 scale, higher means longer and more detailed)
      
      Format the cover letter professionally with proper spacing and sections. Include a header, greeting, opening paragraph, body paragraphs, closing paragraph, and a sign-off.
      
      Please focus on:
      - Matching the candidate's qualifications to the job requirements
      - Using a ${tone || "professional"} tone throughout the letter
      - Being specific about why the candidate is interested in this role at ${companyName}
      - Highlighting relevant skills and experience
      - Being concise but comprehensive
      - Avoiding clichés and generic statements
      - Making the letter compelling and persuasive
      
      The length should be appropriate for a ${length > 0.7 ? "detailed" : length > 0.4 ? "standard" : "concise"} cover letter.
    `

    // Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" })
    const result = await model.generateContent(fullPrompt)
    const coverLetter = result.response.text()
    
    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error("Error generating cover letter:", error)
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    )
  }
} 