import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import Icon from '../components/LucideIcon';

const mais_malade    = require('../assets/images/mais_malade.png');
const secheress_02   = require('../assets/images/secheress_02.png');
const secheress_03   = require('../assets/images/secheress_03.png');

const GUIDES = {
  secheresse: {
    color: '#B45309',
    bg: '#FEF8EB',
    border: '#F5D49A',
    steps: [
      {
        title: 'Suspendre les traitements',
        desc: 'Arrêtez toute fertilisation immédiatement. Les engrais accélèrent le stress hydrique et aggravent les dégâts.',
        requirePhoto: false,
      },
      {
        title: "Irrigation d'urgence",
        desc: "Installez un système goutte-à-goutte ciblé au pied des plants. Arrosez tôt le matin (5h–7h) pour limiter l'évaporation.",
        requirePhoto: true,
        photoImage: secheress_02,
      },
      {
        title: 'Appliquer du paillage',
        desc: "Couvrez le sol d'une couche de paillis organique de 8–10 cm autour des pieds pour retenir l'humidité.",
        requirePhoto: true,
        photoImage: secheress_03,
      },
      {
        title: 'Tailler les feuilles sèches',
        desc: 'Retirez les feuilles jaunies ou desséchées. Cela réduit la transpiration et concentre l\'eau vers les organes vitaux.',
        requirePhoto: true,
      },
      {
        title: 'Alerter la coopérative',
        desc: 'Signalez la situation à votre coopérative locale. Une assistance collective peut être mobilisée sous 48h.',
        requirePhoto: false,
      },
    ],
  },
  inondation: {
    color: '#0369A1',
    bg: '#EFF7FF',
    border: '#BAD8F0',
    steps: [
      {
        title: 'Creuser des canaux de drainage',
        desc: "Ouvrez des rigoles autour du périmètre du champ pour évacuer l'eau vers les zones basses. Profondeur minimale : 30 cm.",
        requirePhoto: true,
      },
      {
        title: "Éliminer l'eau stagnante",
        desc: "Agissez dans les 24h. Au-delà de 48h, l'asphyxie racinaire devient irréversible pour le maïs.",
        requirePhoto: true,
      },
      {
        title: 'Traitement fongicide préventif',
        desc: "Appliquez un fongicide à base de cuivre pour prévenir la fonte des semis et les maladies liées à l'excès d'humidité.",
        requirePhoto: false,
      },
      {
        title: 'Aucune intervention mécanique',
        desc: "Ne faites pas circuler d'engins dans le champ tant que le sol est saturé — le tassement aggraverait les dégâts.",
        requirePhoto: false,
      },
      {
        title: 'Évaluer les plants après retrait',
        desc: 'Une fois l\'eau évacuée, inspectez les plants : nécrose racinaire, verse, décoloration des tiges.',
        requirePhoto: true,
      },
    ],
  },
};

