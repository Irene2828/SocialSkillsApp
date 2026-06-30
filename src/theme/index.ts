export const theme = {
  colors: {
    background: '#F0F1F3', // Light silver grey
    primary: '#BEF264', // Soft pastel lime green
    primarySoft: '#ECFCCB', // Very soft lime background
    success: '#FFC857', // Matching the yellow/gold from the screenshot for coins
    successSoft: '#FFF5E5', // Soft yellow
    error: '#9CA3AF', // Soft neutral grey instead of harsh red
    errorSoft: '#F3F4F6', // Light neutral grey
    neutralGrey: '#E5E7EB',
    accent: '#FFC857',
    stroke: '#D1D5DB', // Grey for card borders
    text: '#111827', // Almost black
    secondaryText: '#6B7280',
    white: '#FFFFFF',
    border: '#F3F4F6', // Softer border
  },
  typography: {
    fontFamily: 'System', // Use system font for clean sans-serif look

    // Large screen headlines — tight tracking like SF Pro Display
    heading: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: '#111827',
      lineHeight: 32,
      letterSpacing: -0.5,
    },

    // Section labels, card titles — slightly open like SF Pro Text
    label: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: '#6B7280',
      lineHeight: 18,
      letterSpacing: 0.6, // Apple uses ~0.6 for small all-caps labels
      textTransform: 'uppercase' as const,
    },

    // Body text — neutral, slightly open for legibility
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#374151',
      lineHeight: 24,
      letterSpacing: 0.1,
    },

    // CTA / button text — slightly wider for impact and clarity
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#111827',
      lineHeight: 22,
      letterSpacing: 0.2,
    },

    // Small supporting text / hints
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      color: '#6B7280',
      lineHeight: 20,
      letterSpacing: 0.15,
    },

    // Tab labels, nav items — tight but readable
    tab: {
      fontSize: 12,
      fontWeight: '500' as const,
      color: '#6B7280',
      lineHeight: 16,
      letterSpacing: 0.1,
    },
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 16,
    md: 24, // Increased for pill-like cards
    lg: 32, // Increased for main containers
    xl: 40,
    full: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#9CA3AF', // Neutral shadow
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 1,
    },
    glow: {
      shadowColor: '#9CA3AF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 2,
    }
  },
  layout: {
    minTouchTarget: 48,
  },
};
