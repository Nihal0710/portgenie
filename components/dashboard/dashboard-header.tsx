import { ModeToggle } from "@/components/mode-toggle"
import { UserButton } from "@clerk/nextjs"

export interface DashboardHeaderProps {
  heading?: string
  title?: string
  text?: string
  description?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  heading,
  title,
  text,
  description,
  children,
}: DashboardHeaderProps) {
  const displayTitle = title ?? heading ?? "Dashboard"
  const displayText = description ?? text

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {displayTitle}
          </h1>
          {displayText && (
            <p className="text-muted-foreground text-sm md:text-base">{displayText}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {children}
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
