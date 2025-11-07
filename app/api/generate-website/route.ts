import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { prompt, websiteType, colorScheme, complexity } = body

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Construct the prompt for the model
    const fullPrompt = `
      Create a modern, responsive website based on the following description:
      
      Description: ${prompt}
      
      Website Type: ${websiteType || "general"}
      Color Scheme: ${colorScheme || "blue"}
      Complexity Level: ${complexity || 0.5} (0-1 scale, higher means more complex)
      
      Respond with ONLY a JSON object with these exact keys:
      {
        "html": "The full HTML code for the website (without <html>, <head>, or <body> tags)",
        "css": "The complete CSS code for styling the website",
        "js": "Any JavaScript code needed for interactivity (if required)"
      }
      
      Important guidelines:
      - Create clean, modern design with responsive layout
      - Include a navigation bar, hero section, and appropriate sections for the website type
      - Use pure HTML/CSS/JS without frameworks
      - Apply the specified color scheme throughout the design
      - Ensure correct HTML structure with semantic tags
      - Add appropriate hover effects and subtle animations
      - Make the website fully responsive for mobile, tablet and desktop
      - Create a polished, professional looking result
      - Include sample content that fits the website purpose
      - Use modern CSS techniques (flexbox, grid)
    `

    // Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(fullPrompt)
    const textResult = result.response.text()
    
    // Extract JSON from the response if needed
    let jsonMatch
    try {
      // First try to parse the entire response as JSON
      const parsedResponse = JSON.parse(textResult)
      return NextResponse.json(parsedResponse)
    } catch (error) {
      // If that fails, try to extract JSON from the text
      jsonMatch = textResult.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                  textResult.match(/\{[\s\S]*"html"[\s\S]*"css"[\s\S]*\}/)
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          const jsonResponse = JSON.parse(jsonMatch[1])
          return NextResponse.json(jsonResponse)
        } catch (e) {
          console.error("Error parsing extracted JSON:", e)
        }
      }
      
      // Last resort: manually extract code blocks
      const htmlMatch = textResult.match(/```html\s*([\s\S]*?)\s*```/) || 
                       textResult.match(/"html"\s*:\s*"([\s\S]*?)"(?=\s*,)/)
      const cssMatch = textResult.match(/```css\s*([\s\S]*?)\s*```/) || 
                      textResult.match(/"css"\s*:\s*"([\s\S]*?)"(?=\s*,)/)
      const jsMatch = textResult.match(/```javascript\s*([\s\S]*?)\s*```/) || 
                     textResult.match(/```js\s*([\s\S]*?)\s*```/) ||
                     textResult.match(/"js"\s*:\s*"([\s\S]*?)"(?=\s*[,}])/)
      
      return NextResponse.json({
        html: htmlMatch ? htmlMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : "",
        css: cssMatch ? cssMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : "",
        js: jsMatch ? jsMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : "",
      })
    }
  } catch (error) {
    console.error("Error generating website:", error)
    return NextResponse.json(
      { error: "Failed to generate website" },
      { status: 500 }
    )
  }
} 