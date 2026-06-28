import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RISK_LEVELS, RADIUS, SHADOW } from '../theme';

export default function RiskCard({ type, level, score, trend, compact = false }) {
  const risk = RISK_LEVELS[level] || RISK_LEVELS.faible;

  const typeConfig = {
    secheresse: { emoji: '☀️', label: 'Sécheresse' },
    inondation: { emoji: '🌊', label: 'Inondation' },
    criquets: { emoji: '🦗', label: 'Criquets' },
  };

  const cfg = typeConfig[type] || { emoji: '⚠️', label: type };
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor = trend === 'up' ? COLORS.danger : trend === 'down' ? COLORS.success : COLORS.textMuted;

  if (compact) {
    return (
      <View style={[styles.compact, { backgroundColor: risk.bg, borderColor: risk.color + '40' }]}>
        <Text style={styles.compactEmoji}>{cfg.emoji}</Text>
        <Text style={[styles.compactLabel, { color: risk.color }]}>{risk.label}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, SHADOW.sm]}>
      <View style={[styles.iconCircle, { backgroundColor: risk.bg }]}>
        <Text style={styles.emoji}>{cfg.emoji}</Text>
      </View>
      <Text style={styles.typeLabel}>{cfg.label}</Text>
      <View style={styles.scoreRow}>
        <Text style={[styles.score, { color: risk.color }]}>{score}%</Text>
        <Text style={[styles.trend, { color: trendColor }]}>{trendIcon}</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${score}%`, backgroundColor: risk.color }]} />
      </View>
      <Text style={[styles.levelLabel, { color: risk.color }]}>{risk.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emoji: { fontSize: 22 },
  typeLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
  },
  trend: {
    fontSize: 14,
    fontWeight: '700',
  },
  barBg: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: 4,
  },
  compactEmoji: { fontSize: 12 },
  compactLabel: { fontSize: 11, fontWeight: '600' },
});
