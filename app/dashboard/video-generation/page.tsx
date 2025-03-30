"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload, Sparkles, Video, Wand2, FilePlus2, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { IntroVideo } from "@/components/dashboard/intro-video"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  goal: z.string().min(1, {
    message: "Please select a video goal.",
  }),
  portfolioImport: z.boolean().default(true),
  resumeImport: z.boolean().default(false),
  customScript: z.string().optional(),
  voiceStyle: z.string().default("professional"),
  theme: z.string().default("modern"),
  musicStyle: z.string().default("upbeat"),
  duration: z.string().default("60"),
})

type VideoStatus = "not_started" | "extracting" | "scripting" | "voiceover" | "rendering" | "complete"

export default function VideoGenerationPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("create")
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("not_started")
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      goal: "job_application",
      portfolioImport: true,
      resumeImport: false,
      customScript: "",
      voiceStyle: "professional",
      theme: "modern",
      musicStyle: "upbeat",
      duration: "60",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    
    try {
      // Start the video generation process
      setVideoStatus("extracting")
      setProgress(10)
      
      // In a real implementation, we would fetch portfolio and resume data here
      const portfolioData = {}
      const resumeData = {}
      
      // Call the video generation API
      const response = await fetch("/api/video-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          portfolioData: values.portfolioImport ? portfolioData : null,
          resumeData: values.resumeImport ? resumeData : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate video");
      }
      
      // Update the UI based on the API response stages
      setVideoStatus("scripting")
      setProgress(30)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setVideoStatus("voiceover")
      setProgress(50)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setVideoStatus("rendering")
      setProgress(75)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const data = await response.json();
      
      setVideoStatus("complete")
      setProgress(100)
      
      setActiveTab("preview")
      
      toast({
        title: "Video Generated Successfully",
        description: "Your personalized video has been created and is ready to view.",
      })
    } catch (error) {
      console.error("Error generating video:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate your video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusMessages = {
    not_started: "Ready to generate your video",
    extracting: "Extracting and analyzing your portfolio data...",
    scripting: "Generating personalized video script...",
    voiceover: "Creating professional voiceover...",
    rendering: "Rendering your video with visual effects...",
    complete: "Your video is ready to view!"
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">AI Video Generation</h1>
        <p className="text-muted-foreground">Create personalized portfolio videos powered by AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Create stunning AI-generated videos in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Data Import</h3>
                  <p className="text-sm text-muted-foreground">We extract relevant information from your portfolio</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">AI Script Generation</h3>
                  <p className="text-sm text-muted-foreground">Our AI creates a personalized script highlighting your achievements</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Wand2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Visual Generation</h3>
                  <p className="text-sm text-muted-foreground">Dynamic visuals and professional voiceover are generated</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Complete Video</h3>
                  <p className="text-sm text-muted-foreground">Download or share your professional portfolio video</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <IntroVideo 
                title="How to Create AI Portfolio Videos"
                description="Learn how to create stunning portfolio videos with our AI technology"
                videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                thumbnailUrl="/images/video-thumbnail.jpg"
              />
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="create">Create Video</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4 pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Video Details</CardTitle>
                      <CardDescription>Configure your personalized video</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video Title</FormLabel>
                            <FormControl>
                              <Input placeholder="My Professional Portfolio" {...field} />
                            </FormControl>
                            <FormDescription>
                              This will be the title of your generated video
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video Goal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="job_application">Job Application</SelectItem>
                                <SelectItem value="personal_branding">Personal Branding</SelectItem>
                                <SelectItem value="project_showcase">Project Showcase</SelectItem>
                                <SelectItem value="conference_presentation">Conference Presentation</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              This helps us tailor the content to your needs
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Data Sources</h3>
                        <FormField
                          control={form.control}
                          name="portfolioImport"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Import from my Portfolio</FormLabel>
                                <FormDescription>
                                  Use projects and skills from your PortGenie portfolio
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="resumeImport"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Import from my Resume</FormLabel>
                                <FormDescription>
                                  Use experience and education from your PortGenie resume
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <FormField
                        control={form.control}
                        name="customScript"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Script (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a custom script or leave blank to auto-generate"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Leave blank to let our AI generate a script based on your portfolio
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Customization</CardTitle>
                      <CardDescription>Personalize your video style and appearance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="voiceStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Voice Style</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select voice style" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="professional">Professional</SelectItem>
                                  <SelectItem value="friendly">Friendly & Casual</SelectItem>
                                  <SelectItem value="energetic">Energetic & Dynamic</SelectItem>
                                  <SelectItem value="corporate">Corporate</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="theme"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Visual Theme</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select theme" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="modern">Modern & Clean</SelectItem>
                                  <SelectItem value="bold">Bold & Creative</SelectItem>
                                  <SelectItem value="minimalist">Minimalist</SelectItem>
                                  <SelectItem value="tech">Tech & Digital</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="musicStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Background Music</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select music style" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="upbeat">Upbeat & Positive</SelectItem>
                                  <SelectItem value="ambient">Ambient & Calm</SelectItem>
                                  <SelectItem value="inspiring">Inspiring & Motivational</SelectItem>
                                  <SelectItem value="corporate">Corporate & Professional</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (seconds)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="30">30 seconds</SelectItem>
                                  <SelectItem value="60">60 seconds</SelectItem>
                                  <SelectItem value="90">90 seconds</SelectItem>
                                  <SelectItem value="120">2 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      {videoStatus !== "not_started" && (
                        <div className="w-full space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{statusMessages[videoStatus]}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Generating Video..." : "Generate Video"}
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{form.getValues("title") || "My Professional Portfolio"}</CardTitle>
                      <CardDescription>
                        Generated on {new Date().toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {form.getValues("duration")} sec
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {videoStatus === "complete" ? (
                    <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <p>Your AI-generated video is ready to play</p>
                        <p className="text-sm text-muted-foreground mt-1">This is a demo. In production, the actual video would appear here.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <FilePlus2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No video generated yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Go to the Create Video tab to generate your video</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button disabled={videoStatus !== "complete"}>
                    <Play className="h-4 w-4 mr-2" />
                    Play Video
                  </Button>
                  <Button variant="outline" disabled={videoStatus !== "complete"}>
                    Download
                  </Button>
                  <Button variant="outline" disabled={videoStatus !== "complete"}>
                    Share
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 