"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ArrowRight, Zap, Shield, Network, Cpu, Sparkles, ChevronDown, Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

// Animated Background Component
function CyberpunkBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main glow orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyber-red/20 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyber-red-glow/15 rounded-full blur-3xl opacity-20 animate-float floating-delay"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyber-red/10 rounded-full blur-3xl opacity-15"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 0, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 60, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
      </div>
    </div>
  );
}

// Floating particles
function FloatingParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyber-red/40 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsAuthenticated(!!userId);
    }
  }, [isLoaded, userId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full bg-cyber-bg text-cyber-text overflow-hidden">
      <CyberpunkBackground />
      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 md:px-6">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-cyber-red/30 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          ></motion.div>
        </div>

        <motion.div
          className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div variants={itemVariants} className="flex flex-col gap-8">
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-red/40 bg-black/50 backdrop-blur-sm w-fit"
                >
                  <Sparkles className="w-4 h-4 text-cyber-red" />
                  <span className="text-sm font-medium text-cyber-red">AI + Web3 Platform</span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-5xl md:text-7xl font-orbitron font-bold leading-tight"
                >
                  <span className="text-glow-lg">Build Your Verified</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyber-red via-cyber-red-glow to-cyber-red bg-clip-text text-transparent">
                    AI Career Identity
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-cyber-text-secondary leading-relaxed max-w-xl"
                >
                  AI + Web3 powered professional ecosystem for the next generation. Build portfolios, verify credentials, analyze skills, and get hired.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {isLoaded && isAuthenticated ? (
                  <Link href="/dashboard" className="flex-1 sm:flex-none">
                    <button className="btn-neon w-full">
                      <span className="flex items-center justify-center gap-2">
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-up" className="flex-1 sm:flex-none">
                      <button className="btn-neon w-full">
                        <span className="flex items-center justify-center gap-2">
                          Get Started
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </button>
                    </Link>
                    <Link href="/sign-in" className="flex-1 sm:flex-none">
                      <button className="px-6 py-3 rounded-lg font-semibold font-orbitron border border-cyber-red/50 text-white hover:bg-cyber-red/10 transition-all duration-300 w-full">
                        Sign In
                      </button>
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Trust indicators */}
              <motion.div variants={itemVariants} className="flex items-center gap-6 text-sm text-cyber-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-red glow-pulse"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-red glow-pulse"></div>
                  <span>Free starter plan</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              variants={itemVariants}
              className="relative hidden md:flex items-center justify-center"
            >
              <div className="relative w-full aspect-square">
                {/* Animated frame */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-cyber-red/30 animated-gradient-border"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {/* Content inside frame */}
                <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-cyber-red/20 p-8 overflow-hidden">
                  <motion.div
                    className="absolute -top-20 -right-20 w-40 h-40 bg-cyber-red/20 rounded-full blur-3xl"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  <div className="relative z-10 space-y-6">
                    {/* AI Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyber-text-secondary font-orbitron">AI Score</span>
                        <span className="text-2xl font-bold text-cyber-red">92%</span>
                      </div>
                      <div className="w-full h-1 bg-cyber-red/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyber-red to-cyber-red-glow"
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 2, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Recruiter Visibility */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyber-text-secondary font-orbitron">Recruiter Visibility</span>
                        <span className="text-2xl font-bold text-cyber-red">78%</span>
                      </div>
                      <div className="w-full h-1 bg-cyber-red/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyber-red to-cyber-red-glow"
                          initial={{ width: 0 }}
                          animate={{ width: "78%" }}
                          transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Verified Credentials */}
                    <div className="pt-4 border-t border-cyber-red/20">
                      <div className="flex items-center gap-2 text-sm text-cyber-text-secondary">
                        <Shield className="w-4 h-4 text-cyber-red" />
                        <span>3 Verified Credentials</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-cyber-red" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-cyber-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need to build, verify, analyze, and get hired.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Zap,
                title: "AI Skill Analyzer",
                description: "Analyze gaps between your skills and target roles. Get personalized roadmaps.",
              },
              {
                icon: Cpu,
                title: "Interview Simulator",
                description: "Practice with AI-powered technical and HR interviews with voice support.",
              },
              {
                icon: Network,
                title: "Recruiter Dashboard",
                description: "Connect with recruiters. Let them discover and verify your credentials.",
              },
              {
                icon: Shield,
                title: "Blockchain Verification",
                description: "NFT-based verified certificates stored on Ethereum and IPFS.",
              },
              {
                icon: Github,
                title: "GitHub Integration",
                description: "Auto-import your projects and repositories. Showcase real work.",
              },
              {
                icon: Sparkles,
                title: "Portfolio AI Review",
                description: "Get AI-powered score for recruiter-friendliness and ATS compatibility.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card-cyber p-6 rounded-xl hover:shadow-glow transition-all duration-300 group"
              >
                <feature.icon className="w-10 h-10 text-cyber-red mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-cyber-text-secondary text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="relative rounded-2xl overflow-hidden glass-card-cyber p-12 md:p-16 border-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-red/10 via-transparent to-cyber-red/10 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-cyber-text-secondary text-lg mb-8">
                Join thousands of professionals building their verified AI career identity.
              </p>
              {!isAuthenticated && (
                <Link href="/sign-up">
                  <button className="btn-neon">
                    <span className="flex items-center justify-center gap-2">
                      Start Free Today
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-cyber-red/20 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-orbitron font-bold text-lg mb-4">PortGenie 2.0</h3>
              <p className="text-cyber-text-secondary text-sm">Build. Verify. Analyze. Get Hired.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Legal", links: ["Privacy", "Terms", "Contact"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-cyber-text-secondary hover:text-cyber-red transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-cyber-red/20 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-cyber-text-secondary text-sm">
              {'\u00A9 '}{new Date().getFullYear()} PortGenie. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="text-cyber-text-secondary hover:text-cyber-red transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-cyber-text-secondary hover:text-cyber-red transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-cyber-text-secondary hover:text-cyber-red transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
