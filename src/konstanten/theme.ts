/**
 * Dreamz App - Theme Constants
 * Zentrale Design-Tokens für konsistentes UI
 */

export const BORDER_RADIUS = {
  // Standard-Rundung für Cards, Inputs, Buttons
  default: 20,

  // Kleine Elemente (Badges, Tags, Icons)
  small: 12,

  // Extra kleine Elemente (Progress Bars, Dividers)
  tiny: 6,

  // Runde Elemente (Avatar, Icon Buttons)
  round: 100,
} as const;

export const COLORS = {
  primary: '#004aad',
  primaryLight: '#5de0e6',

  background: {
    dark: '#0f0c29',
    medium: '#302b63',
    light: '#24243e',
  },

  overlay: {
    dark: 'rgba(10, 15, 18, 0.9)',
    medium: 'rgba(10, 15, 18, 0.7)',
    light: 'rgba(10, 15, 18, 0.5)',
  },

  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
  },

  border: {
    primary: 'rgba(93, 224, 230, 0.5)',
    secondary: 'rgba(93, 224, 230, 0.3)',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const SHADOWS = {
  default: {
    shadowColor: '#5de0e6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 20,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
} as const;
