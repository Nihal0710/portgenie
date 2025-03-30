"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Loader2, Sparkles, Check, RefreshCw, Lightbulb, Wand2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useContentImprovement } from "@/components/providers/content-improvement-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ContentImproverProps {
  sectionType: 'about' | 'overview' | 'description' | 'project' | 'skills'
  currentContent: string
  onSelectImprovement: (content: string) => void
  userData?: any
}

interface Suggestion {
  title: string
  content: string
  explanation: string
}

export function ContentImprover({ 
  sectionType, 
  currentContent, 
  onSelectImprovement,
  userData: propUserData
}: ContentImproverProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("0")
  const [showGenerateButton, setShowGenerateButton] = useState(true)
  const { toast } = useToast()
  const { userData: contextUserData } = useContentImprovement()
  
  // Use userData from props if provided, otherwise use from context
  const userData = propUserData || contextUserData

  const getSectionTitle = () => {
    switch (sectionType) {
      case 'about':
        return 'About Me'
      case 'overview':
        return 'Portfolio Overview'
      case 'description':
        return 'Portfolio Description'
      case 'project':
        return 'Project Description'
      case 'skills':
        return 'Skills Section'
      default:
        return 'Content'
    }
  }

  const getSectionIcon = () => {
    switch(sectionType) {
      case 'about': 
        return (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-full w-full rounded-full flex items-center justify-center">
            <span className="font-semibold text-xs text-white">ME</span>
          </div>
        )
      case 'overview': 
        return (
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 h-full w-full rounded-full flex items-center justify-center">
            <span className="font-semibold text-xs text-white">OV</span>
          </div>
        )
      case 'description': 
        return (
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 h-full w-full rounded-full flex items-center justify-center">
            <span className="font-semibold text-xs text-white">DE</span>
          </div>
        )
      case 'project': 
        return (
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 h-full w-full rounded-full flex items-center justify-center">
            <span className="font-semibold text-xs text-white">PR</span>
          </div>
        )
      case 'skills': 
        return (
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 h-full w-full rounded-full flex items-center justify-center">
            <span className="font-semibold text-xs text-white">SK</span>
          </div>
        )
      default: 
        return (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-full w-full rounded-full flex items-center justify-center">
            <span className="font-semibold text-xs text-white">AI</span>
          </div>
        )
    }
  }

  const handleGenerateImprovements = async () => {
    if (!currentContent.trim()) {
      toast({
        title: "Empty Content",
        description: "Please add some content before generating improvements.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setSelectedSuggestion(null)
    
    try {
      const response = await fetch("/api/content-improvements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sectionType,
          content: currentContent,
          userData
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to generate content improvements")
      }
      
      const data = await response.json()
      if (data.improvements?.suggestions) {
        setSuggestions(data.improvements.suggestions)
        setActiveTab("0")
        setShowGenerateButton(false)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err: any) {
      console.error("Error generating improvements:", err)
      setError(err.message || "Failed to generate improvements")
      toast({
        title: "Error",
        description: "Failed to generate content improvements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSuggestion = (index: number) => {
    setSelectedSuggestion(index)
  }

  const handleApplySuggestion = (index: number) => {
    onSelectImprovement(suggestions[index].content)
    toast({
      title: "Improvement Applied",
      description: "The selected improvement has been applied to your content.",
    })
    // Keep the suggestions but show the generate button again
    setShowGenerateButton(true)
  }

  // Handle tab change
  useEffect(() => {
    if (activeTab && suggestions.length > 0) {
      handleSelectSuggestion(parseInt(activeTab))
    }
  }, [activeTab, suggestions.length])

  const handleReset = () => {
    setSuggestions([])
    setSelectedSuggestion(null)
    setShowGenerateButton(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mt-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-medium text-indigo-700">AI Improvements</span>
      </div>
      
      {showGenerateButton ? (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-1.5 w-full border border-dashed transition-colors",
            "hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
          )}
          onClick={handleGenerateImprovements}
          disabled={isLoading || !currentContent.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Generating improvements...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-3.5 w-3.5" />
              <span>Enhance {getSectionTitle()} with AI</span>
            </>
          )}
        </Button>
      ) : (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-indigo-700"
            onClick={handleReset}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Generate new suggestions
          </Button>
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-500 mt-2 flex items-center gap-2 p-2 bg-red-50 rounded-md border border-red-100">
          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Loader2 className="h-4 w-4 text-red-500" />
          </div>
          <span>{error}</span>
        </div>
      )}
      
      {suggestions.length > 0 && !showGenerateButton && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>AI-Generated Style Options</span>
            </h4>
            <p className="text-xs text-muted-foreground ml-6">
              Choose one of the AI-generated style options below to enhance your {sectionType} content
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              {suggestions.map((suggestion, index) => (
                <TabsTrigger 
                  key={index} 
                  value={index.toString()}
                  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 relative group transition-all duration-200"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                      {getSectionIcon()}
                    </div>
                    <span className="truncate max-w-[80px] font-medium">
                      Style {index + 1}
                    </span>
                  </div>
                  {activeTab === index.toString() && (
                    <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {suggestions.map((suggestion, index) => (
              <TabsContent key={index} value={index.toString()} className="space-y-4">
                <Card className="border-indigo-100 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/40 pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-white/80 text-indigo-700 border-indigo-200">
                        {suggestion.title}
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => handleApplySuggestion(index)}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Apply
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-3">
                    <div className="bg-white p-4 rounded-md border border-gray-100 text-sm whitespace-pre-wrap shadow-sm leading-relaxed max-h-[200px] overflow-y-auto">
                      {suggestion.content}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-indigo-50/40 border-t border-indigo-100 pt-2 pb-2">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-indigo-800/80">
                        {suggestion.explanation}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  )
} 