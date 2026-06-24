import React, { useState, useRef } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";

const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Subtle press animation for the CTA
  const btnScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (!success) {
      Alert.alert("Sign in failed", "Incorrect email or password. Please try again.");
    }
  };

  const inputStyle = (field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* added the keyboard scroll view */}
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={30}
        >
          {/* ── Hero ─────────────────────────────────── */}
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark ?? "#1A1A2E"]}
            style={styles.hero}
          >
            {/* Logo mark */}
            <View style={styles.logoRing}>
              <View style={styles.logoInner}>
                <Text style={styles.logoEmoji}>🛍️</Text>
              </View>
            </View>

            <Text style={styles.brand}>ShopEase</Text>
            <Text style={styles.heroTagline}>
              Your world of fashion,{"\n"}electronics & more.
            </Text>

            {/* Decorative circles */}
            <View style={styles.decCircle1} />
            <View style={styles.decCircle2} />
          </LinearGradient>

          {/* ── Form card ────────────────────────────── */}
          <View style={styles.card}>
            {/* Pull handle */}
            <View style={styles.cardHandle} />

            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue shopping</Text>

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrap, focusedField === "email" && styles.inputWrapFocused]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={focusedField === "email" ? Colors.indigo : Colors.inkLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputInner}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.inkLight}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrap, focusedField === "password" && styles.inputWrapFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={focusedField === "password" ? Colors.indigo : Colors.inkLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputInner}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.inkLight}
                  secureTextEntry={secureText}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={secureText ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={Colors.inkMid}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot */}
            <TouchableOpacity style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* CTA */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.cta, loading && styles.ctaDisabled]}
                onPress={handleLogin}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={loading}
                activeOpacity={1}
              >
                <LinearGradient
                  colors={[Colors.accent, Colors.accentDark ?? Colors.accent]}
                  style={styles.ctaGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <Text style={styles.ctaText}>Signing in…</Text>
                  ) : (
                    <>
                      <Text style={styles.ctaText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register link */}
            <TouchableOpacity
              style={styles.registerRow}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLabel}>New to ShopEase? </Text>
              <Text style={styles.registerLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  /* Hero */
  hero: {
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 52,
    paddingHorizontal: Spacing.xxl,
    overflow: "hidden",
  },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.md,
  },
  logoEmoji: { fontSize: 34 },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  heroTagline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 22,
  },
  decCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.04)",
    top: -60,
    right: -60,
  },
  decCircle2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: 20,
    left: -40,
  },

  /* Card */
  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: 40,
    ...Shadow.lg,
  },
  cardHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.ink,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.inkMid,
    marginBottom: Spacing.xxl,
  },

  /* Fields */
  fieldWrap: { marginBottom: Spacing.lg },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },
  inputWrap: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.md,
  },
  inputWrapFocused: {
    borderColor: Colors.indigo,
    backgroundColor: Colors.indigoLight,
  },
  inputIcon: { marginRight: Spacing.sm },
  inputInner: {
    flex: 1,
    fontSize: 15,
    color: Colors.ink,
    height: "100%",
  },
  // Legacy (unused but kept for safety)
  input: {
    height: 54,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: 15,
    color: Colors.ink,
    backgroundColor: Colors.surfaceAlt,
  },
  inputFocused: {
    borderColor: Colors.indigo,
    backgroundColor: Colors.indigoLight,
  },

  forgotWrap: {
    alignSelf: "flex-end",
    marginBottom: Spacing.xxl,
    marginTop: -Spacing.sm,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.indigo,
  },

  /* CTA */
  cta: {
    borderRadius: Radius.md,
    overflow: "hidden",
    ...Shadow.md,
  },
  ctaGradient: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },

  /* Divider */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    fontSize: 12,
    color: Colors.inkLight,
    marginHorizontal: Spacing.md,
  },

  /* Register */
  registerRow: { flexDirection: "row", justifyContent: "center" },
  registerLabel: { fontSize: 14, color: Colors.inkMid },
  registerLink: { fontSize: 14, fontWeight: "700", color: Colors.indigo },
});