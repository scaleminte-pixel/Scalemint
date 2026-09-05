'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * HeroVisual — Animated 3D-esque floating geometric solar composition
 * Pure, clean, minimalist floating visual without square containers.
 */
interface HeroVisualProps {
  orbitLabels?: string[];
}

export default function HeroVisual({ orbitLabels }: HeroVisualProps) {
  const label1 = orbitLabels?.[0] || 'Branding';
  const label2 = orbitLabels?.[1] || 'Web Dev';
  const label3 = orbitLabels?.[2] || 'Video';
  const label4 = orbitLabels?.[3] || 'Google Ads';
  return (
    <div className="hero-visual-container">
      {/* Central glowing orb */}
      <motion.div
        className="hero-orb-center"
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 360],
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
        }}
      >
        <div className="hero-orb-inner" />
      </motion.div>

      {/* Outer rotating ring 1 */}
      <motion.div
        className="hero-ring hero-ring-1"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        {/* Orbiting dot */}
        <div className="hero-ring-dot hero-ring-dot-purple" />
      </motion.div>

      {/* Outer rotating ring 2 (counter-rotation) */}
      <motion.div
        className="hero-ring hero-ring-2"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        <div className="hero-ring-dot hero-ring-dot-blue" />
      </motion.div>

      {/* Outer rotating ring 3 */}
      <motion.div
        className="hero-ring hero-ring-3"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="hero-ring-dot hero-ring-dot-gold" />
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`hero-particle hero-particle-${i + 1}`}
          animate={{
            y: [0, -20, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Floating icon badges */}
      <motion.div
        className="hero-float-badge hero-float-badge-1"
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
        <span>{label1}</span>
      </motion.div>

      <motion.div
        className="hero-float-badge hero-float-badge-2"
        animate={{ y: [0, -12, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
        <span>{label2}</span>
      </motion.div>

      <motion.div
        className="hero-float-badge hero-float-badge-3"
        animate={{ y: [0, -18, 0], rotate: [0, 4, -4, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
        <span>{label3}</span>
      </motion.div>

      <motion.div
        className="hero-float-badge hero-float-badge-4"
        animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
        </svg>
        <span>{label4}</span>
      </motion.div>

      {/* Ambient glow layers */}
      <div className="hero-glow-purple" />
      <div className="hero-glow-blue" />
      <div className="hero-glow-gold" />
    </div>
  );
}
