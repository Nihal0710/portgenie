import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { getUserProfile, getUserPortfolios, getUserResumes } from '@/lib/supabase'

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json()
    const {
      userId,
      title,
      projectType,
      style,
      portfolioImport,
      resumeImport,
      colorTheme,
      layout,
      sections,
      customNotes,
    } = body

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Fetch user data if import options are selected
    let userData: {
      profile: any;
      portfolios: any[];
      resumes: any[];
      projects: any[];
    } = { profile: null, portfolios: [], resumes: [], projects: [] }
    
    try {
      // Get user profile data
      userData.profile = await getUserProfile(userId)
      
      // Get portfolio data if portfolioImport is true
      if (portfolioImport) {
        userData.portfolios = await getUserPortfolios(userId)
        // For projects, extract them from portfolios since getUserProjects doesn't exist
        userData.projects = userData.portfolios.flatMap(portfolio => 
          portfolio.projects ? portfolio.projects : []
        )
      }
      
      // Get resume data if resumeImport is true
      if (resumeImport) {
        userData.resumes = await getUserResumes(userId)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }

    // Generate a prompt for the AI model
    const prompt = generatePrompt(
      title,
      projectType,
      style,
      colorTheme,
      layout,
      sections,
      customNotes,
      userData
    )

    // Call the Gemini API to generate HTML/CSS/JS code
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the website code from the AI response
    const websiteCode = extractCodeFromResponse(text)

    // Save the generated website to a file
    const uniqueId = uuidv4()
    const fileName = `${userId}-${uniqueId}.html`
    const publicDir = path.join(process.cwd(), 'public', 'generated-websites')
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    const filePath = path.join(publicDir, fileName)
    fs.writeFileSync(filePath, websiteCode)

    // Return success response with the website code and URL
    const previewUrl = `/generated-websites/${fileName}`
    
    return new NextResponse(JSON.stringify({
      success: true,
      previewUrl,
      websiteCode
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error generating website:', error)
    return new NextResponse(JSON.stringify({ error: error.message || "Failed to generate website" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function generatePrompt(
  title: string,
  projectType: string,
  style: string,
  colorTheme: string,
  layout: string,
  sections: string[],
  customNotes: string,
  userData: any
) {
  // Convert userData to a string representation
  const userProfileStr = userData.profile ? JSON.stringify(userData.profile) : 'No profile data'
  const userPortfoliosStr = userData.portfolios.length ? JSON.stringify(userData.portfolios) : 'No portfolio data'
  const userResumesStr = userData.resumes.length ? JSON.stringify(userData.resumes) : 'No resume data'
  const userProjectsStr = userData.projects.length ? JSON.stringify(userData.projects) : 'No project data'

  return `
You are an expert web developer specializing in creating professional resume and portfolio websites.
Generate a complete, responsive, and modern website based on the following specifications:

WEBSITE DETAILS:
- Title: ${title}
- Type: ${projectType} (resume, portfolio, or combined)
- Style: ${style}
- Color Theme: ${colorTheme}
- Layout: ${layout}
- Sections to include: ${sections.join(', ')}
- Additional notes: ${customNotes || 'None'}

USER DATA:
${userProfileStr}
${userPortfoliosStr}
${userResumesStr}
${userProjectsStr}

REQUIREMENTS:
1. Create a complete, responsive HTML file with embedded CSS and JavaScript
2. Use modern web design principles and responsive layouts
3. Include all the sections specified by the user
4. Optimize for both desktop and mobile viewing
5. Use high-quality typography and appropriate spacing
6. Implement subtle animations and transitions where appropriate
7. Include a contact form or contact information section
8. Ensure the design is cohesive and professional
9. Add appropriate metadata and SEO elements

Please generate the complete website code with no placeholders. The response should be a valid HTML file that can be viewed in a browser without any additional dependencies.
`
}

function extractCodeFromResponse(response: string) {
  // Try to extract code between ```html and ``` tags
  const htmlRegex = /```html\s*([\s\S]*?)\s*```/
  const match = response.match(htmlRegex)
  
  if (match && match[1]) {
    return match[1].trim()
  }
  
  // If no HTML code block is found, try generic code blocks
  const genericCodeRegex = /```\s*([\s\S]*?)\s*```/
  const genericMatch = response.match(genericCodeRegex)
  
  if (genericMatch && genericMatch[1]) {
    return genericMatch[1].trim()
  }
  
  // If no code blocks found, return the entire response
  // (assuming it might be HTML without code blocks)
  return response.trim()
} 