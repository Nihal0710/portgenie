"use client";

import { motion } from 'framer-motion';
import { Search, Star, Shield, TrendingUp, Filter, MoreVertical } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const candidateData = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Senior React Developer',
    match: 94,
    verified: true,
    score: 92,
    location: 'San Francisco, CA',
    image: 'A',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Full Stack Engineer',
    match: 87,
    verified: true,
    score: 88,
    location: 'Remote',
    image: 'S',
  },
  {
    id: 3,
    name: 'Michael Brown',
    role: 'DevOps Engineer',
    match: 76,
    verified: false,
    score: 74,
    location: 'New York, NY',
    image: 'M',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    role: 'Full Stack Engineer',
    match: 91,
    verified: true,
    score: 89,
    location: 'Remote',
    image: 'E',
  },
];

const analyticsData = [
  { month: 'Jan', visibility: 40, applications: 65, hires: 12 },
  { month: 'Feb', visibility: 65, applications: 78, hires: 18 },
  { month: 'Mar', visibility: 78, applications: 92, hires: 25 },
  { month: 'Apr', visibility: 85, applications: 88, hires: 22 },
  { month: 'May', visibility: 92, applications: 110, hires: 31 },
  { month: 'Jun', visibility: 95, applications: 125, hires: 38 },
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

export function RecruiterDashboard() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">Recruiter Dashboard</h2>
        <p className="text-muted-foreground">Discover and rank verified candidates</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Candidates', value: '2,341', change: '+12%' },
          { label: 'Verified Profiles', value: '1,892', change: '+18%' },
          { label: 'Avg. Match Score', value: '84%', change: '+5%' },
          { label: 'Hiring Success', value: '38', change: '+42%' },
        ].map((stat, i) => (
          <div key={i} className="saas-card p-6 rounded-xl border-2">
            <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
            <div className="flex items-end gap-4">
              <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
              <span className="text-brand text-sm font-semibold">{stat.change}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Analytics Chart */}
      <motion.div variants={itemVariants} className="saas-card p-6 rounded-xl border-2">
        <h3 className="text-xl font-display font-bold text-white mb-6">Hiring Analytics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analyticsData}>
            <defs>
              <linearGradient id="colorVisibility" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff003c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 60, 0.1)" />
            <XAxis dataKey="month" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
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
              dataKey="visibility"
              stroke="#ff003c"
              fillOpacity={1}
              fill="url(#colorVisibility)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Candidate Search & Filter */}
      <motion.div variants={itemVariants} className="saas-card p-6 rounded-xl border-2">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by skills, location, or experience..."
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-brand/30 rounded-lg text-white placeholder-muted-foreground focus:border-brand focus:outline-none focus:shadow-brand transition-all duration-300"
            />
          </div>
          <button className="px-6 py-3 rounded-lg border border-brand/50 text-foreground hover:bg-brand/10 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filter
          </button>
        </div>

        {/* Candidate List */}
        <div className="space-y-4">
          {candidateData.map((candidate, i) => (
            <motion.div
              key={candidate.id}
              className="glass-card p-4 rounded-lg border border-brand/20 hover:border-brand/50 transition-all duration-300 flex items-center justify-between group"
              whileHover={{ x: 4 }}
            >
              {/* Left Side */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-display font-bold">
                  {candidate.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{candidate.name}</h4>
                    {candidate.verified && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{candidate.role}</p>
                  <p className="text-muted-foreground text-xs">{candidate.location}</p>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-muted-foreground text-xs mb-1">Match Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-display font-bold text-brand">
                      {candidate.match}%
                    </span>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-brand/10 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Credentials Verification */}
      <motion.div variants={itemVariants} className="saas-card p-6 rounded-xl border-2">
        <h3 className="text-xl font-display font-bold text-white mb-6">Blockchain Verified Credentials</h3>
        <div className="space-y-3">
          {[
            { name: 'Advanced TypeScript Certification', issuer: 'Udacity', verified: true },
            { name: 'AWS Solutions Architect', issuer: 'Amazon', verified: true },
            { name: 'Google Cloud Professional', issuer: 'Google', verified: false },
          ].map((cred, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-brand/20">
              <div>
                <p className="font-semibold text-white">{cred.name}</p>
                <p className="text-muted-foreground text-sm">Issued by {cred.issuer}</p>
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                cred.verified
                  ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : 'bg-brand/20 border border-brand text-brand'
              }`}>
                {cred.verified ? 'Verified' : 'Verify'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
