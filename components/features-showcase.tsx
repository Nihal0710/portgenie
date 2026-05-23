"use client";

import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Skill Gap Analyzer',
    description: 'Compare your skills against target roles and get personalized learning roadmaps.',
    color: 'from-cyan-500 to-blue-500',
    stats: [
      { label: 'Skills Tracked', value: '1000+' },
      { label: 'Accuracy', value: '94%' },
    ],
  },
  {
    icon: Zap,
    title: 'Interview Simulator',
    description: 'Practice with AI-powered interviews with instant feedback and confidence analysis.',
    color: 'from-purple-500 to-pink-500',
    stats: [
      { label: 'Interview Types', value: '3+' },
      { label: 'AI Feedback', value: 'Real-time' },
    ],
  },
  {
    icon: Users,
    title: 'Recruiter Dashboard',
    description: 'Connect with recruiters and let them discover your verified credentials.',
    color: 'from-green-500 to-emerald-500',
    stats: [
      { label: 'Active Recruiters', value: '500+' },
      { label: 'Match Rate', value: '92%' },
    ],
  },
  {
    icon: Shield,
    title: 'Blockchain Verification',
    description: 'NFT-based credentials on Ethereum with decentralized identity storage.',
    color: 'from-orange-500 to-red-500',
    stats: [
      { label: 'Credentials', value: 'Unlimited' },
      { label: 'Blockchain', value: 'Ethereum' },
    ],
  },
  {
    icon: TrendingUp,
    title: 'Portfolio Analytics',
    description: 'Get AI-powered scores for recruiter-friendliness and ATS compatibility.',
    color: 'from-blue-500 to-indigo-500',
    stats: [
      { label: 'Score Range', value: '0-100' },
      { label: 'Improvement Tips', value: 'Personalized' },
    ],
  },
  {
    icon: CheckCircle,
    title: 'GitHub Integration',
    description: 'Auto-import projects and showcase real work to recruiters.',
    color: 'from-slate-600 to-slate-800',
    stats: [
      { label: 'Repos Supported', value: 'All' },
      { label: 'Sync Speed', value: 'Real-time' },
    ],
  },
];

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
    transition: { duration: 0.6 },
  },
};

export function FeaturesShowcase() {
  return (
    <section className="py-20 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-80 h-80 bg-cyber-red/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          variants={itemVariants}
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold">
            <span className="gradient-text">Powerful AI Features</span>
          </h2>
          <p className="text-cyber-text-secondary text-lg max-w-2xl mx-auto">
            Everything you need to build, verify, analyze, and get hired with cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="glass-card-cyber p-6 rounded-xl border-2 group relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background */}
                <motion.div
                  className={`absolute -inset-full bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-300`}
                />

                {/* Icon */}
                <motion.div
                  className="mb-4 relative z-10"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <Icon className="w-10 h-10 text-cyber-red" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-orbitron font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-cyber-text-secondary text-sm mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cyber-red/20">
                    {feature.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="font-orbitron font-bold text-cyber-red">
                          {stat.value}
                        </div>
                        <div className="text-cyber-text-secondary text-xs mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          variants={itemVariants}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="btn-neon"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
