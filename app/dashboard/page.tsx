"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Grid3X3,
  Mic,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics"
import { SkillGapAnalyzer } from "@/components/ai/skill-gap-analyzer"
import { InterviewSimulator } from "@/components/ai/interview-simulator"
import { RecruiterDashboard } from "@/components/recruiter/recruiter-dashboard"
import { cn } from "@/lib/utils"

const statCards = [
  { label: "Recruiter visibility", value: "847", change: "+24%", icon: Users },
  { label: "ATS score", value: "92", change: "+8 pts", icon: TrendingUp },
  { label: "Portfolio strength", value: "88%", change: "Strong", icon: BarChart3 },
  {
    label: "Verification",
    value: "Active",
    change: "On-chain",
    icon: Shield,
    success: true,
  },
]

const quickActions = [
  { label: "Upload resume", href: "/dashboard/upload-resume", icon: "📄" },
  { label: "Import GitHub", href: "/dashboard/portfolio", icon: "⭐" },
  { label: "Interview prep", href: "/dashboard", icon: "🎤" },
  { label: "Portfolio score", href: "/dashboard", icon: "📊" },
]

export default function DashboardPage() {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "ai-analyzer", label: "AI Analyzer", icon: Brain },
    { id: "interview", label: "Interview", icon: Mic },
    { id: "recruiter", label: "Recruiter", icon: Users },
    { id: "tools", label: "Tools", icon: Grid3X3 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
        <DashboardHeader
          title="Career intelligence"
          description="Build. Verify. Analyze. Get Hired."
        />

        {/* KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="saas-card p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold">{stat.value}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium",
                      stat.success ? "text-success" : "text-brand-light"
                    )}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 border border-border">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              {stat.label === "Portfolio strength" && (
                <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[88%] rounded-full bg-brand" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="saas-panel p-1">
          <Tabs defaultValue="overview" className="space-y-6 p-4 md:p-6">
            <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-muted/40 p-1 rounded-lg border border-border">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 min-w-[100px] gap-2 rounded-md data-[state=active]:bg-accent data-[state=active]:text-foreground text-muted-foreground"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <DashboardAnalytics />
            </TabsContent>
            <TabsContent value="ai-analyzer">
              <SkillGapAnalyzer />
            </TabsContent>
            <TabsContent value="interview">
              <InterviewSimulator />
            </TabsContent>
            <TabsContent value="recruiter">
              <RecruiterDashboard />
            </TabsContent>
            <TabsContent value="tools" className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-semibold">Portfolio tools</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage your professional presence
                </p>
              </div>
              <DashboardCards />
            </TabsContent>
          </Tabs>
        </div>

        <div className="saas-card p-6">
          <h3 className="font-display text-base font-semibold mb-4">Quick actions</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-border/80 hover:bg-accent"
              >
                <span className="text-xl">{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-success" />
          Profile completion: 76% — add projects to reach 100%
        </div>
      </div>
    </div>
  )
}
