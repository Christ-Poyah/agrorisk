export const COLORS = {
  // Backgrounds — légère teinte verte pour la cohésion avec le logo
  bgPrimary:   '#FFFFFF',
  bgSecondary: '#F7FAF7',
  bgTertiary:  '#EFF5F0',

  // Bordures — teintées vert
  border:       '#DDE8E1',
  borderStrong: '#C2D5C9',

  // Texte — noir chaud avec légère teinte verte
  text:          '#0F1A12',
  textSecondary: '#445A4C',
  textMuted:     '#8A9E92',

  // Marque — couleurs exactes du logo AgroRisk
  brand:            '#1A5C2A',   // vert forêt foncé (logo "Agro")
  brandMedium:      '#2C7D3E',
  brandLight:       '#5CB83C',   // vert lime vif (logo "Risk") — aussi: smart contract / blockchain
  brandBg:          '#EFF8F1',
  brandBorder:      '#BDD9C7',
  brandLightBg:     '#F1FAE8',
  brandLightBorder: '#C8E9A8',

  // Succès = même famille que la marque (une teinte de moins)
  success:       '#1A5C2A',
  successBg:     '#EFF8F1',
  successBorder: '#BDD9C7',

  // Warning — amber terreux (sécheresse / chaleur)
  warning:       '#B45309',
  warningBg:     '#FEF8EB',
  warningBorder: '#F5D49A',

  // Danger — rouge profond (risque élevé, alertes critiques)
  danger:       '#B91C1C',
  dangerBg:     '#FEF2F2',
  dangerBorder: '#FBCFCC',

  // Info — bleu ciel (inondation uniquement — eau = bleu, trop intuitif)
  info:       '#0369A1',
  infoBg:     '#EFF7FF',
  infoBorder: '#BAD8F0',

  // Critique — cramoisi profond (remplace le violet, beaucoup plus agricole/naturel)
  critical:       '#7F1D1D',
  criticalBg:     '#FFF0F0',
  criticalBorder: '#F9C4C4',

  primary: '#1A5C2A',
};

export const RISK_LEVELS = {
  faible:   { color: '#1A5C2A', bg: '#EFF8F1', border: '#BDD9C7', label: 'Faible'   },
  modere:   { color: '#B45309', bg: '#FEF8EB', border: '#F5D49A', label: 'Modéré'   },
  eleve:    { color: '#B91C1C', bg: '#FEF2F2', border: '#FBCFCC', label: 'Élevé'    },
  critique: { color: '#7F1D1D', bg: '#FFF0F0', border: '#F9C4C4', label: 'Critique' },
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
