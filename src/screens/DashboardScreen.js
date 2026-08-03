import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW, RISK_LEVELS } from '../theme';
import { useApp } from '../context/AppContext';
import { WEATHER_DATA } from '../data/mockData';
import PlantationCard from '../components/PlantationCard';
import AlertItem from '../components/AlertItem';
import Icon from '../components/LucideIcon';

export default function DashboardScreen({ navigation }) {
  const { user, plantations, alerts, unreadCount, stats, markAlertRead } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const recentAlerts = alerts.filter(a => !a.read).slice(0, 3);
  const w = WEATHER_DATA;

  const globalScore = Math.round(
    Object.values(plantations).reduce((sum, p) =>
      sum + Object.values(p.risks).reduce((s, r) => s + r.score, 0) / 3, 0
    ) / Math.max(plantations.length, 1)
  );

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.name?.split(' ')[0]}</Text>
          <View style={styles.locationRow}>
            <Icon name="MapPin" size={11} color={COLORS.textMuted} />
            <Text style={styles.location}>{user?.region || 'Côte d\'Ivoire'}</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Alerts', {})}
          >
            <Icon name="Bell" size={20} color={COLORS.textSecondary} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="User" size={20} color={COLORS.textSecondary} strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.brand} />}
      >
        {/* Risk overview */}
        <View style={styles.riskOverview}>
          <View style={styles.riskScore}>
            <Text style={styles.riskScoreNum}>{globalScore}</Text>
            <View>
              <Text style={styles.riskScoreLabel}>Score de risque</Text>
              <Text style={styles.riskScoreSub}>global · {plantations.length} cultures</Text>
            </View>
          </View>
          <View style={styles.riskCards}>
            {[
              { key: 'secheresse', icon: 'Sun',      label: 'Sécheresse', score: 52, level: 'modere'   },
              { key: 'inondation', icon: 'Droplets',  label: 'Inondation',  score: 78, level: 'eleve'    },
              { key: 'criquets',   icon: 'Bug',       label: 'Criquets',    score: 88, level: 'critique' },
            ].map(r => {
              const risk = RISK_LEVELS[r.level];
              return (
                <View key={r.key} style={[styles.riskCard, { borderColor: risk.border, backgroundColor: risk.bg }]}>
                  <Icon name={r.icon} size={14} color={risk.color} strokeWidth={2} />
                  <Text style={[styles.riskCardScore, { color: risk.color }]}>{r.score}%</Text>
                  <Text style={styles.riskCardLabel}>{r.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Weather strip */}
        <View style={styles.weatherStrip}>
          {[
            { icon: 'Thermometer', label: `${w.temp}°C`        },
            { icon: 'Droplets',    label: `${w.humidity}%`     },
            { icon: 'CloudRain',   label: `${w.rainfall}mm`    },
            { icon: 'Wind',        label: `${w.windSpeed}km/h` },
          ].map((item, i) => (
            <View key={i} style={styles.weatherStat}>
              <Icon name={item.icon} size={14} color={COLORS.textMuted} strokeWidth={1.75} />
              <Text style={styles.weatherVal}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Smart Contract banner */}
        {stats.indemnisationsPaid > 0 && (
          <View style={[styles.contractBanner, SHADOW.sm]}>
            <View style={styles.contractLeft}>
              <View style={styles.contractIcon}>
                <Icon name="Zap" size={16} color={COLORS.brandLight} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.contractTitle}>Indemnisation déclenchée</Text>
                <Text style={styles.contractSub}>Smart contract · Rizière Ama</Text>
              </View>
            </View>
            <Text style={styles.contractAmount}>
              {stats.indemnisationsPaid.toLocaleString('fr-FR')} FCFA
            </Text>
          </View>
        )}

        {/* Alerts */}
        {recentAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Alertes non lues</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Alerts', {})}>
                <Text style={styles.sectionLink}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            {recentAlerts.map(a => (
              <AlertItem key={a.id} alert={a} onPress={() => markAlertRead(a.id)} />
            ))}
          </View>
        )}

        {/* Plantations */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Mes cultures</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Plantations')}>
              <Text style={styles.sectionLink}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          {plantations.slice(0, 3).map(p => (
            <PlantationCard
              key={p.id}
              plantation={p}
              onPress={() => navigation.navigate('PlantationDetail', { plantation: p })}
            />
          ))}
          <TouchableOpacity
            style={[styles.addBtn, SHADOW.sm]}
            onPress={() => navigation.navigate('AddPlantation')}
          >
            <Icon name="Plus" size={16} color={COLORS.brand} strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Ajouter une culture</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPrimary },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: { fontSize: 15, fontFamily: FONTS.semibold, color: COLORS.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  location: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  topActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { position: 'relative', padding: 8 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: COLORS.danger, width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 9, fontFamily: FONTS.bold },
  scroll: { flex: 1, backgroundColor: COLORS.bgSecondary },
  riskOverview: {
    backgroundColor: COLORS.bgPrimary,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  riskScore: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  riskScoreNum: { fontSize: 40, fontFamily: FONTS.bold, color: COLORS.text },
  riskScoreLabel: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text },
  riskScoreSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  riskCards: { flexDirection: 'row', gap: SPACING.sm },
  riskCard: {
    flex: 1, alignItems: 'center', gap: 4, padding: SPACING.sm,
    borderRadius: RADIUS.md, borderWidth: 1,
  },
  riskCardScore: { fontSize: 16, fontFamily: FONTS.bold },
  riskCardLabel: { fontSize: 10, fontFamily: FONTS.medium, color: COLORS.textMuted, textAlign: 'center' },
  weatherStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgPrimary,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  weatherStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  weatherVal: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  contractBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.bgPrimary, margin: SPACING.md,
    borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.brandLightBorder,
    borderLeftWidth: 3, borderLeftColor: COLORS.brandLight,
  },
  contractLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  contractIcon: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandLightBg, alignItems: 'center', justifyContent: 'center',
  },
  contractTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.text },
  contractSub: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  contractAmount: { fontSize: 15, fontFamily: FONTS.bold, color: COLORS.brandLight },
  section: { padding: SPACING.md },
  sectionHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text },
  sectionLink: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.brand },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.brandBorder, backgroundColor: COLORS.brandBg,
    borderStyle: 'dashed', marginTop: SPACING.xs,
  },
  addBtnText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.brand },
});
