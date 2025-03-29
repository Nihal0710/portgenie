"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ArrowRight, CheckCircle, Shield, Database, Cpu, Check, X } from 'lucide-react';
import { Star, Twitter, Linkedin, Github } from 'lucide-react';

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsAuthenticated(!!userId);
    }
  }, [isLoaded, userId]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-24 md:py-36 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[40%] -right-[60%] w-[140%] h-[140%] rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 blur-3xl opacity-70"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div className="md:w-1/2 mb-12 md:mb-0 md:pr-8">
                <div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  Web3-Powered Portfolio Builder
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                  Showcase Your Skills <br />with Blockchain Verification
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                  Create stunning portfolios, store credentials on blockchain, and share securely with employers via decentralized identity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {isLoaded && isAuthenticated ? (
                    <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white group">
                      <Link href="/dashboard" className="flex items-center">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white group">
                        <Link href="/sign-up" className="flex items-center">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                      <Button size="lg" asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                        <Link href="/sign-in">Sign In</Link>
                      </Button>
                    </>
                  )}
                </div>
                <div className="mt-8 flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  <span>No credit card required</span>
                  <CheckCircle className="h-4 w-4 mx-2 text-blue-600" />
                  <span>Free starter plan</span>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-8">
                <div className="relative rounded-xl overflow-hidden border border-border/40 shadow-2xl">
                  <div className="aspect-video bg-card p-6 rounded-xl">
                    <div className="h-full flex flex-col">
                      <div className="h-8 w-full bg-muted rounded-md mb-4 flex items-center px-4">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div className="col-span-1 bg-muted rounded-md"></div>
                        <div className="col-span-2 bg-muted rounded-md"></div>
                        <div className="col-span-3 bg-muted rounded-md"></div>
                        <div className="col-span-2 bg-muted rounded-md"></div>
                        <div className="col-span-1 bg-muted rounded-md"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/10 opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm font-medium text-muted-foreground mb-6">TRUSTED BY PROFESSIONALS FROM</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="h-8 w-24 bg-muted rounded"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Web3 Features</h2>
              <p className="text-lg text-muted-foreground">
                Leverage blockchain technology to showcase your skills and experience with verified credentials
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md hover:shadow-lg transition-all hover:translate-y-[-4px]">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Generated Portfolios</h3>
                <p className="text-muted-foreground mb-4">Our AI analyzes your experience and creates professional portfolios optimized for your industry.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                    <span>Custom design templates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                    <span>Industry-specific optimization</span>
                  </li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md hover:shadow-lg transition-all hover:translate-y-[-4px]">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Decentralized Storage</h3>
                <p className="text-muted-foreground mb-4">Store your resume and credentials on IPFS for permanent, tamper-proof accessibility.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 shrink-0 mt-0.5" />
                    <span>IPFS-powered storage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 shrink-0 mt-0.5" />
                    <span>Permanent data availability</span>
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md hover:shadow-lg transition-all hover:translate-y-[-4px]">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Blockchain Verification</h3>
                <p className="text-muted-foreground mb-4">Mint your resume as NFTs or SBTs for immutable proof of your credentials and experience.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                    <span>Ethereum/Polygon integration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                    <span>Tamper-proof verification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">
                Choose the plan that works best for you. All plans include core features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md hover:shadow-lg transition-all">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-muted-foreground">Get started with the basics</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>1 Portfolio</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Basic Templates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Resume Storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Web3 Wallet Connection</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">AI Resume Generation</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Custom Domain</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full bg-gray-500 hover:bg-gray-600 text-white">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-card p-8 rounded-xl border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-all relative">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-muted-foreground">Advanced features for professionals</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$9.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>5 Portfolios</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Premium Templates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Resume Storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Web3 Wallet Connection</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>AI Resume Generation</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Custom Domain</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/sign-up">Get Premium</Link>
                </Button>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md hover:shadow-lg transition-all">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-muted-foreground">Everything you need for your professional presence</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$19.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Unlimited Portfolios</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>All Templates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Resume Storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Web3 Wallet Connection</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>AI Resume Generation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Custom Domain</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/sign-up">Get Pro</Link>
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                All plans include secure blockchain verification and IPFS storage
              </p>
              <Button asChild variant="outline">
                <Link href="/sign-up" className="flex items-center">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Get started with PortGenie in just a few simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="text-xl font-semibold mb-4 mt-2">Create Your Account</h3>
                  <p className="text-muted-foreground">Sign up and set up your profile with basic information and preferences.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="text-xl font-semibold mb-4 mt-2">Upload Your Credentials</h3>
                  <p className="text-muted-foreground">Add your experience, education, skills, and projects to your portfolio.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">3</div>
                  <h3 className="text-xl font-semibold mb-4 mt-2">Share & Verify</h3>
                  <p className="text-muted-foreground">Generate your Web3 portfolio and share it with potential employers with blockchain verification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Users Say</h2>
              <p className="text-lg text-muted-foreground">
                Hear from professionals who have transformed their careers with PortGenie
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-3">JS</div>
                  <div>
                    <h4 className="font-semibold">John Smith</h4>
                    <p className="text-sm text-muted-foreground">Senior Developer @ TechCorp</p>
                  </div>
                </div>
                <div className="flex mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-muted-foreground">
                  "PortGenie revolutionized my job search. The blockchain verification gave my credentials instant credibility, and I received 3 job offers within a month!"
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mr-3">AJ</div>
                  <div>
                    <h4 className="font-semibold">Amanda Johnson</h4>
                    <p className="text-sm text-muted-foreground">UX Designer @ CreativeStudio</p>
                  </div>
                </div>
                <div className="flex mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-muted-foreground">
                  "The AI-generated portfolio was stunning! It captured my design aesthetic perfectly and the Web3 integration adds a layer of trust that traditional portfolios lack."
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-card p-8 rounded-xl border border-border/40 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-3">RK</div>
                  <div>
                    <h4 className="font-semibold">Raj Kumar</h4>
                    <p className="text-sm text-muted-foreground">Blockchain Developer @ Web3Labs</p>
                  </div>
                </div>
                <div className="flex mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-muted-foreground">
                  "As a blockchain developer, I appreciate the technical implementation. The IPFS storage and Ethereum verification are seamless, and the UI is intuitive even for non-technical users."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <div className="max-w-3xl mx-auto bg-card p-8 md:p-12 rounded-2xl border border-border/40 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Web3 Portfolio?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of professionals showcasing their skills with blockchain-verified credentials.
            </p>
            {isLoaded && isAuthenticated ? (
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Link href="/sign-up">Get Started for Free</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PortGenie</span>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-powered Web3 portfolio and resume builder with blockchain verification.
                </p>
                <div className="flex space-x-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                  <li><Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground">Templates</Link></li>
                  <li><Link href="/integrations" className="text-sm text-muted-foreground hover:text-foreground">Integrations</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                  <li><Link href="/documentation" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
                  <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">Guides</Link></li>
                  <li><Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                  <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
                  <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                  <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground mb-4 md:mb-0"> {new Date().getFullYear()} PortGenie. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
