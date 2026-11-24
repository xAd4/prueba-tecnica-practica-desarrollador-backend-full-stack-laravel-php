/**
 * Design tokens. Every visual value of the app comes from here and is applied
 * through Motion components (`style`, `whileHover`, `whileFocus`, ...).
 */
export const theme = {
  colors: {
    background: '#f5f2ec',
    surface: '#ffffff',
    surfaceMuted: '#faf8f4',
    text: '#1d2330',
    textMuted: '#6b7280',
    border: '#e6e1d8',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primarySoft: '#eef2ff',
    danger: '#dc2626',
    dangerHover: '#b91c1c',
    dangerSoft: '#fef2f2',
    accent: '#b45309',
    accentSoft: '#fef3c7',
    overlay: 'rgba(17, 24, 39, 0.45)',
    white: '#ffffff',
  },
  fonts: {
    body: "'Inter', 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif",
    heading: "'Georgia', 'Iowan Old Style', 'Times New Roman', serif",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.75rem',
    xxl: '2.25rem',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(17, 24, 39, 0.06)',
    md: '0 6px 18px rgba(17, 24, 39, 0.08)',
    lg: '0 18px 40px rgba(17, 24, 39, 0.16)',
    focus: '0 0 0 3px rgba(79, 70, 229, 0.25)',
  },
  layout: {
    maxWidth: '1180px',
  },
  transitions: {
    spring: { type: 'spring', stiffness: 380, damping: 30 },
    fast: { duration: 0.15 },
  },
} as const

export type Theme = typeof theme
