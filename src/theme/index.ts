// Instrument Sans — premium geometric sans-serif, narrow and elegant, close to Inter but more upscale.
export const FONTS = {
  regular: 'InstrumentSans_400Regular',
  regularItalic: 'InstrumentSans_400Regular_Italic',
  medium: 'InstrumentSans_500Medium',
  semiBold: 'InstrumentSans_600SemiBold',
  bold: 'InstrumentSans_700Bold',
};

export const theme = {
  colors: {
    background: '#F0F1F3',
    primary: '#BEF264',
    primarySoft: '#ECFCCB',
    success: '#FFC857',
    successSoft: '#FFF5E5',
    error: '#9CA3AF',
    errorSoft: '#F3F4F6',
    neutralGrey: '#E5E7EB',
    accent: '#FFC857',
    stroke: '#D1D5DB',
    text: '#111827',
    secondaryText: '#6B7280',
    white: '#FFFFFF',
    border: '#F3F4F6',
  },
  typography: {
    // Large display headlines — tight tracking like SF Pro Display
    heading: {
      fontFamily: FONTS.semiBold,
      fontSize: 24,
      fontWeight: '600' as const,
      color: '#111827',
      lineHeight: 32,
      letterSpacing: -0.5,
    },

    // Section labels — all-caps small labels like Apple HIG
    label: {
      fontFamily: FONTS.semiBold,
      fontSize: 13,
      fontWeight: '600' as const,
      color: '#6B7280',
      lineHeight: 18,
      letterSpacing: 0.6,
      textTransform: 'uppercase' as const,
    },

    // Body text — neutral, legible
    body: {
      fontFamily: FONTS.regular,
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#374151',
      lineHeight: 24,
      letterSpacing: 0.1,
    },

    // Button / CTA text — semi-bold for authority
    button: {
      fontFamily: FONTS.medium,
      fontSize: 16,
      fontWeight: '500' as const,
      color: '#111827',
      lineHeight: 22,
      letterSpacing: 0.2,
    },

    // Captions and hints
    caption: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      fontWeight: '400' as const,
      color: '#6B7280',
      lineHeight: 20,
      letterSpacing: 0.15,
    },

    // Tab bar labels
    tab: {
      fontFamily: FONTS.medium,
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
    md: 24,
    lg: 32,
    xl: 40,
    full: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#9CA3AF',
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
