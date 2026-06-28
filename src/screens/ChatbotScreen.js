import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Animated,
  Pressable, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import Icon from '../components/LucideIcon';

// Image locale de maïs malade pour la démo IA
const mais_malade = require('../assets/images/mais_malade.png');

const QUICK_REPLIES = [
  "Analyse mes risques",
  "Météo cette semaine",
  "Mon assurance est active ?",
  "Conseils d'irrigation",
];

const BOT_REPLIES = {
  "Analyse mes risques": "D'après l'analyse satellite du jour, votre plantation présente :\n\n• Sécheresse : 52 % — Modéré ↑\n• Inondation : 78 % — Élevé ↑\n\nJe recommande d'irriguer dans les 48h et de vérifier vos drains avant les pluies prévues.",
  "Météo cette semaine": "Cette semaine à Yamoussoukro :\n\n• Auj. 31°C — 20% pluie\n• Dem. 27°C — 75% pluie\n• Mar. 25°C — 80% pluie\n• Jeu. 33°C — 5% pluie\n\nAttention : fortes pluies mardi et mercredi, vérifiez vos drains.",
  "Mon assurance est active ?": "Oui, votre assurance est active :\n\n• Plantation Kofi Sud — 850 000 FCFA couverts\n• Rizière Ama — 680 000 FCFA couverts\n\nUn smart contract a déjà déclenché 120 000 FCFA d'indemnisation automatique.",
  "Conseils d'irrigation": "Pour vos cultures en cette période :\n\n1. Irriguer tôt le matin (6h–8h)\n2. Apporter 25–30mm/semaine pour le maïs\n3. Éviter l'irrigation le soir pour prévenir les maladies fongiques\n4. Surveiller l'humidité du sol avec vos capteurs",
};

function TypingIndicator() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      )
    );
    Animated.parallel(anims).start();
    return () => anims.forEach(a => a.stop());
  }, []);
  return (
    <View style={typing.wrap}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[typing.dot, {
            opacity: dot,
            transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
          }]}
        />
      ))}
    </View>
  );
}
const typing = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 4, paddingHorizontal: 12, paddingVertical: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.textMuted },
});

