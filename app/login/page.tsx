"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignIn } from "@clerk/nextjs";
import { SubscriptionPlans } from "@/components/subscription-plans";
import { getUserProfile } from "@/lib/supabase";
import { LoginNavbar } from "@/components/login-navbar";

export default function LoginPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [showPlans, setShowPlans] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (isSignedIn && user) {
        try {
          // Check if user has a profile and plan already
          const profile = await getUserProfile(user.id);
          
          if (!profile) {
            // New user, show plans
            setIsNewUser(true);
            setShowPlans(true);
          } else if (!profile.subscription_plan) {
            // Existing user but no plan selected
            setShowPlans(true);
          } else {
            // User already has a plan, redirect to dashboard
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
          // If there's an error, show plans anyway
          setShowPlans(true);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      checkUserProfile();
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleClosePlans = () => {
    setShowPlans(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LoginNavbar />
      
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">PG</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to PortGenie
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Your AI-powered Web3 portfolio builder
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <SignIn redirectUrl="/login" />
          </div>
        </div>

        {showPlans && (
          <SubscriptionPlans 
            open={showPlans} 
            onClose={handleClosePlans} 
          />
        )}
      </div>
    </div>
  );
}
