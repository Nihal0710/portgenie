import Link from "next/link"
import { Briefcase, FileText, Upload, User, Shield, Layers, Lightbulb, Radar, Code, Globe, FileEdit, ImageIcon } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DashboardCards() {
  const cards = [
    {
      title: "Create Portfolio design" ,
      description: "Generate an AI-powered professional portfolio",
      icon: Briefcase,
      href: "/dashboard/create-portfolio",
      color: "bg-red-500/10",
    },
    {
      title: "AI Website Builder",
      description: "Create custom websites with live preview",
      icon: Globe,
      href: "/dashboard/website-builder",
      color: "bg-blue-500/10",
    },
    {
      title: "Upload Resume",
      description: "Store your resume on decentralized IPFS",
      icon: Upload,
      href: "/dashboard/upload-resume",
      color: "bg-green-500/10",
    },
    {
      title: "Edit Profile",
      description: "Customize your professional information",
      icon: User,
      href: "/dashboard/edit-profile",
      color: "bg-purple-500/10",
    },
    {
      title: "AI Resume",
      description: "Generate an enhanced resume with AI",
      icon: FileText,
      href: "/dashboard/ai-resume",
      color: "bg-amber-500/10",
    },
    {
      title: "AI Cover Letter",
      description: "Create targeted cover letters with AI",
      icon: FileEdit,
      href: "/dashboard/cover-letter",
      color: "bg-emerald-500/10",
    },
    {
      title: "AI Image Generator",
      description: "Create stunning images with Gemini 2.0",
      icon: ImageIcon,
      href: "/dashboard/image-generator",
      color: "bg-pink-500/10",
    },
    {
      title: "Project Ideas",
      description: "Get AI-powered project suggestions",
      icon: Lightbulb,
      href: "/dashboard/project-suggestions",
      color: "bg-violet-500/10",
    },
    {
      title: "AI Content Detector",
      description: "Detect AI-generated content with our model",
      icon: Radar,
      href: "/dashboard/ai-detection",
      color: "bg-indigo-500/10",
    },
    {
      title: "Web3 Verification",
      description: "Mint your credentials as NFTs or SBTs",
      icon: Shield,
      href: "/dashboard/web3-verification",
      color: "bg-red-500/10",
    },
    {
      title: "Portfolio Themes",
      description: "Choose from multiple portfolio styles",
      icon: Layers,
      href: "/dashboard/themes",
      color: "bg-teal-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className={`mb-2 inline-flex rounded-lg p-2 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={card.href}>Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

