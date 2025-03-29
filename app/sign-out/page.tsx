"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    // Automatically sign out when this page loads
    const performSignOut = async () => {
      await signOut();
      router.push("/");
    };
    
    performSignOut();
  }, [signOut, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl border border-border/40 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Signing you out...</h1>
        <p className="text-center text-muted-foreground">
          Please wait while we securely sign you out of your account.
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/")}
            className="mt-4"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
