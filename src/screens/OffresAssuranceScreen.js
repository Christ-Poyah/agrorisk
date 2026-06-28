import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import Icon from '../components/LucideIcon';

const sunu_logo    = require('../assets/images/sunu_assurance.png');
const nsia_logo    = require('../assets/images/nsia_banque.png');
const allianz_logo = require('../assets/images/allianz.png');
const sonar_logo   = require('../assets/images/sonar_assurance.png');
const sanlam_logo  = require('../assets/images/sanlam.png');

const OFFRES = [
  {
    assureurId: 'sunu',
    assureur: 'SUNU Assurances',
    logo: sunu_logo,
    color: '#0284C7',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    abbr: 'SU',
    plans: [
      {
        name: 'AgroBase',
        price: '2 500',
        coverage: '250 000',
        features: ['Couverture sécheresse', 'Couverture inondation', 'Assistance téléphonique 5j/7'],
        badge: null,
      },
      {
        name: 'AgroPremium',
        price: '5 500',
        coverage: '650 000',
        features: ['Couverture tous risques', 'Smart contract automatique', 'Assistance 24h/7j', 'Indemnisation sous 24h'],
        badge: 'Recommandé',
      },
    ],
  },
  {
    assureurId: 'nsia',
    assureur: 'NSIA Assurances',
    logo: nsia_logo,
    color: '#16A34A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    abbr: 'NS',
    plans: [
      {
        name: 'AgroClassic',
        price: '3 000',
        coverage: '350 000',
        features: ['Sécheresse & inondation', 'Indemnisation sous 48h', 'Conseiller dédié'],
        badge: null,
      },
      {
        name: 'AgroPro',
        price: '6 500',
        coverage: '800 000',
        features: ['Tous risques', 'Smart contract', 'Indemnisation sous 12h', 'Paiement mobile ou virement'],
        badge: 'Premium',
      },
    ],
  },
  {
    assureurId: 'allianz',
    assureur: 'Allianz CI',
    logo: allianz_logo,
    color: '#2563EB',
    bg: '#DBEAFE',
    border: '#BFDBFE',
    abbr: 'AL',
    plans: [
      {
        name: 'AgroSecure',
        price: '4 000',
        coverage: '500 000',
        features: ['Sécheresse & inondation', 'Maladies des cultures', 'Smart contract', 'Wave / MTN / Orange'],
        badge: null,
      },
    ],
  },
  {
    assureurId: 'sonar',
    assureur: 'SONAR-CI',
    logo: sonar_logo,
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    abbr: 'SO',
    plans: [
      {
        name: 'AgroRécolte',
        price: '2 800',
        coverage: '300 000',
        features: ['Sécheresse & inondation', 'Indemnisation sous 72h', 'Réseau de 200 agents terrain'],
        badge: null,
      },
    ],
  },
  {
    assureurId: 'sanlam',
    assureur: 'Sanlam CI',
    logo: sanlam_logo,
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    abbr: 'SA',
    plans: [
      {
        name: 'AgroProtect',
        price: '3 500',
        coverage: '420 000',
        features: ['Tous risques climatiques', 'Smart contract activé', 'Paiement Wave / MTN / Orange'],
        badge: null,
      },
    ],
  },
  {
    assureurId: 'coop',
    assureur: 'Coopérative locale',
    logo: null,
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    abbr: 'CO',
    plans: [
      {
        name: 'Solidarité Agricole',
        price: '1 200',
        coverage: '150 000',
        features: ['Couverture sécheresse', 'Fonds collectif solidaire', 'Aucun frais d\'adhésion'],
        badge: 'Accessible',
      },
    ],
  },
];

