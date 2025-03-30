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
import { Loader2, Upload, Download, FileText, Github, Linkedin, Code, Plus, Trash2, ExternalLink, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { uploadJSONToIPFS, uploadFileToIPFS } from "@/lib/pinata";
import { createPortfolio, getPortfolios, getUserProfile } from "@/lib/supabase";
import { verifyPortfolio } from "@/lib/ethereum";
import { extractGitHubProfile } from "@/lib/gemini";
import { ContentImprover } from "@/components/portfolio/content-improver";
import { ContentImprovementProvider } from "@/components/providers/content-improvement-provider";

interface PortfolioData {
  title: string;
  description: string;
  theme: string;
  projects: {
    title: string;
    description: string;
    technologies: string;
    image: string | null;
    github_url: string;
  }[];
  skills: string;
  about: string;
  contact_email: string;
  social_links: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

export default function PortfolioPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [processingAI, setProcessingAI] = useState(false);
  const [uploadingIPFS, setUploadingIPFS] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    title: "",
    description: "",
    theme: "modern",
    projects: [{ title: "", description: "", technologies: "", image: null, github_url: "" }],
    skills: "",
    about: "",
    contact_email: "",
    social_links: { github: "", linkedin: "", twitter: "" }
  });
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const { toast } = useToast();

  // Load user's portfolios and profile
  useEffect(() => {
    const loadData = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const [userPortfolios, profile] = await Promise.all([
            getPortfolios(user.id),
            getUserProfile(user.id)
          ]);
          
          setPortfolios(userPortfolios);
          setUserProfile(profile);
          
          // Pre-fill form with user profile data if available
          if (profile) {
            setPortfolioData((prev: PortfolioData) => ({
              ...prev,
              about: profile.bio || "",
              contact_email: profile.email || user.primaryEmailAddress?.emailAddress || "",
              social_links: {
                ...prev.social_links,
                ...(profile.social_links || {})
              }
            }));
          }
        } catch (error) {
          console.error("Error loading portfolio data:", error);
          toast({
            title: "Error",
            description: "Failed to load your portfolios. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [isLoaded, isSignedIn, user, toast]);

  const handleInputChange = (field: string, value: string) => {
    setPortfolioData((prev: PortfolioData) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setPortfolioData((prev: PortfolioData) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleProjectChange = (index: number, field: string, value: string | File) => {
    const updatedProjects = [...portfolioData.projects];
    
    if (field === 'image' && value instanceof File) {
      // Handle image file upload
      const newProjectImages = [...projectImages];
      newProjectImages[index] = value;
      setProjectImages(newProjectImages);
      
      // Just store the file name in the project data for now
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value.name
      };
    } else {
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value
      };
    }
    
    setPortfolioData((prev: PortfolioData) => ({
      ...prev,
      projects: updatedProjects
    }));
  };

  const handleAddProject = () => {
    setPortfolioData((prev: PortfolioData) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: "", description: "", technologies: "", image: null, github_url: "" }
      ]
    }));
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = [...portfolioData.projects];
    updatedProjects.splice(index, 1);
    
    const updatedImages = [...projectImages];
    updatedImages.splice(index, 1);
    
    setProjectImages(updatedImages);
    setPortfolioData((prev: PortfolioData) => ({
      ...prev,
      projects: updatedProjects
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleProjectImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProjectChange(index, 'image', e.target.files[0]);
    }
  };

  const handleImportFromGithub = async () => {
    if (!githubUrl) {
      toast({
        title: "GitHub URL Required",
        description: "Please enter your GitHub profile URL to import data.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingAI(true);
    
    try {
      const githubData = await extractGitHubProfile(githubUrl);
      
      if (!githubData) {
        throw new Error("Failed to extract GitHub profile data");
      }
      
      // Update portfolio data with GitHub information
      const updatedPortfolioData = {
        ...portfolioData,
        title: portfolioData.title || `${githubData.name}'s Portfolio`,
        about: portfolioData.about || githubData.bio || "",
        skills: portfolioData.skills || githubData.skills?.join(", ") || "",
        social_links: {
          ...portfolioData.social_links,
          github: githubUrl
        }
      };
      
      // Import projects from GitHub
      if (githubData.projects && githubData.projects.length > 0) {
        updatedPortfolioData.projects = githubData.projects.map((project: any) => ({
          title: project.name,
          description: project.description,
          technologies: project.technologies?.join(", ") || "",
          image: null,
          github_url: project.url || ""
        }));
      }
      
      setPortfolioData(updatedPortfolioData);
      
      toast({
        title: "GitHub Import Successful",
        description: "Your GitHub profile data has been imported successfully.",
      });
    } catch (error) {
      console.error("Error importing from GitHub:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import data from GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAI(false);
    }
  };

  const handleCreatePortfolio = async () => {
    if (!user) return;
    
    // Validate required fields
    if (!portfolioData.title) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your portfolio.",
        variant: "destructive",
      });
      return;
    }
    
    setUploadingIPFS(true);
    
    try {
      // Upload profile image to IPFS if provided
      let profileImageHash = null;
      if (profileImage) {
        const profileImageResponse = await uploadFileToIPFS(profileImage);
        profileImageHash = profileImageResponse?.IpfsHash || null;
      }
      
      // Upload project images to IPFS
      const projectsWithImages = await Promise.all(
        portfolioData.projects.map(async (project: any, index: number) => {
          if (projectImages[index]) {
            const imageResponse = await uploadFileToIPFS(projectImages[index]);
            return {
              ...project,
              image: imageResponse?.IpfsHash || null
            };
          }
          return project;
        })
      );
      
      // Prepare final portfolio data
      const finalPortfolioData = {
        ...portfolioData,
        projects: projectsWithImages,
        profile_image: profileImageHash,
        created_at: new Date().toISOString()
      };
      
      // Upload portfolio data to IPFS
      const ipfsResponse = await uploadJSONToIPFS(finalPortfolioData);
      
      if (!ipfsResponse || !ipfsResponse.IpfsHash) {
        throw new Error("Failed to upload to IPFS");
      }
      
      // Save to Supabase
      const savedPortfolio = await createPortfolio(user.id, {
        title: portfolioData.title,
        description: portfolioData.description,
        theme: portfolioData.theme,
        content: finalPortfolioData,
        ipfs_hash: ipfsResponse.IpfsHash,
        is_public: true
      });
      
      // Add to local state
      setPortfolios([savedPortfolio, ...portfolios]);
      
      toast({
        title: "Portfolio Created",
        description: "Your portfolio has been created and stored on IPFS.",
      });
      
      // Reset form and switch to list tab
      setPortfolioData({
        title: "",
        description: "",
        theme: "modern",
        projects: [{ title: "", description: "", technologies: "", image: null, github_url: "" }],
        skills: "",
        about: "",
        contact_email: "",
        social_links: { github: "", linkedin: "", twitter: "" }
      });
      setProjectImages([]);
      setProfileImage(null);
      setActiveTab("list");
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create your portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingIPFS(false);
    }
  };

  const handleVerifyPortfolio = async (portfolio: any) => {
    if (!user) return;
    
    setVerifying(true);
    
    try {
      // Verify on blockchain
      const verificationResult = await verifyPortfolio(portfolio.content, portfolio.ipfs_hash);
      
      // Update portfolio with verification transaction
      const updatedPortfolio = {
        ...portfolio,
        blockchain_verification_tx: verificationResult.transactionHash
      };
      
      // Update in local state
      const updatedPortfolios = portfolios.map(p => 
        p.id === portfolio.id ? updatedPortfolio : p
      );
      setPortfolios(updatedPortfolios);
      
      toast({
        title: "Portfolio Verified",
        description: "Your portfolio has been verified on the blockchain.",
      });
    } catch (error) {
      console.error("Error verifying portfolio:", error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify your portfolio on the blockchain. Please try again.",
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
    <ContentImprovementProvider initialUserData={userProfile}>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and share your professional portfolio
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="list">My Portfolios</TabsTrigger>
            <TabsTrigger value="create">Create Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            {portfolios.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Portfolios Found</CardTitle>
                  <CardDescription>
                    You haven't created any portfolios yet. Get started by creating your first portfolio.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => setActiveTab("create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Portfolio
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((portfolio) => (
                  <Card key={portfolio.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {portfolio.content.profile_image ? (
                        <img 
                          src={`https://gateway.pinata.cloud/ipfs/${portfolio.content.profile_image}`}
                          alt={portfolio.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{portfolio.title}</CardTitle>
                      <CardDescription>
                        Created on {new Date(portfolio.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {portfolio.description || "No description provided"}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Stored on IPFS
                      </div>
                      {portfolio.blockchain_verification_tx && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500" />
                          Blockchain Verified
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <a href={`/portfolio/${portfolio.id}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </a>
                      </Button>
                      {!portfolio.blockchain_verification_tx && (
                        <Button 
                          variant="secondary"
                          onClick={() => handleVerifyPortfolio(portfolio)}
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
                <CardTitle>Create New Portfolio</CardTitle>
                <CardDescription>
                  Build your professional portfolio to showcase your skills and projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="portfolioTitle">Portfolio Title</Label>
                    <Input
                      id="portfolioTitle"
                      placeholder="My Professional Portfolio"
                      value={portfolioData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolioTheme">Theme</Label>
                    <Select 
                      value={portfolioData.theme} 
                      onValueChange={(value) => handleInputChange('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="colorful">Colorful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portfolioDescription">Description</Label>
                  <Textarea
                    id="portfolioDescription"
                    placeholder="A brief description of your portfolio..."
                    value={portfolioData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  <ContentImprover 
                    sectionType="description"
                    currentContent={portfolioData.description}
                    onSelectImprovement={(content) => handleInputChange('description', content)}
                    userData={userProfile}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portfolioAbout">About Me</Label>
                  <Textarea
                    id="portfolioAbout"
                    placeholder="Tell visitors about yourself and your background..."
                    className="min-h-[120px]"
                    value={portfolioData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                  />
                  <ContentImprover 
                    sectionType="about"
                    currentContent={portfolioData.about}
                    onSelectImprovement={(content) => handleInputChange('about', content)}
                    userData={userProfile}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portfolioSkills">Skills (comma separated)</Label>
                  <Textarea
                    id="portfolioSkills"
                    placeholder="React, JavaScript, Node.js, CSS, HTML..."
                    value={portfolioData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                  />
                  <ContentImprover 
                    sectionType="skills"
                    currentContent={portfolioData.skills}
                    onSelectImprovement={(content) => handleInputChange('skills', content)}
                    userData={userProfile}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image</Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Projects</h3>
                  <p className="text-sm text-muted-foreground">
                    Showcase your projects and achievements
                  </p>
                  
                  <div className="space-y-6">
                    {portfolioData.projects.map((project: any, index: number) => (
                      <div key={index} className="border rounded-md p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Project {index + 1}</h4>
                          {portfolioData.projects.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveProject(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`project-${index}-title`}>Title</Label>
                            <Input
                              id={`project-${index}-title`}
                              placeholder="Project Title"
                              value={project.title}
                              onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`project-${index}-description`}>Description</Label>
                            <Textarea
                              id={`project-${index}-description`}
                              placeholder="Describe your project..."
                              value={project.description}
                              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                            />
                            <ContentImprover 
                              sectionType="project"
                              currentContent={project.description}
                              onSelectImprovement={(content) => handleProjectChange(index, 'description', content)}
                              userData={userProfile}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`project-${index}-technologies`}>Technologies (comma separated)</Label>
                            <Input
                              id={`project-${index}-technologies`}
                              placeholder="React, Node.js, MongoDB..."
                              value={project.technologies}
                              onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`project-${index}-github`}>GitHub URL</Label>
                            <Input
                              id={`project-${index}-github`}
                              placeholder="https://github.com/username/project"
                              value={project.github_url}
                              onChange={(e) => handleProjectChange(index, 'github_url', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`project-${index}-image`}>Project Image</Label>
                            <Input
                              id={`project-${index}-image`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleProjectImageChange(index, e)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleAddProject}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Project
                  </Button>
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      placeholder="your.email@example.com"
                      value={portfolioData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <h4 className="text-md font-medium">Social Links</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Github className="h-5 w-5" />
                        <div className="flex-1">
                          <Input
                            placeholder="GitHub Profile URL"
                            value={portfolioData.social_links.github}
                            onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <Input
                            placeholder="LinkedIn Profile URL"
                            value={portfolioData.social_links.linkedin}
                            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                        <div className="flex-1">
                          <Input
                            placeholder="Twitter/X Profile URL"
                            value={portfolioData.social_links.twitter}
                            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Import from GitHub</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically import your projects and skills from GitHub
                  </p>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="GitHub Profile URL"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                    <Button 
                      variant="outline"
                      onClick={handleImportFromGithub}
                      disabled={processingAI || !githubUrl}
                    >
                      {processingAI && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Import
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreatePortfolio}
                  disabled={uploadingIPFS || !portfolioData.title}
                >
                  {uploadingIPFS && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {uploadingIPFS ? "Creating..." : "Create Portfolio"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContentImprovementProvider>
  );
}
