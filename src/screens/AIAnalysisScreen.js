import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import Icon from '../components/LucideIcon';

const logo_gpt = require('../assets/images/logo_gpt.png');

const { width } = Dimensions.get('window');
const ORB_SIZE    = 110;
const BG          = COLORS.bgSecondary;
const CARD_BG     = COLORS.bgPrimary;
const CARD_BORDER = COLORS.border;
const TEXT_DIM    = COLORS.textMuted;
const TEXT_MAIN   = COLORS.text;
const GREEN       = '#5CB83C';
const GREEN_DIM   = COLORS.brand;

const SOURCES = [
  { id: 'meteo',      icon: 'CloudSun',  label: 'météo-ci.gov',       detail: 'Précipitations · Température'         },
  { id: 'nasa',       icon: 'Satellite', label: 'NASA MODIS',          detail: 'NDVI · Albédo · Couverture végétale'   },
  { id: 'chirps',     icon: 'CloudRain', label: 'CHIRPS Rainfall',     detail: 'Données pluviométriques historiques'   },
  { id: 'sentinel2',  icon: 'Globe',     label: 'Copernicus / Sentinel-2', detail: 'Images optiques 10 m · ESA'        },
  { id: 'sentinel1',  icon: 'Layers',    label: 'Sentinel-1 SAR',      detail: 'Radar · Humidité des sols'            },
  { id: 'landsat',    icon: 'Activity',  label: 'Landsat 9 / USGS',    detail: 'Imagerie thermique infrarouge'        },
  { id: 'ecmwf',      icon: 'Wind',      label: 'ECMWF',               detail: 'Prévisions atmosphériques globales'   },
  { id: 'anader',     icon: 'Leaf',      label: "ANADER Côte d'Ivoire", detail: 'Alertes et rapports agricoles locaux' },
  { id: 'fews',       icon: 'Shield',    label: 'FEWS NET',            detail: 'Surveillance sécurité alimentaire'    },
];

// 3 jeux de valeurs — on cycle au refresh
const METRIC_SETS = [
  ['31°C', '58%', '34 mm', '0.58', '8 mm',  '5.6 kWh'],
  ['32°C', '55%', '38 mm', '0.56', '5 mm',  '5.8 kWh'],
  ['30°C', '62%', '29 mm', '0.61', '11 mm', '5.3 kWh'],
];
const METRIC_LABELS = [
  'Température sol', 'Humidité relative', 'Déficit hydrique',
  'NDVI', 'Pluie / 7 jours', 'Rayonnement',
];
const DATA_TARGETS = [284719, 301043, 268532];

// ─── PulseRing ─────────────────────────────────────────────────────────────
function PulseRing({ delay, size }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scale   = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const opacity = anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.45, 0.2, 0] });

  return (
    <Animated.View style={{
      position: 'absolute', width: size, height: size, borderRadius: size / 2,
      borderWidth: 1.5, borderColor: GREEN, opacity, transform: [{ scale }],
    }} />
  );
}

