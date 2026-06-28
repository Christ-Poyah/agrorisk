import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import { useApp } from '../context/AppContext';
import AlertItem from '../components/AlertItem';
import Icon from '../components/LucideIcon';

const FILTERS = [
  { key: 'all',      label: 'Toutes'  },
  { key: 'critique', label: 'Critique' },
  { key: 'eleve',    label: 'Élevé'   },
  { key: 'modere',   label: 'Modéré'  },
  { key: 'info',     label: 'Info'    },
];

export default function AlertsScreen() {
  const { alerts, markAlertRead, unreadCount } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a => filter === 'all' || a.severity === filter);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertes</Text>
          <Text style={styles.sub}>Surveillance IA en temps réel</Text>
        </View>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount} non lues</Text>
          </View>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, filter === f.key && styles.chipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.some(a => !a.read) && (
        <TouchableOpacity
          style={styles.markAllRow}
          onPress={() => filtered.filter(a => !a.read).forEach(a => markAlertRead(a.id))}
        >
          <Icon name="Check" size={14} color={COLORS.brand} strokeWidth={2.5} />
          <Text style={styles.markAllText}>Tout marquer comme lu</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="Bell" size={40} color={COLORS.border} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Aucune alerte</Text>
            <Text style={styles.emptyText}>Les alertes précoces générées par l'IA apparaîtront ici.</Text>
          </View>
        ) : (
          filtered.map(a => (
            <AlertItem key={a.id} alert={a} onPress={() => markAlertRead(a.id)} />
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.text },
  sub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 1 },
  unreadBadge: {
    backgroundColor: COLORS.dangerBg, borderWidth: 1, borderColor: COLORS.dangerBorder,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  unreadText: { fontSize: 12, fontFamily: FONTS.semibold, color: COLORS.danger },
  filterScroll: { maxHeight: 44, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterContent: { paddingHorizontal: SPACING.md, paddingVertical: 8, gap: 6 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
  },
  chipActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  chipText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  chipTextActive: { color: '#FFF', fontFamily: FONTS.semibold },
  markAllRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.brandBg,
  },
  markAllText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.brand },
  list: { flex: 1, backgroundColor: COLORS.bgSecondary },
  listContent: { padding: SPACING.md },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontFamily: FONTS.semibold, color: COLORS.text },
  emptyText: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18, paddingHorizontal: 32 },
});
