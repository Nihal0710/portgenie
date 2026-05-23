"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { LogOut, PlayCircle, Video, Menu, X, Zap } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { useState } from "react"
import { motion } from "framer-motion"

export function Navbar() {
  const { isLoaded, isSignedIn } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/40 border-b border-cyber-red/20" />
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-cyber-red to-transparent blur-xl opacity-50" />

      <div className="relative w-full px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-br from-cyber-red to-cyber-red-glow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-xl font-orbitron font-bold text-glow-lg group-hover:text-glow transition-all duration-300">
              PortGenie 2.0
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-cyber-red hover:bg-cyber-red/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {isLoaded && isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <motion.button
                    className="px-4 py-2 rounded-lg text-cyber-text hover:bg-cyber-red/10 transition-colors duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dashboard
                  </motion.button>
                </Link>
                <motion.button 
                  className="px-4 py-2 rounded-lg text-cyber-text hover:bg-cyber-red/10 transition-colors duration-300 font-medium flex items-center gap-2"
                  onClick={() => window.open('/intro-video', '_blank')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlayCircle className="h-4 w-4" />
                  Intro Video
                </motion.button>
                <Link href="/dashboard/video-generation">
                  <motion.button
                    className="px-4 py-2 rounded-lg text-cyber-text hover:bg-cyber-red/10 transition-colors duration-300 font-medium flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Video className="h-4 w-4" />
                    Video
                  </motion.button>
                </Link>
                <WalletConnect />
                <Link href="/sign-out">
                  <motion.button
                    className="px-4 py-2 rounded-lg text-cyber-red hover:bg-cyber-red/20 transition-colors duration-300 font-medium flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </motion.button>
                </Link>
                <UserButton afterSignOutUrl="/" />
                <ModeToggle />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <motion.button
                    className="px-4 py-2 rounded-lg text-cyber-text hover:bg-cyber-red/10 transition-colors duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/sign-up">
                  <motion.button
                    className="btn-neon text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
                <ModeToggle />
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col h-full pt-20 px-4 space-y-4">
                <button
                  className="absolute top-4 right-4 p-2 text-cyber-red"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>

                {isLoaded && isSignedIn ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 rounded-lg text-cyber-text hover:bg-cyber-red/10 transition-colors text-left">
                        Dashboard
                      </button>
                    </Link>
                    <button 
                      className="w-full px-4 py-3 rounded-lg text-cyber-text hover:bg-cyber-red/10 transition-colors text-left flex items-center gap-2"
                      onClick={() => {
                        window.open('/intro-video', '_blank')
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <PlayCircle className="h-4 w-4" />
                      Intro Video
                    </button>
                    <Link href="/dashboard/video-generation" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 rounded-lg text-cyber-text hover:bg-cyber-red/10 transition-colors text-left flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video Generation
                      </button>
                    </Link>
                    <div className="border-t border-cyber-red/20 pt-4">
                      <Link href="/sign-out">
                        <button className="w-full px-4 py-3 rounded-lg text-cyber-red hover:bg-cyber-red/10 transition-colors text-left flex items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 rounded-lg text-cyber-text hover:bg-cyber-red/10 transition-colors">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full btn-neon">
                        Get Started
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )
}
