import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, RISK_LEVELS, FONTS, RADIUS } from '../theme';
import Icon from './LucideIcon';

const RISK_CONFIG = {
  secheresse: { icon: 'Sun',      label: 'Sécheresse' },
  inondation: { icon: 'Droplets', label: 'Inondation'  },
  criquets:   { icon: 'Bug',      label: 'Criquets'    },
};

const TREND_CONFIG = {
  up:     { icon: 'TrendingUp',   color: COLORS.danger  },
  down:   { icon: 'TrendingDown', color: COLORS.success },
  stable: { icon: 'Minus',        color: COLORS.textMuted },
};

function AnimatedBar({ score, color, delay = 0 }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(anim, { toValue: score, duration: 700, useNativeDriver: false }).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, [score]);
  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.barTrack}>
      <Animated.View style={[styles.barFill, { width, backgroundColor: color }]} />
    </View>
  );
}

export default function RiskRow({ type, level, score, trend, delay = 0 }) {
  const risk = RISK_LEVELS[level] || RISK_LEVELS.faible;
  const cfg  = RISK_CONFIG[type]  || { icon: 'AlertTriangle', label: type };
  const trnd = TREND_CONFIG[trend] || TREND_CONFIG.stable;

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: risk.bg }]}>
        <Icon name={cfg.icon} size={14} color={risk.color} strokeWidth={2} />
      </View>
      <Text style={styles.label}>{cfg.label}</Text>
      <View style={styles.barArea}>
        <AnimatedBar score={score} color={risk.color} delay={delay} />
      </View>
      <Text style={[styles.score, { color: risk.color }]}>{score}%</Text>
      <View style={styles.trend}>
        <Icon name={trnd.icon} size={13} color={trnd.color} strokeWidth={2} />
      </View>
      <View style={[styles.badge, { backgroundColor: risk.bg, borderColor: risk.border }]}>
        <Text style={[styles.badgeText, { color: risk.color }]}>{risk.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    width: 90,
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  barArea: { flex: 1 },
  barTrack: {
    height: 5,
    backgroundColor: COLORS.bgTertiary,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  barFill: {
    height: 5,
    borderRadius: RADIUS.full,
  },
  score: {
    width: 34,
    fontSize: 12,
    fontFamily: FONTS.bold,
    textAlign: 'right',
  },
  trend: { width: 18, alignItems: 'center' },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FONTS.semibold,
  },
});
