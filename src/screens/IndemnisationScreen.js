import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import Icon from '../components/LucideIcon';
import { useApp } from '../context/AppContext';

const mais_malade = require('../assets/images/mais_malade.png');

const AMOUNTS = {
  secheresse: { display: '420 000', raw: 420000 },
  inondation:  { display: '520 000', raw: 520000 },
};

const PAYMENT_OPTIONS = [
  { id: 'wave', label: 'Wave',             color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: 'Smartphone' },
  { id: 'mtn',  label: 'MTN Money',        color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: 'Phone'      },
  { id: 'bank', label: 'Virement bancaire',color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: 'CreditCard' },
];

const GUIDE_META = {
  secheresse: { color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', icon: 'Sun',      label: 'Sécheresse' },
  inondation:  { color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', icon: 'Droplets', label: 'Inondation'  },
};

const STEP_LABELS = ['GPS', 'Photo', 'Contrat & Paiement'];

export default function IndemnisationScreen({ route, navigation }) {
  const { type } = route.params;
  const { user } = useApp();

  const guide  = GUIDE_META[type] || GUIDE_META.secheresse;
  const amount = AMOUNTS[type]    || AMOUNTS.secheresse;

  const [step, setStep]                       = useState(0);
  const [gpsLoading, setGpsLoading]           = useState(false);
  const [photoLoading, setPhotoLoading]       = useState(false);
  const [photoOk, setPhotoOk]                 = useState(false);
  const [contractOk, setContractOk]           = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentSent, setPaymentSent]         = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  // Dès qu'on atteint l'étape 2, démarrer la validation du contrat
  useEffect(() => {
    if (step === 2 && !contractOk) {
      Animated.timing(progressAnim, { toValue: 1, duration: 3000, useNativeDriver: false }).start();
      const t = setTimeout(() => setContractOk(true), 3200);
      return () => clearTimeout(t);
    }
  }, [step]);

  function activateGPS() {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsLoading(false);
      setTimeout(() => setStep(1), 600);
    }, 2500);
  }

  function takePhoto() {
    setPhotoLoading(true);
    setTimeout(() => {
      setPhotoLoading(false);
      setPhotoOk(true);
      setTimeout(() => setStep(2), 1000);
    }, 2000);
  }

  function handlePayment(opt) {
    setSelectedPayment(opt);
    setTimeout(() => setPaymentSent(true), 900);
  }


  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="ArrowLeft" size={20} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demande d'indemnisation</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Bannière sinistre */}
        <View style={[styles.banner, { backgroundColor: guide.bg, borderColor: guide.border }]}>
          <View style={[styles.bannerIcon, { backgroundColor: guide.color + '25' }]}>
            <Icon name={guide.icon} size={20} color={guide.color} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: guide.color }]}>Sinistre {guide.label}</Text>
            <Text style={styles.bannerSub}>Assuré par {user?.assureur || 'votre assureur'}</Text>
          </View>
          <View style={styles.amountBadge}>
            <Text style={styles.amountText}>{amount.display}</Text>
            <Text style={styles.amountUnit}>FCFA</Text>
          </View>
        </View>

        {/* Stepper 3 étapes */}
        <View style={styles.stepper}>
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={i}>
              <View style={styles.stepperItem}>
                <View style={[
                  styles.stepperCircle,
                  i < step  && styles.stepperDone,
                  i === step && styles.stepperActive,
                ]}>
                  {i < step
                    ? <Icon name="Check" size={10} color="#FFF" strokeWidth={3} />
                    : <Text style={[styles.stepperNum, i === step && { color: COLORS.brand }]}>{i + 1}</Text>
                  }
                </View>
                <Text style={[styles.stepperLabel, i === step && styles.stepperLabelActive]} numberOfLines={2}>
                  {label}
                </Text>
              </View>
              {i < STEP_LABELS.length - 1 && (
                <View style={[styles.stepperLine, i < step && { backgroundColor: COLORS.success }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── STEP 0 : GPS ── */}
        {step >= 0 && (
          <View style={[styles.card, step > 0 && styles.cardDone, SHADOW.sm]}>
            {step > 0 ? (
              <View style={styles.doneRow}>
                <View style={styles.doneCheck}>
                  <Icon name="Check" size={12} color="#FFF" strokeWidth={3} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.doneTitleTxt}>Localisation confirmée</Text>
                  <Text style={styles.doneSubTxt}>6.8274° N, 5.2893° O · à 0.3 km de votre plantation</Text>
                </View>
                <Icon name="MapPin" size={16} color={COLORS.success} strokeWidth={2} />
              </View>
            ) : (
              <>
                <View style={styles.cardHeader}>
                  <View style={[styles.stepIconWrap, { backgroundColor: '#EFF6FF' }]}>
                    <Icon name="MapPin" size={18} color="#2563EB" strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Attestez votre présence</Text>
                    <Text style={styles.cardSub}>Activez le GPS et rendez-vous dans votre plantation</Text>
                  </View>
                </View>
                <Text style={styles.cardDesc}>
                  Pour valider votre sinistre, nous devons confirmer que vous vous trouvez physiquement dans votre champ au moment de la déclaration.
                </Text>
                <TouchableOpacity
                  style={[styles.actionBtn, gpsLoading && styles.actionBtnLoading]}
                  onPress={activateGPS}
                  disabled={gpsLoading}
                  activeOpacity={0.85}
                >
                  <Icon name={gpsLoading ? 'Loader' : 'MapPin'} size={16} color="#FFF" strokeWidth={2} />
                  <Text style={styles.actionBtnTxt}>
                    {gpsLoading ? 'Localisation en cours...' : 'Activer ma localisation'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* ── STEP 1 : Photo ── */}
        {step >= 1 && (
          <View style={[styles.card, step > 1 && styles.cardDone, SHADOW.sm]}>
            {step > 1 ? (
              <View style={styles.doneRow}>
                <View style={styles.doneCheck}>
                  <Icon name="Check" size={12} color="#FFF" strokeWidth={3} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.doneTitleTxt}>Photo du sinistre enregistrée</Text>
                  <Text style={styles.doneSubTxt}>Analysée et validée par Agro AI</Text>
                </View>
                <Image source={mais_malade} style={styles.photoMini} resizeMode="cover" />
              </View>
            ) : (
              <>
                <View style={styles.cardHeader}>
                  <View style={[styles.stepIconWrap, { backgroundColor: '#FFF7ED' }]}>
                    <Icon name="ImagePlus" size={18} color="#EA580C" strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Photographiez le sinistre</Text>
                    <Text style={styles.cardSub}>Prenez une photo claire des dégâts visibles</Text>
                  </View>
                </View>
                {photoOk ? (
                  <View style={styles.photoPreview}>
                    <Image source={mais_malade} style={styles.photoFull} resizeMode="cover" />
                    <View style={styles.photoTag}>
                      <Icon name="CheckCircle2" size={13} color={COLORS.success} strokeWidth={2.5} />
                      <Text style={styles.photoTagTxt}>Agro AI a analysé et validé la photo</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <Text style={styles.cardDesc}>
                      Photographiez clairement les plants endommagés. L'IA analysera l'image pour évaluer la sévérité du sinistre.
                    </Text>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#EA580C' }, photoLoading && styles.actionBtnLoading]}
                      onPress={takePhoto}
                      disabled={photoLoading}
                      activeOpacity={0.85}
                    >
                      <Icon name={photoLoading ? 'Loader' : 'ImagePlus'} size={16} color="#FFF" strokeWidth={2} />
                      <Text style={styles.actionBtnTxt}>
                        {photoLoading ? 'Agro AI analyse...' : 'Prendre une photo'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
        )}

        {/* ── STEP 2 : Smart Contract + Paiement (même carte) ── */}
        {step >= 2 && (
          <View style={[styles.card, paymentSent && styles.cardDone, SHADOW.sm]}>

            {/* Sous-état A : validation en cours */}
            {!contractOk && (
              <>
                <View style={styles.cardHeader}>
                  <View style={[styles.stepIconWrap, { backgroundColor: COLORS.purpleBg }]}>
                    <Icon name="Zap" size={18} color={COLORS.purple} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Validation blockchain</Text>
                    <Text style={styles.cardSub}>Le smart contract vérifie votre dossier...</Text>
                  </View>
                </View>

                <View style={styles.hashBox}>
                  <Text style={styles.hashLabel}>Transaction en cours</Text>
                  <Text style={styles.hashValue}>0x7f3a8b2c4d9e1f6a3b5c7d2e8f4a1b9c4d6e2f8a…</Text>
                </View>

                <View style={styles.progressBar}>
                  <Animated.View style={[
                    styles.progressFill,
                    { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
                  ]} />
                </View>

                <View style={styles.verifyList}>
                  {['Localisation GPS vérifiée', 'Photo du sinistre analysée', 'Correspondance avec votre contrat'].map((item, i) => (
                    <View key={i} style={styles.verifyItem}>
                      <Icon name="CheckCircle2" size={13} color={COLORS.success} strokeWidth={2.5} />
                      <Text style={styles.verifyTxt}>{item}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Sous-état B : validé → choix du paiement */}
            {contractOk && !paymentSent && (
              <>
                {/* Badge validation réussie */}
                <View style={styles.contractSuccess}>
                  <View style={styles.contractSuccessIcon}>
                    <Icon name="Zap" size={20} color={COLORS.purple} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contractSuccessTitle}>Smart contract validé</Text>
                    <Text style={styles.contractSuccessSub}>Dossier #0x7f3a…c89d approuvé</Text>
                  </View>
                  <View style={styles.contractBadge}>
                    <Icon name="Check" size={12} color="#FFF" strokeWidth={3} />
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Montant débloqué */}
                <View style={styles.amountBox}>
                  <Text style={styles.amountBoxLabel}>Indemnisation débloquée</Text>
                  <Text style={styles.amountBoxValue}>{amount.display} FCFA</Text>
                  <Text style={styles.amountBoxSub}>
                    Par {user?.assureur || 'votre assureur'} · Contrat #0x7f3a
                  </Text>
                </View>

                {/* Choix du paiement */}
                <Text style={styles.payLabel}>Choisissez votre mode de paiement</Text>
                <View style={styles.payOptions}>
                  {PAYMENT_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.payOption,
                        { backgroundColor: opt.bg, borderColor: opt.border },
                        selectedPayment?.id === opt.id && { borderColor: opt.color, borderWidth: 2 },
                      ]}
                      onPress={() => handlePayment(opt)}
                      activeOpacity={0.8}
                    >
                      <Icon name={opt.icon} size={20} color={opt.color} strokeWidth={2} />
                      <Text style={[styles.payOptionLabel, { color: opt.color }]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Sous-état C : paiement confirmé */}
            {paymentSent && (
              <View style={styles.successBox}>
                <View style={styles.successIconWrap}>
                  <Icon name="CheckCircle2" size={42} color={COLORS.success} strokeWidth={1.5} />
                </View>
                <Text style={styles.successTitle}>Paiement en cours !</Text>
                <Text style={styles.successAmount}>{amount.display} FCFA</Text>
                <Text style={styles.successSub}>
                  Votre indemnisation sera créditée via{'\n'}{selectedPayment?.label} dans les 2 heures.
                </Text>
              </View>
            )}

          </View>
        )}

        <View style={{ height: 24 }} />
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

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md,
  },
  bannerIcon: { width: 40, height: 40, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: 15, fontFamily: FONTS.bold },
  bannerSub: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 2 },
  amountBadge: { alignItems: 'flex-end' },
  amountText: { fontSize: 17, fontFamily: FONTS.bold, color: COLORS.text },
  amountUnit: { fontSize: 10, fontFamily: FONTS.medium, color: COLORS.textMuted },

  stepper: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 4 },
  stepperItem: { alignItems: 'center', gap: 4, flex: 1 },
  stepperCircle: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.bgPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  stepperActive: { borderColor: COLORS.brand, backgroundColor: COLORS.brandBg },
  stepperDone:   { borderColor: COLORS.success, backgroundColor: COLORS.success },
  stepperNum: { fontSize: 11, fontFamily: FONTS.semibold, color: COLORS.textMuted },
  stepperLabel: { fontSize: 10, fontFamily: FONTS.medium, color: COLORS.textMuted, textAlign: 'center' },
  stepperLabelActive: { color: COLORS.brand, fontFamily: FONTS.semibold },
  stepperLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginTop: 13 },

  card: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  cardDone: { borderColor: COLORS.successBorder, backgroundColor: COLORS.successBg },

  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepIconWrap: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardTitle: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text },
  cardSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 1 },
  cardDesc: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 19 },

  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  doneCheck: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.success,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  doneTitleTxt: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.success },
  doneSubTxt:   { fontSize: 11, fontFamily: FONTS.regular,  color: COLORS.textMuted, marginTop: 1 },
  photoMini: { width: 44, height: 44, borderRadius: RADIUS.sm, flexShrink: 0 },

  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.brand, borderRadius: RADIUS.md,
    paddingVertical: 12, paddingHorizontal: SPACING.md,
  },
  actionBtnLoading: { opacity: 0.65 },
  actionBtnTxt: { fontSize: 14, fontFamily: FONTS.semibold, color: '#FFF' },

  photoPreview: { gap: 8 },
  photoFull: { width: '100%', height: 160, borderRadius: RADIUS.md },
  photoTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.sm,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.successBorder,
  },
  photoTagTxt: { fontSize: 12, fontFamily: FONTS.semibold, color: COLORS.success },

  hashBox: {
    backgroundColor: '#1A1A2E', borderRadius: RADIUS.md, padding: 10, gap: 3,
  },
  hashLabel: {
    fontSize: 9, fontFamily: FONTS.semibold, color: '#64748B',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  hashValue: { fontSize: 11, fontFamily: FONTS.regular, color: '#94A3B8', letterSpacing: 0.2 },
  progressBar: { height: 6, backgroundColor: COLORS.bgTertiary, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: COLORS.purple, borderRadius: 3 },
  verifyList: { gap: 6 },
  verifyItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  verifyTxt: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary },

  contractSuccess: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.purpleBg, borderRadius: RADIUS.md,
    padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.purpleBorder,
  },
  contractSuccessIcon: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    backgroundColor: COLORS.purpleBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  contractSuccessTitle: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.purple },
  contractSuccessSub:   { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  contractBadge: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.success,
    alignItems: 'center', justifyContent: 'center',
  },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 2 },

  amountBox: {
    backgroundColor: COLORS.successBg, borderRadius: RADIUS.md,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.successBorder,
    alignItems: 'center', gap: 3,
  },
  amountBoxLabel: {
    fontSize: 10, fontFamily: FONTS.semibold, color: COLORS.success,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  amountBoxValue: { fontSize: 28, fontFamily: FONTS.bold, color: COLORS.success },
  amountBoxSub:   { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },

  payLabel: { fontSize: 12, fontFamily: FONTS.semibold, color: COLORS.textSecondary },
  payOptions: { gap: 8 },
  payOption: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.sm,
  },
  payOptionLabel: { fontSize: 14, fontFamily: FONTS.semibold, flex: 1 },
  preferredTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  preferredTxt: { fontSize: 10, fontFamily: FONTS.semibold },

  successBox: { alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md },
  successIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.successBg,
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle:  { fontSize: 18, fontFamily: FONTS.bold,    color: COLORS.text },
  successAmount: { fontSize: 30, fontFamily: FONTS.bold,    color: COLORS.success },
  successSub: {
    fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted,
    textAlign: 'center', lineHeight: 20,
  },
});
