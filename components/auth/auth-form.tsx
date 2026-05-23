"use client";

import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, Github } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface AuthFormProps {
  title: string;
  subtitle: string;
  isSignUp?: boolean;
}

export function CyberpunkAuthForm({ title, subtitle, isSignUp }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyber-red/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyber-red-glow/10 rounded-full blur-3xl opacity-15"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 0, 60, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 60, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card */}
        <div className="glass-card-cyber p-8 rounded-2xl border-2 space-y-6">
          {/* Header */}
          <motion.div
            className="text-center space-y-2"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center justify-center gap-2 mb-4"
              whileHover={{ scale: 1.1 }}
            >
              <Zap className="w-6 h-6 text-cyber-red" />
              <span className="text-xl font-orbitron font-bold text-glow">PortGenie 2.0</span>
            </motion.div>
            <h1 className="text-3xl font-orbitron font-bold text-white">{title}</h1>
            <p className="text-cyber-text-secondary text-sm">{subtitle}</p>
          </motion.div>

          {/* Form */}
          <form className="space-y-4">
            {/* Email Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-orbitron text-cyber-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyber-red/50 group-focus-within:text-cyber-red transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-cyber-red/30 rounded-lg text-white placeholder-cyber-text-secondary/50 focus:border-cyber-red focus:outline-none focus:shadow-glow transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-orbitron text-cyber-text-secondary mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyber-red/50 group-focus-within:text-cyber-red transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-black/40 border border-cyber-red/30 rounded-lg text-white placeholder-cyber-text-secondary/50 focus:border-cyber-red focus:outline-none focus:shadow-glow transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyber-text-secondary hover:text-cyber-red transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Forgot Password (Sign In only) */}
            {!isSignUp && (
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/forgot-password">
                  <button
                    type="button"
                    className="text-sm text-cyber-red hover:text-cyber-red-glow transition-colors"
                  >
                    Forgot password?
                  </button>
                </Link>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full btn-neon py-3 font-orbitron font-bold text-center mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-cyber-red/0 via-cyber-red/30 to-cyber-red/0"></div>
            <span className="text-xs text-cyber-text-secondary font-orbitron">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyber-red/0 via-cyber-red/30 to-cyber-red/0"></div>
          </div>

          {/* OAuth Button */}
          <motion.button
            type="button"
            className="w-full px-4 py-3 rounded-lg border border-cyber-red/30 text-white hover:bg-cyber-red/10 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </motion.button>

          {/* Footer Text */}
          <motion.div
            className="text-center text-sm text-cyber-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link href="/sign-in">
                  <button className="text-cyber-red hover:text-cyber-red-glow transition-colors font-semibold">
                    Sign in
                  </button>
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link href="/sign-up">
                  <button className="text-cyber-red hover:text-cyber-red-glow transition-colors font-semibold">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Terms */}
          <motion.p
            className="text-xs text-cyber-text-secondary/70 text-center leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our{' '}
            <Link href="/terms">
              <button className="text-cyber-red hover:underline">Terms</button>
            </Link>
            {' '}and{' '}
            <Link href="/privacy">
              <button className="text-cyber-red hover:underline">Privacy Policy</button>
            </Link>
          </motion.p>
        </div>

        {/* Floating Cards Background */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 glass-card-cyber rounded-xl opacity-20 border border-cyber-red/10"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 glass-card-cyber rounded-xl opacity-20 border border-cyber-red/10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
