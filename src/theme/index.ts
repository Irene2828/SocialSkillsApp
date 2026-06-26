export const theme = {
  colors: {
    background: '#E0F2FE', // Light sky blue
    primary: '#7A437A', // Matched to the plum footer color
    primarySoft: '#EDE9FE', // Soft lavender
    success: '#8B5CF6', // Soft lavender/periwinkle highlight instead of harsh green
    successSoft: '#F5F3FF', // Very light lavender
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
    fontFamily: 'Inter',
    heading: {
      fontSize: 24,
      fontWeight: '600' as const, // SemiBold
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
    md: 24,
    lg: 32,
    xl: 40,
    full: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#111827',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 24,
      elevation: 2,
    },
    glow: {
      shadowColor: '#4C1D95',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 4,
    }
  },
  layout: {
    minTouchTarget: 48, // slightly reduced from 56 for smaller screens
  },
};
