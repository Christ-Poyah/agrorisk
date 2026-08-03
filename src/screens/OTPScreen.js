import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import { useApp } from '../context/AppContext';
import Icon from '../components/LucideIcon';

const CODE_LENGTH = 6;
const DEMO_CODE   = '248631';

export default function OTPScreen({ route, navigation }) {
  const { login } = useApp();
  const { name, phone } = route.params;

  const [digits, setDigits]       = useState(Array(CODE_LENGTH).fill(''));
  const [error, setError]         = useState('');
  const [verified, setVerified]   = useState(false);
  const [resendCount, setResend]  = useState(30);

  const inputs  = useRef([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  // Compte à rebours renvoi
  useEffect(() => {
    if (resendCount <= 0) return;
    const t = setTimeout(() => setResend(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCount]);

  function handleDigit(val, idx) {
    setError('');
    const d = [...digits];
    d[idx] = val.slice(-1);
    setDigits(d);
    if (val && idx < CODE_LENGTH - 1) inputs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputs.current[idx - 1]?.focus();
  }

  function handlePaste(val, idx) {
    // Gère le collage d'un code complet
    if (val.length === CODE_LENGTH) {
      const d = val.split('');
      setDigits(d);
      inputs.current[CODE_LENGTH - 1]?.focus();
    } else {
      handleDigit(val, idx);
    }
  }

  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function verify() {
    const code = digits.join('');
    if (code.length < CODE_LENGTH) { setError('Entrez les 6 chiffres.'); shake(); return; }
    if (code !== DEMO_CODE) { setError('Code incorrect. Essayez ' + DEMO_CODE); shake(); return; }

    setVerified(true);
    Animated.timing(successAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        login(name, 'Yamoussoukro');
        navigation.replace('AddPlantation');
      }, 800);
    });
  }

  function autofill() {
    const d = DEMO_CODE.split('');
    setDigits(d);
    setError('');
  }

  const filled = digits.every(d => d !== '');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="ArrowLeft" size={20} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vérification</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.container}>

          {/* Icône */}
          <Animated.View style={[styles.iconWrap, verified && { backgroundColor: COLORS.successBg, borderColor: COLORS.successBorder }, { opacity: successAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1] }) }]}>
            <Icon
              name={verified ? 'CheckCircle2' : 'Phone'}
              size={28}
              color={verified ? COLORS.success : COLORS.brand}
              strokeWidth={1.75}
            />
          </Animated.View>

          <Text style={styles.title}>Code de vérification</Text>
          <Text style={styles.sub}>
            Un code à 6 chiffres a été envoyé au{'\n'}
            <Text style={styles.phone}>+225 {phone}</Text>
          </Text>

          {/* Champs OTP */}
          <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={r => { inputs.current[i] = r; }}
                style={[
                  styles.otpBox,
                  d && styles.otpBoxFilled,
                  verified && styles.otpBoxSuccess,
                  error && styles.otpBoxError,
                ]}
                value={d}
                onChangeText={v => handlePaste(v, i)}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                selectTextOnFocus
                caretHidden
              />
            ))}
          </Animated.View>

          {/* Erreur */}
          {!!error && (
            <View style={styles.errorRow}>
              <Icon name="AlertTriangle" size={13} color={COLORS.danger} strokeWidth={2} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Bouton vérifier */}
          <TouchableOpacity
            style={[styles.btn, SHADOW.sm, !filled && styles.btnDisabled, verified && styles.btnSuccess]}
            onPress={verify}
            activeOpacity={filled ? 0.85 : 1}
          >
            {verified ? (
              <>
                <Icon name="CheckCircle2" size={18} color="#FFF" strokeWidth={2.5} />
                <Text style={styles.btnText}>Vérifié !</Text>
              </>
            ) : (
              <>
                <Text style={[styles.btnText, !filled && styles.btnTextDisabled]}>Vérifier le code</Text>
                <Icon name="ChevronRight" size={18} color={filled ? '#FFF' : COLORS.textMuted} strokeWidth={2.5} />
              </>
            )}
          </TouchableOpacity>

          {/* Renvoi */}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Code non reçu ? </Text>
            {resendCount > 0 ? (
              <Text style={styles.resendTimer}>Renvoyer dans {resendCount}s</Text>
            ) : (
              <TouchableOpacity onPress={() => setResend(30)}>
                <Text style={styles.resendLink}>Renvoyer le code</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontFamily: FONTS.semibold, color: COLORS.text },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: 40, gap: SPACING.md },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.brandBg, borderWidth: 1, borderColor: COLORS.brandBorder,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  title: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.text },
  sub: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  phone: { fontFamily: FONTS.semibold, color: COLORS.text },
  otpRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  otpBox: {
    width: 46, height: 54,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.bgSecondary,
    textAlign: 'center', fontSize: 22, fontFamily: FONTS.bold, color: COLORS.text,
  },
  otpBoxFilled: { borderColor: COLORS.brand, backgroundColor: COLORS.brandBg },
  otpBoxSuccess: { borderColor: COLORS.success, backgroundColor: COLORS.successBg },
  otpBoxError: { borderColor: COLORS.danger, backgroundColor: COLORS.dangerBg },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  errorText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.danger },
  hintBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1,
    borderColor: COLORS.border, borderStyle: 'dashed',
  },
  hintText: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: COLORS.brand, borderRadius: RADIUS.md,
    paddingVertical: 14, paddingHorizontal: SPACING.md,
    width: '100%', marginTop: 4,
  },
  btnDisabled: { backgroundColor: COLORS.bgTertiary },
  btnSuccess: { backgroundColor: COLORS.success },
  btnText: { fontSize: 15, fontFamily: FONTS.semibold, color: '#FFF' },
  btnTextDisabled: { color: COLORS.textMuted },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendLabel: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted },
  resendTimer: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textMuted },
  resendLink: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.brand },
});
