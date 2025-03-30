import { ProjectSuggestions } from "@/components/dashboard/project-suggestions"
import { Lightbulb } from "lucide-react"

export default function ProjectSuggestionsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Lightbulb className="h-8 w-8 text-violet-500" />
          AI-Powered Project Suggestions
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover personalized project ideas to enhance your portfolio and showcase your skills.
        </p>
      </div>
      
      <div className="bg-violet-50 border border-violet-100 rounded-lg p-5 text-violet-800">
        <h3 className="font-medium text-violet-900 mb-2">How It Works</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Our AI analyzes your skills and portfolio data</li>
          <li>Personalizes project ideas matching your experience level</li>
          <li>Provides detailed information on skills needed and difficulty</li>
          <li>Estimates completion time to help with planning</li>
          <li>Explains how each project benefits your portfolio</li>
        </ul>
      </div>
      
      <ProjectSuggestions />
    </div>
  )
} 