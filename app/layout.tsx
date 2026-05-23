import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs"
import { Navbar } from "@/components/navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Chatbot } from "@/components/chatbot"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

const siteDescription =
  "Build AI-powered Web3 portfolios and resumes with PortGenie. Verify credentials on-chain, generate cover letters, and showcase your work."

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "PortGenie - Web3 Portfolio Builder",
    template: "%s | PortGenie",
  },
  description: siteDescription,
  applicationName: "PortGenie",
  keywords: [
    "portfolio builder",
    "resume builder",
    "Web3",
    "AI portfolio",
    "developer portfolio",
    "PortGenie",
  ],
  authors: [{ name: "PortGenie" }],
  creator: "PortGenie",
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PortGenie",
    title: "PortGenie - Web3 Portfolio Builder",
    description: siteDescription,
    images: [
      {
        url: "/images/logo.png",
        alt: "PortGenie logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "PortGenie - Web3 Portfolio Builder",
    description: siteDescription,
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
      signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/dashboard"}
      signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/dashboard"}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <div className="relative flex min-h-screen w-full overflow-hidden">
                <Navbar />
                <main className="flex-1 w-full pt-16">
                  {children}
                </main>
              </div>
            </SidebarProvider>
            <Toaster />
            <Chatbot />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}