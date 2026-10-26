import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safe parseInt that returns a fallback (default 0) instead of NaN.
 */
export function safeParseInt(val: any, fallback: number = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  const parsed = parseInt(String(val), 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safe parseFloat that returns a fallback instead of NaN.
 */
export function safeParseFloat(val: any, fallback: number = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? fallback : parsed;
}

