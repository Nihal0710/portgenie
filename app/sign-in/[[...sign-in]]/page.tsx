import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Left side - Sign In Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg 
                width="60" 
                height="60" 
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
                />
                <path 
                  d="M2 17L12 22L22 17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 12L12 17L22 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Welcome to PortGenie</h1>
            <p className="text-muted-foreground mt-2">Sign in to continue to your Web3 portfolio builder</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border/40 shadow-xl">
            <SignIn />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>By signing in, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link></p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Decorative Image (visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted/30 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-60"></div>
        <div className="relative z-10 p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Build Your Web3 Future</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-md">
            Create stunning portfolios with blockchain verification and decentralized storage
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="bg-card/40 backdrop-blur-sm p-4 rounded-lg border border-border/40">
              <h3 className="font-semibold mb-1">AI-Generated Portfolios</h3>
              <p className="text-sm text-muted-foreground">Professionally designed by AI</p>
            </div>
            <div className="bg-card/40 backdrop-blur-sm p-4 rounded-lg border border-border/40">
              <h3 className="font-semibold mb-1">IPFS Storage</h3>
              <p className="text-sm text-muted-foreground">Decentralized & permanent</p>
            </div>
            <div className="bg-card/40 backdrop-blur-sm p-4 rounded-lg border border-border/40">
              <h3 className="font-semibold mb-1">Blockchain Verification</h3>
              <p className="text-sm text-muted-foreground">Immutable credentials</p>
            </div>
            <div className="bg-card/40 backdrop-blur-sm p-4 rounded-lg border border-border/40">
              <h3 className="font-semibold mb-1">Web3 Identity</h3>
              <p className="text-sm text-muted-foreground">Secure & portable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
