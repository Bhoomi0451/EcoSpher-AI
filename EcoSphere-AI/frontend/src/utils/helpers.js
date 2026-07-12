import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names safely utilizing clsx and tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object or ISO string to a human-readable date
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

/**
 * Extracts initials from a user's name
 */
export function getInitials(name) {
  if (!name) return 'ES';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Truncates text with trailing ellipses if exceeds limit
 */
export function truncateText(text, limit = 100) {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
}

/**
 * Formats point values with separators
 */
export function formatPoints(points) {
  if (points === undefined || points === null) return '0';
  return Number(points).toLocaleString('en-US');
}
