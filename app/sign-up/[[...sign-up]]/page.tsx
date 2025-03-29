import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Left side - Sign Up Form */}
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
            <h1 className="text-3xl font-bold">Join PortGenie</h1>
            <p className="text-muted-foreground mt-2">Create your account to start building your Web3 portfolio</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border/40 shadow-xl">
            <SignUp />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>By signing up, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link></p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Decorative Content (visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted/30 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-60"></div>
        <div className="relative z-10 p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Unlock Web3 Opportunities</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-md">
            Join thousands of professionals showcasing their skills with blockchain-verified credentials
          </p>
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="bg-card/40 backdrop-blur-sm p-6 rounded-lg border border-border/40">
              <h3 className="font-semibold text-lg mb-2">Why Join PortGenie?</h3>
              <ul className="space-y-2 text-left">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-powered portfolio generation tailored to your experience</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Decentralized storage on IPFS for permanent accessibility</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Blockchain verification for your credentials and experience</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Shareable Web3 links for employers to verify your profile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
