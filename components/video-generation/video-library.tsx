"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getUserVideoGenerations, deleteVideoGeneration, VideoGeneration } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { Download, ExternalLink, MoreHorizontal, PlayCircle, Trash2, Video } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { VideoPreview } from "./video-preview"

export function VideoLibrary() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<VideoGeneration[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedVideo, setSelectedVideo] = useState<VideoGeneration | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  
  useEffect(() => {
    if (user) {
      loadVideos()
    }
  }, [user])
  
  const loadVideos = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const videoData = await getUserVideoGenerations(user.id)
      setVideos(videoData)
    } catch (error) {
      console.error("Error loading videos:", error)
      toast.error("Failed to load your videos")
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (videoId: string) => {
    if (!user) return
    
    try {
      const success = await deleteVideoGeneration(videoId, user.id)
      if (success) {
        setVideos(videos.filter(v => v.id !== videoId))
        toast.success("Video deleted successfully")
      } else {
        toast.error("Failed to delete video")
      }
    } catch (error) {
      console.error("Error deleting video:", error)
      toast.error("Failed to delete video")
    }
  }
  
  const openPreview = (video: VideoGeneration) => {
    setSelectedVideo(video)
    setPreviewOpen(true)
  }
  
  const filteredVideos = videos.filter(video => {
    if (activeTab === "all") return true
    if (activeTab === "portfolio") return video.video_type === "portfolio"
    if (activeTab === "resume") return video.video_type === "resume"
    if (activeTab === "completed") return video.status === "completed"
    if (activeTab === "pending") return video.status === "pending" || video.status === "generating"
    return true
  })
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "generating":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Generating</Badge>
      case "pending":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Pending</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return null
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="flex flex-col items-center gap-2">
          <Video className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">Loading your videos...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Video Library</h2>
        <Button variant="outline" size="sm" onClick={loadVideos}>
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">In Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border rounded-lg text-center">
              <Video className="h-12 w-12 mb-4 text-muted-foreground/60" />
              <h3 className="text-lg font-medium mb-2">No Videos Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === "all" 
                  ? "You haven't created any videos yet."
                  : `You don't have any ${activeTab} videos.`}
              </p>
              <Button variant="default">Create Your First Video</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map(video => (
                <Card key={video.id} className="overflow-hidden">
                  <div 
                    className="h-40 bg-muted relative flex items-center justify-center cursor-pointer"
                    onClick={() => openPreview(video)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-primary/80 hover:text-primary transition-colors" />
                    </div>
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(video.status)}
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                        {video.video_type === "portfolio" ? "Portfolio" : "Resume"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base truncate">{video.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openPreview(video)}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            <span>Play</span>
                          </DropdownMenuItem>
                          {video.status === "completed" && (
                            <>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                <span>Share</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(video.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs mt-1">
                      {video.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogDescription>
              {selectedVideo?.description || "No description provided"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedVideo && (
            <VideoPreview
              title={selectedVideo.title}
              videoUrl={selectedVideo.video_url || ""}
              audioUrl={selectedVideo.audio_url || ""}
              script={selectedVideo.script || ""}
            />
          )}
          
          {selectedVideo?.script && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Video Script</h4>
                <div className="max-h-[200px] overflow-y-auto rounded border p-4 text-sm">
                  {selectedVideo.script}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 