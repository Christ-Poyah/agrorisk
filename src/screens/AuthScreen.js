import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Image,
} from 'react-native';

const logo = require('../assets/images/logo.jpeg');
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import { useApp } from '../context/AppContext';
import Icon from '../components/LucideIcon';

export default function AuthScreen({ navigation }) {
  const { login } = useApp();
  const [mode, setMode] = useState('login');
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');

  function handleSubmit() {
    const displayName = name.trim() || 'Agriculteur';
    if (mode === 'register') {
      navigation.navigate('OTP', { name: displayName, phone: phone || '07 00 00 00 00' });
    } else {
      login(displayName, 'Yamoussoukro');
      navigation.replace('AddPlantation');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.logoSection}>
            <Image source={logo} style={styles.logoImg} resizeMode="contain" />
            <Text style={styles.subtitle}>Protection intelligente de vos cultures</Text>
          </View>

          {/* Card */}
          <View style={[styles.card, SHADOW.md]}>
            <View style={styles.tabs}>
              {['login', 'register'].map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.tab, mode === m && styles.tabActive]}
                  onPress={() => setMode(m)}
                >
                  <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                    {m === 'login' ? 'Connexion' : 'Inscription'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {mode === 'register' && (
              <View style={styles.field}>
                <Text style={styles.label}>Nom complet</Text>
                <View style={styles.inputWrap}>
                  <Icon name="User" size={16} color={COLORS.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Kofi Mensah"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={COLORS.textMuted}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Téléphone</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.dialCode}>+225</Text>
                <View style={styles.inputDivider} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="07 00 00 00 00"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor={COLORS.textMuted}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.btnText}>
                {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </Text>
              <Icon name="ChevronRight" size={18} color="#FFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.legal}>
            En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgSecondary },
  scroll: { flex: 1 },
  container: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  logoSection: { alignItems: 'center', gap: 8, marginBottom: SPACING.sm },
  logoImg: { width: 200, height: 68 },
  subtitle: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgTertiary,
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  tabActive: { backgroundColor: COLORS.bgPrimary, borderWidth: 1, borderColor: COLORS.border },
  tabText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.text, fontFamily: FONTS.semibold },
  field: { gap: 6 },
  label: { fontSize: 12, fontFamily: FONTS.semibold, color: COLORS.textSecondary },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: COLORS.bgPrimary,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    padding: 0,
  },
  dialCode: { fontSize: 14, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  inputDivider: { width: 1, height: 18, backgroundColor: COLORS.border },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
    backgroundColor: COLORS.bgPrimary,
  },
  chipActive: { borderColor: COLORS.brand, backgroundColor: COLORS.brandBg },
  chipText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.brand, fontFamily: FONTS.semibold },
  btn: {
    backgroundColor: COLORS.brand,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.xs,
  },
  btnText: { fontSize: 15, fontFamily: FONTS.semibold, color: '#FFF' },
  legal: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
