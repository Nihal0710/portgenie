import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Logo } from "@/components/layout/logo"
import { CheckCircle2, Shield, Sparkles, BarChart3 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

const highlights = [
  { icon: Sparkles, title: "AI portfolio builder", desc: "Launch a professional presence in minutes" },
  { icon: BarChart3, title: "Recruiter analytics", desc: "See how hiring teams view your profile" },
  { icon: Shield, title: "Verified credentials", desc: "Stand out with blockchain verification" },
]

export default function Page() {
  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <div className="flex w-full flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <Logo size="md" href="/" />
              <h1 className="font-display text-2xl font-semibold tracking-tight pt-6">
                Create your account
              </h1>
              <p className="text-muted-foreground text-sm">
                Start building your verified AI career identity
              </p>
            </div>
            <div className="saas-card p-6 md:p-8">
              <SignUp />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-brand hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 items-center justify-center border-l border-border bg-muted/30 p-12">
          <div className="max-w-md space-y-8">
            <div>
              <p className="text-sm font-medium text-brand mb-2">PortGenie 2.0</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Your career intelligence platform
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Join professionals using AI to optimize portfolios, prepare for
                interviews, and verify credentials.
              </p>
            </div>
            <ul className="space-y-4">
              {highlights.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-muted border border-brand/20">
                    <item.icon className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Free to start — upgrade anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
