/**
 * Application Spacing, Radius, and Typography metrics
 * Following an 8-point standard grid system for React Native.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const typography = {
  heading1: { fontSize: 26, fontWeight: '700' as const, lineHeight: 34 },
  heading2: { fontSize: 20, fontWeight: '700' as const, lineHeight: 28 },
  heading3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
};
