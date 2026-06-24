import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";

type MenuItem = {
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  route: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    label: "Manage Users",
    sub: "View, block, or remove accounts",
    icon: "people-outline",
    iconBg: Colors.indigoLight,
    iconColor: Colors.indigo,
    route: "Users",
  },
  {
    label: "Manage Products",
    sub: "Add, edit, or delete listings",
    icon: "cube-outline",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    route: "Products",
  },
  {
    label: "User Reviews",
    sub: "Monitor customer feedback",
    icon: "star-outline",
    iconBg: Colors.successLight,
    iconColor: Colors.success,
    route: "Reviews",
  },
];

const STAT_CARDS = [
  { label: "Total Sales", value: "₹84,320", icon: "trending-up-outline" as const, color: Colors.success },
  { label: "Orders",      value: "1,240",   icon: "bag-outline" as const,          color: Colors.indigo },
  { label: "Users",       value: "312",     icon: "people-outline" as const,        color: "#D97706" },
];

const AdminScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  const firstName = user?.name?.split(" ")[0] || "Admin";
  const initials  = user?.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "AD";

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Top bar ──────────────────────────────── */}
        <View style={styles.topBar}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.topBarInfo}>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.adminName}>{firstName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {/* ── Hero banner ──────────────────────────── */}
        <View style={styles.heroBanner}>
          <View>
            <Text style={styles.heroLabel}>ADMIN DASHBOARD</Text>
            <Text style={styles.heroTitle}>Store Control{"\n"}Centre</Text>
            <Text style={styles.heroSub}>Manage everything in one place.</Text>
          </View>
          <Text style={styles.heroEmoji}>🏪</Text>
        </View>

        {/* ── Quick stats ──────────────────────────── */}
        <View style={styles.statsRow}>
          {STAT_CARDS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + "22" }]}>
                <Ionicons name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Section header ───────────────────────── */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* ── Menu items ───────────────────────────── */}
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.85}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={22} color={item.iconColor} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.inkLight} />
          </TouchableOpacity>
        ))}

        {/* ── Sign out row ─────────────────────────── */}
        <TouchableOpacity style={styles.signOutRow} onPress={logout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={Colors.accent} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.surfaceAlt },
  scroll: { paddingBottom: 40 },

  /* Top bar */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  avatarText: { ...Typography.labelL, color: Colors.white },
  topBarInfo: { flex: 1 },
  greeting:  { ...Typography.caption, color: Colors.inkLight },
  adminName: { ...Typography.h4, color: Colors.ink },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Hero banner */
  heroBanner: {
    margin: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Shadow.md,
  },
  heroLabel: {
    ...Typography.labelS,
    color: Colors.accent,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    ...Typography.displayL,
    color: Colors.white,
    lineHeight: 34,
    marginBottom: Spacing.sm,
  },
  heroSub: { ...Typography.bodyS, color: "rgba(255,255,255,0.5)" },
  heroEmoji: { fontSize: 56 },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: "center",
    ...Shadow.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  statValue: { ...Typography.h3, color: Colors.ink, marginBottom: 2 },
  statLabel: { ...Typography.caption, color: Colors.inkLight, textAlign: "center" },

  /* Section */
  sectionTitle: {
    ...Typography.labelM,
    color: Colors.inkLight,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  /* Menu cards */
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuInfo:  { flex: 1 },
  menuLabel: { ...Typography.labelL, color: Colors.ink, marginBottom: 3 },
  menuSub:   { ...Typography.caption, color: Colors.inkMid },

  /* Sign out */
  signOutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  signOutText: { ...Typography.labelM, color: Colors.accent },
});