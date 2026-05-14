import { createStitches } from '@stitches/react';

const { styled, globalCss, keyframes, theme } = createStitches({
  theme: {
    colors: {
      bg: '#0a0b14',
      bgMuted: '#12141f',
      panel: '#1a1c2e',
      panelElevated: '#222436',
      border: 'rgba(77, 97, 252, 0.12)',
      borderStrong: 'rgba(255, 255, 255, 0.08)',
      text: '#f0f2fa',
      textMuted: '#8b92a8',
      brand: '#4d61fc',
      brandGlow: 'rgba(77, 97, 252, 0.45)',
      brandDim: 'rgba(77, 97, 252, 0.14)',
      accent: '#4d61fc',
      accentSoft: '#3d52e6',
      critical: '#ff4d4d',
      warning: '#ff9933',
      info: '#33cc33',
      passed: '#33cc33',
      shadow: 'rgba(0, 0, 0, 0.55)',
    },
    fonts: {
      sans: '"DM Sans", "Segoe UI", system-ui, sans-serif',
      mono: '"JetBrains Mono", "IBM Plex Mono", monospace',
    },
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '32px',
      8: '40px',
    },
    radii: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      pill: '999px',
    },
    fontSizes: {
      1: '0.75rem',
      2: '0.875rem',
      3: '1rem',
      4: '1.125rem',
      5: '1.35rem',
      6: '1.75rem',
    },
  },
  media: {
    xl: '(max-width: 1320px)',
    lg: '(max-width: 1180px)',
    md: '(max-width: 980px)',
    sm: '(max-width: 820px)',
    xs: '(max-width: 600px)',
  },
});

const drift = keyframes({
  '0%': { transform: 'translate3d(0, 0, 0)' },
  '50%': { transform: 'translate3d(0, -10px, 0)' },
  '100%': { transform: 'translate3d(0, 0, 0)' },
});

export const pulse = keyframes({
  '0%': { boxShadow: '0 0 0 0 rgba(77, 97, 252, 0.35)' },
  '70%': { boxShadow: '0 0 0 16px rgba(77, 97, 252, 0)' },
  '100%': { boxShadow: '0 0 0 0 rgba(77, 97, 252, 0)' },
});

export const tickerMarquee = keyframes({
  '0%': { transform: 'translateX(0)' },
  '100%': { transform: 'translateX(-50%)' },
});

export const globalStyles = globalCss({
  '@import':
    'url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap")',
  '*': {
    boxSizing: 'border-box',
  },
  html: {
    colorScheme: 'dark',
    height: '100%',
    overflow: 'hidden',
  },
  body: {
    margin: 0,
    height: '100%',
    overflow: 'hidden',
    fontFamily: '$sans',
    color: '$text',
    background:
      'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(77, 97, 252, 0.16), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(77, 97, 252, 0.08), transparent), linear-gradient(180deg, $bg 0%, #06070d 100%)',
  },
  button: {
    fontFamily: 'inherit',
  },
  input: {
    fontFamily: 'inherit',
  },
  '#root': {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
});

export const FloatOrb = styled('div', {
  position: 'absolute',
  inset: 'auto auto 8% 6%',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(77, 97, 252, 0.12), transparent 65%)',
  filter: 'blur(20px)',
  animation: `${drift} 10s ease-in-out infinite`,
  pointerEvents: 'none',
});

export { styled, theme };
