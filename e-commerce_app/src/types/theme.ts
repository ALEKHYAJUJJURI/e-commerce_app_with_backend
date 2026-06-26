// ─── ShopEase Premium Design System v2 ────────────────────────────────────
// Palette: Deep Midnight primary · Coral-Red accent · Indigo chips · Warm surfaces
// Signature: Liquid shimmer cards + staggered entrance animations

export const Colors = {
  // Brand
  primary:        "#1A1A2E",
  primaryLight:   "#16213E",
  primaryDark:    "#0F172A",
  accent:         "#E94560",
  accentDark:     "#C73652",
  accentSoft:     "#FDEDF0",
  accentGlow:     "rgba(233, 69, 96, 0.25)",

  // Indigo
  indigo:         "#4F46E5",
  indigoLight:    "#EEF2FF",
  indigoDark:     "#3730A3",
  indigoGlow:     "rgba(79, 70, 229, 0.15)",

  // Emerald
  success:        "#059669",
  successLight:   "#ECFDF5",
  successGlow:    "rgba(5, 150, 105, 0.15)",

  // Neutrals
  ink:            "#0F172A",
  inkMid:         "#475569",
  inkLight:       "#94A3B8",
  border:         "#E2E8F0",
  borderFocus:    "#A5B4FC",
  surface:        "#FFFFFF",
  surfaceAlt:     "#F8FAFC",
  surfaceDim:     "#F1F5F9",

  // Glass
  glass:          "rgba(255,255,255,0.08)",
  glassBorder:    "rgba(255,255,255,0.15)",
  glassDark:      "rgba(15,23,42,0.6)",

  // States
  warning:        "#F59E0B",
  warningLight:   "#FFFBEB",
  danger:         "#DC2626",
  dangerLight:    "#FEF2F2",

  // Gradients (array form for LinearGradient)
  gradientHero:   ["#1A1A2E", "#0F172A"] as const,
  gradientAccent: ["#E94560", "#C73652"] as const,
  gradientIndigo: ["#4F46E5", "#3730A3"] as const,
  gradientCard:   ["rgba(255,255,255,0)", "rgba(15,23,42,0.7)"] as const,
  gradientSurface:["#FFFFFF", "#F8FAFC"] as const,

  white:          "#FFFFFF",
  black:          "#000000",
  transparent:    "transparent",
};

export const Typography = {
  displayXL: { fontSize: 38, fontWeight: "800" as const, letterSpacing: -1 },
  displayL:  { fontSize: 30, fontWeight: "800" as const, letterSpacing: -0.5 },
  displayM:  { fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.3 },

  h1: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.2 },
  h2: { fontSize: 20, fontWeight: "700" as const, letterSpacing: -0.1 },
  h3: { fontSize: 18, fontWeight: "600" as const },
  h4: { fontSize: 16, fontWeight: "600" as const },

  bodyL:  { fontSize: 16, fontWeight: "400" as const, lineHeight: 26 },
  bodyM:  { fontSize: 15, fontWeight: "400" as const, lineHeight: 24 },
  bodyS:  { fontSize: 13, fontWeight: "400" as const, lineHeight: 20 },

  labelXL: { fontSize: 17, fontWeight: "700" as const, letterSpacing: 0.1 },
  labelL:  { fontSize: 15, fontWeight: "700" as const },
  labelM:  { fontSize: 13, fontWeight: "600" as const },
  labelS:  { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.5 },
  labelXS: { fontSize: 10, fontWeight: "700" as const, letterSpacing: 0.6 },

  caption: { fontSize: 12, fontWeight: "400" as const },
  micro:   { fontSize: 10, fontWeight: "400" as const },
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
  mega: 48,
};

export const Radius = {
  xs:   6,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  xxxl: 36,
  full: 9999,
};

export const Shadow = {
  xs: {
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 5,
  },
  lg: {
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
  xl: {
    shadowColor: "#E94560",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 12,
  },
  accent: {
    shadowColor: "#E94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Animation = {
  fast:    150,
  normal:  250,
  slow:    400,
  spring:  { tension: 100, friction: 12 },
  bounce:  { tension: 120, friction: 8 },
};