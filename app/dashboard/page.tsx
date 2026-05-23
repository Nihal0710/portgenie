"use client";

import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Grid3X3, Zap, Brain, Users, Shield } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics"
import { SkillGapAnalyzer } from "@/components/ai/skill-gap-analyzer"
import { InterviewSimulator } from "@/components/ai/interview-simulator"
import { RecruiterDashboard } from "@/components/recruiter/recruiter-dashboard"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function DashboardPage() {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ai-analyzer', label: 'AI Analyzer', icon: Brain },
    { id: 'interview', label: 'Interview Prep', icon: Zap },
    { id: 'recruiter', label: 'Recruiter View', icon: Users },
    { id: 'tools', label: 'Tools', icon: Grid3X3 },
  ];

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyber-red/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-cyber-red/5 rounded-full blur-3xl opacity-15"></div>
      </div>

      <motion.div
        className="relative container mx-auto space-y-6 px-4 py-6 lg:px-6 pt-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <DashboardHeader title="PortGenie 2.0" description="Your AI-powered career operating system" />
        </motion.div>

        {/* Tabs Section */}
        <motion.div variants={itemVariants} className="glass-card-cyber p-6 rounded-xl border-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex overflow-x-auto pb-2">
              <TabsList className="grid grid-cols-5 w-full bg-transparent gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="rounded-lg border border-cyber-red/30 data-[state=active]:border-cyber-red data-[state=active]:bg-cyber-red/10 data-[state=active]:shadow-glow transition-all duration-300 flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 pt-4">
              <motion.div variants={itemVariants}>
                <DashboardAnalytics />
              </motion.div>
            </TabsContent>

            {/* AI Analyzer Tab */}
            <TabsContent value="ai-analyzer" className="space-y-6 pt-4">
              <motion.div variants={itemVariants}>
                <SkillGapAnalyzer />
              </motion.div>
            </TabsContent>

            {/* Interview Prep Tab */}
            <TabsContent value="interview" className="space-y-6 pt-4">
              <motion.div variants={itemVariants}>
                <InterviewSimulator />
              </motion.div>
            </TabsContent>

            {/* Recruiter View Tab */}
            <TabsContent value="recruiter" className="space-y-6 pt-4">
              <motion.div variants={itemVariants}>
                <RecruiterDashboard />
              </motion.div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-6 pt-4">
              <motion.div variants={itemVariants}>
                <div className="mb-6">
                  <h2 className="text-2xl font-orbitron font-bold text-white">Portfolio Tools</h2>
                  <p className="text-cyber-text-secondary">Create and manage your professional presence</p>
                </div>
                <DashboardCards />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div variants={itemVariants} className="glass-card-cyber p-6 rounded-xl border-2">
          <h3 className="text-xl font-orbitron font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Upload Resume', icon: '📄', color: 'from-cyber-red to-cyber-red-glow' },
              { label: 'Import GitHub', icon: '⭐', color: 'from-cyan-500 to-blue-500' },
              { label: 'Start Interview', icon: '🎤', color: 'from-purple-500 to-pink-500' },
              { label: 'Get Portfolio Score', icon: '📊', color: 'from-green-500 to-emerald-500' },
            ].map((action, i) => (
              <motion.button
                key={i}
                className={`p-4 rounded-lg bg-gradient-to-br ${action.color} opacity-20 hover:opacity-40 border border-white/20 text-white font-semibold transition-all duration-300 group`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{action.icon}</span>
                {action.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

