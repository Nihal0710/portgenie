"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  Briefcase,
  FileText,
  Home,
  LogOut,
  Settings,
  Upload,
  User,
  Wallet,
  Shield,
  Moon,
  Sun,
  Layers,
  Crown,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useUser } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserProfile } from "@/lib/supabase"
import { SubscriptionBadge } from "@/components/subscription-plans"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isLoaded } = useUser()
  const [userInitials, setUserInitials] = useState("JD")
  const [userName, setUserName] = useState("John Doe")
  const [subscriptionPlan, setSubscriptionPlan] = useState("free")

  // Update user info when Clerk user data is loaded
  useEffect(() => {
    if (isLoaded && user) {
      // Set user name
      const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      setUserName(fullName || 'User')
      
      // Set user initials
      if (user.firstName && user.lastName) {
        setUserInitials(`${user.firstName[0]}${user.lastName[0]}`)
      } else if (fullName) {
        const nameParts = fullName.split(' ')
        if (nameParts.length > 1) {
          setUserInitials(`${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`)
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
          setUserInitials(nameParts[0][0])
        }
      }

      // Load user profile to get subscription plan
      const loadUserProfile = async () => {
        try {
          const profile = await getUserProfile(user.id);
          if (profile && profile.subscription_plan) {
            setSubscriptionPlan(profile.subscription_plan);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      };

      loadUserProfile();
    }
  }, [isLoaded, user])

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Portfolio",
      href: "/dashboard/portfolio",
      icon: Briefcase,
    },
    {
      title: "Resume",
      href: "/dashboard/resume",
      icon: FileText,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Web3 Verification",
      href: "/dashboard/verification",
      icon: Shield,
    },
  ]

  const secondaryNavItems = [
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Upgrade Plan",
      href: "/dashboard/upgrade",
      icon: Crown,
    },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex flex-col items-start gap-4 px-4 py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">PG</span>
            </div>
            <span className="text-xl font-bold">PortGenie</span>
          </Link>
          <div className="ml-auto md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")} tooltip="Toggle Theme">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span>Toggle Theme</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="gap-3">
              <Avatar>
                {user?.imageUrl ? (
                  <AvatarImage src={user.imageUrl} alt={userName} />
                ) : (
                  <AvatarFallback>{userInitials}</AvatarFallback>
                )}
              </Avatar>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{userName}</p>
                  <SubscriptionBadge plan={subscriptionPlan} />
                </div>
                <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress || 'No email'}</p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
