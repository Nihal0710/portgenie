import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs"
import { Navbar } from "@/components/navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Chatbot } from "@/components/chatbot"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const siteDescription =
  "Build. Verify. Analyze. Get Hired. AI-powered career intelligence for portfolios, resumes, interviews, and verified credentials."

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "PortGenie 2.0 — AI Career Intelligence",
    template: "%s | PortGenie",
  },
  description: siteDescription,
  applicationName: "PortGenie",
  keywords: [
    "AI portfolio",
    "resume builder",
    "recruiter analytics",
    "interview prep",
    "ATS score",
    "credential verification",
    "PortGenie",
  ],
  authors: [{ name: "PortGenie" }],
  creator: "PortGenie",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PortGenie",
    title: "PortGenie 2.0 — AI Career Intelligence",
    description: siteDescription,
    images: [{ url: "/icon.svg", alt: "PortGenie" }],
  },
  twitter: {
    card: "summary",
    title: "PortGenie 2.0 — AI Career Intelligence",
    description: siteDescription,
    images: ["/icon.svg"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
      signInFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/dashboard"
      }
      signUpFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/dashboard"
      }
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="portgenie-theme"
          >
            <SidebarProvider>
              <div className="relative flex min-h-screen w-full bg-background">
                <Navbar />
                <main className="flex-1 w-full min-h-screen">{children}</main>
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