export default function ChatbotScreen() {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping]       = useState(false);
  const scrollRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  useEffect(() => {
    if (isRecording) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,   duration: 500, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    }
  }, [isRecording]);

  function scrollToEnd() {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }

  function nowTime() {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  function sendMessage(text, imageUri = null) {
    if (!text.trim() && !imageUri) return;
    const userMsg = {
      id: Date.now().toString(), from: 'user', time: nowTime(),
      text: text.trim(), image: imageUri,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    scrollToEnd();

    setTimeout(() => {
      const reply = BOT_REPLIES[text.trim()] ||
        (imageUri
          ? "🌽 Analyse de l'image en cours...\n\nJe détecte une infection fongique sur vos plants de maïs — probablement la rouille commune (Puccinia sorghi) ou le mildiou.\n\nSymptômes identifiés :\n• Taches jaunes/brunes sur les feuilles\n• Nécroses progressives\n• Risque de propagation : Élevé\n\nRecommandations immédiates :\n1. Appliquer un fongicide systémique (mancozèbe ou azoxystrobine) sous 48h\n2. Retirer et brûler les feuilles atteintes\n3. Éviter l'irrigation par aspersion\n4. Surveiller les plants voisins\n\nVotre smart contract est notifié. Une indemnisation peut être déclenchée si les dégâts dépassent 30% de la parcelle."
          : "Je n'ai pas compris. Vous pouvez me demander l'analyse des risques, la météo, l'état de votre assurance ou des conseils agronomiques.");
      const botMsg = { id: (Date.now() + 1).toString(), from: 'bot', time: nowTime(), text: reply };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      scrollToEnd();
    }, 1400);
  }

  function handleImage() {
    sendMessage('', mais_malade);
  }

  function handleVoice() {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => sendMessage("Quel est le risque pour mes cultures cette semaine ?"), 300);
    } else {
      setIsRecording(true);
      setTimeout(() => setIsRecording(false), 5000);
    }
  }

  const hasText = input.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.botAvatar}>
          <Icon name="Bot" size={18} color={COLORS.brand} strokeWidth={1.75} />
        </View>
        <View>
          <Text style={styles.headerTitle}>Agro AI</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>En ligne · Assistant agricole</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages ou état vierge */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={[styles.messagesContent, messages.length === 0 && styles.emptyContent]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
        >
          {messages.length === 0 && !isTyping ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Icon name="Bot" size={32} color={COLORS.brand} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>Comment puis-je vous aider ?</Text>
              <Text style={styles.emptySub}>Posez une question, envoyez une photo de vos cultures ou utilisez votre voix.</Text>
            </View>
          ) : (
            messages.map(msg => (
              <View key={msg.id} style={[styles.msgRow, msg.from === 'user' && styles.msgRowUser]}>
                {msg.from === 'bot' && (
                  <View style={styles.msgAvatar}>
                    <Icon name="Bot" size={13} color={COLORS.brand} strokeWidth={2} />
                  </View>
                )}
                <View style={[styles.bubble, msg.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                  {msg.image && (
                    <Image
                      source={msg.image}
                      style={styles.bubbleImage}
                      resizeMode="cover"
                    />
                  )}
                  {msg.text ? (
                    <>
                      <Text style={[styles.bubbleText, msg.from === 'user' && styles.bubbleTextUser]}>
                        {msg.text}
                      </Text>
                      <Text style={[styles.bubbleTime, msg.from === 'user' && styles.bubbleTimeUser]}>
                        {msg.time}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.bubbleTime, msg.from === 'user' && styles.bubbleTimeUser, { marginTop: 4 }]}>
                      {msg.time}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}

          {isTyping && (
            <View style={styles.msgRow}>
              <View style={styles.msgAvatar}>
                <Icon name="Bot" size={13} color={COLORS.brand} strokeWidth={2} />
              </View>
              <View style={styles.bubbleBot}>
                <TypingIndicator />
              </View>
            </View>
          )}

          <View style={{ height: 8 }} />
        </ScrollView>

        {/* Quick replies */}
        {!isTyping && messages.length === 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll} contentContainerStyle={styles.quickContent}>
            {QUICK_REPLIES.map(q => (
              <TouchableOpacity key={q} style={styles.quickChip} onPress={() => sendMessage(q)}>
                <Text style={styles.quickText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          {/* Bouton image */}
          <TouchableOpacity style={styles.attachBtn} onPress={handleImage} activeOpacity={0.75}>
            <Icon name="ImagePlus" size={20} color={COLORS.textSecondary} strokeWidth={1.75} />
          </TouchableOpacity>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder={isRecording ? 'Écoute en cours...' : 'Posez votre question...'}
              placeholderTextColor={isRecording ? COLORS.danger : COLORS.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
          </View>

          {/* Envoyer ou Micro */}
          {hasText ? (
            <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)}>
              <Icon name="ArrowUp" size={18} color="#FFF" strokeWidth={2.5} />
            </TouchableOpacity>
          ) : (
            <Pressable onPress={handleVoice}>
              <Animated.View style={[
                styles.micBtn,
                isRecording && styles.micBtnActive,
                { transform: [{ scale: pulseAnim }] },
              ]}>
                {isRecording
                  ? <Icon name="Square" size={14} color="#FFF" strokeWidth={2.5} />
                  : <Icon name="Mic" size={18} color={COLORS.brand} strokeWidth={2} />
                }
              </Animated.View>
            </Pressable>
          )}
        </View>

        {isRecording && (
          <View style={styles.recordingBar}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Enregistrement… Appuyez sur Stop pour envoyer</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: SPACING.md, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
  },
  botAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.brandBg, borderWidth: 1, borderColor: COLORS.brandBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 15, fontFamily: FONTS.semibold, color: COLORS.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  onlineText: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textMuted },

  messages: { flex: 1, backgroundColor: COLORS.bgSecondary },
  messagesContent: { padding: SPACING.md, gap: 4 },
  emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  emptyState: { alignItems: 'center', gap: 12, paddingHorizontal: SPACING.lg },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.brandBg, borderWidth: 1, borderColor: COLORS.brandBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 17, fontFamily: FONTS.semibold, color: COLORS.text, textAlign: 'center' },
  emptySub: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center', lineHeight: 19 },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 4 },
  msgRowUser: { flexDirection: 'row-reverse' },
  msgAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.brandBg, borderWidth: 1, borderColor: COLORS.brandBorder,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  bubble: { maxWidth: '78%', borderRadius: 16, overflow: 'hidden', paddingHorizontal: 12, paddingTop: 9, paddingBottom: 6 },
  bubbleBot: { backgroundColor: COLORS.bgPrimary, borderWidth: 1, borderColor: COLORS.border, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: COLORS.brand, borderBottomRightRadius: 4 },
  bubbleImage: { width: 200, height: 130, borderRadius: 10, marginBottom: 6, marginHorizontal: -12, marginTop: -9 },
  bubbleText: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.text, lineHeight: 20 },
  bubbleTextUser: { color: '#FFF' },
  bubbleTime: { fontSize: 10, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'right', marginTop: 3 },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.6)' },

  quickScroll: { maxHeight: 44, backgroundColor: COLORS.bgPrimary, borderTopWidth: 1, borderTopColor: COLORS.border },
  quickContent: { paddingHorizontal: SPACING.md, paddingVertical: 6, gap: 6, alignItems: 'center' },
  quickChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1,
    borderColor: COLORS.brandBorder, backgroundColor: COLORS.brandBg,
  },
  quickText: { fontSize: 12, fontFamily: FONTS.medium, color: COLORS.brand },

  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
    backgroundColor: COLORS.bgPrimary, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  attachBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.bgTertiary, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  inputWrap: {
    flex: 1, backgroundColor: COLORS.bgTertiary,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 22, paddingHorizontal: 14, paddingVertical: 9,
    minHeight: 40, maxHeight: 110, justifyContent: 'center',
  },
  input: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.text, padding: 0, lineHeight: 19 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.brand, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  micBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.bgTertiary, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  micBtnActive: { backgroundColor: COLORS.danger, borderColor: COLORS.danger },
  recordingBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: SPACING.md, paddingVertical: 7,
    backgroundColor: COLORS.dangerBg, borderTopWidth: 1, borderTopColor: COLORS.dangerBorder,
  },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger },
  recordingText: { fontSize: 12, fontFamily: FONTS.medium, color: COLORS.danger },
});
