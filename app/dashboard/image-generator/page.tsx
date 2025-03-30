import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ImageGenerator } from "@/components/image-generator/image-generator"

export const metadata = {
  title: "AI Image Generator",
  description: "Create stunning images with Google's Gemini 2.0 AI model",
}

export default function ImageGeneratorPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI Image Generator"
        text="Create high-quality images using Google's Gemini 2.0 model"
      />
      <div className="grid gap-4">
        <ImageGenerator />
      </div>
    </DashboardShell>
  )
} 