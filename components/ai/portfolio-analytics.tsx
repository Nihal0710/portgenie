"use client";

import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Award } from 'lucide-react';

const scoreData = [
  { month: 'Jan', score: 62, recruiterFriendly: 58, atsScore: 65 },
  { month: 'Feb', score: 68, recruiterFriendly: 64, atsScore: 72 },
  { month: 'Mar', score: 75, recruiterFriendly: 72, atsScore: 78 },
  { month: 'Apr', score: 82, recruiterFriendly: 80, atsScore: 85 },
  { month: 'May', score: 88, recruiterFriendly: 86, atsScore: 90 },
  { month: 'Jun', score: 92, recruiterFriendly: 90, atsScore: 94 },
];

const categoryData = [
  { name: 'Skills Match', value: 92, color: '#ff003c' },
  { name: 'Experience', value: 85, color: '#ff4d6d' },
  { name: 'Projects', value: 88, color: '#ff1744' },
  { name: 'Certifications', value: 78, color: '#d32f2f' },
];

const improvements = [
  {
    title: 'Add More Projects',
    impact: '+8% recruiter visibility',
    status: 'recommended',
    priority: 'high',
  },
  {
    title: 'Complete AWS Certification',
    impact: '+5% match score',
    status: 'recommended',
    priority: 'medium',
  },
  {
    title: 'Update Resume Keywords',
    impact: '+3% ATS score',
    status: 'critical',
    priority: 'high',
  },
  {
    title: 'Add GitHub Links',
    impact: '+6% technical credibility',
    status: 'recommended',
    priority: 'medium',
  },
];

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

export function PortfolioAnalytics() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-2">Portfolio Review Score</h2>
        <p className="text-cyber-text-secondary">AI-powered analysis of your portfolio quality</p>
      </motion.div>

      {/* Main Score Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Overall Score',
            score: 92,
            subtitle: 'Excellent',
            icon: Award,
            trend: '+12%',
          },
          {
            label: 'Recruiter Friendliness',
            score: 90,
            subtitle: 'Very High',
            icon: TrendingUp,
            trend: '+8%',
          },
          {
            label: 'ATS Compatibility',
            score: 94,
            subtitle: 'Excellent',
            icon: CheckCircle,
            trend: '+14%',
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card-cyber p-8 rounded-xl border-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-cyber-text-secondary text-sm mb-2 font-orbitron">{card.label}</p>
                  <p className="text-4xl font-orbitron font-bold text-glow-lg">{card.score}%</p>
                  <p className="text-cyber-text-secondary text-xs mt-1">{card.subtitle}</p>
                </div>
                <Icon className="w-8 h-8 text-cyber-red/50" />
              </div>
              <div className="w-full h-2 bg-cyber-red/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-red to-cyber-red-glow rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${card.score}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <p className="text-cyber-red text-sm mt-3 font-semibold">{card.trend}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Score Trend Chart */}
      <motion.div variants={itemVariants} className="glass-card-cyber p-6 rounded-xl border-2">
        <h3 className="text-xl font-orbitron font-bold text-white mb-6">Score Progression</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={scoreData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff003c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 60, 0.1)" />
            <XAxis dataKey="month" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" domain={[50, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(5, 5, 5, 0.8)',
                border: '1px solid rgba(255, 0, 60, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#ff003c"
              fillOpacity={1}
              fill="url(#colorScore)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass-card-cyber p-6 rounded-xl border-2">
          <h3 className="text-xl font-orbitron font-bold text-white mb-6">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(5, 5, 5, 0.8)',
                  border: '1px solid rgba(255, 0, 60, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-cyber-text-secondary">{item.name}</span>
                </div>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="glass-card-cyber p-6 rounded-xl border-2">
          <h3 className="text-xl font-orbitron font-bold text-white mb-6">Improvement Suggestions</h3>
          <div className="space-y-3">
            {improvements.map((item, i) => (
              <motion.div
                key={i}
                className={`p-4 rounded-lg border-l-4 ${
                  item.status === 'critical'
                    ? 'bg-red-500/10 border-red-500'
                    : 'bg-cyber-red/10 border-cyber-red'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-cyber-text-secondary text-xs mt-1">{item.impact}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      item.priority === 'high'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {item.priority === 'high' ? '⚡ High' : 'Medium'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Optimization Tips */}
      <motion.div variants={itemVariants} className="glass-card-cyber p-6 rounded-xl border-2">
        <h3 className="text-xl font-orbitron font-bold text-white mb-4">Quick Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Use Keywords',
              desc: 'Match job description keywords to improve ATS score',
            },
            {
              title: 'Add Metrics',
              desc: 'Quantify your achievements with numbers and percentages',
            },
            {
              title: 'Showcase Projects',
              desc: 'Link to live projects and GitHub repositories',
            },
            {
              title: 'Keep Updated',
              desc: 'Regularly update skills and experience sections',
            },
          ].map((tip, i) => (
            <div key={i} className="bg-black/40 p-4 rounded-lg border border-cyber-red/20">
              <p className="font-semibold text-white mb-2">{tip.title}</p>
              <p className="text-cyber-text-secondary text-sm">{tip.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
