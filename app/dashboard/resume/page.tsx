"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Download, FileText, Github, Linkedin, Code, Plus, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";
import { uploadJSONToIPFS } from "@/lib/pinata";
import { createResume, getResumes } from "@/lib/supabase";
import { extractLinkedInProfile, extractGitHubProfile, extractLeetCodeProfile, combineProfiles } from "@/lib/gemini";
import { verifyResume } from "@/lib/ethereum";

export default function ResumePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("create");
  const [processingAI, setProcessingAI] = useState(false);
  const [uploadingIPFS, setUploadingIPFS] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [resumeTemplate, setResumeTemplate] = useState("modern");
  const { toast } = useToast();

  // Load user's resumes
  useEffect(() => {
    const loadResumes = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const userResumes = await getResumes(user.id);
          setResumes(userResumes);
        } catch (error) {
          console.error("Error loading resumes:", error);
          toast({
            title: "Error",
            description: "Failed to load your resumes. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadResumes();
  }, [isLoaded, isSignedIn, user, toast]);

  const handleGenerateResume = async () => {
    if (!user) return;
    
    if (!linkedinUrl && !githubUrl && !leetcodeUrl) {
      toast({
        title: "Input Required",
        description: "Please provide at least one profile URL (LinkedIn, GitHub, or LeetCode).",
        variant: "destructive",
      });
      return;
    }
    
    if (!resumeTitle) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your resume.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingAI(true);
    
    try {
      const profiles: any = {};
      
      // Extract data from provided profiles
      if (linkedinUrl) {
        try {
          const linkedinData = await extractLinkedInProfile(linkedinUrl);
          profiles.linkedin = linkedinData;
        } catch (error) {
          console.error("Error extracting LinkedIn profile:", error);
          toast({
            title: "LinkedIn Extraction Failed",
            description: "Could not extract data from the provided LinkedIn URL.",
            variant: "destructive",
          });
        }
      }
      
      if (githubUrl) {
        try {
          const githubData = await extractGitHubProfile(githubUrl);
          profiles.github = githubData;
        } catch (error) {
          console.error("Error extracting GitHub profile:", error);
          toast({
            title: "GitHub Extraction Failed",
            description: "Could not extract data from the provided GitHub URL.",
            variant: "destructive",
          });
        }
      }
      
      if (leetcodeUrl) {
        try {
          const leetcodeData = await extractLeetCodeProfile(leetcodeUrl);
          profiles.leetcode = leetcodeData;
        } catch (error) {
          console.error("Error extracting LeetCode profile:", error);
          toast({
            title: "LeetCode Extraction Failed",
            description: "Could not extract data from the provided LeetCode URL.",
            variant: "destructive",
          });
        }
      }
      
      // Combine profiles if multiple sources were provided
      let combinedProfile;
      if (Object.keys(profiles).length > 1) {
        combinedProfile = await combineProfiles(profiles);
      } else if (profiles.linkedin) {
        combinedProfile = profiles.linkedin;
      } else if (profiles.github) {
        combinedProfile = profiles.github;
      } else if (profiles.leetcode) {
        combinedProfile = profiles.leetcode;
      }
      
      if (!combinedProfile) {
        throw new Error("Failed to generate profile data");
      }
      
      // Create resume data structure
      const newResumeData = {
        title: resumeTitle,
        template: resumeTemplate,
        content: combinedProfile,
        sources: Object.keys(profiles),
        created_at: new Date().toISOString()
      };
      
      setResumeData(newResumeData);
      setActiveTab("preview");
      
      toast({
        title: "Resume Generated",
        description: "Your resume has been generated successfully. You can now preview and save it.",
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAI(false);
    }
  };

  const handleSaveResume = async () => {
    if (!user || !resumeData) return;
    
    setUploadingIPFS(true);
    
    try {
      // Upload to IPFS
      const ipfsResponse = await uploadJSONToIPFS(resumeData);
      
      if (!ipfsResponse || !ipfsResponse.IpfsHash) {
        throw new Error("Failed to upload to IPFS");
      }
      
      // Save to Supabase
      const savedResume = await createResume(user.id, {
        title: resumeData.title,
        content: resumeData.content,
        template: resumeData.template,
        ipfs_hash: ipfsResponse.IpfsHash,
        is_public: false
      });
      
      // Add to local state
      setResumes([savedResume, ...resumes]);
      
      toast({
        title: "Resume Saved",
        description: "Your resume has been saved and stored on IPFS.",
      });
      
      // Reset form
      setResumeData(null);
      setLinkedinUrl("");
      setGithubUrl("");
      setLeetcodeUrl("");
      setResumeTitle("");
      setActiveTab("list");
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingIPFS(false);
    }
  };

  const handleVerifyResume = async (resume: any) => {
    if (!user) return;
    
    setVerifying(true);
    
    try {
      // Verify on blockchain
      const verificationResult = await verifyResume(resume.content, resume.ipfs_hash);
      
      // Update resume with verification transaction
      const updatedResume = {
        ...resume,
        blockchain_verification_tx: verificationResult.transactionHash
      };
      
      // Update in local state
      const updatedResumes = resumes.map(r => 
        r.id === resume.id ? updatedResume : r
      );
      setResumes(updatedResumes);
      
      toast({
        title: "Resume Verified",
        description: "Your resume has been verified on the blockchain.",
      });
    } catch (error) {
      console.error("Error verifying resume:", error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify your resume on the blockchain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
        <p className="text-muted-foreground mt-1">
          Create, manage, and verify your professional resumes with AI
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="list">My Resumes</TabsTrigger>
          <TabsTrigger value="create">Create Resume</TabsTrigger>
          <TabsTrigger value="preview" disabled={!resumeData}>Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {resumes.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Resumes Found</CardTitle>
                <CardDescription>
                  You haven't created any resumes yet. Get started by creating your first resume.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Resume
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <Card key={resume.id}>
                  <CardHeader>
                    <CardTitle>{resume.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(resume.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <FileText className="mr-2 h-4 w-4" />
                      Template: {resume.template}
                    </div>
                    {resume.ipfs_hash && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Stored on IPFS
                      </div>
                    )}
                    {resume.blockchain_verification_tx && (
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500" />
                        Blockchain Verified
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <a href={`/dashboard/resume/${resume.id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </a>
                    </Button>
                    {resume.ipfs_hash && !resume.blockchain_verification_tx && (
                      <Button 
                        variant="secondary"
                        onClick={() => handleVerifyResume(resume)}
                        disabled={verifying}
                      >
                        {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Resume</CardTitle>
              <CardDescription>
                Generate a professional resume using AI from your LinkedIn, GitHub, or LeetCode profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resumeTitle">Resume Title</Label>
                <Input
                  id="resumeTitle"
                  placeholder="My Professional Resume"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resumeTemplate">Template Style</Label>
                <Select value={resumeTemplate} onValueChange={setResumeTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Import from Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  Provide at least one profile URL to generate your resume
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <Input
                        placeholder="LinkedIn Profile URL"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Github className="h-5 w-5" />
                    <div className="flex-1">
                      <Input
                        placeholder="GitHub Profile URL"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Code className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <Input
                        placeholder="LeetCode Profile URL"
                        value={leetcodeUrl}
                        onChange={(e) => setLeetcodeUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateResume}
                disabled={processingAI || (!linkedinUrl && !githubUrl && !leetcodeUrl) || !resumeTitle}
              >
                {processingAI && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {processingAI ? "Generating..." : "Generate Resume"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          {resumeData && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{resumeData.title}</CardTitle>
                  <CardDescription>
                    Preview your generated resume before saving
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted p-6 rounded-md">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold">{resumeData.content.name}</h2>
                      <p className="text-muted-foreground">{resumeData.content.title}</p>
                    </div>
                    
                    {resumeData.content.summary && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Summary</h3>
                        <p>{resumeData.content.summary}</p>
                      </div>
                    )}
                    
                    {resumeData.content.experience && resumeData.content.experience.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Experience</h3>
                        <div className="space-y-4">
                          {resumeData.content.experience.map((exp: any, index: number) => (
                            <div key={index}>
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">{exp.position}</h4>
                                  <p className="text-sm">{exp.company}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {exp.startDate} - {exp.endDate || 'Present'}
                                </p>
                              </div>
                              <p className="text-sm mt-1">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {resumeData.content.education && resumeData.content.education.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Education</h3>
                        <div className="space-y-4">
                          {resumeData.content.education.map((edu: any, index: number) => (
                            <div key={index}>
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">{edu.degree}</h4>
                                  <p className="text-sm">{edu.institution}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {edu.startDate} - {edu.endDate || 'Present'}
                                </p>
                              </div>
                              {edu.description && (
                                <p className="text-sm mt-1">{edu.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {resumeData.content.skills && resumeData.content.skills.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.content.skills.map((skill: string, index: number) => (
                            <span 
                              key={index}
                              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {resumeData.content.projects && resumeData.content.projects.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Projects</h3>
                        <div className="space-y-4">
                          {resumeData.content.projects.map((project: any, index: number) => (
                            <div key={index}>
                              <h4 className="font-medium">{project.name}</h4>
                              <p className="text-sm mt-1">{project.description}</p>
                              {project.technologies && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.technologies.map((tech: string, techIndex: number) => (
                                    <span 
                                      key={techIndex}
                                      className="bg-muted-foreground/20 px-2 py-0.5 rounded text-xs"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("create")}>
                    Back to Edit
                  </Button>
                  <Button 
                    onClick={handleSaveResume}
                    disabled={uploadingIPFS}
                  >
                    {uploadingIPFS && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {uploadingIPFS ? "Saving..." : "Save Resume"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
