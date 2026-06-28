import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW, RISK_LEVELS } from '../theme';
import { useApp } from '../context/AppContext';

const DEFAULT_CROP_IMAGE = require('../assets/images/mais.png');

// Alterne sécheresse / inondation à chaque fois que l'écran prend le focus
let visitCount = 0;
import RiskRow from '../components/RiskRow';
import Icon from '../components/LucideIcon';

export default function PlantationSummaryScreen({ route, navigation }) {
  const { plantations, unreadCount } = useApp();

  // Fonctionne comme home (lit du contexte) ET comme écran post-création (lit les params)
  const fromCreation = !!route.params?.plantation;
  const plantation   = route.params?.plantation || plantations[plantations.length - 1];

  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(16)).current;
  const alertAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;

  const [alertType,     setAlertType]     = useState(null);   // 'secheresse' | 'inondation'
  const [simulatedRisks, setSimulated]    = useState(null);

  // Fade-in initial (une seule fois)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  // Simulation déclenchée à chaque fois que l'écran reprend le focus
  useFocusEffect(useCallback(() => {
    visitCount++;
    const type = visitCount % 2 === 1 ? 'secheresse' : 'inondation';

    // Reset état précédent
    setAlertType(null);
    setSimulated(null);
    alertAnim.setValue(0);
    pulseAnim.setValue(1);

    const timer = setTimeout(() => {
      const criticalRisk = { level: 'critique', score: 91, trend: 'up' };
      setAlertType(type);
      setSimulated({
        secheresse: type === 'secheresse' ? criticalRisk : plantation.risks.secheresse,
        inondation: type === 'inondation' ? criticalRisk : plantation.risks.inondation,
      });
      Animated.sequence([
        Animated.timing(alertAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.05, duration: 700, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
          ]),
          { iterations: 8 }
        ),
      ]).start();
    }, 10000);

    return () => {
      clearTimeout(timer);
      pulseAnim.stopAnimation();
    };
  }, [plantation?.id]));

  const displayRisks = simulatedRisks || plantation.risks;

  if (!plantation) return null;

  const overallRisk = RISK_LEVELS[plantation.riskLevel] || RISK_LEVELS.modere;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topTitle}>Accueil</Text>
          <View style={styles.topSub}>
            <View style={styles.liveDotSmall} />
            <Text style={styles.topSubText}>Surveillance IA active</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Alerts')}>
            <Icon name="Bell" size={20} color={COLORS.textSecondary} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Profile')}>
            <Icon name="User" size={20} color={COLORS.textSecondary} strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Hero image de la culture */}
        <Animated.View style={[styles.heroWrap, { opacity: fadeAnim }]}>
          <Image
            source={plantation.cropImage || DEFAULT_CROP_IMAGE}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          {fromCreation && (
            <View style={styles.heroBadge}>
              <Icon name="CheckCircle2" size={16} color="#FFF" strokeWidth={2.5} />
              <Text style={styles.heroBadgeText}>Plantation enregistrée</Text>
            </View>
          )}
          <View style={styles.heroLabel}>
            <Text style={styles.heroLabelText}>{plantation.cropLabel}</Text>
          </View>
        </Animated.View>

        {/* Sous-titre après création */}
        {fromCreation && (
          <Animated.View style={[styles.successSub, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.successSubText}>La surveillance IA est maintenant active</Text>
          </Animated.View>
        )}

        {/* Plantation identity card */}
        <Animated.View style={[styles.card, SHADOW.sm, { opacity: fadeAnim, transform: [{ translateY: slideAnim }], marginHorizontal: SPACING.md }]}>
          <View style={styles.plantHeader}>
            <View style={[styles.plantIcon, { backgroundColor: plantation.cropColor + '15', borderColor: plantation.cropColor + '30' }]}>
              <Icon name="Leaf" size={20} color={plantation.cropColor} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.plantName}>{plantation.name}</Text>
              <View style={styles.plantMeta}>
                <Icon name="Leaf" size={11} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{plantation.cropLabel}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Icon name="MapPin" size={11} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{plantation.region}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Icon name="Maximize2" size={11} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{plantation.area} ha</Text>
              </View>
            </View>
            <View style={[styles.riskBadge, { backgroundColor: overallRisk.bg, borderColor: overallRisk.border }]}>
              <Text style={[styles.riskBadgeText, { color: overallRisk.color }]}>{overallRisk.label}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Bannière d'alerte simulée */}
        {alertType && (
          <Animated.View
            style={[
              styles.alertBanner,
              alertType === 'secheresse'
                ? { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }
                : { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' },
              { opacity: alertAnim, transform: [{ translateY: alertAnim.interpolate({ inputRange: [0,1], outputRange: [-12, 0] }) }] },
              { marginHorizontal: SPACING.md },
            ]}
          >
            <Icon
              name={alertType === 'secheresse' ? 'Sun' : 'Droplets'}
              size={18}
              color={alertType === 'secheresse' ? '#EA580C' : '#0284C7'}
              strokeWidth={2}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: alertType === 'secheresse' ? '#EA580C' : '#0284C7' }]}>
                {alertType === 'secheresse' ? 'Alerte sécheresse critique' : 'Alerte inondation critique'}
              </Text>
              <Text style={styles.alertSub}>Simulation IA • Appuyez sur la barre pour le guide</Text>
            </View>
          </Animated.View>
        )}

        {/* AI Risk Analysis */}
        <View style={[styles.section, SHADOW.sm, { marginHorizontal: SPACING.md }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabel}>
              <Icon name="Bot" size={14} color={COLORS.brand} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Analyse des risques</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>IA active</Text>
            </View>
          </View>
          <View style={styles.divider} />
          {Object.entries(displayRisks)
            .filter(([key]) => key !== 'criquets')
            .map(([key, val], i) => {
              const isAlert = alertType === key;
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={isAlert ? 0.75 : 1}
                  onPress={() => isAlert && navigation.navigate('RiskGuide', { type: key })}
                >
                  <Animated.View style={isAlert && { transform: [{ scale: pulseAnim }] }}>
                    <RiskRow
                      type={key}
                      level={val.level}
                      score={val.score}
                      trend={val.trend}
                      delay={i * 150}
                    />
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
        </View>

        {/* Boutons d'action alerte */}
        {alertType && (() => {
          const isS = alertType === 'secheresse';
          const clr = isS ? '#EA580C' : '#0284C7';
          const bg  = isS ? '#FFF7ED' : '#F0F9FF';
          const bdr = isS ? '#FED7AA' : '#BAE6FD';
          return (
            <View style={[styles.alertBtns, { marginHorizontal: SPACING.md }]}>
              <TouchableOpacity
                style={[styles.alertActionBtn, { backgroundColor: bg, borderColor: bdr }]}
                onPress={() => navigation.navigate('RiskGuide', { type: alertType })}
                activeOpacity={0.8}
              >
                <View style={[styles.alertActionIcon, { backgroundColor: clr + '20' }]}>
                  <Icon name={isS ? 'Sun' : 'Droplets'} size={16} color={clr} strokeWidth={2} />
                </View>
                <Text style={[styles.alertActionTxt, { color: clr }]}>Appuyer pour le guide d'urgence</Text>
                <Icon name="ChevronRight" size={15} color={clr} strokeWidth={2.5} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.alertActionBtn, { backgroundColor: COLORS.successBg, borderColor: COLORS.successBorder }]}
                onPress={() => navigation.navigate('Indemnisation', { type: alertType })}
                activeOpacity={0.8}
              >
                <View style={[styles.alertActionIcon, { backgroundColor: COLORS.success + '20' }]}>
                  <Icon name="Shield" size={16} color={COLORS.success} strokeWidth={2} />
                </View>
                <Text style={[styles.alertActionTxt, { color: COLORS.success }]}>Recevoir votre indemnisation</Text>
                <Icon name="ChevronRight" size={15} color={COLORS.success} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          );
        })()}

        {/* AI Recommendation */}
        <View style={[styles.section, SHADOW.sm, { marginHorizontal: SPACING.md }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabel}>
              <Icon name="BarChart3" size={14} color={COLORS.brand} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Prédictions IA — 30 jours</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.summaryText}>{plantation.aiPrediction.summary}</Text>
          <View style={[styles.recBox, { backgroundColor: COLORS.brandBg, borderColor: COLORS.brandBorder }]}>
            <Icon name="CheckCircle2" size={14} color={COLORS.brand} strokeWidth={2} />
            <Text style={styles.recText}>{plantation.aiPrediction.recommendation}</Text>
          </View>
        </View>

        {/* Stat boxes */}
        <View style={[styles.statsRow, { marginHorizontal: SPACING.md }]}>
          {[
            { icon: 'Satellite', label: 'Prochaine analyse', value: 'Dans 6h' },
            { icon: 'Bell',      label: 'Alertes précoces', value: 'Activées' },
            { icon: 'Zap',       label: 'Smart Contract',   value: plantation.insurance.active ? 'Actif' : 'Inactif' },
          ].map((s, i) => (
            <View key={i} style={[styles.statBox, SHADOW.sm]}>
              <Icon name={s.icon} size={16} color={COLORS.brand} strokeWidth={1.75} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Ajouter une culture */}
        <TouchableOpacity
          style={[styles.addBtn, SHADOW.sm, { marginHorizontal: SPACING.md }]}
          onPress={() => navigation.navigate('AddPlantation')}
          activeOpacity={0.85}
        >
          <Icon name="Plus" size={16} color={COLORS.brand} strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Ajouter une culture</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgSecondary },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.bgPrimary,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  topTitle: { fontSize: 15, fontFamily: FONTS.semibold, color: COLORS.text },
  topSub: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  liveDotSmall: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  topSubText: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  topActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { position: 'relative', padding: 8 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: COLORS.danger, width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 9, fontFamily: FONTS.bold },
  container: { gap: SPACING.md, paddingBottom: SPACING.md },
  heroWrap: {
    position: 'relative',
    height: 200,
    overflow: 'hidden',
  },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  heroBadge: {
    position: 'absolute', top: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.success,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  heroBadgeText: { fontSize: 12, fontFamily: FONTS.semibold, color: '#FFF' },
  heroLabel: {
    position: 'absolute', bottom: 14, left: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  heroLabelText: { fontSize: 13, fontFamily: FONTS.semibold, color: '#FFF' },
  successSub: { alignItems: 'center', paddingHorizontal: SPACING.md },
  successSubText: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  plantHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  plantIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  plantName: { fontSize: 15, fontFamily: FONTS.semibold, color: COLORS.text, marginBottom: 3 },
  plantMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  metaText: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  metaDot: { fontSize: 11, color: COLORS.border },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1 },
  riskBadgeText: { fontSize: 11, fontFamily: FONTS.semibold },
  section: {
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.text },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.successBg, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.successBorder,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  liveText: { fontSize: 10, fontFamily: FONTS.semibold, color: COLORS.success },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.xs },
  summaryText: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 19, marginBottom: SPACING.sm },
  recBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.sm,
  },
  recText: { flex: 1, fontSize: 13, fontFamily: FONTS.medium, color: COLORS.brand, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statBox: {
    flex: 1, backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.md,
    padding: SPACING.sm, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.text },
  statLabel: { fontSize: 10, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.brandBorder, backgroundColor: COLORS.brandBg, borderStyle: 'dashed',
  },
  addBtnText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.brand },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.sm,
  },
  alertTitle: { fontSize: 13, fontFamily: FONTS.semibold },
  alertSub: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 1 },
  alertBtns: { gap: 8 },
  alertActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.sm,
  },
  alertActionIcon: {
    width: 32, height: 32, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  alertActionTxt: { flex: 1, fontSize: 13, fontFamily: FONTS.semibold },
});
