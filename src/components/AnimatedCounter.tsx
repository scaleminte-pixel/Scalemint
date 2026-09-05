'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

/**
 * AnimatedCounter — Counts up numbers when scrolled into view
 * Handles values like "360°", "95+", "100%", "24h", "1 Dedicated", "Sprint-Based"
 * Extracts numeric portion and animates it, preserving prefix/suffix
 */
export default function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;

    // Extract numeric portion: handles "360°", "95+", "100%", "24h", "1", "1 Dedicated"
    const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    hasAnimated.current = true;
    const prefix = match[1];
    const targetNumber = parseFloat(match[2]);
    const suffix = match[3];
    const isDecimal = match[2].includes('.');

    const duration = 1800; // 1.8 seconds
    const startTime = performance.now();

    // Start with 0
    setDisplayValue(`${prefix}0${suffix}`);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo for snappy, premium feel
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = isDecimal
        ? (targetNumber * eased).toFixed(1)
        : Math.round(targetNumber * eased);

      setDisplayValue(`${prefix}${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
