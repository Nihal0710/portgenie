"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, ImageIcon, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample prompts for inspiration
const samplePrompts = [
  "A professional portfolio website header image with a sleek, modern design showing coding and design elements",
  "A minimalist logo for a tech professional with blue and purple gradients",
  "An illustration of a software developer working in a futuristic workspace with holographic displays",
  "A clean banner image showing various technology icons and tools for a developer portfolio",
  "An artistic representation of data visualization and AI concepts for a tech portfolio",
]

export function ImageGenerator() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("create")

  const generateImage = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt for image generation",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      if (data.success && data.imagePath) {
        setGeneratedImage(data.imagePath)
        setActiveTab("result")
        toast({
          title: "Success",
          description: "Image generated successfully!",
        })
      } else {
        throw new Error(data.message || "Failed to generate image")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return
    
    const link = document.createElement("a")
    link.href = generatedImage
    link.download = `ai-generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Downloaded",
      description: "Image downloaded successfully",
    })
  }

  const useSamplePrompt = (index: number) => {
    setPrompt(samplePrompts[index])
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Generate Image</span>
          </TabsTrigger>
          <TabsTrigger value="result" className="flex items-center gap-2" disabled={!generatedImage}>
            <ImageIcon className="h-4 w-4" />
            <span>View Image</span>
          </TabsTrigger>
        </TabsList>

        {/* CREATE TAB */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate AI Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="prompt">
                  Describe the image you want to create <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  id="prompt" 
                  placeholder="A professional portfolio header image with a sleek, modern design..." 
                  className="min-h-[100px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Sample prompts for inspiration:</p>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((samplePrompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => useSamplePrompt(index)}
                      className="text-xs"
                    >
                      Sample {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateImage} 
                disabled={loading || !prompt}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">About AI Image Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This tool uses Google's Gemini 2.0 model to generate high-quality images based on your text prompts.
                The more detailed and specific your description, the better the results will be.
                You can generate images for your portfolio, project thumbnails, or any creative needs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RESULT TAB */}
        <TabsContent value="result" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Generated Image</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("create")}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Another
                  </Button>
                  <Button size="sm" onClick={downloadImage} disabled={!generatedImage}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative overflow-hidden rounded-lg border border-border w-full max-w-2xl mx-auto">
                    <Image 
                      src={generatedImage}
                      alt="AI Generated Image" 
                      width={1024} 
                      height={1024}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground px-4">
                    <strong>Prompt:</strong> {prompt}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/30">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No image generated yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("create")}>
                Generate Another Image
              </Button>
              <Button onClick={downloadImage} disabled={!generatedImage}>
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 