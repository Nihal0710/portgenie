"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const interviewModes = [
  { id: 'hr', label: 'HR Interview', description: 'Behavioral & communication interview' },
  { id: 'technical', label: 'Technical Interview', description: 'Coding & system design questions' },
  { id: 'mixed', label: 'Mixed Interview', description: 'Combination of both types' },
];

const sampleQuestions = {
  hr: [
    'Tell me about yourself and your background.',
    'Why are you interested in this position?',
    'Describe a challenging project you worked on.',
    'How do you handle conflicts in a team?',
  ],
  technical: [
    'Design a URL shortening service.',
    'Implement a cache system with LRU eviction.',
    'Explain your approach to debugging production issues.',
    'Build a real-time notification system.',
  ],
};

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

export function InterviewSimulator() {
  const [selectedMode, setSelectedMode] = useState('hr');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-2">AI Interview Simulator</h2>
        <p className="text-cyber-text-secondary">Practice interviews with AI feedback and analysis</p>
      </motion.div>

      {/* Mode Selection */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interviewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setSelectedMode(mode.id);
                setCurrentQuestion(0);
                setAnswers([]);
              }}
              className={`glass-card-cyber p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedMode === mode.id ? 'border-cyber-red shadow-glow' : 'border-cyber-red/30'
              }`}
            >
              <h3 className="font-orbitron font-bold text-white mb-2">{mode.label}</h3>
              <p className="text-cyber-text-secondary text-sm">{mode.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Interview Interface */}
      <motion.div variants={itemVariants} className="glass-card-cyber p-8 rounded-xl border-2">
        <div className="space-y-6">
          {/* Current Question */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-orbitron font-bold text-white">
                Question {currentQuestion + 1}
              </h3>
              <div className="flex items-center gap-2 text-cyber-text-secondary">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}</span>
              </div>
            </div>
            <p className="text-lg text-cyber-text mb-6 leading-relaxed">
              {sampleQuestions[selectedMode as keyof typeof sampleQuestions][currentQuestion]}
            </p>
          </div>

          {/* Recording Controls */}
          <div className="border-t border-cyber-red/20 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isRecording
                    ? 'bg-cyber-red/30 border border-cyber-red shadow-glow text-cyber-red'
                    : 'bg-cyber-red border border-cyber-red shadow-glow text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </>
                )}
              </button>

              <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-cyber-red/50 text-cyber-text hover:bg-cyber-red/10 transition-colors">
                <Volume2 className="w-5 h-5" />
                Listen Again
              </button>
            </div>
          </div>

          {/* Your Answer Area */}
          <div>
            <label className="block text-sm font-orbitron text-cyber-text-secondary mb-3">
              Your Answer
            </label>
            <textarea
              className="w-full h-32 bg-black/40 border border-cyber-red/30 rounded-lg px-4 py-3 text-white focus:border-cyber-red focus:outline-none focus:shadow-glow transition-all duration-300"
              placeholder="Type your answer or speak into the microphone..."
            />
          </div>

          {/* AI Feedback Preview */}
          <div className="bg-black/40 border border-cyber-red/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Strong Points</p>
                <p className="text-xs text-cyber-text-secondary mt-1">
                  Good structure and clear articulation of your approach
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-cyber-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Areas to Improve</p>
                <p className="text-xs text-cyber-text-secondary mt-1">
                  Could provide more specific examples and technical depth
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-cyber-red/20">
          <button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            className="px-6 py-2 rounded-lg border border-cyber-red/50 text-cyber-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyber-red/10 transition-colors"
          >
            Previous
          </button>

          <div className="text-center">
            <p className="text-cyber-text-secondary text-sm">
              {currentQuestion + 1} of {sampleQuestions[selectedMode as keyof typeof sampleQuestions].length}
            </p>
          </div>

          <button
            onClick={() => {
              if (
                currentQuestion <
                sampleQuestions[selectedMode as keyof typeof sampleQuestions].length - 1
              ) {
                setCurrentQuestion(currentQuestion + 1);
              }
            }}
            className="px-6 py-2 rounded-lg bg-cyber-red border border-cyber-red text-white hover:shadow-glow transition-all duration-300"
          >
            {currentQuestion ===
            sampleQuestions[selectedMode as keyof typeof sampleQuestions].length - 1
              ? 'Finish'
              : 'Next'}
          </button>
        </div>
      </motion.div>

      {/* Performance Summary */}
      <motion.div variants={itemVariants} className="glass-card-cyber p-6 rounded-xl border-2">
        <h3 className="text-xl font-orbitron font-bold text-white mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Clarity', score: 82 },
            { label: 'Confidence', score: 75 },
            { label: 'Technical Depth', score: 68 },
            { label: 'Communication', score: 85 },
          ].map((metric, i) => (
            <div key={i} className="bg-black/40 rounded-lg p-4">
              <p className="text-cyber-text-secondary text-sm mb-2">{metric.label}</p>
              <div className="relative h-2 bg-cyber-red/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-red to-cyber-red-glow rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.score}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <p className="text-white font-orbitron text-sm mt-2">{metric.score}%</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