// ─── SourceRow ─────────────────────────────────────────────────────────────
function SourceRow({ source, index, onAllDone, total }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const delay = index * 1200 + 600;
    const t = setTimeout(() => {
      setStatus('scanning');
      Animated.timing(progress, { toValue: 1, duration: 1600, useNativeDriver: false })
        .start(() => {
          setStatus('done');
          if (index === total - 1) onAllDone?.();
        });
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const isDone   = status === 'done';
  const isScan   = status === 'scanning';

  return (
    <View style={styles.sourceRow}>
      <View style={[styles.sourceIcon, isDone && { borderColor: GREEN_DIM }]}>
        <Icon
          name={source.icon} size={14}
          color={isDone ? GREEN : isScan ? GREEN : TEXT_DIM}
          strokeWidth={1.75}
        />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.sourceTopRow}>
          <Text style={styles.sourceLabel}>{source.label}</Text>
          {isDone  && (
            <View style={styles.doneBadge}>
              <Icon name="Check" size={9} color={GREEN} strokeWidth={3} />
              <Text style={styles.doneTxt}>Analysé</Text>
            </View>
          )}
          {isScan  && <Text style={styles.scanTxt}>Scan en cours…</Text>}
          {!isDone && !isScan && <Text style={styles.pendingTxt}>En attente</Text>}
        </View>
        <Text style={styles.sourceDetail}>{source.detail}</Text>
        <View style={styles.progressTrack}>
          {status !== 'pending' && (
            <Animated.View style={[styles.progressFill, { width: barWidth, backgroundColor: isDone ? GREEN_DIM : GREEN }]} />
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────
export default function AIAnalysisScreen({ navigation }) {
  const [refreshKey,   setRefreshKey]   = useState(0);
  const [setIdx,       setSetIdx]       = useState(0);
  const [dataPoints,   setDataPoints]   = useState(0);
  const [allDone,      setAllDone]      = useState(false);
  const counterRef = useRef(null);

  const metricSet  = METRIC_SETS[setIdx % METRIC_SETS.length];
  const dataTarget = DATA_TARGETS[setIdx % DATA_TARGETS.length];

  // Compteur qui monte jusqu'à la cible puis s'arrête
  useEffect(() => {
    setDataPoints(0);
    setAllDone(false);
    if (counterRef.current) clearInterval(counterRef.current);
    counterRef.current = setInterval(() => {
      setDataPoints(n => {
        const next = n + Math.floor(Math.random() * 120 + 60);
        if (next >= dataTarget) {
          clearInterval(counterRef.current);
          return dataTarget;
        }
        return next;
      });
    }, 280);
    return () => clearInterval(counterRef.current);
  }, [refreshKey]);

  function handleRefresh() {
    setSetIdx(i => i + 1);
    setRefreshKey(k => k + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Header minimal */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="ArrowLeft" size={20} color={TEXT_MAIN} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analyse IA</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Orbe */}
        <View style={styles.orbSection}>
          <View style={styles.orbWrap}>
            <PulseRing delay={0}    size={ORB_SIZE} />
            <PulseRing delay={700}  size={ORB_SIZE} />
            <PulseRing delay={1400} size={ORB_SIZE} />
            <View style={styles.orb}>
              <Image source={logo_gpt} style={styles.orbLogo} resizeMode="contain" />
            </View>
          </View>
          <Text style={styles.analysisTitle}>Analyse en cours…</Text>
          <Text style={styles.dataCounter}>
            {dataPoints.toLocaleString('fr-FR')} points de données traités
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Métriques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres captés</Text>
          <View style={styles.metricsGrid}>
            {METRIC_LABELS.map((label, i) => (
              <View key={i} style={styles.metricCell}>
                <Text style={styles.metricValue}>{metricSet[i]}</Text>
                <Text style={styles.metricLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Sources */}
        <View style={styles.section}>
          <View style={styles.sourceHeader}>
            <Text style={styles.sectionTitle}>Sources de données</Text>
            {allDone && (
              <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh} activeOpacity={0.75}>
                <Icon name="Activity" size={13} color={GREEN} strokeWidth={2} />
                <Text style={styles.refreshTxt}>Actualiser</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.sourcesList}>
            {SOURCES.map((s, i) => (
              <SourceRow
                key={`${s.id}-${refreshKey}`}
                source={s}
                index={i}
                total={SOURCES.length}
                onAllDone={() => setAllDone(true)}
              />
            ))}
          </View>
          {allDone && (
            <View style={styles.nextUpdate}>
              <Icon name="Clock" size={12} color={TEXT_DIM} strokeWidth={1.75} />
              <Text style={styles.nextUpdateTxt}>Prochaine analyse automatique dans 6h</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: BG },
  scroll: { paddingBottom: 20 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.bgPrimary,
    borderBottomWidth: 1, borderBottomColor: CARD_BORDER,
  },
  backBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 14, fontFamily: FONTS.semibold, color: TEXT_MAIN },

  orbSection: { alignItems: 'center', paddingVertical: 36, gap: 14 },
  orbWrap: {
    width: ORB_SIZE, height: ORB_SIZE,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  orb: {
    width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  orbLogo:       { width: ORB_SIZE * 0.60, height: ORB_SIZE * 0.60 },
  analysisTitle: { fontSize: 20, fontFamily: FONTS.bold, color: TEXT_MAIN },
  dataCounter:   { fontSize: 12, fontFamily: FONTS.regular, color: TEXT_DIM },

  divider: { height: 1, backgroundColor: CARD_BORDER, marginHorizontal: SPACING.md },

  section: { padding: SPACING.md, gap: SPACING.sm },
  sectionTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: TEXT_MAIN, marginBottom: 4 },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricCell: {
    width: (width - SPACING.md * 2 - 16) / 3,
    backgroundColor: CARD_BG,
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: CARD_BORDER,
    paddingVertical: 10, paddingHorizontal: 6,
    alignItems: 'center', gap: 4,
  },
  metricValue: { fontSize: 15, fontFamily: FONTS.bold, color: GREEN },
  metricLabel: { fontSize: 9, fontFamily: FONTS.regular, color: TEXT_DIM, textAlign: 'center' },

  sourceHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  refreshBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(92,184,60,0.1)',
    borderWidth: 1, borderColor: 'rgba(92,184,60,0.25)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  refreshTxt: { fontSize: 11, fontFamily: FONTS.semibold, color: GREEN },

  sourcesList: { gap: 14 },
  sourceRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  sourceIcon: {
    width: 34, height: 34, borderRadius: RADIUS.md,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  sourceTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sourceLabel:  { fontSize: 12, fontFamily: FONTS.semibold, color: TEXT_MAIN },
  sourceDetail: { fontSize: 10, fontFamily: FONTS.regular, color: TEXT_DIM },

  doneBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(92,184,60,0.1)',
    borderRadius: RADIUS.full, paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: 'rgba(92,184,60,0.25)',
  },
  doneTxt:    { fontSize: 10, fontFamily: FONTS.semibold, color: GREEN },
  scanTxt:    { fontSize: 10, fontFamily: FONTS.medium,   color: GREEN },
  pendingTxt: { fontSize: 10, fontFamily: FONTS.regular,  color: TEXT_DIM },

  progressTrack: { height: 2, backgroundColor: COLORS.bgTertiary, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  progressFill:  { height: 2, borderRadius: 2 },

  nextUpdate: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 8, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  nextUpdateTxt: { fontSize: 11, fontFamily: FONTS.regular, color: TEXT_DIM },
});
