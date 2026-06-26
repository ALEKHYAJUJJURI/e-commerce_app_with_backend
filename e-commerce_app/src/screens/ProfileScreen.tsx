import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { Colors, Radius, Shadow, Spacing } from "../types/theme";

const SettingsRow = ({
  icon,
  label,
  toggle,
  value,
  onToggle,
  onPress,
  danger,
}: {
  icon: any;
  label: string;
  toggle?: boolean;
  value?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}) => (
  <TouchableOpacity
    style={styles.row}
    activeOpacity={toggle ? 1 : 0.7}
    onPress={onPress}
  >
    <View style={[styles.rowIcon, danger && { backgroundColor: "#FEE2E2" }]}>
      <Ionicons
        name={icon}
        size={18}
        color={danger ? Colors.danger : Colors.indigo}
      />
    </View>
    <Text style={[styles.rowLabel, danger && { color: Colors.danger }]}>
      {label}
    </Text>
    {toggle ? (
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ true: Colors.accent }}
      />
    ) : (
      <Ionicons name="chevron-forward" size={18} color={Colors.inkLight} />
    )}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState(true);

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!user) {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark ?? "#1A1A2E"]}
            style={styles.guestHero}
          >
            <View style={styles.guestAvatar}>
              <Ionicons name="person-outline" size={40} color={Colors.white} />
            </View>
            <Text style={styles.guestTitle}>You're browsing as a guest</Text>
            <Text style={styles.guestSub}>
              Sign in to track orders, save favourites & checkout faster.
            </Text>
          </LinearGradient>

          <View style={styles.guestActions}>
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryCtaText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryCta}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryCtaText}>Create an account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionLabel}>Preferences</Text>
            <SettingsRow
              icon="notifications-outline"
              label="Notifications"
              toggle
              value={notifications}
              onToggle={setNotifications}
            />
            <SettingsRow
              icon="information-circle-outline"
              label="About ShopEase"
            />
            <SettingsRow icon="help-circle-outline" label="Help & Support" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark ?? "#1A1A2E"]}
          style={styles.hero}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </LinearGradient>

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Account</Text>
          <SettingsRow
            icon="bag-outline"
            label="My Orders"
            onPress={() => navigation.navigate("MyOrders")}
          />
          <SettingsRow
            icon="heart-outline"
            label="Wishlist"
            onPress={() => navigation.navigate("Wishlist")}
          />
          <SettingsRow icon="location-outline" label="Saved Addresses" />
          <SettingsRow icon="card-outline" label="Payment Methods" />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            toggle
            value={notifications}
            onToggle={setNotifications}
          />
          <SettingsRow icon="help-circle-outline" label="Help & Support" />
          <SettingsRow icon="document-text-outline" label="Terms & Privacy" />
        </View>

        <View style={styles.menuSection}>
          <SettingsRow
            icon="log-out-outline"
            label="Sign Out"
            onPress={logout}
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  hero: { alignItems: "center", paddingVertical: Spacing.xxl, paddingTop: 40 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: Colors.white },
  name: { fontSize: 20, fontWeight: "800", color: Colors.white },
  email: { fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 },

  guestHero: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingTop: 50,
    paddingHorizontal: Spacing.xl,
  },
  guestAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 6,
  },
  guestSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 19,
  },

  guestActions: { padding: Spacing.lg, gap: Spacing.md },
  primaryCta: {
    backgroundColor: Colors.accent,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.md,
  },
  primaryCtaText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  secondaryCta: {
    backgroundColor: Colors.surface,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  secondaryCtaText: { color: Colors.ink, fontWeight: "700", fontSize: 15 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.inkLight,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  menuSection: { marginTop: Spacing.md, marginBottom: Spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Colors.indigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: Colors.ink },
});
