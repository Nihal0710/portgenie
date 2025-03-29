import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function UploadResumePage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Upload Resume" description="Store your resume on decentralized IPFS" />
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-medium mb-4">IPFS Resume Storage</h2>
        <p className="text-muted-foreground mb-6">
          Upload your resume to IPFS for decentralized storage. Your files will be securely stored and accessible via a
          unique link.
        </p>
        <div className="space-y-4">
          {/* Resume upload interface would go here */}
          <div className="h-64 rounded-md border border-dashed flex items-center justify-center">
            <p className="text-muted-foreground">Resume upload interface placeholder</p>
          </div>
        </div>
      </div>
    </div>
  )
}

