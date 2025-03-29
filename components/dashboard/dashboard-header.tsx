import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b mb-6">
      <div>
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{title}</h1>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}
