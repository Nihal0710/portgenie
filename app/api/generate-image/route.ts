import { NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

// Directory for storing generated images
const IMAGE_DIR = path.join(process.cwd(), "public", "generated-images")

// Ensure image directory exists
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true })
}

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const fileName = `image_${uuidv4()}`
    const filePath = path.join(IMAGE_DIR, fileName)

    // Create a promise to handle the Python script execution
    const generateImage = () => {
      return new Promise((resolve, reject) => {
        // Set up environment with Gemini API key
        const env = {
          ...process.env,
          GEMINI_API_KEY: process.env.GOOGLE_API_KEY,
        }

        // Spawn Python process
        const pythonProcess = spawn("python", [
          path.join(process.cwd(), "lib", "image-generator.py"),
        ], { env })

        let promptSent = false
        let fileNameSent = false
        let outputData = ""
        let errorData = ""

        pythonProcess.stdout.on("data", (data) => {
          const output = data.toString()
          outputData += output

          // Send prompt when prompted
          if (!promptSent && output.includes("Enter image generation prompt:")) {
            pythonProcess.stdin.write(`${prompt}\n`)
            promptSent = true
          }
          // Send filename when prompted
          else if (promptSent && !fileNameSent && output.includes("Enter output filename")) {
            pythonProcess.stdin.write(`${filePath}\n`)
            fileNameSent = true
          }
        })

        pythonProcess.stderr.on("data", (data) => {
          errorData += data.toString()
          console.error(`Python error: ${data}`)
        })

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            // Extract the file extension from the output
            const savedFileMatch = outputData.match(/saved to: (.+)/)
            if (savedFileMatch && savedFileMatch[1]) {
              const fullPath = savedFileMatch[1].trim()
              const publicPath = `/generated-images/${path.basename(fullPath)}`
              resolve({ success: true, imagePath: publicPath })
            } else {
              resolve({ success: true, imagePath: null, message: "Image generated but path not found in output" })
            }
          } else {
            reject(new Error(`Python process exited with code ${code}: ${errorData}`))
          }
        })
      })
    }

    // Execute the Python script
    const result = await generateImage()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    )
  }
} 