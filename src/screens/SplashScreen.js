import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { FONTS } from '../theme';

const logo = require('../assets/images/logo.jpeg');

export default function SplashScreen({ navigation }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => navigation.replace('Auth'), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fade, transform: [{ scale }] }]}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>Anticipation des risques agricoles</Text>
      </Animated.View>
      <Animated.Text style={[styles.powered, { opacity: fade }]}>
        IA · Satellite · Smart Contracts
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111E14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { alignItems: 'center', gap: 20 },
  logo: {
    width: 260,
    height: 90,
    borderRadius: 8,
  },
  tagline: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.2,
  },
  powered: {
    position: 'absolute',
    bottom: 48,
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 0.5,
  },
});
