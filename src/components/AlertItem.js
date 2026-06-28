import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import Icon from './LucideIcon';

const SEV = {
  critique: { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: 'AlertTriangle' },
  eleve:    { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: 'AlertTriangle' },
  modere:   { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: 'AlertTriangle' },
  info:     { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: 'Info' },
};

const TYPE_ICONS = {
  criquets:   'Bug',
  inondation: 'Droplets',
  secheresse: 'Sun',
  meteo:      'CloudSun',
  satellite:  'Satellite',
};

export default function AlertItem({ alert, onPress }) {
  const sev  = SEV[alert.severity] || SEV.info;
  const date = new Date(alert.timestamp);
  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: sev.color }, !alert.read && styles.unread]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={[styles.typeIcon, { backgroundColor: sev.bg }]}>
          <Icon name={TYPE_ICONS[alert.type] || 'AlertTriangle'} size={14} color={sev.color} strokeWidth={2} />
        </View>
        <Text style={[styles.severity, { color: sev.color }]}>{alert.severity.toUpperCase()}</Text>
        {!alert.read && <View style={[styles.unreadDot, { backgroundColor: sev.color }]} />}
        <Text style={styles.time}>{dateStr} · {timeStr}</Text>
      </View>

      <Text style={styles.title}>{alert.title}</Text>
      <Text style={styles.message} numberOfLines={2}>{alert.message}</Text>

      <View style={styles.footer}>
        <View style={styles.region}>
          <Icon name="MapPin" size={11} color={COLORS.textMuted} />
          <Text style={styles.regionText}>{alert.region}</Text>
        </View>
        {alert.smartContractTriggered && (
          <View style={[styles.chip, { backgroundColor: COLORS.purpleBg, borderColor: COLORS.purpleBorder }]}>
            <Icon name="Zap" size={11} color={COLORS.purple} />
            <Text style={[styles.chipText, { color: COLORS.purple }]}>Smart Contract déclenché</Text>
          </View>
        )}
        {alert.actionRequired && !alert.smartContractTriggered && (
          <View style={[styles.chip, { backgroundColor: COLORS.warningBg, borderColor: COLORS.warningBorder }]}>
            <Text style={[styles.chipText, { color: COLORS.warning }]}>Action requise</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unread: { backgroundColor: '#FCFCFB' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severity: { fontSize: 10, fontFamily: FONTS.bold, letterSpacing: 0.5 },
  unreadDot: { width: 6, height: 6, borderRadius: 3 },
  time: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular, marginLeft: 'auto' },
  title: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text, marginBottom: 3 },
  message: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 18 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  region: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  regionText: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipText: { fontSize: 11, fontFamily: FONTS.medium },
});
