import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <SidebarInset className="bg-background border-l border-border">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/90 px-4 backdrop-blur-xl md:hidden">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">Menu</span>
          </div>
          <ModeToggle />
        </header>
        <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
      </SidebarInset>
    </div>
  )
}
