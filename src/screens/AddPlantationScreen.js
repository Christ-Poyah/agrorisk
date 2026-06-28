import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import { useApp } from '../context/AppContext';
import { CROPS, REGIONS } from '../data/mockData';
import Icon from '../components/LucideIcon';

const STEPS = ['Culture', 'Localisation', 'Superficie', 'Assurance'];

const ASSUREURS = [
  { id: 'sunu',    label: 'SUNU Assurances',    abbr: 'SU', color: '#0284C7', bg: '#EFF6FF', idLabel: 'Numéro de police',   logo: require('../assets/images/sunu_assurance.png') },
  { id: 'nsia',    label: 'NSIA Assurances',    abbr: 'NS', color: '#16A34A', bg: '#F0FDF4', idLabel: 'Numéro d\'assuré',   logo: require('../assets/images/nsia_banque.png') },
  { id: 'allianz', label: 'Allianz CI',         abbr: 'AL', color: '#2563EB', bg: '#DBEAFE', idLabel: 'Numéro de contrat', logo: null },
  { id: 'sonar',   label: 'SONAR-CI',           abbr: 'SO', color: '#D97706', bg: '#FFFBEB', idLabel: 'Référence client',  logo: null },
  { id: 'sanlam',  label: 'Sanlam CI',          abbr: 'SA', color: '#DC2626', bg: '#FEF2F2', idLabel: 'ID membre',         logo: null },
  { id: 'coop',    label: 'Coopérative locale', abbr: 'CO', color: '#7C3AED', bg: '#F5F3FF', idLabel: 'Numéro d\'adhérent',logo: null },
];

