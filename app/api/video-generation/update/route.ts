import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
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
    
    const body = await request.json()
    const { videoId, status, video_url, audio_url, script } = body
    
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
    
    // Update the video generation record
    const updateData: any = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (video_url) {
      updateData.video_url = video_url
    }
    
    if (audio_url) {
      updateData.audio_url = audio_url
    }
    
    if (script) {
      updateData.script = script
    }
    
    const updatedVideo = await updateVideoGeneration(videoId, userId, updateData)
    
    if (!updatedVideo) {
      return NextResponse.json(
        { error: "Failed to update video", success: false },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo
    })
  } catch (error: any) {
    console.error("Error updating video:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred", success: false },
      { status: 500 }
    )
  }
} 