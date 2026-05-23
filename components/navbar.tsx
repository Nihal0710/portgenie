"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth, UserButton } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/layout/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#platform", label: "Platform" },
  { href: "#pricing", label: "Pricing" },
]

export function Navbar() {
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up")
  ) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 border-b border-border bg-background/80 backdrop-blur-xl" />
      <div className="relative mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo size="md" />

        <nav className="hidden md:flex items-center gap-8">
          {!isSignedIn &&
            navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          {isLoaded && isSignedIn && (
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard" className="btn-brand-outline text-sm py-2">
                Open app
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="nav-link px-2">
                Sign in
              </Link>
              <Link href="/sign-up" className="btn-brand text-sm py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative border-b border-border bg-card/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 p-4">
              {!isSignedIn &&
                navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              {isLoaded && isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="btn-brand justify-center mt-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/sign-in"
                    className={cn("btn-brand-outline justify-center")}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="btn-brand justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
