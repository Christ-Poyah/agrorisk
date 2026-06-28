import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import { useApp } from '../context/AppContext';
import Icon from '../components/LucideIcon';

function Row({ icon, label, value, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, danger && { backgroundColor: COLORS.dangerBg }]}>
        <Icon name={icon} size={16} color={danger ? COLORS.danger : COLORS.textSecondary} strokeWidth={1.75} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: COLORS.danger }]}>{label}</Text>
      {value ? (
        <Text style={styles.rowValue}>{value}</Text>
      ) : (
        <Icon name="ChevronRight" size={16} color={COLORS.border} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { user, logout, plantations, stats } = useApp();

  function handleLogout() {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: () => { logout(); navigation.replace('Auth'); } },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Identity */}
        <View style={[styles.identityCard, SHADOW.sm]}>
          <View style={styles.avatar}>
            <Icon name="User" size={24} color={COLORS.brand} strokeWidth={1.75} />
          </View>
          <View style={styles.identityInfo}>
            <Text style={styles.identityName}>{user?.name || 'Agriculteur'}</Text>
            <View style={styles.identityMeta}>
              <Icon name="MapPin" size={12} color={COLORS.textMuted} />
              <Text style={styles.identityMetaText}>{user?.region || 'Côte d\'Ivoire'}</Text>
              <View style={styles.verifiedBadge}>
                <Icon name="CheckCircle2" size={11} color={COLORS.success} strokeWidth={2} />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, SHADOW.sm]}>
          {[
            { icon: 'Leaf',       label: 'Cultures',  value: plantations.length },
            { icon: 'Maximize2',  label: 'Hectares',  value: `${stats.totalArea}` },
            { icon: 'ShieldCheck',label: 'Assurés',   value: stats.activeInsurance },
            { icon: 'Activity',   label: 'Alertes',   value: stats.alertsThisWeek },
          ].map((s, i) => (
            <View key={i} style={[styles.stat, i < 3 && styles.statBorder]}>
              <Icon name={s.icon} size={16} color={COLORS.brand} strokeWidth={1.75} />
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* AI status */}
        <View style={[styles.aiCard, SHADOW.sm]}>
          <View style={styles.aiLeft}>
            <View style={styles.aiIcon}>
              <Icon name="Bot" size={18} color={COLORS.brand} strokeWidth={1.75} />
            </View>
            <View>
              <Text style={styles.aiTitle}>Surveillance IA</Text>
              <Text style={styles.aiSub}>Mise à jour toutes les 6h</Text>
            </View>
          </View>
          <View style={styles.aiStatus}>
            <View style={styles.aiDot} />
            <Text style={styles.aiStatusText}>Actif</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>COMPTE</Text>
        <View style={[styles.group, SHADOW.sm]}>
          <Row icon="User"  label="Informations personnelles" />
          <Row icon="Phone" label="Téléphone" value="+225 ·· ·· ··" />
          <Row icon="MapPin" label="Région" value={user?.region} />
        </View>

        <Text style={styles.sectionLabel}>ALERTES</Text>
        <View style={[styles.group, SHADOW.sm]}>
          <Row icon="Bell"    label="Notifications push"     value="Activées" />
          <Row icon="Globe"   label="Alertes SMS"            value="Activées" />
          <Row icon="BarChart3" label="Rapports hebdomadaires" value="Lundi" />
        </View>

        <Text style={styles.sectionLabel}>ASSURANCE</Text>
        <View style={[styles.group, SHADOW.sm]}>
          <Row icon="ShieldCheck"  label="Mes contrats"              />
          <Row icon="CreditCard"   label="Historique des paiements"  />
          <Row icon="Zap"          label="Smart contracts actifs" value={`${stats.activeInsurance}`} />
        </View>

        <Text style={styles.sectionLabel}>APPLICATION</Text>
        <View style={[styles.group, SHADOW.sm]}>
          <Row icon="Settings"    label="Qualité données satellite" value="Haute" />
          <Row icon="HelpCircle"  label="Aide & support"            />
          <Row icon="Eye"         label="Version"                   value="1.0.0" />
        </View>

        <View style={[styles.group, SHADOW.sm, { marginTop: SPACING.sm }]}>
          <Row icon="LogOut" label="Se déconnecter" onPress={handleLogout} danger />
        </View>

        <Text style={styles.footer}>RARM · Réseau d'Anticipation des Risques en Milieu Agricole</Text>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.text },
  scroll: { flex: 1, backgroundColor: COLORS.bgSecondary },
  content: { padding: SPACING.md, gap: SPACING.sm },
  identityCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.brandBg, borderWidth: 1, borderColor: COLORS.brandBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  identityInfo: { flex: 1 },
  identityName: { fontSize: 16, fontFamily: FONTS.semibold, color: COLORS.text },
  identityMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  identityMetaText: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  verifiedText: { fontSize: 11, fontFamily: FONTS.medium, color: COLORS.success },
  statsCard: {
    flexDirection: 'row', backgroundColor: COLORS.bgPrimary,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statBorder: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statVal: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.text },
  statLabel: { fontSize: 10, fontFamily: FONTS.regular, color: COLORS.textMuted },
  aiCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.md,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  aiLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiIcon: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandBg, alignItems: 'center', justifyContent: 'center',
  },
  aiTitle: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.text },
  aiSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  aiStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.success },
  aiStatusText: { fontSize: 12, fontFamily: FONTS.semibold, color: COLORS.success },
  sectionLabel: {
    fontSize: 11, fontFamily: FONTS.semibold, color: COLORS.textMuted,
    letterSpacing: 0.8, marginTop: SPACING.sm,
  },
  group: {
    backgroundColor: COLORS.bgPrimary, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: SPACING.md, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowIcon: {
    width: 30, height: 30, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgTertiary, alignItems: 'center', justifyContent: 'center',
  },
  rowLabel: { flex: 1, fontSize: 14, fontFamily: FONTS.medium, color: COLORS.text },
  rowValue: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted },
  footer: {
    fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted,
    textAlign: 'center', marginTop: SPACING.sm,
  },
});