export default function OffresAssuranceScreen({ navigation }) {
  function handleSelect(assureurId) {
    navigation.navigate('AddPlantation', { selectedAssureur: assureurId });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="ArrowLeft" size={20} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offres d'assurance</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Intro */}
        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Icon name="Shield" size={24} color={COLORS.brand} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>Protégez vos cultures</Text>
            <Text style={styles.introSub}>Choisissez l'offre adaptée à votre exploitation. En cas de sinistre, le smart contract déclenche automatiquement votre indemnisation.</Text>
          </View>
        </View>

        {/* Offres par assureur */}
        {OFFRES.map(offre => (
          <View key={offre.assureurId} style={styles.assureurBlock}>
            {/* En-tête assureur */}
            <View style={[styles.assureurHeader, { backgroundColor: offre.bg, borderColor: offre.border }]}>
              {offre.logo
                ? <Image source={offre.logo} style={styles.assureurLogo} resizeMode="contain" />
                : <View style={[styles.assureurBadge, { backgroundColor: offre.color + '20' }]}>
                    <Text style={[styles.assureurBadgeText, { color: offre.color }]}>{offre.abbr}</Text>
                  </View>
              }
              <Text style={[styles.assureurName, { color: offre.color }]}>{offre.assureur}</Text>
              <View style={[styles.partnerBadge, { backgroundColor: offre.color + '15', borderColor: offre.border }]}>
                <Text style={[styles.partnerBadgeText, { color: offre.color }]}>Partenaire</Text>
              </View>
            </View>

            {/* Plans */}
            {offre.plans.map((plan, pi) => (
              <View key={pi} style={[styles.planCard, SHADOW.sm, plan.badge === 'Recommandé' && { borderColor: offre.color, borderWidth: 1.5 }]}>
                {/* Badge */}
                {plan.badge && (
                  <View style={[styles.planBadge, { backgroundColor: offre.color }]}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}

                <View style={styles.planTop}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planPriceWrap}>
                    <Text style={[styles.planPrice, { color: offre.color }]}>{plan.price} FCFA</Text>
                    <Text style={styles.planPricePer}>/mois</Text>
                  </View>
                </View>

                {/* Couverture */}
                <View style={[styles.coverageRow, { backgroundColor: offre.bg, borderColor: offre.border }]}>
                  <Icon name="Umbrella" size={13} color={offre.color} strokeWidth={2} />
                  <Text style={[styles.coverageText, { color: offre.color }]}>
                    Couverture jusqu'à <Text style={{ fontFamily: FONTS.bold }}>{plan.coverage} FCFA</Text>
                  </Text>
                </View>

                {/* Features */}
                <View style={styles.featuresList}>
                  {plan.features.map((f, fi) => (
                    <View key={fi} style={styles.featureRow}>
                      <Icon name="Check" size={13} color={COLORS.success} strokeWidth={2.5} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>

                {/* CTA */}
                <TouchableOpacity
                  style={[styles.planBtn, { backgroundColor: offre.color }]}
                  onPress={() => handleSelect(offre.assureurId)}
                  activeOpacity={0.85}
                >
                  <Icon name="Shield" size={15} color="#FFF" strokeWidth={2} />
                  <Text style={styles.planBtnText}>Souscrire à cette offre</Text>
                  <Icon name="ChevronRight" size={15} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: 30 }} />
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

  intro: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.brandBorder, padding: SPACING.md,
  },
  introIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandBg, alignItems: 'center', justifyContent: 'center',
  },
  introTitle: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text, marginBottom: 4 },
  introSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 17 },

  assureurBlock: { gap: SPACING.sm },

  assureurHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
  },
  assureurLogo: { width: 36, height: 36 },
  assureurBadge: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  assureurBadgeText: { fontSize: 12, fontFamily: FONTS.bold },
  assureurName: { flex: 1, fontSize: 14, fontFamily: FONTS.semibold },
  partnerBadge: {
    borderWidth: 1, borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  partnerBadgeText: { fontSize: 10, fontFamily: FONTS.semibold },

  planCard: {
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, gap: SPACING.sm, overflow: 'hidden',
    marginLeft: 12,
  },
  planBadge: {
    position: 'absolute', top: 0, right: 0,
    paddingHorizontal: 10, paddingVertical: 4,
    borderBottomLeftRadius: RADIUS.md,
  },
  planBadgeText: { fontSize: 10, fontFamily: FONTS.bold, color: '#FFF' },

  planTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  planName: { fontSize: 15, fontFamily: FONTS.bold, color: COLORS.text },
  planPriceWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  planPrice: { fontSize: 18, fontFamily: FONTS.bold },
  planPricePer: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },

  coverageRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: RADIUS.sm,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  coverageText: { fontSize: 12, fontFamily: FONTS.medium },

  featuresList: { gap: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  featureText: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary, flex: 1 },

  planBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    borderRadius: RADIUS.md, paddingVertical: 12, marginTop: 4,
  },
  planBtnText: { fontSize: 14, fontFamily: FONTS.semibold, color: '#FFF', flex: 1, textAlign: 'center' },
});
