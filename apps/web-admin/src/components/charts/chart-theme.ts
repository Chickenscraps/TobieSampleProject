// ─── Tobie Chart Theme ─────────────────────────────────────────────────────
// Shared colors, fonts, and styling for all Recharts components

export const CHART_COLORS = {
  primary: '#316A9E',     // tobie-500
  primaryLight: '#4F91C9', // tobie-400
  primaryDark: '#255077',  // tobie-600
  accent: '#FFB31A',      // accent
  accentDark: '#E09800',  // accent-dark
  success: '#22C55E',     // green-500
  warning: '#F59E0B',     // amber-500
  danger: '#EF4444',      // red-500
  info: '#3B82F6',        // blue-500
  muted: '#94A3B8',       // slate-400
  background: '#EAF2F9',  // brand-surface
  border: '#E2E8F0',      // slate-200
  text: '#18354F',        // brand-dark
  textMuted: '#64748B',   // slate-500
} as const;

// Color palette for multi-series charts (devices, browsers, OS, etc.)
export const PALETTE = [
  '#316A9E', // tobie-500
  '#FFB31A', // accent
  '#22C55E', // green
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#F97316', // orange
  '#06B6D4', // cyan
  '#84CC16', // lime
] as const;

// Heatmap color scale (low → high)
export const HEATMAP_SCALE = [
  '#EAF2F9', // brand-surface (0)
  '#D0E2F1', // tobie-100
  '#A1C5E3', // tobie-200
  '#72A8D5', // tobie-300
  '#4F91C9', // tobie-400
  '#316A9E', // tobie-500
  '#255077', // tobie-600
  '#18354F', // tobie-700
] as const;

// Shared tooltip styling (light mode)
export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '0px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    padding: '8px 12px',
    fontSize: '12px',
  },
  labelStyle: {
    fontWeight: 600,
    color: '#18354F',
    marginBottom: '4px',
  },
  itemStyle: {
    color: '#64748B',
    fontSize: '12px',
    padding: '1px 0',
  },
} as const;

// Shared tooltip styling (dark mode)
export const DARK_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#1e293b',   // slate-800
    border: '1px solid #475569',  // slate-600
    borderRadius: '0px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
    padding: '8px 12px',
    fontSize: '12px',
  },
  labelStyle: {
    fontWeight: 600,
    color: '#f1f5f9',             // slate-100
    marginBottom: '4px',
  },
  itemStyle: {
    color: '#94a3b8',             // slate-400
    fontSize: '12px',
    padding: '1px 0',
  },
} as const;

// Shared axis styling (light mode)
export const AXIS_STYLE = {
  tick: { fill: '#64748B', fontSize: 11 },
  axisLine: { stroke: '#E2E8F0' },
  tickLine: { stroke: '#E2E8F0' },
} as const;

// Shared axis styling (dark mode)
export const DARK_AXIS_STYLE = {
  tick: { fill: '#94a3b8', fontSize: 11 },    // slate-400
  axisLine: { stroke: '#475569' },             // slate-600
  tickLine: { stroke: '#475569' },             // slate-600
} as const;

// Format numbers with commas
export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

// Format milliseconds to readable time
export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// Get trend arrow and color
export function getTrend(current: number, previous: number): { arrow: string; percent: string; color: string } {
  if (previous === 0) return { arrow: '→', percent: 'N/A', color: 'text-gray-400 dark:text-gray-500' };
  const change = ((current - previous) / previous) * 100;
  if (change > 0) return { arrow: '↑', percent: `+${change.toFixed(1)}%`, color: 'text-green-600 dark:text-green-400' };
  if (change < 0) return { arrow: '↓', percent: `${change.toFixed(1)}%`, color: 'text-red-600 dark:text-red-400' };
  return { arrow: '→', percent: '0%', color: 'text-gray-400 dark:text-gray-500' };
}
