"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { getUserProfile, getUserPortfolios, getUserResumes, createVideoGeneration } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { VideoPreview } from "./video-preview"
import { VideoLibrary } from "./video-library"
import { Loader2, Video, Wand2, Sparkles, MusicIcon, Download, Share, Save } from "lucide-react"
import { toast } from "sonner"

type Portfolio = {
  id: string
  title: string
  description: string
  slug: string
}

type Resume = {
  id: string
  title: string
  content: any
}

export function VideoGenerator() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [userPortfolios, setUserPortfolios] = useState<Portfolio[]>([])
  const [userResumes, setUserResumes] = useState<Resume[]>([])
  const [activeTab, setActiveTab] = useState("portfolio")
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle')
  const [videoUrl, setVideoUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [videoGenerated, setVideoGenerated] = useState(false)
  const [viewMode, setViewMode] = useState<'create' | 'library'>('create')
  
  // Form state
  const [videoTitle, setVideoTitle] = useState("")
  const [videoGoal, setVideoGoal] = useState("")
  const [selectedPortfolio, setSelectedPortfolio] = useState("")
  const [selectedResume, setSelectedResume] = useState("")
  const [customScript, setCustomScript] = useState("")
  const [useCustomScript, setUseCustomScript] = useState(false)
  const [voiceStyle, setVoiceStyle] = useState("professional")
  const [theme, setTheme] = useState("modern")
  const [musicStyle, setMusicStyle] = useState("ambient")
  const [duration, setDuration] = useState(60)
  const [generatedScript, setGeneratedScript] = useState("")
  
  // Load user portfolios and resumes
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])
  
  const loadUserData = async () => {
    setLoading(true)
    try {
      if (!user) return
      
      // Load portfolios
      const portfolios = await getUserPortfolios(user.id)
      setUserPortfolios(portfolios)
      
      // Load resumes
      const resumes = await getUserResumes(user.id)
      setUserResumes(resumes)
      
      // Set defaults if available
      if (portfolios.length > 0) {
        setSelectedPortfolio(portfolios[0].id)
      }
      
      if (resumes.length > 0) {
        setSelectedResume(resumes[0].id)
      }
      
      // Set default title based on user name
      if (user.fullName) {
        setVideoTitle(`${user.fullName}'s Professional Portfolio`)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      toast.error("Failed to load your portfolios and resumes")
    } finally {
      setLoading(false)
    }
  }
  
  const generateVideo = async () => {
    if (!videoTitle) {
      toast.error("Please provide a title for your video")
      return
    }
    
    if (activeTab === "portfolio" && !selectedPortfolio) {
      toast.error("Please select a portfolio to showcase")
      return
    }
    
    if (activeTab === "resume" && !selectedResume) {
      toast.error("Please select a resume to showcase")
      return
    }
    
    if (!user) {
      toast.error("You must be logged in to generate videos")
      return
    }
    
    setGenerating(true)
    setStatus('generating')
    setProgress(0)
    
    try {
      // Create a record in the database first
      const videoData = {
        title: videoTitle,
        description: videoGoal,
        video_type: activeTab as 'portfolio' | 'resume',
        portfolio_id: activeTab === "portfolio" ? selectedPortfolio : undefined,
        resume_id: activeTab === "resume" ? selectedResume : undefined,
        voice_style: voiceStyle,
        theme: theme,
        music_style: musicStyle,
        duration: duration,
        status: 'generating' as const
      }
      
      // Save to database first
      const savedVideo = await createVideoGeneration(user.id, videoData)
      if (!savedVideo) {
        throw new Error("Failed to save video generation request")
      }
      
      // Find the selected portfolio or resume data
      const portfolioData = activeTab === "portfolio" 
        ? userPortfolios.find(p => p.id === selectedPortfolio) 
        : null
        
      const resumeData = activeTab === "resume" 
        ? userResumes.find(r => r.id === selectedResume) 
        : null
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 1000)
      
      // Call the API to generate the video
      const response = await fetch("/api/video-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: savedVideo.id,
          title: videoTitle,
          goal: videoGoal,
          portfolioImport: activeTab === "portfolio",
          resumeImport: activeTab === "resume",
          customScript: useCustomScript ? customScript : null,
          voiceStyle,
          theme,
          musicStyle,
          duration,
          portfolioData,
          resumeData
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to generate video")
      }
      
      const data = await response.json()
      
      if (data.success) {
        // In a real implementation, we'd get back a video URL
        // For now, we'll use a placeholder
        setGeneratedScript(data.script)
        clearInterval(progressInterval)
        setProgress(100)
        setStatus('completed')
        
        // Set placeholder URLs for demo purposes
        setVideoUrl("https://example.com/videos/portfolio-demo.mp4")
        setAudioUrl("https://example.com/audios/portfolio-narration.mp3")
        setVideoGenerated(true)
        
        // Update the video record in the database with the completed info
        await fetch("/api/video-generation/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoId: savedVideo.id,
            status: "completed",
            video_url: "https://example.com/videos/portfolio-demo.mp4",
            audio_url: "https://example.com/audios/portfolio-narration.mp3",
            script: data.script
          }),
        })
        
        toast.success("Video generated successfully!")
      } else {
        throw new Error(data.error || "Video generation failed")
      }
    } catch (error: any) {
      console.error("Error generating video:", error)
      setStatus('error')
      toast.error(error.message || "Failed to generate video")
    } finally {
      setGenerating(false)
    }
  }
  
  const downloadVideo = () => {
    // In a real implementation, this would trigger a download
    toast.success("Video download started")
  }
  
  const shareVideo = () => {
    // In a real implementation, this would open a share dialog
    navigator.clipboard.writeText(videoUrl)
    toast.success("Video link copied to clipboard")
  }
  
  const saveVideo = () => {
    // In a real implementation, this would save to the user's account
    toast.success("Video saved to your library")
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Video Generator</h2>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'create' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('create')}
          >
            Create New
          </Button>
          <Button 
            variant={viewMode === 'library' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('library')}
          >
            My Videos
          </Button>
        </div>
      </div>
      
      <Separator />
      
      {viewMode === 'create' ? (
        <Tabs defaultValue="portfolio" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio" disabled={generating}>Portfolio Video</TabsTrigger>
            <TabsTrigger value="resume" disabled={generating}>Resume Video</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Form Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Details</CardTitle>
                  <CardDescription>
                    Configure your {activeTab === "portfolio" ? "portfolio" : "resume"} video
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Video Title</Label>
                    <Input 
                      id="title" 
                      placeholder="My Professional Portfolio" 
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      disabled={generating}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goal">Video Goal</Label>
                    <Input 
                      id="goal" 
                      placeholder="Showcase my web development skills to potential employers" 
                      value={videoGoal}
                      onChange={(e) => setVideoGoal(e.target.value)}
                      disabled={generating}
                    />
                  </div>
                  
                  {activeTab === "portfolio" && (
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Select Portfolio</Label>
                      <Select 
                        value={selectedPortfolio} 
                        onValueChange={setSelectedPortfolio}
                        disabled={generating || userPortfolios.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a portfolio" />
                        </SelectTrigger>
                        <SelectContent>
                          {userPortfolios.map(portfolio => (
                            <SelectItem key={portfolio.id} value={portfolio.id}>
                              {portfolio.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {userPortfolios.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          You don't have any portfolios yet. Create one first.
                        </p>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "resume" && (
                    <div className="space-y-2">
                      <Label htmlFor="resume">Select Resume</Label>
                      <Select 
                        value={selectedResume} 
                        onValueChange={setSelectedResume}
                        disabled={generating || userResumes.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a resume" />
                        </SelectTrigger>
                        <SelectContent>
                          {userResumes.map(resume => (
                            <SelectItem key={resume.id} value={resume.id}>
                              {resume.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {userResumes.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          You don't have any resumes yet. Create one first.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Audio & Visuals</CardTitle>
                  <CardDescription>
                    Customize the look and sound of your video
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="custom-script" className="flex items-center gap-2">
                      <span>Use Custom Script</span>
                    </Label>
                    <Switch
                      id="custom-script"
                      checked={useCustomScript}
                      onCheckedChange={setUseCustomScript}
                      disabled={generating}
                    />
                  </div>
                  
                  {useCustomScript && (
                    <div className="space-y-2">
                      <Label htmlFor="script">Custom Script</Label>
                      <Textarea 
                        id="script" 
                        placeholder="Write your script here..." 
                        className="min-h-[120px]"
                        value={customScript}
                        onChange={(e) => setCustomScript(e.target.value)}
                        disabled={generating}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice">Voice Style</Label>
                    <Select value={voiceStyle} onValueChange={setVoiceStyle} disabled={generating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="serious">Serious</SelectItem>
                        <SelectItem value="calm">Calm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Visual Theme</Label>
                    <Select value={theme} onValueChange={setTheme} disabled={generating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="vibrant">Vibrant</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="music">Background Music</Label>
                    <Select value={musicStyle} onValueChange={setMusicStyle} disabled={generating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select music style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ambient">Ambient</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="upbeat">Upbeat</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="none">No Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="duration">Video Duration</Label>
                      <span className="text-sm text-muted-foreground">{duration} seconds</span>
                    </div>
                    <Slider
                      id="duration"
                      min={30}
                      max={180}
                      step={15}
                      value={[duration]}
                      onValueChange={(values) => setDuration(values[0])}
                      disabled={generating}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    size="lg" 
                    onClick={generateVideo}
                    disabled={generating || (activeTab === "portfolio" && userPortfolios.length === 0) || (activeTab === "resume" && userResumes.length === 0)}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Preview Section */}
            <div className="space-y-6">
              <Card className="min-h-[400px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Video Preview</span>
                    {status !== 'idle' && (
                      <Badge 
                        variant={status === 'completed' ? "default" : status === 'generating' ? "outline" : "destructive"}
                      >
                        {status === 'completed' ? 'Completed' : status === 'generating' ? 'Generating' : 'Error'}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {status === 'idle' && "Fill out the form and click generate to create your video"}
                    {status === 'generating' && "Your video is being generated..."}
                    {status === 'completed' && "Your video has been generated successfully"}
                    {status === 'error' && "There was an error generating your video"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {status === 'idle' && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <Video className="h-16 w-16 text-muted-foreground/60" />
                      <h3 className="mt-4 text-lg font-medium">No Video Generated Yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Complete the form to generate your professional video
                      </p>
                    </div>
                  )}
                  
                  {status === 'generating' && (
                    <div className="flex h-full flex-col items-center justify-center px-8">
                      <Sparkles className="h-12 w-12 text-primary animate-pulse mb-4" />
                      <Progress value={progress} className="w-full mb-4" />
                      <p className="text-sm text-center text-muted-foreground">
                        {progress < 30 && "Preparing your content..."}
                        {progress >= 30 && progress < 60 && "Generating script and audio..."}
                        {progress >= 60 && progress < 90 && "Creating visuals..."}
                        {progress >= 90 && "Finalizing your video..."}
                      </p>
                    </div>
                  )}
                  
                  {status === 'completed' && (
                    <VideoPreview 
                      title={videoTitle}
                      videoUrl={videoUrl} 
                      audioUrl={audioUrl} 
                      script={generatedScript}
                    />
                  )}
                  
                  {status === 'error' && (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="rounded-full bg-destructive/10 p-4">
                        <div className="text-destructive">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                        </div>
                      </div>
                      <h3 className="mt-4 text-lg font-medium">Video Generation Failed</h3>
                      <p className="mt-2 text-sm text-muted-foreground text-center">
                        There was an error generating your video. Please try again or contact support.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={generateVideo}
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className={status !== 'completed' ? "hidden" : "flex flex-wrap justify-between gap-2"}>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadVideo}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={shareVideo}
                      className="flex items-center gap-1"
                    >
                      <Share className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={saveVideo}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    Save to Library
                  </Button>
                </CardFooter>
              </Card>
              
              {generatedScript && status === 'completed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MusicIcon className="h-4 w-4" />
                      Generated Script
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[200px] overflow-y-auto rounded border p-4 text-sm">
                      {generatedScript}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Tabs>
      ) : (
        <VideoLibrary />
      )}
    </div>
  )
} 