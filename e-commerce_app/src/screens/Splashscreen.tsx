import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../types/theme";
import Ionicons from "@expo/vector-icons/build/Ionicons";

const { width, height } = Dimensions.get("window");

const Particle = React.memo(({ delay, x }: { delay: number; x: number }) => {
  const translateY = useRef(new Animated.Value(height * 0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),

        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: true,
          }),

          Animated.spring(scale, {
            toValue: 1,
            tension: 80,
            friction: 10,
            useNativeDriver: true,
          }),

          Animated.timing(translateY, {
            toValue: Math.random() * height * 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),

        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        width: 4 + Math.random() * 4,
        height: 4 + Math.random() * 4,
        borderRadius: 9999,
        backgroundColor: Colors.accent,
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    />
  );
});

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale1 = useRef(new Animated.Value(0)).current;
  const ringScale2 = useRef(new Animated.Value(0)).current;
  const ringOpacity1 = useRef(new Animated.Value(0)).current;
  const ringOpacity2 = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (width / 12) * i + Math.random() * 30,
      delay: 600 + i * 80,
    })),
  ).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Logo pops in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // 2. Rings expand
      Animated.parallel([
        Animated.timing(ringOpacity1, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(ringScale1, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(ringOpacity2, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(ringScale2, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // 3. Brand name slides up
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(textY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      // 4. Tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // 5. Hold
      Animated.delay(700),
      // 6. Fade out
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(onFinish);
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <LinearGradient
        colors={["#1A1A2E", "#0F172A", "#16213E"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      {/* Particles */}
      {particles.map((p) => (
        <Particle key={p.id} delay={p.delay} x={p.x} />
      ))}

      {/* Center content */}
      <View style={styles.center}>
        {/* Outer ring */}
        <Animated.View
          style={[
            styles.ring2,
            { opacity: ringOpacity2, transform: [{ scale: ringScale2 }] },
          ]}
        />
        {/* Inner ring */}
        <Animated.View
          style={[
            styles.ring1,
            { opacity: ringOpacity1, transform: [{ scale: ringScale1 }] },
          ]}
        />

        {/* Logo circle */}
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <LinearGradient
            colors={["#E94560", "#C73652"]}
            style={styles.logoBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="bag-handle" size={42} color="white" />
          </LinearGradient>
        </Animated.View>

        {/* Brand name */}
        <Animated.Text
          style={[
            styles.brand,
            { opacity: textOpacity, transform: [{ translateY: textY }] },
          ]}
        >
          ShopEase
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Your world of fashion & more
        </Animated.Text>
      </View>

      {/* Bottom badge */}
      <Animated.View style={[styles.footer, { opacity: taglineOpacity }]}>
        <View style={styles.footerDot} />
        <Text style={styles.footerText}>Premium shopping, every day</Text>
        <View style={styles.footerDot} />
      </Animated.View>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  blob1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(233,69,96,0.08)",
    top: -80,
    right: -80,
  },
  blob2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(79,70,229,0.08)",
    bottom: 60,
    left: -60,
  },
  center: {
    alignItems: "center",
  },
  ring2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "rgba(233,69,96,0.12)",
  },
  ring1: {
    position: "absolute",
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 1.5,
    borderColor: "rgba(233,69,96,0.25)",
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#E94560",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  logoBg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 44 },
  brand: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 0.3,
  },
  footer: {
    position: "absolute",
    bottom: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(233,69,96,0.6)",
  },
  footerText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
