import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import Icon from '../components/LucideIcon';

const mais_malade = require('../assets/images/mais_malade.png');

const GUIDES = {
  secheresse: {
    title: 'Alerte Sécheresse',
    subtitle: 'Risque critique détecté — agissez maintenant',
    color: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA',
    icon: 'Sun',
    steps: [
      {
        title: 'Suspendre les traitements',
        desc: 'Arrêtez toute fertilisation immédiatement. Les engrais accélèrent le stress hydrique et aggravent les dégâts.',
      },
      {
        title: 'Irrigation d\'urgence',
        desc: 'Installez un système goutte-à-goutte ciblé au pied des plants. Arrosez tôt le matin (5h–7h) pour limiter l\'évaporation.',
      },
      {
        title: 'Appliquer du paillage',
        desc: 'Couvrez le sol d\'une couche de paillis organique de 8–10 cm autour des pieds pour retenir l\'humidité.',
      },
      {
        title: 'Tailler les feuilles sèches',
        desc: 'Retirez les feuilles jaunies ou desséchées. Cela réduit la transpiration et concentre l\'eau vers les organes vitaux.',
      },
      {
        title: 'Alerter la coopérative',
        desc: 'Signalez la situation à votre coopérative locale. Une assistance collective peut être mobilisée sous 48h.',
      },
    ],
  },
  inondation: {
    title: 'Alerte Inondation',
    subtitle: 'Risque critique détecté — agissez maintenant',
    color: '#0284C7',
    bg: '#F0F9FF',
    border: '#BAE6FD',
    icon: 'Droplets',
    steps: [
      {
        title: 'Creuser des canaux de drainage',
        desc: 'Ouvrez des rigoles autour du périmètre du champ pour évacuer l\'eau vers les zones basses. Profondeur minimale : 30 cm.',
      },
      {
        title: 'Éliminer l\'eau stagnante',
        desc: 'Agissez dans les 24h. Au-delà de 48h, l\'asphyxie racinaire devient irréversible pour le maïs.',
      },
      {
        title: 'Traitement fongicide préventif',
        desc: 'Appliquez un fongicide à base de cuivre pour prévenir la fonte des semis et les maladies liées à l\'excès d\'humidité.',
      },
      {
        title: 'Aucune intervention mécanique',
        desc: 'Ne faites pas circuler d\'engins dans le champ tant que le sol est saturé — le tassement aggraverait les dégâts.',
      },
      {
        title: 'Évaluer les plants après retrait',
        desc: 'Une fois l\'eau évacuée, inspectez les plants : nécrose racinaire, verse, décoloration des tiges. Photographiez pour le dossier.',
      },
    ],
  },
};