function StepItem({ step, index, total, color, delay }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scanAnim  = useRef(new Animated.Value(0)).current;
  const scanLoop  = useRef(null);

  const [validated, setValidated] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const isLast   = index === total - 1;
  const photoSrc = step.photoImage ?? mais_malade;

  const scanY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 72] });

  function handlePhoto() {
    setAnalyzing(true);
    scanLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0,   useNativeDriver: true }),
      ])
    );
    scanLoop.current.start();
    setTimeout(() => {
      if (scanLoop.current) scanLoop.current.stop();
      setAnalyzing(false);
      setValidated(true);
    }, 1800);
  }

  function handleDone() {
    setValidated(true);
  }

  return (
    <Animated.View style={[styles.stepRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Colonne gauche */}
      <View style={styles.stepLeft}>
        <View style={[
          styles.circle,
          { borderColor: validated ? COLORS.success : color },
          { backgroundColor: validated ? COLORS.success : COLORS.bgPrimary },
        ]}>
          {validated
            ? <Icon name="Check" size={14} color="#FFF" strokeWidth={3} />
            : <Text style={[styles.circleNum, { color }]}>{index + 1}</Text>
          }
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: validated ? COLORS.success + '60' : color + '40' }]} />}
      </View>

      {/* Colonne droite */}
      <View style={[
        styles.stepContent,
        validated && { borderColor: COLORS.successBorder, backgroundColor: COLORS.successBg },
      ]}>
        <Text style={[styles.stepTitle, validated && { color: COLORS.success }]}>{step.title}</Text>
        <Text style={styles.stepDesc}>{step.desc}</Text>

        <View style={styles.actionZone}>
          {validated ? (
            <View style={styles.validatedBadge}>
              <Icon name="CheckCircle2" size={12} color={COLORS.success} strokeWidth={2.5} />
              <Text style={styles.validatedText}>
                {step.requirePhoto ? 'Agro AI a validé cette étape' : 'Étape complétée'}
              </Text>
            </View>
          ) : step.requirePhoto ? (
            <>
              {/* Photo + scan IA */}
              {analyzing && (
                <View style={styles.photoContainer}>
                  <Image source={photoSrc} style={styles.photoThumb} resizeMode="cover" />
                  <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanY }] }]} />
                  <View style={styles.iaBadge}>
                    <Icon name="Bot" size={9} color="#5CB83C" strokeWidth={2} />
                    <Text style={styles.iaBadgeText}>IA</Text>
                  </View>
                </View>
              )}

              {analyzing ? (
                <View style={styles.analyzingRow}>
                  <Icon name="Loader" size={13} color={color} strokeWidth={2} />
                  <Text style={[styles.analyzingText, { color }]}>Agro AI analyse votre champ…</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.photoBtn, { borderColor: color + '60' }]}
                  onPress={handlePhoto}
                  activeOpacity={0.75}
                >
                  <Icon name="ImagePlus" size={15} color={color} strokeWidth={2} />
                  <Text style={[styles.photoBtnText, { color }]}>Prendre une photo pour valider</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={handleDone}
              activeOpacity={0.75}
            >
              <Icon name="Check" size={14} color={COLORS.brand} strokeWidth={2.5} />
              <Text style={styles.doneBtnText}>Marquer comme fait</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export default function RiskGuideScreen({ route, navigation }) {
  const { type } = route.params;
  const guide = GUIDES[type];
  const typeLabel = type === 'secheresse' ? 'Sécheresse' : 'Inondation';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="ArrowLeft" size={20} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guide d'urgence : {typeLabel}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.steps}>
          {guide.steps.map((step, i) => (
            <StepItem
              key={i}
              step={step}
              index={i}
              total={guide.steps.length}
              color={guide.color}
              delay={i * 80}
            />
          ))}
        </View>
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

  steps: { gap: 0 },

  stepRow: { flexDirection: 'row', gap: 16, minHeight: 80 },

  stepLeft: { width: 36, alignItems: 'center' },
  circle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, flexShrink: 0,
  },
  circleNum: { fontSize: 14, fontFamily: FONTS.bold },
  line: {
    flex: 1, width: 2, marginVertical: 4, borderRadius: 1, minHeight: 24,
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
  stepTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.text },
  stepDesc: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 17 },

  actionZone: { marginTop: 8 },

  photoContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: RADIUS.md,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#5CB83C',
  },
  photoThumb: { width: '100%', height: 140 },
  scanLine: {
    position: 'absolute',
    left: 0, right: 0, height: 14,
    backgroundColor: 'rgba(92,184,60,0.38)',
  },
  iaBadge: {
    position: 'absolute', top: 6, right: 6,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  iaBadgeText: { fontSize: 9, fontFamily: FONTS.bold, color: '#5CB83C', letterSpacing: 1 },

  analyzingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 6,
  },
  analyzingText: { fontSize: 12, fontFamily: FONTS.medium },

  photoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderWidth: 1, borderStyle: 'dashed', borderRadius: RADIUS.md,
    paddingVertical: 8, paddingHorizontal: 10,
    backgroundColor: COLORS.bgSecondary,
  },
  photoBtnText: { fontSize: 12, fontFamily: FONTS.medium },

  doneBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderWidth: 1, borderRadius: RADIUS.md,
    paddingVertical: 8, paddingHorizontal: 10,
    backgroundColor: COLORS.brandBg, borderColor: COLORS.brandBorder,
  },
  doneBtnText: { fontSize: 12, fontFamily: FONTS.medium, color: COLORS.brand },

  validatedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.sm,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.successBorder,
  },
  validatedText: { fontSize: 11, fontFamily: FONTS.semibold, color: COLORS.success },
});
