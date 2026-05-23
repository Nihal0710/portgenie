"use client";

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Target, Award, Code } from 'lucide-react';

const skillData = [
  { skill: 'React', have: 85, need: 95, gap: 10 },
  { skill: 'TypeScript', have: 70, need: 90, gap: 20 },
  { skill: 'Node.js', have: 60, need: 85, gap: 25 },
  { skill: 'System Design', have: 50, need: 85, gap: 35 },
  { skill: 'DevOps', have: 40, need: 75, gap: 35 },
];

const radarData = [
  { name: 'Frontend', current: 78, target: 92 },
  { name: 'Backend', current: 65, target: 88 },
  { name: 'Database', current: 70, target: 85 },
  { name: 'DevOps', current: 45, target: 80 },
  { name: 'Communication', current: 82, target: 95 },
  { name: 'Problem Solving', current: 75, target: 92 },
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

export function SkillGapAnalyzer() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">AI Skill Gap Analyzer</h2>
        <p className="text-muted-foreground">Compare your skills with senior-level requirements</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Current Score', value: '72%', color: 'brand' },
          { icon: Target, label: 'Target Score', value: '88%', color: 'brand' },
          { icon: Award, label: 'Skills Gap', value: '16%', color: 'brand-light' },
          { icon: Code, label: 'Time to Goal', value: '3-4 months', color: 'brand' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="saas-card p-6 rounded-xl border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-brand">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-brand opacity-50" />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Skill Gap Chart */}
      <motion.div variants={itemVariants} className="saas-card p-6 rounded-xl border-2">
        <h3 className="text-xl font-display font-bold text-white mb-6">Skill Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={skillData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 60, 0.1)" />
            <XAxis dataKey="skill" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(5, 5, 5, 0.8)',
                border: '1px solid rgba(255, 0, 60, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
              }}
            />
            <Bar dataKey="have" fill="#ff003c" radius={[8, 8, 0, 0]} />
            <Bar dataKey="need" fill="rgba(255, 0, 60, 0.3)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Radar Chart */}
      <motion.div variants={itemVariants} className="saas-card p-6 rounded-xl border-2">
        <h3 className="text-xl font-display font-bold text-white mb-6">Competency Profile</h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255, 0, 60, 0.2)" />
            <PolarAngleAxis dataKey="name" stroke="#a1a1aa" />
            <PolarRadiusAxis stroke="rgba(255, 0, 60, 0.1)" />
            <Radar name="Current" dataKey="current" stroke="#ff003c" fill="rgba(255, 0, 60, 0.2)" />
            <Radar name="Target" dataKey="target" stroke="#ff4d6d" fill="rgba(255, 77, 109, 0.1)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(5, 5, 5, 0.8)',
                border: '1px solid rgba(255, 0, 60, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recommended Roadmap */}
      <motion.div variants={itemVariants} className="saas-card p-6 rounded-xl border-2">
        <h3 className="text-xl font-display font-bold text-white mb-6">Personalized Growth Roadmap</h3>
        <div className="space-y-4">
          {[
            {
              month: 'Month 1-2',
              focus: 'Advanced TypeScript & System Design',
              resources: ['Design Patterns Course', 'LeetCode Hard Problems', 'System Design Interview'],
            },
            {
              month: 'Month 2-3',
              focus: 'DevOps & Infrastructure',
              resources: ['Docker & Kubernetes', 'AWS Certification', 'CI/CD Best Practices'],
            },
            {
              month: 'Month 3-4',
              focus: 'Leadership & Communication',
              resources: ['Tech Mentoring', 'Presentation Skills', 'Team Project Leadership'],
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 pb-4 border-b border-brand/20 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 w-1 h-auto min-h-16 bg-gradient-to-b from-brand to-transparent rounded-full" />
              <div>
                <h4 className="font-display font-bold text-white mb-2">{item.month}</h4>
                <p className="text-muted-foreground mb-3">{item.focus}</p>
                <div className="flex flex-wrap gap-2">
                  {item.resources.map((res, j) => (
                    <span key={j} className="px-3 py-1 rounded-full text-xs bg-brand/20 border border-brand/40 text-brand">
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
