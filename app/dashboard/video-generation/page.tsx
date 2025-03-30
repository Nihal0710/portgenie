import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VideoGenerator } from "@/components/video-generation/video-generator"

export const metadata = {
  title: "Portfolio & Resume Video Generator",
  description: "Create professional videos showcasing your portfolio and resume",
}

export default function VideoGenerationPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Portfolio & Resume Video Generator"
        text="Create professional videos with audio to showcase your work and experience"
      />
      <div className="grid gap-8">
        <VideoGenerator />
      </div>
    </DashboardShell>
  )
} 