export default function AddPlantationScreen({ route, navigation }) {
  const { addPlantation, updateUserInsurance } = useApp();
  const [step, setStep]               = useState(0);
  const [gpsLoading, setGpsLoading]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', crop: null, cropLabel: '', cropColor: '', cropImage: '',
    region: '', area: '', plantingDate: new Date().toISOString().split('T')[0],
    assureur: '', clientId: '',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // Retour depuis OffresAssuranceScreen avec un assureur pré-sélectionné
  useEffect(() => {
    const sel = route.params?.selectedAssureur;
    if (sel) { set('assureur', sel); set('clientId', ''); }
  }, [route.params?.selectedAssureur]);

  const canNext =
    (step === 0 && form.crop && form.name.length > 1) ||
    (step === 1 && form.region.length > 0) ||
    (step === 2 && parseFloat(form.area) > 0) ||
    (step === 3 && form.assureur.length > 0 && form.clientId.trim().length > 0);

  function handleGPS() {
    setGpsLoading(true);
    setTimeout(() => {
      set('region', 'Yamoussoukro');
      setGpsLoading(false);
      // avance automatiquement après détection
      setTimeout(() => setStep(2), 300);
    }, 1500);
  }

  function handleNext() {
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    const plantation = addPlantation({
      name: form.name, crop: form.crop, cropLabel: form.cropLabel,
      cropColor: form.cropColor, cropImage: form.cropImage,
      region: form.region, area: parseFloat(form.area),
      plantingDate: form.plantingDate,
    });
    updateUserInsurance(form.assureur);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'HomeTab', params: { screen: 'Home', params: { plantation } } } }],
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.header}>
          {step > 0 ? (
            <TouchableOpacity onPress={() => setStep(s => s - 1)} style={styles.backBtn}>
              <Icon name="ArrowLeft" size={20} color={COLORS.text} strokeWidth={2} />
            </TouchableOpacity>
          ) : <View style={styles.backBtn} />}
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Nouvelle culture</Text>
            <Text style={styles.headerStep}>{STEPS[step]}</Text>
          </View>
          <Text style={styles.stepCount}>{step + 1}/{STEPS.length}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.bodyContent}>

          {/* STEP 0 — Culture */}
          {step === 0 && (
            <>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Quelle est votre culture ?</Text>
                <Text style={styles.stepDesc}>Sélectionnez le type de plante et nommez votre plantation.</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Nom de la plantation</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Ma plantation de Korhogo"
                    value={form.name}
                    onChangeText={v => set('name', v)}
                    placeholderTextColor={COLORS.textMuted}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Type de culture</Text>
                <View style={styles.cropGrid}>
                  {CROPS.map(c => {
                    const active = form.crop === c.id;
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.cropItem, active && { borderColor: c.color, borderWidth: 2 }]}
                        onPress={() => { set('crop', c.id); set('cropLabel', c.label); set('cropColor', c.color); set('cropImage', c.image); }}
                        activeOpacity={0.8}
                      >
                        {c.image ? (
                          <Image
                            source={c.image}
                            style={styles.cropImg}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={[styles.cropImgPlaceholder, { backgroundColor: c.color + '15' }]}>
                            <Icon name="Plus" size={22} color={c.color} strokeWidth={2} />
                          </View>
                        )}
                        {active && (
                          <View style={[styles.cropCheck, { backgroundColor: c.color }]}>
                            <Icon name="Check" size={10} color="#FFF" strokeWidth={3} />
                          </View>
                        )}
                        <Text style={[styles.cropName, active && { color: c.color, fontFamily: FONTS.semibold }]}>
                          {c.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {/* STEP 1 — Localisation */}
          {step === 1 && (
            <>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Où est votre plantation ?</Text>
                <Text style={styles.stepDesc}>Sélectionnez votre région pour activer la surveillance satellite.</Text>
              </View>

              <TouchableOpacity
                style={[styles.gpsCard, SHADOW.sm, gpsLoading && { opacity: 0.7 }]}
                onPress={handleGPS}
                disabled={gpsLoading}
                activeOpacity={0.85}
              >
                <View style={[styles.gpsIcon, gpsLoading && { backgroundColor: COLORS.brandBg }]}>
                  <Icon name={gpsLoading ? 'Loader' : 'MapPin'} size={20} color={COLORS.brand} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gpsTitle}>
                    {gpsLoading ? 'Localisation en cours…' : 'Utiliser ma position GPS'}
                  </Text>
                  <Text style={styles.gpsSub}>
                    {gpsLoading ? 'Détection satellite active' : 'Localisation précise sur la carte satellite'}
                  </Text>
                </View>
                {!gpsLoading && <Icon name="ChevronRight" size={16} color={COLORS.textMuted} />}
              </TouchableOpacity>

              <View style={styles.field}>
                <Text style={styles.label}>Région</Text>
                <View style={styles.regionGrid}>
                  {REGIONS.map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.regionChip, form.region === r && styles.regionChipActive]}
                      onPress={() => set('region', r)}
                    >
                      <Text style={[styles.regionText, form.region === r && styles.regionTextActive]}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* STEP 2 — Superficie */}
          {step === 2 && (
            <>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Superficie et date</Text>
                <Text style={styles.stepDesc}>Ces données permettent de calibrer les prédictions IA.</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Superficie (hectares)</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Ex: 2.5"
                    keyboardType="decimal-pad"
                    value={form.area}
                    onChangeText={v => set('area', v)}
                    placeholderTextColor={COLORS.textMuted}
                    underlineColorAndroid="transparent"
                  />
                  <Text style={styles.inputUnit}>ha</Text>
                </View>
                {parseFloat(form.area) > 0 && (
                  <Text style={styles.fieldHint}>
                    {(parseFloat(form.area) * 10000).toLocaleString('fr-FR')} m² · {Math.ceil(parseFloat(form.area) * 4)} points de mesure satellite
                  </Text>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Date de plantation</Text>
                <View style={styles.inputWrap}>
                  <Icon name="Calendar" size={16} color={COLORS.textMuted} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="AAAA-MM-JJ"
                    value={form.plantingDate}
                    onChangeText={v => set('plantingDate', v)}
                    placeholderTextColor={COLORS.textMuted}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>

              <View style={[styles.infoBox, SHADOW.sm]}>
                <Icon name="Satellite" size={16} color={COLORS.brand} strokeWidth={2} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.infoTitle}>Surveillance activée dès l'enregistrement</Text>
                  <Text style={styles.infoText}>Analyse satellite toutes les 6h · Alertes en temps réel · Prédictions IA quotidiennes</Text>
                </View>
              </View>
            </>
          )}


          {/* STEP 3 — Assurance */}
          {step === 3 && (
            <>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Votre assurance</Text>
                <Text style={styles.stepDesc}>Sélectionnez votre assureur ou coopérative. Ces informations servent à déclencher votre indemnisation en cas de sinistre.</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Assureur / Coopérative</Text>

                {/* Trigger dropdown */}
                {(() => {
                  const selected = ASSUREURS.find(a => a.id === form.assureur);
                  return (
                    <TouchableOpacity
                      style={[styles.dropdownTrigger, dropdownOpen && styles.dropdownTriggerOpen]}
                      onPress={() => setDropdownOpen(o => !o)}
                      activeOpacity={0.8}
                    >
                      {selected ? (
                        selected.logo
                          ? <Image source={selected.logo} style={styles.assureurLogo} resizeMode="contain" />
                          : <View style={[styles.assureurBadge, { backgroundColor: selected.bg }]}>
                              <Text style={[styles.assureurBadgeText, { color: selected.color }]}>{selected.abbr}</Text>
                            </View>
                      ) : (
                        <Icon name="Shield" size={16} color={COLORS.textMuted} strokeWidth={2} />
                      )}
                      <Text style={[styles.dropdownTriggerText, selected && styles.dropdownTriggerSelected]}>
                        {selected ? selected.label : 'Sélectionner votre assureur'}
                      </Text>
                      <Icon name={dropdownOpen ? 'ChevronUp' : 'ChevronDown'} size={16} color={COLORS.textMuted} strokeWidth={2} />
                    </TouchableOpacity>
                  );
                })()}

                {/* Liste déroulante */}
                {dropdownOpen && (
                  <View style={styles.dropdownList}>
                    {ASSUREURS.map((a, i) => {
                      const active = form.assureur === a.id;
                      return (
                        <TouchableOpacity
                          key={a.id}
                          style={[
                            styles.dropdownItem,
                            i < ASSUREURS.length - 1 && styles.dropdownItemBorder,
                            active && styles.dropdownItemActive,
                          ]}
                          onPress={() => { set('assureur', a.id); set('clientId', ''); setDropdownOpen(false); }}
                          activeOpacity={0.75}
                        >
                          {a.logo
                            ? <Image source={a.logo} style={styles.assureurLogo} resizeMode="contain" />
                            : <View style={[styles.assureurBadge, { backgroundColor: a.bg }]}>
                                <Text style={[styles.assureurBadgeText, { color: a.color }]}>{a.abbr}</Text>
                              </View>
                          }
                          <Text style={[styles.dropdownItemText, active && styles.dropdownItemTextActive]}>
                            {a.label}
                          </Text>
                          {active && <Icon name="Check" size={15} color={COLORS.brand} strokeWidth={2.5} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Champ ID client — apparaît après sélection */}
                {form.assureur && !dropdownOpen && (() => {
                  const selected = ASSUREURS.find(a => a.id === form.assureur);
                  return (
                    <View style={styles.clientIdWrap}>
                      <Text style={styles.clientIdLabel}>{selected?.idLabel || 'ID client'}</Text>
                      <View style={[styles.clientIdInput, { borderColor: form.clientId ? selected?.color || COLORS.brand : COLORS.border }]}>
                        <View style={[styles.assureurBadgeSmall, { backgroundColor: selected?.bg }]}>
                          <Text style={[styles.assureurBadgeTextSmall, { color: selected?.color }]}>{selected?.abbr}</Text>
                        </View>
                        <TextInput
                          style={styles.clientIdField}
                          placeholder="Ex: ASS-2024-001234"
                          placeholderTextColor={COLORS.textMuted}
                          value={form.clientId}
                          onChangeText={v => set('clientId', v)}
                          autoCapitalize="characters"
                          underlineColorAndroid="transparent"
                        />
                      </View>
                    </View>
                  );
                })()}
              </View>

              <View style={[styles.infoBox, SHADOW.sm]}>
                <Icon name="Shield" size={16} color={COLORS.brand} strokeWidth={2} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.infoTitle}>Smart contract activé automatiquement</Text>
                  <Text style={styles.infoText}>En cas de sinistre détecté, votre assureur est notifié et l'indemnisation peut être déclenchée en quelques heures.</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.subscribeBtn}
                onPress={() => navigation.navigate('OffresAssurance')}
                activeOpacity={0.8}
              >
                <View style={styles.subscribeBtnIcon}>
                  <Icon name="Plus" size={15} color={COLORS.brand} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subscribeBtnTitle}>Pas encore assuré ?</Text>
                  <Text style={styles.subscribeBtnSub}>Découvrir les offres de nos partenaires</Text>
                </View>
                <Icon name="ChevronRight" size={15} color={COLORS.brand} strokeWidth={2.5} />
              </TouchableOpacity>
            </>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextBtn, !canNext && styles.nextBtnDisabled]}
            onPress={canNext ? handleNext : null}
            activeOpacity={canNext ? 0.85 : 1}
          >
            <Text style={[styles.nextBtnText, !canNext && styles.nextBtnTextDisabled]}>
              {step === STEPS.length - 1 ? 'Enregistrer ma plantation' : 'Continuer'}
            </Text>
            <Icon
              name={step === STEPS.length - 1 ? 'CheckCircle2' : 'ChevronRight'}
              size={18}
              color={canNext ? '#FFF' : COLORS.textMuted}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 15, fontFamily: FONTS.semibold, color: COLORS.text },
  headerStep: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  stepCount: { fontSize: 12, fontFamily: FONTS.medium, color: COLORS.textMuted, width: 36, textAlign: 'right' },
  progressTrack: {
    height: 2,
    backgroundColor: COLORS.bgTertiary,
  },
  progressFill: { height: 2, backgroundColor: COLORS.brand },
  body: { flex: 1, backgroundColor: COLORS.bgSecondary },
  bodyContent: { padding: SPACING.md, gap: SPACING.lg },
  stepHeader: { gap: 4 },
  stepTitle: { fontSize: 20, fontFamily: FONTS.bold, color: COLORS.text },
  stepDesc: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 18 },
  field: { gap: 6 },
  label: { fontSize: 12, fontFamily: FONTS.semibold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  input: { flex: 1, fontSize: 14, fontFamily: FONTS.regular, color: COLORS.text, padding: 0 },
  inputUnit: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textMuted },
  fieldHint: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cropItem: {
    width: '22%',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
    overflow: 'hidden',
    gap: 6,
    paddingBottom: 8,
    position: 'relative',
  },
  cropImg: {
    width: '100%',
    height: 60,
    opacity: 0.92,
  },
  cropImgPlaceholder: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropCheck: {
    position: 'absolute',
    top: 6, right: 6,
    width: 18, height: 18,
    borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  cropName: { fontSize: 11, fontFamily: FONTS.medium, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: 4 },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  gpsIcon: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandBg,
    alignItems: 'center', justifyContent: 'center',
  },
  gpsTitle: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text },
  gpsSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  regionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  regionChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
  },
  regionChipActive: { borderColor: COLORS.brand, backgroundColor: COLORS.brandBg },
  regionText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  regionTextActive: { color: COLORS.brand, fontFamily: FONTS.semibold },
  infoBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: COLORS.brandBg, borderWidth: 1, borderColor: COLORS.brandBorder,
    borderRadius: RADIUS.md, padding: SPACING.md,
  },
  infoTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.brand },
  infoText: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 17 },

  dropdownTrigger: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: COLORS.bgPrimary,
  },
  dropdownTriggerOpen: { borderColor: COLORS.brand, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  dropdownTriggerText: { flex: 1, fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textMuted },
  dropdownTriggerSelected: { color: COLORS.text, fontFamily: FONTS.medium },
  dropdownList: {
    borderWidth: 1, borderTopWidth: 0, borderColor: COLORS.brand,
    borderBottomLeftRadius: RADIUS.md, borderBottomRightRadius: RADIUS.md,
    backgroundColor: COLORS.bgPrimary, overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingVertical: 11,
  },
  dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dropdownItemActive: { backgroundColor: COLORS.brandBg },
  dropdownItemText: { flex: 1, fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  dropdownItemTextActive: { color: COLORS.brand, fontFamily: FONTS.semibold },

  assureurLogo: { width: 32, height: 32, flexShrink: 0 },
  assureurBadge: {
    width: 32, height: 32, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  assureurBadgeText: { fontSize: 11, fontFamily: FONTS.bold },
  assureurBadgeSmall: {
    width: 26, height: 26, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  assureurBadgeTextSmall: { fontSize: 10, fontFamily: FONTS.bold },

  clientIdWrap: { gap: 6, marginTop: 4 },
  clientIdLabel: { fontSize: 12, fontFamily: FONTS.semibold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  clientIdInput: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderRadius: RADIUS.md,
    paddingHorizontal: 10, paddingVertical: 10,
    backgroundColor: COLORS.bgPrimary,
  },
  clientIdField: {
    flex: 1, fontSize: 14, fontFamily: FONTS.medium, color: COLORS.text, padding: 0,
  },
  subscribeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: COLORS.brandBorder, borderStyle: 'dashed',
    borderRadius: RADIUS.md, padding: SPACING.md,
    backgroundColor: COLORS.brandBg,
  },
  subscribeBtnIcon: {
    width: 32, height: 32, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgPrimary, borderWidth: 1, borderColor: COLORS.brandBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  subscribeBtnTitle: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.brand },
  subscribeBtnSub:   { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 1 },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
  },
  nextBtn: {
    backgroundColor: COLORS.brand, borderRadius: RADIUS.md,
    paddingVertical: 14, paddingHorizontal: SPACING.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  nextBtnDisabled: { backgroundColor: COLORS.bgTertiary },
  nextBtnText: { fontSize: 15, fontFamily: FONTS.semibold, color: '#FFF' },
  nextBtnTextDisabled: { color: COLORS.textMuted },
});
