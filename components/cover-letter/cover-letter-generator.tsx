"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, FileText, Copy, Download, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"

export function CoverLetterGenerator() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState("")
  const [activeTab, setActiveTab] = useState("form")
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState("")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState(50)

  const generateCoverLetter = async () => {
    if (!jobTitle || !companyName || !jobDescription) {
      toast({
        title: "Missing information",
        description: "Please fill in the required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          companyName,
          jobDescription,
          experience,
          skills,
          tone,
          length: length / 100,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate cover letter")
      }

      const data = await response.json()
      setCoverLetterText(data.coverLetter)
      toast({
        title: "Success",
        description: "Cover letter generated successfully!",
      })
      
      // Switch to result tab
      setActiveTab("result")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetterText)
    toast({
      title: "Copied",
      description: "Cover letter copied to clipboard",
    })
  }

  const downloadCoverLetter = () => {
    const blob = new Blob([coverLetterText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Cover Letter - ${companyName} - ${jobTitle}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Cover letter saved as text file",
    })
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Create Cover Letter</span>
          </TabsTrigger>
          <TabsTrigger value="result" className="flex items-center gap-2" disabled={!coverLetterText}>
            <FileText className="h-4 w-4" />
            <span>Generated Letter</span>
          </TabsTrigger>
        </TabsList>

        {/* FORM TAB */}
        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="job-title">Job Title <span className="text-red-500">*</span></Label>
                  <Input 
                    id="job-title" 
                    placeholder="Software Engineer" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="company-name">Company Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="company-name" 
                    placeholder="Acme Inc." 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="job-description">Job Description/Requirements <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="job-description" 
                  placeholder="Paste the job description or key requirements here..." 
                  className="min-h-[100px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="experience">Relevant Experience</Label>
                <Textarea 
                  id="experience" 
                  placeholder="Briefly describe your relevant work experience..." 
                  className="min-h-[100px]"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="skills">Key Skills</Label>
                <Textarea 
                  id="skills" 
                  placeholder="List your key skills relevant to the job..." 
                  className="min-h-[80px]"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tone">Tone of Letter</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="confident">Confident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="length">Letter Length</Label>
                    <span className="text-sm text-muted-foreground">{length}%</span>
                  </div>
                  <Slider
                    id="length"
                    min={25}
                    max={100}
                    step={25}
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                onClick={generateCoverLetter} 
                disabled={loading || !jobTitle || !companyName || !jobDescription}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Cover Letter...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* RESULT TAB */}
        <TabsContent value="result" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Cover Letter</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Text
                  </Button>
                  <Button size="sm" onClick={downloadCoverLetter}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 whitespace-pre-wrap min-h-[400px] bg-muted/30">
                {coverLetterText}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("form")}>
                Edit Details
              </Button>
              <Button onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 