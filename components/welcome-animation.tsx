"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function WelcomeAnimation() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show animation first, then show login buttons
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => {
        setShowButtons(true);
      }, 500); // Small delay after fade-out begins
    }, 3000); // Animation duration

    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  return (
    <div className={cn(
      "fixed inset-0 flex flex-col items-center justify-center bg-background transition-opacity duration-500 z-50",
      animationComplete ? "opacity-70" : "opacity-100"
    )}>
      <div className="relative">
        {/* Logo animation */}
        <div className="animate-bounce-slow mb-4">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-draw"
            />
            <path 
              d="M2 17L12 22L22 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-draw-delay"
            />
            <path 
              d="M2 12L12 17L22 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-draw-delay-2"
            />
          </svg>
        </div>
        
        {/* Text animation */}
        <h1 className="text-4xl font-bold text-center animate-fade-in-up">
          PortGenie
        </h1>
        <p className="text-muted-foreground mt-2 text-center animate-fade-in-up-delay">
          Your Web3 Portfolio Builder
        </p>
        
        {/* Login buttons */}
        {showButtons && (
          <div className="mt-8 flex flex-col space-y-4 animate-fade-in">
            <Button onClick={handleSignIn} size="lg" className="w-full">
              Sign In
            </Button>
            <Button onClick={handleSignUp} variant="outline" size="lg" className="w-full">
              Create Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
