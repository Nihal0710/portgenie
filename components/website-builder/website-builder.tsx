"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, Code, Save, Eye, Layout, Palette, FileCode } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"

export function WebsiteBuilder() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [jsCode, setJsCode] = useState("")
  const [previewHtml, setPreviewHtml] = useState("")
  const [websiteName, setWebsiteName] = useState("")
  const [prompt, setPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("builder")
  const [websiteType, setWebsiteType] = useState("portfolio")
  const [colorScheme, setColorScheme] = useState("blue")
  const [complexity, setComplexity] = useState(50)
  
  // Update the preview whenever code changes
  useEffect(() => {
    const combinedCode = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `
    setPreviewHtml(combinedCode)
  }, [htmlCode, cssCode, jsCode])

  const generateWebsite = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please provide a website description",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          websiteType,
          colorScheme,
          complexity: complexity / 100,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate website")
      }

      const data = await response.json()
      setHtmlCode(data.html)
      setCssCode(data.css)
      setJsCode(data.js || "")
      
      toast({
        title: "Success",
        description: "Website generated successfully!",
      })
      
      // Switch to preview tab
      setActiveTab("preview")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveWebsite = () => {
    // Create a downloadable file
    const blob = new Blob([previewHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${websiteName || 'website'}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Website Saved",
      description: "Your website has been downloaded successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Builder</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>

        {/* BUILDER TAB */}
        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="website-name">Website Name</Label>
                <Input 
                  id="website-name" 
                  placeholder="My Awesome Website" 
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="website-type">Website Type</Label>
                <Select value={websiteType} onValueChange={setWebsiteType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select website type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="color-scheme">Color Scheme</Label>
                <Select value={colorScheme} onValueChange={setColorScheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="complexity">Complexity</Label>
                  <span className="text-sm text-muted-foreground">{complexity}%</span>
                </div>
                <Slider
                  id="complexity"
                  min={10}
                  max={100}
                  step={10}
                  value={[complexity]}
                  onValueChange={(value) => setComplexity(value[0])}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="prompt">Website Description</Label>
                <Textarea 
                  id="prompt" 
                  placeholder="Describe your website in detail..." 
                  className="min-h-[100px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateWebsite} 
                disabled={loading || !prompt}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Website
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* CODE TAB */}
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                </TabsList>
                <TabsContent value="html">
                  <Textarea
                    className="min-h-[400px] font-mono text-sm"
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="<div>Your HTML code here...</div>"
                  />
                </TabsContent>
                <TabsContent value="css">
                  <Textarea
                    className="min-h-[400px] font-mono text-sm"
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    placeholder="body { font-family: sans-serif; }"
                  />
                </TabsContent>
                <TabsContent value="js">
                  <Textarea
                    className="min-h-[400px] font-mono text-sm"
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    placeholder="// Your JavaScript code here"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("preview")}>
                <Eye className="mr-2 h-4 w-4" />
                View Preview
              </Button>
              <Button onClick={saveWebsite}>
                <Save className="mr-2 h-4 w-4" />
                Save Website
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* PREVIEW TAB */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </span>
                <Button size="sm" onClick={saveWebsite}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Website
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden bg-white min-h-[500px]">
                <iframe
                  srcDoc={previewHtml}
                  title="Website Preview"
                  className="w-full h-[500px]"
                  sandbox="allow-scripts"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 