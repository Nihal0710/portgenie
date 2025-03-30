import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Grid3X3 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-6 px-4 py-6 lg:px-6">
      <DashboardHeader title="Dashboard" description="Manage your Web3 portfolio and resume" />
      
      <Tabs defaultValue="analytics" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Tools & Features
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="analytics" className="space-y-6 pt-2">
          <DashboardAnalytics />
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-6 pt-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Your Portfolio Tools</h2>
            <p className="text-muted-foreground">Create and manage your professional presence with these tools</p>
          </div>
          <DashboardCards />
        </TabsContent>
      </Tabs>
    </div>
  )
}

