import Link from "next/link"
import { Briefcase, FileText, Upload, User, Shield, Layers } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DashboardCards() {
  const cards = [
    {
      title: "Create Portfolio",
      description: "Generate an AI-powered professional portfolio",
      icon: Briefcase,
      href: "/dashboard/create-portfolio",
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

