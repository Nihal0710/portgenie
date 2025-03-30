"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, FileText, Copy, Download, ArrowRight, Save, Eye, CloudUpload, History, Trash2, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { useUser } from "@clerk/nextjs"
import { createCoverLetter, getUserCoverLetters } from "@/lib/supabase"
import { pinJSONToIPFS } from "@/lib/pinata"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { getUserProfile } from "@/lib/supabase"

type SavedCoverLetter = {
  id: string
  title: string
  company: string
  job_title: string
  content: string
  template: string
  is_generated: boolean
  ipfs_hash?: string
  ipfs_url?: string
  created_at: string
  updated_at: string
}

export function CoverLetterGenerator() {
  const { toast } = useToast()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [ipfsLoading, setIpfsLoading] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState("")
  const [activeTab, setActiveTab] = useState("form")
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState("")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState(50)
  const [template, setTemplate] = useState("modern")
  const [savedLetters, setSavedLetters] = useState<SavedCoverLetter[]>([])
  const [selectedLetter, setSelectedLetter] = useState<SavedCoverLetter | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [coverLetterTitle, setCoverLetterTitle] = useState("")

  // Load saved cover letters when component mounts
  useEffect(() => {
    if (user) {
      loadSavedLetters()
      
      // Pre-fill experience/skills from user profile if available
      loadUserProfileData()
    }
  }, [user])

  const loadUserProfileData = async () => {
    try {
      if (!user) return
      
      const userProfile = await getUserProfile(user.id)
      if (userProfile) {
        // If user has skills in profile, use them
        if (userProfile.profile && userProfile.profile.skills && userProfile.profile.skills.length > 0) {
          setSkills(userProfile.profile.skills.join(', '))
        }
        
        // If user has job title and summary in profile, use them for experience
        if (userProfile.profile && userProfile.profile.job_title && userProfile.profile.summary) {
          setExperience(`${userProfile.profile.job_title}: ${userProfile.profile.summary}`)
        }
      }
    } catch (error) {
      console.error('Error loading user profile data:', error)
      // Continue without profile data - not critical
    }
  }

  const loadSavedLetters = async () => {
    try {
      if (!user) return
      const letters = await getUserCoverLetters(user.id)
      setSavedLetters(letters)
    } catch (error) {
      console.error('Error loading saved cover letters:', error)
      toast({
        title: "Error",
        description: "Failed to load your saved cover letters",
        variant: "destructive",
      })
    }
  }

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
      
      // Set a default title for the cover letter
      setCoverLetterTitle(`${companyName} - ${jobTitle}`)
      
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
  
  const saveCoverLetter = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your cover letter",
        variant: "destructive",
      })
      return
    }
    
    if (!coverLetterText || !coverLetterTitle) {
      toast({
        title: "Missing information",
        description: "Please generate a cover letter and provide a title",
        variant: "destructive",
      })
      return
    }
    
    setSaveLoading(true)
    try {
      const coverLetterData = {
        title: coverLetterTitle,
        company: companyName,
        job_title: jobTitle,
        content: coverLetterText,
        template: template,
        is_generated: true
      }
      
      const savedLetter = await createCoverLetter(user.id, coverLetterData)
      
      // Refresh the list of saved letters
      await loadSavedLetters()
      
      toast({
        title: "Saved",
        description: "Cover letter saved successfully",
      })
      
      // Switch to saved tab to show the newly saved letter
      setActiveTab("saved")
    } catch (error) {
      console.error('Error saving cover letter:', error)
      toast({
        title: "Error",
        description: "Failed to save cover letter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaveLoading(false)
    }
  }
  
  const saveToIPFS = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to store on IPFS",
        variant: "destructive",
      })
      return
    }
    
    if (!selectedLetter) {
      toast({
        title: "No cover letter selected",
        description: "Please select a saved cover letter first",
        variant: "destructive",
      })
      return
    }
    
    setIpfsLoading(true)
    try {
      // Prepare metadata
      const metadata = {
        title: selectedLetter.title,
        company: selectedLetter.company,
        job_title: selectedLetter.job_title,
        content: selectedLetter.content,
        created_at: selectedLetter.created_at,
        template: selectedLetter.template,
      }
      
      // Upload to IPFS via Pinata
      const result = await pinJSONToIPFS(
        metadata,
        user.id,
        {
          name: `cover-letter-${selectedLetter.id}.json`,
          description: `Cover letter for ${selectedLetter.company} - ${selectedLetter.job_title}`,
          relatedEntityType: 'cover_letter',
          relatedEntityId: selectedLetter.id,
          tags: ['cover-letter', 'job-application']
        }
      )
      
      // Update the database record with IPFS info
      const { data, error } = await supabase
        .from('cover_letters')
        .update({
          ipfs_hash: result.ipfsHash,
          ipfs_url: result.ipfsUrl
        })
        .eq('id', selectedLetter.id)
        .select()
      
      if (error) throw error
      
      // Refresh the list
      await loadSavedLetters()
      
      toast({
        title: "Stored on IPFS",
        description: "Cover letter successfully stored on IPFS",
      })
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      toast({
        title: "Error",
        description: "Failed to store cover letter on IPFS",
        variant: "destructive",
      })
    } finally {
      setIpfsLoading(false)
    }
  }
  
  const deleteCoverLetter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Refresh the list
      await loadSavedLetters()
      
      toast({
        title: "Deleted",
        description: "Cover letter deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting cover letter:', error)
      toast({
        title: "Error",
        description: "Failed to delete cover letter",
        variant: "destructive",
      })
    }
  }
  
  const loadCoverLetter = (letter: SavedCoverLetter) => {
    setSelectedLetter(letter)
    setCoverLetterText(letter.content)
    setJobTitle(letter.job_title)
    setCompanyName(letter.company)
    setCoverLetterTitle(letter.title)
    setTemplate(letter.template)
    setActiveTab("result")
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Create Cover Letter</span>
          </TabsTrigger>
          <TabsTrigger value="result" className="flex items-center gap-2" disabled={!coverLetterText}>
            <FileText className="h-4 w-4" />
            <span>Generated Letter</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Saved Letters</span>
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
              
              <div className="grid gap-2">
                <Label htmlFor="template">Template Style</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="flex flex-col space-y-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Your Cover Letter</span>
                </CardTitle>
                <div className="grid gap-2">
                  <Label htmlFor="cover-letter-title">Title</Label>
                  <Input 
                    id="cover-letter-title" 
                    placeholder="Give your cover letter a title" 
                    value={coverLetterTitle}
                    onChange={(e) => setCoverLetterTitle(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`border rounded-md p-6 space-y-6 ${
                template === 'modern' ? 'font-sans' : 
                template === 'classic' ? 'font-serif' : 
                template === 'minimal' ? 'font-sans text-sm' : 
                template === 'creative' ? 'font-sans bg-gradient-to-r from-purple-50 to-blue-50' : 
                'font-serif'
              }`}>
                <pre className="whitespace-pre-wrap font-inherit">{coverLetterText}</pre>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={downloadCoverLetter}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setActiveTab("form")}
                >
                  <Edit className="h-4 w-4" />
                  Edit Details
                </Button>
              </div>
              
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={saveCoverLetter}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Cover Letter
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* SAVED LETTERS TAB */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Cover Letters</CardTitle>
              <CardDescription>
                Your previously created cover letters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedLetters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-3 opacity-30" />
                  <p>You haven't saved any cover letters yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setActiveTab("form")}
                  >
                    Create Your First Cover Letter
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedLetters.map((letter) => (
                    <Card key={letter.id} className="overflow-hidden">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{letter.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {letter.job_title} at {letter.company}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {letter.ipfs_hash && (
                              <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                IPFS
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(letter.created_at), 'MMM d, yyyy')}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => loadCoverLetter(letter)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                {!letter.ipfs_hash && (
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedLetter(letter);
                                    saveToIPFS();
                                  }}>
                                    <CloudUpload className="mr-2 h-4 w-4" />
                                    Store on IPFS
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => deleteCoverLetter(letter.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="border-t px-4 py-3">
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {letter.content.substring(0, 150)}...
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t px-4 py-2 bg-muted/20">
                        <div className="flex justify-between items-center w-full">
                          <div className="text-xs">
                            Template: <span className="font-medium capitalize">{letter.template}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            onClick={() => loadCoverLetter(letter)}
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 