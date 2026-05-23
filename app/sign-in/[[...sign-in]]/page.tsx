import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { Logo } from "@/components/layout/logo"
import { CheckCircle2, Shield, Sparkles, BarChart3 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

const highlights = [
  { icon: Sparkles, title: "AI portfolio builder", desc: "Generate recruiter-ready portfolios in minutes" },
  { icon: BarChart3, title: "Career analytics", desc: "ATS scores and visibility insights" },
  { icon: Shield, title: "Verified credentials", desc: "Blockchain-backed professional identity" },
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
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to your PortGenie career intelligence workspace
              </p>
            </div>
            <div className="saas-card p-6 md:p-8">
              <SignIn />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="#" className="text-brand hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-brand hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 items-center justify-center border-l border-border bg-muted/30 p-12">
          <div className="max-w-md space-y-8">
            <div>
              <p className="text-sm font-medium text-brand mb-2">PortGenie 2.0</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Build. Verify. Analyze. Get Hired.
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                The AI-powered career platform trusted by professionals who want
                recruiter-ready portfolios and verified credentials.
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
              Enterprise-grade security via Clerk
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
