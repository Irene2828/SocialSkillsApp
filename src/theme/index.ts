export const theme = {
  colors: {
    background: '#FAFAF8',
    primary: '#4C1D95', // Deeper darker purple
    success: '#7C8CF8', // Soft purple
    successSoft: '#EDEBFF',
    neutralGrey: '#E5E7EB',
    accent: '#FFC857',
    text: '#222222',
    secondaryText: '#6B7280',
    white: '#FFFFFF',
    border: '#E5E7EB',
  },
  typography: {
    fontFamily: 'Inter',
    heading: {
      fontSize: 24,
      fontWeight: '600' as const, // SemiBold
      color: '#222222',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const, // Regular
      color: '#222222',
    },
    button: {
      fontSize: 16,
      fontWeight: '500' as const, // Medium
      color: '#FFFFFF',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      color: '#6B7280',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 12,
    md: 20,
    lg: 24,
    full: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
  },
  layout: {
    minTouchTarget: 44,
  },
};
