"use client"

import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function IntroVideoPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Add any initialization code here if needed
    document.title = "PortGenie - Introduction Video"
  }, [])
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome to PortGenie</h1>
        <p className="text-muted-foreground">Learn how to use our powerful AI portfolio builder with this introductory video.</p>
        
        <div className="aspect-video w-full rounded-lg overflow-hidden border">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="PortGenie Introduction"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">Portfolio Creation</h3>
              <p>Build stunning portfolios with just a few clicks. Import data from GitHub, LinkedIn, and more.</p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">Resume Generation</h3>
              <p>Generate professional resumes that highlight your skills and experience.</p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">AI Video Generation</h3>
              <p>Create personalized portfolio videos with AI for maximum impact.</p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">Blockchain Verification</h3>
              <p>Certify your credentials on the blockchain for immutable proof.</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 