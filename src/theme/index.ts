export const theme = {
  colors: {
    background: '#F7F7F9', // Very light grey/white
    primary: '#6B4EFF', // Vibrant purple
    primarySoft: '#F3EFFF', // Soft purple background
    success: '#FFC857', // Matching the yellow/gold from the screenshot for coins
    successSoft: '#FFF5E5', // Soft yellow
    error: '#9CA3AF', // Soft neutral grey instead of harsh red
    errorSoft: '#F3F4F6', // Light neutral grey
    neutralGrey: '#E5E7EB',
    accent: '#FFC857',
    text: '#111827', // Almost black
    secondaryText: '#6B7280',
    white: '#FFFFFF',
    border: '#F3F4F6', // Softer border
  },
  typography: {
    fontFamily: 'System', // Use system font for clean sans-serif look
    heading: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: '#111827',
      lineHeight: 32,
      letterSpacing: -0.5,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const, // Regular
      color: '#374151',
      lineHeight: 24,
    },
    button: {
      fontSize: 16,
      fontWeight: '500' as const, // Medium
      color: '#FFFFFF',
      lineHeight: 22,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      color: '#6B7280',
      lineHeight: 20,
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
      shadowColor: '#6B4EFF', // Tinted shadow
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.04,
      shadowRadius: 24,
      elevation: 2,
    },
    glow: {
      shadowColor: '#6B4EFF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 4,
    }
  },
  layout: {
    minTouchTarget: 48, // slightly reduced from 56 for smaller screens
  },
};
