"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Github,
  Linkedin,
  Mic,
  Shield,
  Sparkles,
  Target,
} from "lucide-react"
import { LogoMark } from "@/components/layout/logo"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

const features = [
  {
    icon: Brain,
    title: "AI Skill Gap Analyzer",
    description:
      "Identify missing skills and get a clear roadmap to become interview-ready.",
  },
  {
    icon: BarChart3,
    title: "Recruiter Analytics",
    description:
      "Understand how recruiters view your profile with visibility and ATS insights.",
  },
  {
    icon: Mic,
    title: "AI Interview Simulator",
    description:
      "Practice role-specific questions with structured feedback before the real call.",
  },
  {
    icon: Github,
    title: "GitHub & LinkedIn Import",
    description:
      "Pull projects and experience automatically into a polished portfolio.",
  },
  {
    icon: Target,
    title: "Portfolio Review Score",
    description:
      "AI grades clarity, impact, and presentation — with actionable improvements.",
  },
  {
    icon: Shield,
    title: "Credential Verification",
    description:
      "Blockchain-backed proof for certificates, resumes, and professional identity.",
  },
]

const metrics = [
  { label: "ATS Score", value: "92", trend: "+8%" },
  { label: "Recruiter Views", value: "847", trend: "+24%" },
  { label: "Profile Strength", value: "88%", trend: "Strong" },
]

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth()

  return (
    <div className="relative w-full overflow-hidden pt-[4.25rem] bg-background">
      <div className="pointer-events-none fixed inset-0 bg-hero-gradient mesh-bg opacity-80" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 md:px-6 md:pt-20 lg:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Build. Verify. Analyze. Get Hired.
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
            >
              Build Your Verified{" "}
              <span className="text-gradient-brand">AI Career Identity</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-5 max-w-lg text-lg text-muted-foreground leading-relaxed"
            >
              AI-powered professional ecosystem for the next generation — portfolios,
              recruiter intelligence, interview prep, and verified credentials in one
              platform.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href={isLoaded && isSignedIn ? "/dashboard" : "/sign-up"}
                className="btn-brand"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#platform" className="btn-brand-outline">
                View Demo
              </Link>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground"
            >
              {["No credit card", "Recruiter-ready", "AI-native"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Preview cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="saas-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LogoMark size={28} />
                  <span className="text-sm font-medium">Career Intelligence</span>
                </div>
                <span className="badge-success">Live</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {m.label}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold">{m.value}</p>
                    <p className="text-xs text-brand-light">{m.trend}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Portfolio strength</span>
                  <span>88%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-brand"
                    initial={{ width: 0 }}
                    animate={{ width: "88%" }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Verification</span>
                  <span className="text-success flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 -bottom-4 saas-card p-4 max-w-[200px] hidden sm:block"
            >
              <p className="text-xs text-muted-foreground">Recruiter visibility</p>
              <p className="text-2xl font-display font-semibold mt-1">↑ 24%</p>
              <p className="text-[10px] text-muted-foreground mt-1">vs last month</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-medium text-brand mb-2">Platform</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Everything you need to get hired
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Enterprise-grade AI tools designed for candidates and recruiters — not
              gamers.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="saas-card p-6 group"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted border border-brand/20">
                  <f.icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform CTA */}
      <section id="platform" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="saas-panel p-10 md:p-14 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl mx-auto">
              Your career operating system, powered by AI
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              Join professionals using PortGenie to stand out to recruiters with
              data-backed portfolios and verified credentials.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/sign-up" className="btn-brand">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sign-in" className="btn-brand-outline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing placeholder */}
      <section id="pricing" className="relative border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
          <h2 className="font-display text-3xl font-semibold">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you&apos;re ready to unlock advanced AI analytics.
          </p>
          <Link href="/dashboard/upgrade" className="btn-brand-outline mt-8 inline-flex">
            View plans
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <LogoMark size={28} />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PortGenie 2.0. All rights reserved.
          </p>
          <div className="flex gap-4 text-muted-foreground">
            <Linkedin className="h-4 w-4 hover:text-foreground cursor-pointer transition-colors" />
            <Github className="h-4 w-4 hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  )
}
