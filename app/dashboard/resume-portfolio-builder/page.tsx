"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload, Sparkles, Globe, Wand2, FileText, CodeSquare, PanelRight, PenTool } from "lucide-react"
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
  projectType: z.enum(["resume", "portfolio", "both"]),
  style: z.string().min(1, {
    message: "Please select a style.",
  }),
  portfolioImport: z.boolean().default(true),
  resumeImport: z.boolean().default(false),
  colorTheme: z.string().default("professional"),
  layout: z.string().default("modern"),
  sections: z.array(z.string()).default([]),
  customNotes: z.string().optional(),
})

type BuilderStatus = "not_started" | "extracting" | "designing" | "coding" | "optimizing" | "complete"

export default function ResumePortfolioBuilderPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("create")
  const [builderStatus, setBuilderStatus] = useState<BuilderStatus>("not_started")
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      projectType: "portfolio",
      style: "professional",
      portfolioImport: true,
      resumeImport: false,
      colorTheme: "professional",
      layout: "modern",
      sections: ["about", "experience", "skills", "projects", "contact"],
      customNotes: "",
    },
  })

  const sections = [
    { id: "about", label: "About Me" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "achievements", label: "Achievements" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
    { id: "gallery", label: "Gallery" },
    { id: "blog", label: "Blog" },
  ]

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    
    try {
      // Start the website generation process
      setBuilderStatus("extracting")
      setProgress(10)
      
      // In a real implementation, we would fetch portfolio and resume data here
      const portfolioData = {}
      const resumeData = {}
      
      // Call the website builder API
      const response = await fetch("/api/website-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          ...values,
          portfolioData: values.portfolioImport ? portfolioData : null,
          resumeData: values.resumeImport ? resumeData : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate website");
      }
      
      // Update the UI based on the API response stages
      setBuilderStatus("designing")
      setProgress(30)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBuilderStatus("coding")
      setProgress(50)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBuilderStatus("optimizing")
      setProgress(75)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const data = await response.json();
      
      setBuilderStatus("complete")
      setProgress(100)
      setPreviewUrl(data.previewUrl || "https://example.com/preview")
      
      setActiveTab("preview")
      
      toast({
        title: "Website Generated Successfully",
        description: "Your personalized website has been created and is ready to preview.",
      })
    } catch (error) {
      console.error("Error generating website:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate your website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusMessages = {
    not_started: "Ready to generate your website",
    extracting: "Extracting and analyzing your data...",
    designing: "Designing your website layout...",
    coding: "Generating responsive HTML and CSS...",
    optimizing: "Optimizing for performance and accessibility...",
    complete: "Your website is ready to preview!"
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Resume & Portfolio Website Builder</h1>
        <p className="text-muted-foreground">Create professional websites to showcase your skills and experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Create stunning websites in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Data Import</h3>
                  <p className="text-sm text-muted-foreground">We extract relevant information from your existing content</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <PenTool className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">AI Design Process</h3>
                  <p className="text-sm text-muted-foreground">Our AI creates a personalized design based on your preferences</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CodeSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Website Generation</h3>
                  <p className="text-sm text-muted-foreground">Responsive HTML, CSS, and JavaScript are generated</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Deployment</h3>
                  <p className="text-sm text-muted-foreground">Publish your website with one click</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <IntroVideo 
                title="How to Create Professional Websites"
                description="Learn how to create stunning portfolio and resume websites"
                videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                thumbnailUrl="/images/website-builder-thumbnail.jpg"
              />
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="create">Create Website</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4 pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Website Details</CardTitle>
                      <CardDescription>Configure your personalized website</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website Title</FormLabel>
                            <FormControl>
                              <Input placeholder="My Professional Portfolio" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a title for your website (will appear in browser tab)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select the type of website" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="resume">Resume Website</SelectItem>
                                <SelectItem value="portfolio">Portfolio Website</SelectItem>
                                <SelectItem value="both">Combined Resume & Portfolio</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose what type of website you want to create
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Style</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="minimal">Minimal</SelectItem>
                                <SelectItem value="bold">Bold</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the overall style of your website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-3">
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
                                <FormLabel>Import Portfolio Data</FormLabel>
                                <FormDescription>
                                  Use your existing portfolio data to populate the website
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
                                <FormLabel>Import Resume Data</FormLabel>
                                <FormDescription>
                                  Use your existing resume data to populate the website
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="colorTheme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color Theme</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a color theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="professional">Professional Blue</SelectItem>
                                <SelectItem value="modern">Modern Dark</SelectItem>
                                <SelectItem value="creative">Creative Purple</SelectItem>
                                <SelectItem value="elegant">Elegant Green</SelectItem>
                                <SelectItem value="bold">Bold Red</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose a color theme for your website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="layout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Layout</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a layout" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="minimal">Minimal</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the layout structure for your website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sections"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">Sections</FormLabel>
                              <FormDescription>
                                Select the sections to include in your website
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {sections.map((section) => (
                                <FormField
                                  key={section.id}
                                  control={form.control}
                                  name="sections"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={section.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(section.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, section.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== section.id
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {section.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add any special instructions or requirements for your website..."
                                className="resize-none min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Any specific features or details you want to include
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Reset
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                          </>
                        ) : (
                          <>Generate Website</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
              
              {builderStatus !== "not_started" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generation Progress</CardTitle>
                    <CardDescription>{statusMessages[builderStatus]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress} className="h-2" />
                    <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className={`p-2 rounded ${builderStatus === "extracting" || builderStatus === "designing" || builderStatus === "coding" || builderStatus === "optimizing" || builderStatus === "complete" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        Data Extraction
                      </div>
                      <div className={`p-2 rounded ${builderStatus === "designing" || builderStatus === "coding" || builderStatus === "optimizing" || builderStatus === "complete" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        Design
                      </div>
                      <div className={`p-2 rounded ${builderStatus === "coding" || builderStatus === "optimizing" || builderStatus === "complete" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        Code Generation
                      </div>
                      <div className={`p-2 rounded ${builderStatus === "optimizing" || builderStatus === "complete" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        Optimization
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 pt-4">
              {builderStatus === "complete" ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Website Preview</CardTitle>
                      <CardDescription>
                        Your website has been successfully generated
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full border rounded-md overflow-hidden">
                        <div className="bg-muted border-b flex items-center px-4 py-2 gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <div className="ml-4 bg-background rounded flex-1 text-sm p-1.5 text-center truncate">
                            {previewUrl}
                          </div>
                        </div>
                        <div className="aspect-video bg-background relative flex items-center justify-center">
                          <iframe 
                            src={previewUrl} 
                            className="w-full h-full"
                            title="Website Preview"
                          />
                          <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab("create")}
                      >
                        Back to Editor
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          Download Source Code
                        </Button>
                        <Button>
                          Publish Website
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Next Steps</CardTitle>
                      <CardDescription>
                        What you can do with your new website
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <PanelRight className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Customize Content</h3>
                          <p className="text-sm text-muted-foreground">Fine-tune your website content to perfect your online presence</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Custom Domain</h3>
                          <p className="text-sm text-muted-foreground">Connect your own domain name for a professional touch</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Download Code</h3>
                          <p className="text-sm text-muted-foreground">Get the source code to host the site on your own servers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Preview Available</CardTitle>
                    <CardDescription>
                      Generate a website first to see a preview
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Globe className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-center max-w-md">
                      Your website preview will appear here after you complete the generation process. 
                      Go to the "Create Website" tab to begin.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => setActiveTab("create")}
                    >
                      Create Your Website
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 