import { ModeToggle } from "@/components/mode-toggle"
import { UserButton } from "@clerk/nextjs"

export interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 py-4 mb-6 border-b">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{heading}</h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
        <div className="flex items-center gap-4">
          {children}
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
