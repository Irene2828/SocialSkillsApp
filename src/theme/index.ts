// DM Sans — warm premium sans: friendly for kids, polished enough for an Apple-grade tool.
export const FONTS = {
  regular: 'DMSans_400Regular',
  regularItalic: 'DMSans_400Regular_Italic',
  medium: 'DMSans_500Medium',
  semiBold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
};

export const theme = {
  colors: {
    background: '#00CED1',
    primary: '#BEF264',
    primarySoft: '#ECFCCB',
    success: '#BEF264',
    successSoft: '#ECFCCB',
    successGreenSoft: '#E4F8E5',
    danger: '#EF8B8B',       // muted dusty-rose — signals destructive without alarming kids
    dangerSoft: '#FEE2E2',   // light red background for danger zones
    error: '#9CA3AF',
    errorSoft: '#EEF2F7',
    neutralGrey: 'rgba(255, 255, 255, 0.14)',
    accent: '#FFC857',
    stroke: 'rgba(255, 255, 255, 0.18)',
    text: '#FFFFFF',
    secondaryText: 'rgba(255, 255, 255, 0.68)',
    white: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.14)',
  },
  typography: {
    // Large display headlines
    heading: {
      fontFamily: FONTS.medium,
      fontSize: 24,
      fontWeight: '500' as const,
      color: '#FFFFFF',
      lineHeight: 32,
      letterSpacing: 0,
    },

    // Hero display text
    display: {
      fontFamily: FONTS.medium,
      fontSize: 42,
      fontWeight: '500' as const,
      color: '#FFFFFF',
      lineHeight: 52,
      letterSpacing: 0,
    },

    // Subheading text
    subheading: {
      fontFamily: FONTS.medium,
      fontSize: 20,
      fontWeight: '500' as const,
      color: '#FFFFFF',
      lineHeight: 28,
      letterSpacing: 0,
    },



    // Section labels — all-caps small labels like Apple HIG
    label: {
      fontFamily: FONTS.semiBold,
      fontSize: 13,
      fontWeight: '600' as const,
      color: 'rgba(255, 255, 255, 0.68)',
      lineHeight: 18,
      letterSpacing: 0,
      textTransform: 'uppercase' as const,
    },

    // Body text — neutral, legible
    body: {
      fontFamily: FONTS.regular,
      fontSize: 16,
      fontWeight: '400' as const,
      color: 'rgba(255, 255, 255, 0.82)',
      lineHeight: 24,
      letterSpacing: 0,
    },

    // Button / CTA text — semi-bold for authority
    button: {
      fontFamily: FONTS.semiBold,
      fontSize: 13.5,
      fontWeight: '600' as const,
      color: '#2A1E5C',
      lineHeight: 24,
      letterSpacing: 0,
    },

    // Captions and hints
    caption: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      fontWeight: '400' as const,
      color: 'rgba(255, 255, 255, 0.68)',
      lineHeight: 20,
      letterSpacing: 0,
    },

    // Tab bar labels
    tab: {
      fontFamily: FONTS.medium,
      fontSize: 12,
      fontWeight: '500' as const,
      color: 'rgba(255, 255, 255, 0.68)',
      lineHeight: 16,
      letterSpacing: 0,
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
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.07,
      shadowRadius: 24,
      elevation: 1,
    },
    glow: {
      shadowColor: '#38BDF8',
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
