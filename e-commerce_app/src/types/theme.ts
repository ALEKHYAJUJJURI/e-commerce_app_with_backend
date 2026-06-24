// ─── ShopEase Design System ────────────────────────────────────────────────
// Inspired by: Nike App clarity, Myntra warmth, Nykaa femininity, Shopify
// Palette: Deep Indigo primary, Warm White surface, Coral accent, Slate text
// Signature: Bold full-bleed hero cards with bottom-pinned CTAs

export const Colors = {
  // Brand
  primary:        "#1A1A2E",  // Deep midnight navy — authority
  primaryLight:   "#16213E",
  primaryDark:    "#0F172A",
  accent:         "#E94560",  // Coral-red — energy, CTA
  accentDark:     "#C73652",  // Darker coral for gradient end
  accentSoft:     "#FDEDF0",

  // Indigo tints (chips, pills, badges)
  indigo:         "#4F46E5",
  indigoLight:    "#EEF2FF",
  indigoDark:     "#3730A3",

  // Greens
  success:        "#059669",
  successLight:   "#ECFDF5",

  // Neutrals
  ink:            "#0F172A",   // Body text
  inkMid:         "#475569",   // Secondary text
  inkLight:       "#94A3B8",   // Placeholder, captions
  border:         "#E2E8F0",
  borderFocus:    "#A5B4FC",
  surface:        "#FFFFFF",
  surfaceAlt:     "#F8FAFC",
  surfaceDim:     "#F1F5F9",

  // States
  warning:        "#F59E0B",
  warningLight:   "#FFFBEB",
  danger:         "#DC2626",
  dangerLight:    "#FEF2F2",
  blocked:        "#DC2626",
  active:         "#059669",

  white:          "#FFFFFF",
  black:          "#000000",
  transparent:    "transparent",
};

export const Typography = {
  // Display — used for hero headings only
  displayXL: { fontSize: 36, fontWeight: "800" as const, letterSpacing: -0.5 },
  displayL:  { fontSize: 28, fontWeight: "800" as const, letterSpacing: -0.3 },

  // Headings
  h1: { fontSize: 24, fontWeight: "700" as const },
  h2: { fontSize: 20, fontWeight: "700" as const },
  h3: { fontSize: 18, fontWeight: "600" as const },
  h4: { fontSize: 16, fontWeight: "600" as const },

  // Body
  bodyL:  { fontSize: 16, fontWeight: "400" as const, lineHeight: 26 },
  bodyM:  { fontSize: 15, fontWeight: "400" as const, lineHeight: 24 },
  bodyS:  { fontSize: 13, fontWeight: "400" as const, lineHeight: 20 },

  // Labels / UI
  labelL: { fontSize: 15, fontWeight: "600" as const },
  labelM: { fontSize: 13, fontWeight: "600" as const },
  labelS: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.5 },

  // Captions
  caption: { fontSize: 12, fontWeight: "400" as const },
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
};

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};