import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW, RISK_LEVELS } from '../theme';
import { useApp } from '../context/AppContext';

const DEFAULT_CROP_IMAGE = require('../assets/images/mais.png');
const logo = require('../assets/images/logo.jpeg');

const LANGUAGES = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'di', label: 'Dioula',   short: 'DI' },
];

// Alterne sécheresse / inondation à chaque fois que l'écran prend le focus
let visitCount = 0;
import RiskRow from '../components/RiskRow';
import Icon from '../components/LucideIcon';

const CLIMATE_ROWS = [
  [
    { icon: 'Thermometer', label: 'Température', value: '27°C'     },
    { icon: 'Droplets',    label: 'Humidité',    value: '72%'      },
    { icon: 'Wind',        label: 'Vent',         value: '10 km/h' },
  ],
  [
    { icon: 'CloudRain',  label: 'Pluie/jour',  value: '3 mm'     },
    { icon: 'Activity',   label: 'NDVI',         value: '0.65'    },
    { icon: 'Sun',        label: 'Rayonnement',  value: '5.1 kWh' },
  ],
];

export default function PlantationSummaryScreen({ route, navigation }) {
  const { plantations, unreadCount } = useApp();

  const fromCreation = !!route.params?.plantation;

  const [selectedIndex, setSelectedIndex] = useState(
    plantations.length > 0 ? plantations.length - 1 : 0
  );

  // Quand une nouvelle plantation est ajoutée, pointer sur la dernière
  useEffect(() => {
    if (!fromCreation && plantations.length > 0) {
      setSelectedIndex(plantations.length - 1);
    }
  }, [plantations.length]);

  const plantation = fromCreation
    ? route.params.plantation
    : (plantations[selectedIndex] ?? plantations[plantations.length - 1]);

  // Ref pour que useFocusEffect accède toujours à la plantation courante
  const plantationRef = useRef(plantation);
  useEffect(() => { plantationRef.current = plantation; }, [plantation]);

  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(16)).current;
  const alertAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;

  const [alertType,      setAlertType]  = useState(null);
  const [simulatedRisks, setSimulated]  = useState(null);
  const [paraIgnored,    setParaIgnored] = useState(false);

  // Ref pour lire alertType dans useFocusEffect sans en dépendre
  const alertTypeRef2 = useRef(null);
  useEffect(() => { alertTypeRef2.current = alertType; }, [alertType]);
  const [notifSMS,   setNotifSMS]   = useState(true);
  const [notifCall,  setNotifCall]  = useState(false);
  const [lang, setLang] = useState('fr');
  const [showLangMenu, setShowLangMenu] = useState(false);

  function switchPlantation(dir) {
    const next = selectedIndex + dir;
    if (next < 0 || next >= plantations.length) return;
    setSelectedIndex(next);
    setAlertType(null);
    setSimulated(null);
    setParaIgnored(false);
    alertAnim.setValue(0);
    pulseAnim.setValue(1);
  }

  // Fade-in initial (une seule fois)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  // Simulation déclenchée à chaque fois que l'écran reprend le focus
  useFocusEffect(useCallback(() => {
    // Si une alerte est déjà active (retour depuis RiskGuide/Indemnisation), on la conserve
    if (alertTypeRef2.current !== null) return;

    visitCount++;
    const mod = visitCount % 3;
    const type = mod === 1 ? 'secheresse' : mod === 2 ? 'inondation' : 'parametre';

    setAlertType(null);
    setSimulated(null);
    setParaIgnored(false);
    alertAnim.setValue(0);
    pulseAnim.setValue(1);

    const timer = setTimeout(() => {
      const criticalRisk = { level: 'critique', score: 91, trend: 'up' };
      setAlertType(type);
      if (type !== 'parametre') {
        setSimulated({
          secheresse: type === 'secheresse' ? criticalRisk : plantationRef.current.risks.secheresse,
          inondation: type === 'inondation' ? criticalRisk : plantationRef.current.risks.inondation,
        });
      }
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
  }, []));

  const displayRisks = simulatedRisks || plantation.risks;

  if (!plantation) return null;

  const overallRisk = RISK_LEVELS[plantation.riskLevel] || RISK_LEVELS.modere;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Image source={logo} style={styles.topLogo} resizeMode="contain" />
        </View>
        <View style={styles.topActions}>
          {/* Dropdown langue */}
          <View style={styles.langWrap}>
            <TouchableOpacity
              style={[styles.langBtn, showLangMenu && styles.langBtnOpen]}
              onPress={() => setShowLangMenu(v => !v)}
              activeOpacity={0.75}
            >
              <Icon name="Globe" size={12} color={COLORS.brand} strokeWidth={2} />
              <Text style={styles.langBtnText}>
                {LANGUAGES.find(l => l.code === lang)?.short}
              </Text>
              <Icon name={showLangMenu ? 'ChevronUp' : 'ChevronDown'} size={10} color={COLORS.brand} strokeWidth={2.5} />
            </TouchableOpacity>

            {showLangMenu && (
              <View style={styles.langDropdown}>
                {LANGUAGES.map((l, i) => (
                  <TouchableOpacity
                    key={l.code}
                    style={[
                      styles.langOption,
                      i < LANGUAGES.length - 1 && styles.langOptionDivider,
                      lang === l.code && styles.langOptionActive,
                    ]}
                    onPress={() => { setLang(l.code); setShowLangMenu(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.langOptionShort, lang === l.code && { color: COLORS.brand }]}>
                      {l.short}
                    </Text>
                    <Text style={[styles.langOptionLabel, lang === l.code && { color: COLORS.brand }]}>
                      {l.label}
                    </Text>
                    {lang === l.code && (
                      <Icon name="Check" size={12} color={COLORS.brand} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Alerts')}>
            <Icon name="Bell" size={20} color={COLORS.textSecondary} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
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

          {/* Switcher multi-plantation */}
          {!fromCreation && plantations.length > 1 && (
            <>
              {selectedIndex > 0 && (
                <TouchableOpacity style={styles.heroArrowLeft} onPress={() => switchPlantation(-1)} activeOpacity={0.7}>
                  <Icon name="ChevronLeft" size={20} color="#FFF" strokeWidth={2.5} />
                </TouchableOpacity>
              )}
              {selectedIndex < plantations.length - 1 && (
                <TouchableOpacity style={styles.heroArrowRight} onPress={() => switchPlantation(1)} activeOpacity={0.7}>
                  <Icon name="ChevronRight" size={20} color="#FFF" strokeWidth={2.5} />
                </TouchableOpacity>
              )}
              <View style={styles.heroDots}>
                {plantations.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => switchPlantation(i - selectedIndex)} activeOpacity={0.7}>
                    <View style={[styles.heroDot, i === selectedIndex && styles.heroDotActive]} />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          <View style={styles.heroBottom}>
            <View style={styles.heroLabel}>
              <Text style={styles.heroLabelText}>{plantation.cropLabel}</Text>
            </View>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaPill}>
                <Icon name="MapPin" size={11} color="#FFF" strokeWidth={2} />
                <Text style={styles.heroMetaText}>{plantation.region}</Text>
              </View>
              <View style={styles.heroMetaPill}>
                <Icon name="Maximize2" size={11} color="#FFF" strokeWidth={2} />
                <Text style={styles.heroMetaText}>{plantation.area} ha</Text>
              </View>
              <View style={[styles.heroMetaPill, { backgroundColor: overallRisk.color + 'CC' }]}>
                <Text style={styles.heroMetaText}>{overallRisk.label}</Text>
              </View>
            </View>
          </View>
        </Animated.View>


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
              const clr = alertType === 'secheresse' ? '#B45309' : '#0369A1';
              return (
                <Animated.View
                  key={key}
                  style={isAlert ? { transform: [{ scale: pulseAnim }] } : undefined}
                >
                  <TouchableOpacity
                    activeOpacity={isAlert ? 0.75 : 1}
                    onPress={() => isAlert && navigation.navigate('RiskGuide', { type: key })}
                  >
                    <RiskRow
                      type={key}
                      level={val.level}
                      score={val.score}
                      trend={val.trend}
                      delay={i * 150}
                    />
                  </TouchableOpacity>

                  {isAlert && (
                    <View style={styles.inlineActions}>
                      <TouchableOpacity
                        style={[styles.inlineActionBtn, { borderColor: clr + '40', backgroundColor: clr + '12' }]}
                        onPress={() => navigation.navigate('RiskGuide', { type: key })}
                        activeOpacity={0.8}
                      >
                        <Icon name="AlertTriangle" size={13} color={clr} strokeWidth={2} />
                        <Text style={[styles.inlineActionTxt, { color: clr }]}>Appuyer pour le guide d'urgence</Text>
                        <Icon name="ChevronRight" size={13} color={clr} strokeWidth={2.5} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.inlineActionBtn, { borderColor: COLORS.success + '40', backgroundColor: COLORS.success + '12' }]}
                        onPress={() => navigation.navigate('Indemnisation', { type: key })}
                        activeOpacity={0.8}
                      >
                        <Icon name="Shield" size={13} color={COLORS.success} strokeWidth={2} />
                        <Text style={[styles.inlineActionTxt, { color: COLORS.success }]}>Recevoir votre indemnisation</Text>
                        <Icon name="ChevronRight" size={13} color={COLORS.success} strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  )}
                </Animated.View>
              );
            })}
        </View>

        {/* Paramètres climatiques temps réel */}
        <View style={[styles.section, SHADOW.sm, { marginHorizontal: SPACING.md }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabel}>
              <Icon name="Satellite" size={14} color={COLORS.brand} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Paramètres climatiques</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Temps réel</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {CLIMATE_ROWS.map((row, ri) => (
            <View key={ri} style={[styles.climateRow, ri > 0 && { marginTop: 8 }]}>
              {row.map((p, pi) => {
                const isPluie = p.icon === 'CloudRain';
                const isParamTrigger = alertType === 'parametre' && isPluie;
                return (
                  <View key={pi} style={[styles.climateCell, isParamTrigger && { borderColor: COLORS.warningBorder, borderWidth: 1 }]}>
                    <Icon name={p.icon} size={16} color={isParamTrigger ? COLORS.warning : COLORS.brand} strokeWidth={1.75} />
                    <Text style={[styles.climateValue, isParamTrigger && { color: COLORS.warning }]}>
                      {isParamTrigger ? '0 mm' : p.value}
                    </Text>
                    <Text style={styles.climateLabel}>{p.label}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Carte assurance paramétrique */}
        {alertType === 'parametre' && !paraIgnored && (
          <Animated.View style={[styles.paraCard, { opacity: alertAnim, marginHorizontal: SPACING.md }]}>
            <View style={styles.paraHeader}>
              <Icon name="CloudRain" size={15} color={COLORS.warning} strokeWidth={2} />
              <Text style={styles.paraTitle}>Seuil paramétrique atteint</Text>
            </View>
            <Text style={styles.paraDesc}>
              Pluie/jour = 0 mm depuis 15 jours — seuil contractuel : {'<'} 5 mm/j
            </Text>
            <Text style={styles.paraQuestion}>Souhaitez-vous accéder à votre assurance paramétrique ?</Text>
            <View style={styles.paraActions}>
              <TouchableOpacity
                style={styles.paraYes}
                onPress={() => navigation.navigate('Indemnisation', { type: 'secheresse', skipToPayment: true })}
                activeOpacity={0.85}
              >
                <Text style={styles.paraYesTxt}>Oui, accéder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paraNo}
                onPress={() => setParaIgnored(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.paraNoTxt}>Non, merci</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Alertes & Notifications */}
        <View style={[styles.section, SHADOW.sm, { marginHorizontal: SPACING.md }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabel}>
              <Icon name="Bell" size={14} color={COLORS.brand} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Alertes & Notifications</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {[
            { icon: 'Smartphone', label: 'Alertes SMS',       sub: 'Recevez une alerte à chaque déclenchement',         state: notifSMS,   set: setNotifSMS   },
            { icon: 'Phone',      label: 'Appel d\'urgence',  sub: 'Appel automatique en cas de sinistre critique',      state: notifCall,  set: setNotifCall  },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <TouchableOpacity
                style={styles.notifRow}
                onPress={() => item.set(!item.state)}
                activeOpacity={0.75}
              >
                <View style={[styles.notifIconWrap, item.state
                  ? { backgroundColor: COLORS.brandBg, borderColor: COLORS.brandBorder }
                  : { backgroundColor: COLORS.bgSecondary, borderColor: COLORS.border }
                ]}>
                  <Icon name={item.icon} size={15} color={item.state ? COLORS.brand : COLORS.textMuted} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifLabel}>{item.label}</Text>
                  <Text style={styles.notifSub}>{item.sub}</Text>
                </View>
                <View style={[styles.toggle, { backgroundColor: item.state ? COLORS.brand : COLORS.border }]}>
                  <View style={[styles.toggleThumb, { transform: [{ translateX: item.state ? 18 : 2 }] }]} />
                </View>
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
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

        {/* Analyse IA */}
        <TouchableOpacity
          style={[styles.aiBtn, SHADOW.sm, { marginHorizontal: SPACING.md }]}
          onPress={() => navigation.navigate('AIAnalysis')}
          activeOpacity={0.85}
        >
          <Icon name="Bot" size={16} color="#5CB83C" strokeWidth={2} />
          <Text style={styles.aiBtnText}>Voir l'analyse IA en temps réel</Text>
          <Icon name="ChevronRight" size={14} color="rgba(255,255,255,0.5)" strokeWidth={2} />
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
    zIndex: 200, elevation: 200,
  },
  topLogo: { width: 110, height: 34 },
  topSub: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  liveDotSmall: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  topSubText: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  // ── Dropdown langue ──
  langWrap: { position: 'relative', zIndex: 100 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.brandBorder,
    backgroundColor: COLORS.brandBg,
  },
  langBtnOpen: { borderColor: COLORS.brand },
  langBtnText: { fontSize: 11, fontFamily: FONTS.bold, color: COLORS.brand, letterSpacing: 0.5 },
  langDropdown: {
    position: 'absolute',
    top: 34,
    right: 0,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
    minWidth: 148,
    overflow: 'hidden',
  },
  langOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 11, gap: 8,
  },
  langOptionDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  langOptionActive: { backgroundColor: COLORS.brandBg },
  langOptionShort: { fontSize: 11, fontFamily: FONTS.bold, color: COLORS.textMuted, letterSpacing: 0.5, width: 22 },
  langOptionLabel: { flex: 1, fontSize: 13, fontFamily: FONTS.medium, color: COLORS.text },
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

  heroArrowLeft: {
    position: 'absolute', left: 12, top: '50%', marginTop: -18,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroArrowRight: {
    position: 'absolute', right: 12, top: '50%', marginTop: -18,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroDots: {
    position: 'absolute', top: 14, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 5,
  },
  heroDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  heroDotActive: {
    width: 18, backgroundColor: '#FFF',
  },

  heroBottom: {
    position: 'absolute', bottom: 14, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  heroLabel: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  heroLabelText: { fontSize: 13, fontFamily: FONTS.semibold, color: '#FFF' },
  heroMeta: { flexDirection: 'row', gap: 6 },
  heroMetaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  heroMetaText: { fontSize: 11, fontFamily: FONTS.medium, color: '#FFF' },
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
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.textMuted },
  liveText: { fontSize: 10, fontFamily: FONTS.semibold, color: COLORS.textMuted },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.xs },
  climateRow: { flexDirection: 'row', gap: 8 },
  climateCell: {
    flex: 1, alignItems: 'center', gap: 3,
    backgroundColor: COLORS.bgSecondary, borderRadius: RADIUS.sm,
    paddingVertical: 10, paddingHorizontal: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  climateValue: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.text },
  climateLabel: { fontSize: 10, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center' },
  thresholdAlert: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderWidth: 1, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm,
  },
  thresholdText: { flex: 1, fontSize: 11, fontFamily: FONTS.medium, color: '#B45309', lineHeight: 15 },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: SPACING.sm },
  notifIconWrap: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  notifLabel: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.text, marginBottom: 1 },
  notifSub: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  toggle: { width: 36, height: 20, borderRadius: 10, justifyContent: 'center' },
  toggleThumb: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFF' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.brandBorder, backgroundColor: COLORS.brandBg, borderStyle: 'dashed',
  },
  aiBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 13, paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: '#0A1A0D',
    borderWidth: 1, borderColor: 'rgba(92,184,60,0.25)',
  },
  aiBtnText: { flex: 1, fontSize: 13, fontFamily: FONTS.medium, color: '#FFF' },
  addBtnText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.brand },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.sm,
  },
  alertTitle: { fontSize: 13, fontFamily: FONTS.semibold },
  alertSub: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 1 },
  inlineActions: { gap: 6, marginTop: 4, marginBottom: 2 },
  inlineActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: RADIUS.sm,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  inlineActionTxt: { flex: 1, fontSize: 12, fontFamily: FONTS.semibold },
  paraCard: {
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.warningBorder,
    gap: 8,
  },
  paraHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  paraTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.warning },
  paraDesc: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 17 },
  paraQuestion: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.text },
  paraActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  paraYes: {
    flex: 1, backgroundColor: COLORS.brand, borderRadius: RADIUS.md,
    paddingVertical: 10, alignItems: 'center',
  },
  paraYesTxt: { fontSize: 13, fontFamily: FONTS.semibold, color: '#FFF' },
  paraNo: {
    flex: 1, backgroundColor: COLORS.bgSecondary, borderRadius: RADIUS.md,
    paddingVertical: 10, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  paraNoTxt: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textMuted },
});
