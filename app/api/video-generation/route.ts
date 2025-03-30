import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { initGemini } from "@/lib/gemini"
import { updateVideoGeneration, getVideoGenerationById } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      )
    }
    
    const {
      videoId,
      title,
      goal,
      portfolioImport,
      resumeImport,
      customScript,
      voiceStyle,
      theme,
      musicStyle,
      duration,
      portfolioData,
      resumeData
    } = await request.json()
    
    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required", success: false },
        { status: 400 }
      )
    }
    
    // Verify that the video belongs to the user
    const existingVideo = await getVideoGenerationById(videoId, userId)
    if (!existingVideo) {
      return NextResponse.json(
        { error: "Video not found or does not belong to you", success: false },
        { status: 404 }
      )
    }
    
    const genAI = initGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    
    // Step 1: Generate script using AI if not provided
    let finalScript = customScript
    
    if (!customScript) {
      const scriptPrompt = `
        You are a professional video script writer for portfolio and resume videos.
        Create a compelling, engaging script for a ${portfolioImport ? 'portfolio' : 'resume'} video with the following details:
        
        Title: ${title}
        Goal: ${goal}
        Portfolio Data: ${JSON.stringify(portfolioData || {})}
        Resume Data: ${JSON.stringify(resumeData || {})}
        Voice Style: ${voiceStyle}
        Target Duration: ${duration} seconds
        
        The script should be conversational, highlight key achievements, skills, and projects,
        and be optimized for a video of ${duration} seconds duration.
        
        Format the script as plain text that can be read aloud.
      `
      
      // Update the video status to indicate we're generating the script
      await updateVideoGeneration(videoId, userId, {
        status: "generating"
      })
      
      const scriptResult = await model.generateContent(scriptPrompt)
      const scriptResponse = await scriptResult.response
      finalScript = scriptResponse.text()
    }
    
    // Step 2: In a real implementation, we would:
    // 1. Call a text-to-speech API to generate the voiceover
    // 2. Use a video generation API to create visuals
    // 3. Combine audio and visuals
    // 4. Store the result
    
    // Generate the placeholder video and audio URLs
    const videoUrl = `https://example.com/videos/${portfolioImport ? 'portfolio' : 'resume'}-${Date.now()}.mp4`
    const audioUrl = `https://example.com/audios/${portfolioImport ? 'portfolio' : 'resume'}-narration-${Date.now()}.mp3`
    
    // Simulate async processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update the video in the database with the completed info
    const updatedVideo = await updateVideoGeneration(videoId, userId, {
      status: "completed",
      video_url: videoUrl,
      audio_url: audioUrl,
      script: finalScript
    })
    
    if (!updatedVideo) {
      throw new Error("Failed to update video status")
    }
    
    return NextResponse.json({
      success: true,
      videoId: videoId,
      script: finalScript,
      status: "completed",
      videoUrl: videoUrl,
      audioUrl: audioUrl
    })
  } catch (error: any) {
    console.error("Video generation API error:", error)
    
    // If we have a videoId and userId, update the video status to error
    const body = await request.json().catch(() => ({}))
    const { videoId } = body
    
    if (videoId) {
      const { userId } = await auth()
      if (userId) {
        await updateVideoGeneration(videoId, userId, {
          status: "error"
        }).catch(err => console.error("Failed to update video status to error:", err))
      }
    }
    
    return NextResponse.json(
      { error: error.message || "An error occurred during video generation", success: false },
      { status: 500 }
    )
  }
} 