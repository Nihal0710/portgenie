"use client";

import { useUser } from "@clerk/nextjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Your Profile" 
        description="Manage your Web3 portfolio profile and credentials" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal information and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-bold">{user?.fullName || "User"}</h3>
                <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">First Name</h4>
                  <p className="text-lg">{user?.firstName || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Name</h4>
                  <p className="text-lg">{user?.lastName || "N/A"}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h4>
                <p className="text-lg">{user?.primaryEmailAddress?.emailAddress || "N/A"}</p>
              </div>
              
              <div className="pt-4">
                <Button asChild variant="outline">
                  <Link href="https://accounts.clerk.dev/user/settings">
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Web3 Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Web3 Credentials</CardTitle>
            <CardDescription>Your blockchain verified credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border border-dashed border-muted-foreground/50 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any Web3 credentials yet</p>
              <Button asChild>
                <Link href="/dashboard/credentials/create">
                  Create Credentials
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
