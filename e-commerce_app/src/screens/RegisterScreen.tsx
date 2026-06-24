import axios from "axios";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";
import { API_BASE_URL } from "../types/constants";

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const btnScale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true }).start();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all fields to continue.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password });
      Alert.alert("Account created!", "You can now sign in with your credentials.", [
        { text: "Sign In", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Registration failed",
        error?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    {
      key: "name",
      label: "Full Name",
      icon: "person-outline",
      placeholder: "Jane Doe",
      value: name,
      onChange: setName,
      keyboardType: "default" as const,
      autoCapitalize: "words" as const,
      secure: false,
    },
    {
      key: "email",
      label: "Email",
      icon: "mail-outline",
      placeholder: "you@example.com",
      value: email,
      onChange: setEmail,
      keyboardType: "email-address" as const,
      autoCapitalize: "none" as const,
      secure: false,
    },
  ];

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
            <View style={styles.logoRing}>
              <View style={styles.logoInner}>
                <Text style={styles.logoEmoji}>🛍️</Text>
              </View>
            </View>
            <Text style={styles.brand}>ShopEase</Text>
            <Text style={styles.heroTagline}>
              Join millions of smart shoppers.{"\n"}It only takes a minute.
            </Text>
            <View style={styles.decCircle1} />
            <View style={styles.decCircle2} />
          </LinearGradient>

          {/* ── Form card ────────────────────────────── */}
          <View style={styles.card}>
            <View style={styles.cardHandle} />

            <Text style={styles.cardTitle}>Create account</Text>
            <Text style={styles.cardSubtitle}>Free forever. No credit card needed.</Text>

            {/* Name & Email fields */}
            {FIELDS.map((field) => (
              <View key={field.key} style={styles.fieldWrap}>
                <Text style={styles.label}>{field.label}</Text>
                <View style={[styles.inputWrap, focusedField === field.key && styles.inputWrapFocused]}>
                  <Ionicons
                    name={field.icon as any}
                    size={18}
                    color={focusedField === field.key ? Colors.indigo : Colors.inkLight}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.inputInner}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.inkLight}
                    value={field.value}
                    onChangeText={field.onChange}
                    keyboardType={field.keyboardType}
                    autoCapitalize={field.autoCapitalize}
                    onFocus={() => setFocusedField(field.key)}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            ))}

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
                  placeholder="Min. 8 characters"
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

            {/* Password strength hint */}
            <View style={styles.strengthRow}>
              {["Weak", "Fair", "Strong"].map((level, i) => (
                <View
                  key={level}
                  style={[
                    styles.strengthBar,
                    password.length > i * 3 && {
                      backgroundColor: i === 0 ? Colors.danger : i === 1 ? Colors.warning : Colors.success,
                    },
                  ]}
                />
              ))}
              <Text style={styles.strengthLabel}>
                {password.length === 0 ? "" : password.length < 4 ? "Weak" : password.length < 8 ? "Fair" : "Strong"}
              </Text>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            {/* CTA */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.cta, loading && styles.ctaDisabled]}
                onPress={handleRegister}
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
                    <Text style={styles.ctaText}>Creating account…</Text>
                  ) : (
                    <>
                      <Text style={styles.ctaText}>Create Account</Text>
                      <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Login link */}
            <TouchableOpacity
              style={styles.loginRow}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLabel}>Already have an account? </Text>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flexGrow: 1, justifyContent: "flex-end" },

  hero: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 48,
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
    marginBottom: Spacing.xl,
  },

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

  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.lg,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  strengthLabel: {
    fontSize: 11,
    color: Colors.inkLight,
    minWidth: 40,
    textAlign: "right",
  },

  termsText: {
    fontSize: 12,
    color: Colors.inkLight,
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },
  termsLink: { color: Colors.indigo, fontWeight: "600" },

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

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  loginLabel: { fontSize: 14, color: Colors.inkMid },
  loginLink:  { fontSize: 14, fontWeight: "700", color: Colors.indigo },
});