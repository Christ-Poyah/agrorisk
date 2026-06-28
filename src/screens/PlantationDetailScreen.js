import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW, RISK_LEVELS } from '../theme';
import RiskRow from '../components/RiskRow';
import Icon from '../components/LucideIcon';

const TABS = [
  { key: 'risques',   label: 'Risques'   },
  { key: 'meteo',     label: 'Météo'     },
  { key: 'ia',        label: 'IA'        },
  { key: 'assurance', label: 'Assurance' },
];

export default function PlantationDetailScreen({ route, navigation }) {
  const { plantation } = route.params;
  const [tab, setTab] = useState('risques');
  const risk = RISK_LEVELS[plantation.riskLevel] || RISK_LEVELS.faible;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="ArrowLeft" size={20} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{plantation.name}</Text>
          <View style={styles.headerMeta}>
            <Icon name="Leaf" size={11} color={COLORS.textMuted} />
            <Text style={styles.headerMetaText}>{plantation.cropLabel}</Text>
            <Text style={styles.headerMetaDot}>·</Text>
            <Icon name="MapPin" size={11} color={COLORS.textMuted} />
            <Text style={styles.headerMetaText}>{plantation.region}</Text>
          </View>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: risk.bg, borderColor: risk.border }]}>
          <Text style={[styles.riskBadgeText, { color: risk.color }]}>{risk.label}</Text>
        </View>
      </View>

      {/* Last scan */}
      <View style={styles.scanBar}>
        <View style={styles.scanLeft}>
          <Icon name="Satellite" size={13} color={COLORS.textMuted} strokeWidth={1.75} />
          <Text style={styles.scanText}>
            Analyse {new Date(plantation.lastScan).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>EN DIRECT</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabContent}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.bodyContent}>

        {/* RISKS */}
        {tab === 'risques' && (
          <>
            <View style={[styles.card, SHADOW.sm]}>
              <Text style={styles.cardTitle}>Analyse des risques</Text>
              <View style={styles.divider} />
              {Object.entries(plantation.risks).map(([key, val], i) => (
                <RiskRow key={key} type={key} level={val.level} score={val.score} trend={val.trend} delay={i * 150} />
              ))}
            </View>

            <View style={[styles.card, SHADOW.sm]}>
              <Text style={styles.cardTitle}>Indice de végétation NDVI</Text>
              <View style={styles.divider} />
              <View style={styles.ndviBar}>
                {['#DC2626', '#D97706', '#EAB308', '#65A30D', '#16A34A'].map((c, i) => (
                  <View key={i} style={[styles.ndviSeg, { backgroundColor: c }]} />
                ))}
              </View>
              <View style={styles.ndviLabels}>
                <Text style={styles.ndviLabelLeft}>Dégradé</Text>
                <Text style={styles.ndviLabelRight}>Excellent</Text>
              </View>
              <Text style={styles.ndviValue}>
                NDVI:{' '}
                {plantation.riskLevel === 'critique' ? '0.12' :
                  plantation.riskLevel === 'eleve' ? '0.28' :
                  plantation.riskLevel === 'modere' ? '0.52' : '0.71'}
                {' '}— Source: Sentinel-2
              </Text>
            </View>
          </>
        )}

        {/* METEO */}
        {tab === 'meteo' && (
          <>
            <View style={[styles.statsGrid]}>
              {[
                { icon: 'Thermometer', label: 'Température',    value: `${plantation.weather.temp}°C`        },
                { icon: 'Droplets',    label: 'Humidité',       value: `${plantation.weather.humidity}%`     },
                { icon: 'CloudRain',   label: 'Précipitations', value: `${plantation.weather.rainfall}mm`    },
                { icon: 'Wind',        label: 'Vent',           value: `${plantation.weather.windSpeed}km/h` },
              ].map((item, i) => (
                <View key={i} style={[styles.statCard, SHADOW.sm]}>
                  <Icon name={item.icon} size={18} color={COLORS.brand} strokeWidth={1.75} />
                  <Text style={styles.statCardVal}>{item.value}</Text>
                  <Text style={styles.statCardLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.card, SHADOW.sm]}>
              <Text style={styles.cardTitle}>Prévisions 5 jours</Text>
              <View style={styles.divider} />
              {[
                { day: 'Auj.', high: 31, low: 22, rain: 20, sunny: true },
                { day: 'Dem.',  high: 27, low: 20, rain: 75, sunny: false },
                { day: 'Mar.',  high: 25, low: 19, rain: 80, sunny: false },
                { day: 'Mer.',  high: 28, low: 21, rain: 40, sunny: false },
                { day: 'Jeu.',  high: 33, low: 23, rain: 5,  sunny: true },
              ].map((d, i) => (
                <View key={i} style={[styles.forecastRow, i > 0 && styles.forecastRowBorder]}>
                  <Text style={styles.forecastDay}>{d.day}</Text>
                  <Icon name={d.sunny ? 'Sun' : 'CloudRain'} size={16} color={d.sunny ? COLORS.warning : COLORS.info} strokeWidth={1.75} />
                  <Text style={styles.forecastHigh}>{d.high}°</Text>
                  <Text style={styles.forecastLow}>{d.low}°</Text>
                  <View style={styles.forecastRainRow}>
                    <Icon name="Droplets" size={12} color={COLORS.info} />
                    <Text style={styles.forecastRain}>{d.rain}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* IA */}
        {tab === 'ia' && (
          <>
            <View style={[styles.card, SHADOW.sm]}>
              <View style={styles.aiHeader}>
                <View style={styles.aiIcon}>
                  <Icon name="Bot" size={18} color={COLORS.brand} strokeWidth={1.75} />
                </View>
                <View>
                  <Text style={styles.aiTitle}>Modèle RARM IA</Text>
                  <Text style={styles.aiSub}>Satellite + Météo + Terrain</Text>
                </View>
              </View>
            </View>

            {[
              { icon: 'Calendar', label: 'Prochaine semaine', color: COLORS.info,   text: plantation.aiPrediction.summary },
              { icon: 'CheckCircle2', label: 'Recommandation', color: COLORS.brand, text: plantation.aiPrediction.recommendation },
            ].map((item, i) => (
              <View key={i} style={[styles.card, SHADOW.sm, { borderLeftWidth: 3, borderLeftColor: item.color }]}>
                <View style={styles.predHeader}>
                  <Icon name={item.icon} size={14} color={item.color} strokeWidth={2} />
                  <Text style={[styles.predLabel, { color: item.color }]}>{item.label}</Text>
                </View>
                <Text style={styles.predText}>{item.text}</Text>
              </View>
            ))}

            <View style={[styles.card, SHADOW.sm]}>
              <Text style={styles.cardTitle}>Confiance du modèle</Text>
              <View style={styles.divider} />
              {[
                { label: 'Données satellite',  score: 94 },
                { label: 'Données météo',       score: 87 },
                { label: 'Données sol',         score: 72 },
                { label: 'Historique local',    score: 68 },
              ].map((c, i) => (
                <View key={i} style={styles.confRow}>
                  <Text style={styles.confLabel}>{c.label}</Text>
                  <View style={styles.confTrack}>
                    <View style={[styles.confFill, { width: `${c.score}%` }]} />
                  </View>
                  <Text style={styles.confScore}>{c.score}%</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ASSURANCE */}
        {tab === 'assurance' && (
          plantation.insurance.active ? (
            <>
              <View style={[styles.card, SHADOW.sm, { borderTopWidth: 3, borderTopColor: COLORS.purple }]}>
                <View style={styles.insuranceTop}>
                  <Icon name="ShieldCheck" size={22} color={COLORS.purple} strokeWidth={1.75} />
                  <View>
                    <Text style={styles.insTitle}>Assurance active</Text>
                    <Text style={styles.insSub}>Smart Contract on-chain</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.insStats}>
                  <View style={styles.insStat}>
                    <Text style={styles.insStatVal}>{plantation.insurance.coverage.toLocaleString('fr-FR')}</Text>
                    <Text style={styles.insStatLabel}>FCFA couverts</Text>
                  </View>
                  <View style={styles.insStatDivider} />
                  <View style={styles.insStat}>
                    <Text style={styles.insStatVal}>{plantation.insurance.premium.toLocaleString('fr-FR')}</Text>
                    <Text style={styles.insStatLabel}>FCFA prime/an</Text>
                  </View>
                </View>
                <View style={[styles.hashBox, { backgroundColor: COLORS.purpleBg, borderColor: COLORS.purpleBorder }]}>
                  <Icon name="Zap" size={12} color={COLORS.purple} />
                  <Text style={styles.hashText}>{plantation.insurance.smartContract}</Text>
                </View>
              </View>

              {plantation.insurance.triggered && (
                <View style={[styles.card, SHADOW.sm, { borderLeftWidth: 3, borderLeftColor: COLORS.success }]}>
                  <Text style={styles.trigTitle}>Indemnisation déclenchée</Text>
                  <Text style={styles.trigAmount}>{plantation.insurance.triggerAmount?.toLocaleString('fr-FR')} FCFA</Text>
                  <Text style={styles.trigDesc}>Virement automatique en cours vers votre mobile money.</Text>
                </View>
              )}
            </>
          ) : (
            <View style={[styles.card, SHADOW.sm]}>
              <View style={styles.noInsurance}>
                <Icon name="Shield" size={40} color={COLORS.border} strokeWidth={1.5} />
                <Text style={styles.noInsTitle}>Non assuré</Text>
                <Text style={styles.noInsDesc}>Protégez vos revenus avec notre assurance basée sur les smart contracts.</Text>
                <TouchableOpacity style={styles.subscribeBtn}>
                  <Icon name="Zap" size={16} color="#FFF" strokeWidth={2} />
                  <Text style={styles.subscribeBtnText}>Souscrire maintenant</Text>
                </TouchableOpacity>
                <Text style={styles.noInsPrime}>
                  Prime estimée: {Math.round(plantation.area * 20000).toLocaleString('fr-FR')} FCFA/an
                </Text>
              </View>
            </View>
          )
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 15, fontFamily: FONTS.semibold, color: COLORS.text },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  headerMetaText: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  headerMetaDot: { fontSize: 11, color: COLORS.border },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1 },
  riskBadgeText: { fontSize: 11, fontFamily: FONTS.semibold },
  scanBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: 8,
    backgroundColor: COLORS.bgTertiary, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  scanLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  scanText: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.successBg, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.successBorder,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  liveText: { fontSize: 9, fontFamily: FONTS.bold, color: COLORS.success, letterSpacing: 0.5 },
  tabBar: { maxHeight: 42, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tabContent: { paddingHorizontal: SPACING.md, paddingVertical: 8, gap: 4 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
  },
  tabActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  tabText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF', fontFamily: FONTS.semibold },
  body: { flex: 1, backgroundColor: COLORS.bgSecondary },
  bodyContent: { padding: SPACING.md, gap: SPACING.md },
  card: {
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.text, marginBottom: SPACING.sm },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.sm },
  ndviBar: { flexDirection: 'row', height: 10, borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: 4 },
  ndviSeg: { flex: 1 },
  ndviLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  ndviLabelLeft: { fontSize: 10, fontFamily: FONTS.regular, color: COLORS.danger },
  ndviLabelRight: { fontSize: 10, fontFamily: FONTS.regular, color: COLORS.success },
  ndviValue: { fontSize: 12, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: {
    width: '47%', backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statCardVal: { fontSize: 20, fontFamily: FONTS.bold, color: COLORS.text },
  statCardLabel: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  forecastRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12,
  },
  forecastRowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  forecastDay: { width: 36, fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  forecastHigh: { flex: 1, fontSize: 14, fontFamily: FONTS.bold, color: COLORS.text },
  forecastLow: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted },
  forecastRainRow: { flexDirection: 'row', alignItems: 'center', gap: 3, width: 44 },
  forecastRain: { fontSize: 12, fontFamily: FONTS.medium, color: COLORS.info },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiIcon: {
    width: 42, height: 42, borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandBg, alignItems: 'center', justifyContent: 'center',
  },
  aiTitle: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text },
  aiSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  predHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  predLabel: { fontSize: 12, fontFamily: FONTS.semibold },
  predText: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 18 },
  confRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  confLabel: { width: 120, fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  confTrack: { flex: 1, height: 5, backgroundColor: COLORS.bgTertiary, borderRadius: RADIUS.full, overflow: 'hidden' },
  confFill: { height: 5, backgroundColor: COLORS.brand, borderRadius: RADIUS.full },
  confScore: { width: 32, fontSize: 11, fontFamily: FONTS.semibold, color: COLORS.brand, textAlign: 'right' },
  insuranceTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  insTitle: { fontSize: 16, fontFamily: FONTS.bold, color: COLORS.text },
  insSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  insStats: { flexDirection: 'row', marginBottom: SPACING.sm },
  insStat: { flex: 1, alignItems: 'center', gap: 3 },
  insStatDivider: { width: 1, backgroundColor: COLORS.border },
  insStatVal: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.purple },
  insStatLabel: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  hashBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    padding: SPACING.sm, borderRadius: RADIUS.sm, borderWidth: 1, marginTop: SPACING.xs,
  },
  hashText: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.purple },
  trigTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.success, marginBottom: 4 },
  trigAmount: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.text, marginBottom: 4 },
  trigDesc: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  noInsurance: { alignItems: 'center', gap: 10, paddingVertical: SPACING.lg },
  noInsTitle: { fontSize: 16, fontFamily: FONTS.semibold, color: COLORS.text },
  noInsDesc: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18, paddingHorizontal: 16 },
  subscribeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.purple, borderRadius: RADIUS.md,
    paddingVertical: 12, paddingHorizontal: 20, marginTop: 4,
  },
  subscribeBtnText: { fontSize: 14, fontFamily: FONTS.semibold, color: '#FFF' },
  noInsPrime: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
});
