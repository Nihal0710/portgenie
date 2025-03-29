"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { IntroVideo } from "@/components/dashboard/intro-video"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Upload, Lightbulb } from "lucide-react"

export default function CreatePortfolioPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Create Portfolio" description="Generate an AI-powered professional portfolio" />
      
      {/* Intro Video Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <IntroVideo 
            title="How to Create Your Web3 Portfolio" 
            description="Learn how to build a professional portfolio with blockchain verification in under 10 minutes"
            videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0" 
            thumbnailUrl="/portfolio-tutorial-thumbnail.jpg" 
          />
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Make your portfolio stand out</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                  <span>Include your best projects with detailed descriptions</span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                  <span>Add blockchain certificates for skill verification</span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                  <span>Connect your Web3 wallet for enhanced credibility</span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                  <span>Store your portfolio securely on IPFS via Pinata</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-4">
                View Examples
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Portfolio Creation Tabs */}
      <Tabs defaultValue="ai-generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai-generator" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> AI Generator
          </TabsTrigger>
          <TabsTrigger value="manual-entry" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" /> Manual Entry
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> Templates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-generator" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Portfolio Generator</CardTitle>
              <CardDescription>
                Our AI will create a stunning portfolio based on your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Portfolio creation form would go here */}
                <div className="h-64 rounded-md border border-dashed flex items-center justify-center">
                  <p className="text-muted-foreground">Portfolio creation form placeholder</p>
                </div>
                <Button className="w-full">
                  Generate Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manual-entry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Portfolio Creation</CardTitle>
              <CardDescription>
                Build your portfolio by entering information manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 rounded-md border border-dashed flex items-center justify-center">
                  <p className="text-muted-foreground">Manual entry form placeholder</p>
                </div>
                <Button className="w-full">
                  Create Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Templates</CardTitle>
              <CardDescription>
                Choose from our selection of professional templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 hover:border-blue-500 cursor-pointer transition-colors">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md mb-3"></div>
                  <p className="font-medium">Modern Tech</p>
                </div>
                <div className="border rounded-md p-4 hover:border-blue-500 cursor-pointer transition-colors">
                  <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md mb-3"></div>
                  <p className="font-medium">Creative</p>
                </div>
                <div className="border rounded-md p-4 hover:border-blue-500 cursor-pointer transition-colors">
                  <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md mb-3"></div>
                  <p className="font-medium">Professional</p>
                </div>
              </div>
              <Button className="w-full mt-4">
                Use Selected Template <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
