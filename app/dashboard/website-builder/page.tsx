import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WebsiteBuilder } from "@/components/website-builder/website-builder"

export const metadata = {
  title: "Website Builder",
  description: "Build custom websites with AI assistance",
}

export default function WebsiteBuilderPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI Website Builder"
        text="Create custom websites with our AI-powered builder and live preview"
      />
      <div className="grid gap-4">
        <WebsiteBuilder />
      </div>
    </DashboardShell>
  )
} 