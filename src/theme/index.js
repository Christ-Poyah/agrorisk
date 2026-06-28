export const COLORS = {
  bgPrimary: '#FFFFFF',
  bgSecondary: '#FAFAF9',
  bgTertiary: '#F4F4F2',

  border: '#E8E8E5',
  borderStrong: '#D1D1CE',

  text: '#18181A',
  textSecondary: '#52525C',
  textMuted: '#A0A0AB',

  brand: '#16613A',
  brandMedium: '#1E8048',
  brandBg: '#F0F8F4',
  brandBorder: '#C2E5D0',

  success: '#16A34A',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',

  warning: '#D97706',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',

  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',

  purple: '#7C3AED',
  purpleBg: '#F5F3FF',
  purpleBorder: '#DDD6FE',

  primary: '#16613A',
};

export const RISK_LEVELS = {
  faible:   { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', label: 'Faible'   },
  modere:   { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Modéré'   },
  eleve:    { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Élevé'    },
  critique: { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', label: 'Critique' },
};

export const RISK_ICONS = {
  secheresse: 'Sun',
  inondation: 'Droplets',
  criquets:   'Bug',
};

export const FONTS = {
  regular:  'Inter_400Regular',
  medium:   'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold:     'Inter_700Bold',
};

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
};

export const RADIUS = {
  sm: 6, md: 10, lg: 14, full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
};
