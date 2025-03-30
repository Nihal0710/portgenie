"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, Clock, BarChart, Bookmark, RefreshCw, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

interface ProjectSuggestion {
  title: string
  description: string
  skills: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  timeEstimate: string
  portfolioBenefit: string
  techStack: string[]
}

interface ProjectSuggestionsProps {
  userData?: any
}

export function ProjectSuggestions({ userData }: ProjectSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSuggestions = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Mock data for initial development if needed
      const mockUserData = userData || {
        skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Node.js"],
        interests: ["Web Development", "UI/UX Design", "Mobile Apps"],
        experience: "Intermediate",
        recentProjects: ["Portfolio Website", "E-commerce App"]
      }
      
      const response = await fetch("/api/project-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData: mockUserData }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch project suggestions")
      }
      
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (err: any) {
      console.error("Error fetching project suggestions:", err)
      setError(err.message || "Failed to generate project suggestions")
      toast({
        title: "Error",
        description: "Failed to generate project suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchSuggestions()
  }, [userData])
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500"
      case "Intermediate":
        return "bg-amber-500/10 text-amber-500"
      case "Advanced":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }
  
  const saveProject = (project: ProjectSuggestion) => {
    // Logic to save project to user's saved projects
    toast({
      title: "Project Saved",
      description: `"${project.title}" has been saved to your projects.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="text-xl font-semibold">AI-Powered Project Suggestions</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchSuggestions}
          disabled={isLoading}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Personalized project ideas based on your skills and portfolio, powered by Gemini AI.
      </p>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1 mb-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchSuggestions}
              className="mt-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion.title}</span>
                </CardTitle>
                <CardDescription>{suggestion.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className={getDifficultyColor(suggestion.difficulty)}>
                    {suggestion.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {suggestion.timeEstimate}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Skills Used</h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.skills.slice(0, 4).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-100">
                          {skill}
                        </Badge>
                      ))}
                      {suggestion.skills.length > 4 && (
                        <Badge variant="secondary" className="bg-gray-100">
                          +{suggestion.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Tech Stack</h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.techStack.slice(0, 3).map((tech, i) => (
                        <Badge key={i} variant="outline" className="border-purple-200 text-purple-700">
                          {tech}
                        </Badge>
                      ))}
                      {suggestion.techStack.length > 3 && (
                        <Badge variant="outline" className="border-purple-200 text-purple-700">
                          +{suggestion.techStack.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Portfolio Benefit</h4>
                    <p className="text-sm text-muted-foreground">{suggestion.portfolioBenefit}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50/50 pt-3">
                <Button className="w-full gap-1.5" onClick={() => saveProject(suggestion)}>
                  <Bookmark className="h-4 w-4" />
                  Save Project Idea
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 