function StepItem({ step, index, total, color, delay }) {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(20)).current;
  const [validated, setValidated] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const isLast = index === total - 1;

  function handlePhoto() {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setValidated(true);
    }, 1800);
  }

  return (
    <Animated.View style={[styles.stepRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Colonne gauche : numéro + ligne */}
      <View style={styles.stepLeft}>
        <View style={[
          styles.circle,
          { borderColor: validated ? COLORS.success : color },
          { backgroundColor: validated ? COLORS.success : (step.highlight ? color : COLORS.bgPrimary) },
        ]}>
          {validated
            ? <Icon name="Check" size={14} color="#FFF" strokeWidth={3} />
            : <Text style={[styles.circleNum, { color: step.highlight ? '#FFF' : color }]}>{index + 1}</Text>
          }
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: validated ? COLORS.success + '60' : color + '40' }]} />}
      </View>

      {/* Colonne droite : contenu */}
      <View style={[
        styles.stepContent,
        step.highlight && { backgroundColor: step.bg || COLORS.brandBg, borderColor: color + '40' },
        validated && { borderColor: COLORS.successBorder, backgroundColor: COLORS.successBg },
      ]}>
        {step.highlight && (
          <View style={styles.stepIconRow}>
            <Icon name="Zap" size={13} color={color} strokeWidth={2} />
            <Text style={[styles.stepTag, { color }]}>Automatique</Text>
          </View>
        )}
        <Text style={[styles.stepTitle, step.highlight && { color }, validated && { color: COLORS.success }]}>
          {step.title}
        </Text>
        <Text style={styles.stepDesc}>{step.desc}</Text>

        {/* Champ photo fictif — pas sur la dernière étape automatique */}
        {!step.highlight && (
          <View style={styles.photoZone}>
            {validated ? (
              <View style={styles.photoValidated}>
                <Image source={mais_malade} style={styles.photoThumb} resizeMode="cover" />
                <View style={styles.photoValidBadge}>
                  <Icon name="CheckCircle2" size={12} color={COLORS.success} strokeWidth={2.5} />
                  <Text style={styles.photoValidText}>Agro AI a validé cette étape</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.photoBtn, analyzing && { opacity: 0.6 }]}
                onPress={handlePhoto}
                disabled={analyzing}
                activeOpacity={0.75}
              >
                <Icon
                  name={analyzing ? 'Loader' : 'ImagePlus'}
                  size={15}
                  color={color}
                  strokeWidth={2}
                />
                <Text style={[styles.photoBtnText, { color }]}>
                  {analyzing ? 'Agro AI analyse...' : 'Prendre une photo pour valider'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default function RiskGuideScreen({ route, navigation }) {
  const { type } = route.params;
  const guide = GUIDES[type];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="ArrowLeft" size={20} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guide d'urgence</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Alert banner */}
        <View style={[styles.alertBanner, { backgroundColor: guide.bg, borderColor: guide.border }]}>
          <View style={[styles.alertIcon, { backgroundColor: guide.color + '20' }]}>
            <Icon name={guide.icon} size={22} color={guide.color} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.alertTitle, { color: guide.color }]}>{guide.title}</Text>
            <Text style={styles.alertSub}>{guide.subtitle}</Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {guide.steps.map((step, i) => (
            <StepItem
              key={i}
              step={{ ...step, bg: guide.bg }}
              index={i}
              total={guide.steps.length}
              color={guide.color}
              delay={i * 80}
            />
          ))}
        </View>

        {/* Bouton accéder à l'indemnisation */}
        <TouchableOpacity
          style={[styles.indemnBtn, { backgroundColor: guide.color }]}
          onPress={() => navigation.navigate('Indemnisation', { type })}
          activeOpacity={0.85}
        >
          <View style={styles.indemnBtnLeft}>
            <Icon name="Shield" size={20} color="#FFF" strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.indemnBtnTitle}>Accéder à l'indemnisation</Text>
            <Text style={styles.indemnBtnSub}>Déclencher la procédure smart contract</Text>
          </View>
          <Icon name="ChevronRight" size={18} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgSecondary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.bgPrimary,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontFamily: FONTS.semibold, color: COLORS.text },

  container: { padding: SPACING.md, gap: SPACING.md },

  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md,
  },
  alertIcon: {
    width: 48, height: 48, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  alertTitle: { fontSize: 16, fontFamily: FONTS.bold },
  alertSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 2 },

  steps: { gap: 0 },

  stepRow: {
    flexDirection: 'row',
    gap: 16,
    minHeight: 80,
  },

  stepLeft: {
    width: 36,
    alignItems: 'center',
  },
  circle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, flexShrink: 0,
  },
  circleNum: { fontSize: 14, fontFamily: FONTS.bold },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 4,
    borderRadius: 1,
    minHeight: 24,
  },

  stepContent: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 3,
  },
  stepContentHighlight: { borderWidth: 1 },
  stepIconRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  stepTag: { fontSize: 10, fontFamily: FONTS.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  stepTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.text },
  stepDesc: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 17 },

  indemnBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: RADIUS.lg, padding: SPACING.md,
  },
  indemnBtnLeft: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  indemnBtnTitle: { fontSize: 14, fontFamily: FONTS.bold, color: '#FFF' },
  indemnBtnSub:   { fontSize: 11, fontFamily: FONTS.regular, color: 'rgba(255,255,255,0.75)', marginTop: 1 },

  photoZone: { marginTop: 8 },
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderWidth: 1, borderStyle: 'dashed', borderRadius: RADIUS.md,
    paddingVertical: 8, paddingHorizontal: 10,
    borderColor: COLORS.border, backgroundColor: COLORS.bgSecondary,
  },
  photoBtnText: { fontSize: 12, fontFamily: FONTS.medium },
  photoValidated: { gap: 6 },
  photoThumb: {
    width: '100%', height: 80, borderRadius: RADIUS.md, overflow: 'hidden',
  },
  photoValidBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.sm,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.successBorder,
  },
  photoValidText: { fontSize: 11, fontFamily: FONTS.semibold, color: COLORS.success },
});
