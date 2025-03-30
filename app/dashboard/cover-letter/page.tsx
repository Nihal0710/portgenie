import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CoverLetterGenerator } from "@/components/cover-letter/cover-letter-generator"

export const metadata = {
  title: "AI Cover Letter Generator",
  description: "Generate tailored cover letters with AI",
}

export default function CoverLetterPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI Cover Letter Generator"
        text="Create personalized cover letters for your job applications"
      />
      <div className="grid gap-4">
        <CoverLetterGenerator />
      </div>
    </DashboardShell>
  )
} 