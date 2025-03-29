import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" description="Manage your Web3 portfolio and resume" />
      <DashboardCards />
    </div>
  )
}

