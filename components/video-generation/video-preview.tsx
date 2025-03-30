"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VideoPreviewProps {
  title: string
  videoUrl: string
  audioUrl: string
  script: string
}

export function VideoPreview({ title, videoUrl, audioUrl, script }: VideoPreviewProps) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("video")
  
  // In a real implementation, we would use a video player component
  // For now, we'll just simulate playing functionality
  
  const togglePlay = () => {
    setPlaying(!playing)
    // In a real implementation, we would play or pause the video
  }
  
  const toggleMute = () => {
    setMuted(!muted)
    // In a real implementation, we would mute or unmute the video
  }
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="mt-2">
          <div className="relative aspect-video bg-muted overflow-hidden rounded-lg">
            {/* This would be a real video player in production */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-medium text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {playing ? "Now playing" : "Click play to preview"}
                </p>
              </div>
            </div>
            
            {/* Overlay controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={togglePlay}
                  className="text-white hover:text-white hover:bg-white/30"
                >
                  {playing ? 
                    <Pause className="h-5 w-5" /> : 
                    <Play className="h-5 w-5" />
                  }
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                  className="text-white hover:text-white hover:bg-white/30"
                >
                  {muted ? 
                    <VolumeX className="h-5 w-5" /> : 
                    <Volume2 className="h-5 w-5" />
                  }
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="audio" className="mt-2">
          <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="mb-4 opacity-80">
              <Volume2 className="h-12 w-12" />
            </div>
            <h3 className="font-medium text-lg mb-2">{title} - Audio</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Audio narration for your {title} video
            </p>
            <Button 
              variant="outline" 
              onClick={togglePlay}
              className="flex items-center gap-2"
            >
              {playing ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Audio
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play Audio
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 