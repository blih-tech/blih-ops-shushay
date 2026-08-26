---
version: alpha
name: BlihOps
description: A calm, editorial operations interface where disciplined structure communicates
  trust. White and soft-neutral surfaces carry most of the page; a focused blue marks
  action and live operational signals. Source Serif 4 adds authority to headings,
  while Inter and JetBrains Mono keep the system practical and technical. Hairline
  grids, compact radii, restrained depth, and purposeful motion make intelligent outsourcing
  feel measurable rather than abstract.
colors:
  primary: '#3B82F6'
  primary-foreground: '#FFFFFF'
  foreground: '#333333'
  body: '#4B5563'
  muted-foreground: '#6B7280'
  background: '#FFFFFF'
  card: '#FFFFFF'
  muted: '#F9FAFB'
  secondary: '#F3F4F6'
  border: '#E5E7EB'
  accent: '#E0F2FE'
  accent-foreground: '#1E3A8A'
  destructive: '#EF4444'
  dark-background: '#171717'
  dark-card: '#262626'
  dark-foreground: '#E5E5E5'
  dark-muted: '#1F1F1F'
  dark-muted-foreground: '#A3A3A3'
  dark-border: '#404040'
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  on-secondary: '#ffffff'
  secondary-container: '#dee0e2'
  on-secondary-container: '#606365'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e2e4'
  secondary-fixed-dim: '#c5c6c8'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
  body-text: '#4B5563'
  accent-blue-soft: '#E0F2FE'
  accent-blue-deep: '#1E3A8A'
  dark-surface: '#171717'
typography:
  display-hero:
    fontFamily: '''Source Serif 4'', Georgia, serif'
    fontSize: 60px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -1.5px
  display-section:
    fontFamily: '''Source Serif 4'', Georgia, serif'
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -1.2px
  heading-card:
    fontFamily: '''Source Serif 4'', Georgia, serif'
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.2px
  body-lg:
    fontFamily: Inter, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0
  body-md:
    fontFamily: Inter, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0
  body-sm:
    fontFamily: Inter, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0
  label:
    fontFamily: Inter, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 1.2px
  technical:
    fontFamily: '''JetBrains Mono'', monospace'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.6px
  button:
    fontFamily: Inter, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
rounded:
  none: 0px
  sm: 3.6px
  md: 4.8px
  lg: 6px
  xl: 8.4px
  2xl: 10.8px
  3xl: 13.2px
  full: 9999px
  DEFAULT: 0.25rem
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  section-mobile: 64px
  section-desktop: 96px
motion:
  ease-out: cubic-bezier(0.22, 1, 0.36, 1)
  ease-snappy: cubic-bezier(0.16, 1, 0.3, 1)
  micro: 180ms
  interactive: 300ms
  entrance: 450ms
  entrance-long: 550ms
  numeric: 900ms
  stagger: 80ms
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    typography: '{typography.button}'
    rounded: '{rounded.md}'
    height: 40px
    padding: 0 {spacing.base}
  button-outline:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    typography: '{typography.button}'
    rounded: '{rounded.md}'
    height: 40px
    padding: 0 {spacing.base}
  eyebrow-label:
    textColor: '{colors.muted-foreground}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
  section-heading:
    textColor: '{colors.foreground}'
    typography: '{typography.display-section}'
  section-intro:
    textColor: '{colors.muted-foreground}'
    typography: '{typography.body-md}'
  structural-panel:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    rounded: '{rounded.none}'
  operational-card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    rounded: '{rounded.xl}'
    padding: '{spacing.lg}'
  status-badge:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.muted-foreground}'
    borderColor: '{colors.border}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
  metric-card:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  image-cta-panel:
    backgroundColor: '{colors.dark-background}'
    textColor: '{colors.primary-foreground}'
    borderColor: '{colors.border}'
    rounded: '{rounded.2xl}'
  form-control:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    height: 40px
---

