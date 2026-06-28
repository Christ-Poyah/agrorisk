import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, RISK_LEVELS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import Icon from './LucideIcon';

export default function PlantationCard({ plantation, onPress }) {
  const risk = RISK_LEVELS[plantation.riskLevel] || RISK_LEVELS.faible;
  const lastScan = new Date(plantation.lastScan);
  const diffH = Math.round((new Date() - lastScan) / 3600000);
  const scanLabel = diffH < 1 ? '< 1h' : diffH < 24 ? `${diffH}h` : `${Math.floor(diffH / 24)}j`;

  const RISK_ICONS = { secheresse: 'Sun', inondation: 'Droplets', criquets: 'Bug' };

  return (
    <TouchableOpacity style={[styles.card, SHADOW.sm]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.top}>
        {plantation.cropImage ? (
          <Image source={plantation.cropImage} style={styles.cropDot} resizeMode="cover" />
        ) : (
          <View style={[styles.cropDotIcon, { backgroundColor: plantation.cropColor + '20', borderColor: plantation.cropColor + '40' }]}>
            <Icon name="Leaf" size={16} color={plantation.cropColor} strokeWidth={2} />
          </View>
        )}
        <View style={styles.topInfo}>
          <Text style={styles.name}>{plantation.name}</Text>
          <View style={styles.meta}>
            <Icon name="MapPin" size={11} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{plantation.region}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>{plantation.cropLabel}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>{plantation.area} ha</Text>
          </View>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: risk.bg, borderColor: risk.border }]}>
          <Text style={[styles.riskText, { color: risk.color }]}>{risk.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.risks}>
        {Object.entries(plantation.risks).map(([key, val]) => {
          const r = RISK_LEVELS[val.level] || RISK_LEVELS.faible;
          return (
            <View key={key} style={styles.miniRisk}>
              <Icon name={RISK_ICONS[key]} size={12} color={COLORS.textMuted} />
              <View style={styles.miniTrack}>
                <View style={[styles.miniFill, { width: `${val.score}%`, backgroundColor: r.color }]} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Icon name="Satellite" size={11} color={COLORS.textMuted} />
          <Text style={styles.footerText}>Scan {scanLabel}</Text>
        </View>
        {plantation.insurance.active ? (
          <View style={styles.insuredBadge}>
            <Icon name="ShieldCheck" size={11} color={COLORS.success} />
            <Text style={[styles.insuredText, { color: COLORS.success }]}>Assuré</Text>
          </View>
        ) : (
          <View style={styles.insuredBadge}>
            <Icon name="Shield" size={11} color={COLORS.textMuted} />
            <Text style={[styles.insuredText, { color: COLORS.textMuted }]}>Non assuré</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cropDot: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  cropDotIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topInfo: { flex: 1 },
  name: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  metaText: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  dot: { fontSize: 11, color: COLORS.textMuted },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  riskText: { fontSize: 11, fontFamily: FONTS.semibold },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  risks: { flexDirection: 'row', gap: 8, marginBottom: SPACING.sm },
  miniRisk: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  miniTrack: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.bgTertiary,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  miniFill: { height: 3, borderRadius: RADIUS.full },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  insuredBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  insuredText: { fontSize: 11, fontFamily: FONTS.medium },
});
