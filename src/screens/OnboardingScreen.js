import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS } from '../theme';
import Icon from '../components/LucideIcon';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    image: require('../assets/images/one_bording_1.png'),
    title: `"Faites face aux aléas."`,
    desc: "Sécheresses, inondations, maladies... Ne subissez plus les imprévus climatiques qui menacent vos cultures.",
  },
  {
    image: require('../assets/images/one_bording_3.png'),
    title: `"Recevez des conseils d'experts."`,
    desc: "Notre assistant IA et nos agronomes vous guident à chaque étape pour protéger et optimiser vos cultures.",
  },
  {
    image: require('../assets/images/one_bording_2.png'),
    title: `"Sécurisez vos revenus."`,
    desc: "Bénéficiez d'une assurance basée sur des contrats intelligents avec indemnisation automatique par Mobile Money.",
  },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);

  const fadeImage = useRef(new Animated.Value(1)).current;
  const fadeText  = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1 / SLIDES.length)).current;

  const circleRadius  = 28;
  const strokeWidth   = 3;
  const circumference = 2 * Math.PI * circleRadius;

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  function handleNext() {
    if (currentSlide === SLIDES.length - 1) {
      navigation.replace('Auth');
      return;
    }

    const nextSlide = currentSlide + 1;

    Animated.timing(progressAnim, {
      toValue: (nextSlide + 1) / SLIDES.length,
      duration: 450,
      useNativeDriver: false,
    }).start();

    Animated.parallel([
      Animated.timing(fadeImage, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeText,  { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setCurrentSlide(nextSlide);
      Animated.parallel([
        Animated.timing(fadeImage, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeText,  { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }, 200);
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={SLIDES[currentSlide].image}
        style={[styles.bgImage, { opacity: fadeImage }]}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.82)', 'rgba(0,0,0,0.96)']}
        locations={[0, 0.25, 0.62, 1]}
        style={styles.gradient}
      />

      <TouchableOpacity
        style={[styles.skipButton, { top: insets.top + 12 }]}
        onPress={() => navigation.replace('Auth')}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <View style={[styles.bottomSection, { bottom: insets.bottom + 24 }]}>
        <Animated.View style={[styles.textContainer, { opacity: fadeText }]}>
          <Text style={styles.title}>{SLIDES[currentSlide].title}</Text>
          <Text style={styles.desc}>{SLIDES[currentSlide].desc}</Text>
        </Animated.View>

        <TouchableOpacity onPress={handleNext} style={styles.buttonContainer} activeOpacity={0.85}>
          <Svg width={72} height={72} style={styles.svg}>
            <Circle
              cx="36" cy="36" r={circleRadius}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <AnimatedCircle
              cx="36" cy="36" r={circleRadius}
              stroke="#5CB83C"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 36 36)"
            />
          </Svg>
          <View style={styles.buttonInner}>
            <Icon name="ArrowRight" size={22} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B06',
  },
  bgImage: {
    position: 'absolute',
    width,
    height,
    top: 0, left: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '55%',
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 10,
  },
  skipText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontFamily: FONTS.semibold,
    letterSpacing: 0.3,
  },
  bottomSection: {
    position: 'absolute',
    left: 24, right: 24,
    alignItems: 'center',
    gap: 32,
  },
  textContainer: {
    width: '100%',
    gap: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: FONTS.bold,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  desc: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14.5,
    fontFamily: FONTS.regular,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  buttonContainer: {
    width: 72, height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: { position: 'absolute' },
  buttonInner: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.brandMedium,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
