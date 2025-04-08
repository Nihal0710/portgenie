"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { LogOut, PlayCircle, Video, Menu, X } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { useState } from "react"

export function Navbar() {
  const { isLoaded, isSignedIn } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="w-full px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="PortGenie Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">PortGenie</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {isLoaded && isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/40"
                  onClick={() => window.open('/intro-video', '_blank')}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Intro Video</span>
                </Button>
                <Link href="/dashboard/video-generation">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/40"
                  >
                    <Video className="h-4 w-4" />
                    <span>Video Generation</span>
                  </Button>
                </Link>
                <WalletConnect />
                <Link href="/sign-out">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-red-700 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/40">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
                <ModeToggle />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="default" size="sm">Sign Up</Button>
                </Link>
                <ModeToggle />
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className={`fixed inset-0 z-50 bg-background md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center space-x-3">
                  <Image
                    src="/images/logo.png"
                    alt="PortGenie Logo"
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">PortGenie</span>
                </Link>
                <button
                  className="p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col p-4 space-y-4">
                {isLoaded && isSignedIn ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/40"
                      onClick={() => {
                        window.open('/intro-video', '_blank');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Intro Video</span>
                    </Button>
                    <Link href="/dashboard/video-generation" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-start flex items-center gap-2 text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/40"
                      >
                        <Video className="h-4 w-4" />
                        <span>Video Generation</span>
                      </Button>
                    </Link>
                    <div className="py-2">
                      <WalletConnect />
                    </div>
                    <Link href="/sign-out" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start flex items-center gap-2 text-red-700 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/40">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </Button>
                    </Link>
                    <div className="flex items-center justify-between py-2">
                      <UserButton afterSignOutUrl="/" />
                      <ModeToggle />
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="default" size="sm" className="w-full justify-start">Sign Up</Button>
                    </Link>
                    <div className="py-2">
                      <ModeToggle />
                    </div>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
