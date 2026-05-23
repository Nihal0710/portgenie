"use client";

import { motion } from 'framer-motion';
import { Shield, Zap, GitBranch, Award, Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  role: string;
  bio: string;
  location: string;
  image: string;
  skills: string[];
  verified: boolean;
  score: number;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export function ProfileCard({
  name,
  role,
  bio,
  location,
  image,
  skills,
  verified,
  score,
  social,
}: ProfileCardProps) {
  return (
    <motion.div
      className="saas-card p-6 rounded-xl border-2 relative overflow-hidden group"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-brand/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-xl"
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        {/* Header with Avatar and Score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <motion.div
              className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-display text-2xl font-bold flex-shrink-0"
              whileHover={{ scale: 1.1 }}
            >
              {image}
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-bold text-white">{name}</h3>
                {verified && (
                  <motion.div whileHover={{ scale: 1.2 }}>
                    <Shield className="w-4 h-4 text-green-500" />
                  </motion.div>
                )}
              </div>
              <p className="text-brand text-sm font-semibold">{role}</p>
              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                <MapPin className="w-3 h-3" />
                {location}
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="text-right">
            <div className="text-3xl font-display font-bold text-brand">{score}%</div>
            <div className="w-12 h-1 bg-brand/20 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-brand to-brand-light"
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{bio}</p>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-muted-foreground text-xs font-display mb-2">SKILLS</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <motion.span
                key={i}
                className="px-3 py-1 rounded-full text-xs bg-brand/20 border border-brand/40 text-brand font-semibold"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 0, 60, 0.3)' }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent my-4" />

        {/* Footer Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="font-display font-bold text-brand text-lg">12</div>
            <div className="text-muted-foreground text-xs">Projects</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-brand text-lg">8</div>
            <div className="text-muted-foreground text-xs">Verified</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-brand text-lg">4.8</div>
            <div className="text-muted-foreground text-xs">Rating</div>
          </div>
        </div>

        {/* Social Links */}
        {social && (
          <div className="flex items-center justify-center gap-3">
            {social.github && (
              <motion.a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-brand/10 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                <Github className="w-4 h-4 text-muted-foreground hover:text-brand" />
              </motion.a>
            )}
            {social.linkedin && (
              <motion.a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-brand/10 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-brand" />
              </motion.a>
            )}
            {social.twitter && (
              <motion.a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-brand/10 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                <Twitter className="w-4 h-4 text-muted-foreground hover:text-brand" />
              </motion.a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
