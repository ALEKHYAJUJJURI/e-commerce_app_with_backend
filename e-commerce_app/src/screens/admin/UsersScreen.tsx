import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radius, Shadow, Spacing, Typography } from "../../types/theme";
import { API_BASE_URL } from "@/src/types/constants";


const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin:          { bg: "#FEF3C7", text: "#92400E" },
  user:           { bg: Colors.indigoLight, text: Colors.indigo },
  "delivery agent": { bg: Colors.successLight, text: Colors.success },
};

const UsersScreen = () => {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);
  

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(res.data);
    } catch (e) {
      Alert.alert("Error", "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Remove user?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove", style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/api/users/${id}`);
            setUsers((p: any) => p.filter((u: any) => u._id !== id));
          } catch { Alert.alert("Error", "Could not remove user."); }
        },
      },
    ]);
  };

  const handleBlock = async (id: string, isBlocked: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/users/${id}/block`, { isBlocked: !isBlocked });
      fetchUsers();
    } catch { Alert.alert("Error", "Block action failed."); }
  };

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loaderText}>Loading users…</Text>
      </View>
    );
  }

  const renderUser = ({ item }: any) => {
    const roleStyle = ROLE_COLORS[item.role] || ROLE_COLORS.user;
    return (
      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(item.name)}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={[styles.rolePill, { backgroundColor: roleStyle.bg }]}>
              <Text style={[styles.roleText, { color: roleStyle.text }]}>
                {item.role}
              </Text>
            </View>
          </View>
          <Text style={styles.email}>{item.email}</Text>

          {/* Status + actions */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, {
              backgroundColor: item.isBlocked ? Colors.danger : Colors.success,
            }]} />
            <Text style={[styles.statusText, {
              color: item.isBlocked ? Colors.danger : Colors.success,
            }]}>
              {item.isBlocked ? "Blocked" : "Active"}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, {
              backgroundColor: item.isBlocked ? Colors.successLight : Colors.warningLight,
            }]}
            onPress={() => handleBlock(item._id, item.isBlocked)}
          >
            <Ionicons
              name={item.isBlocked ? "lock-open-outline" : "ban-outline"}
              size={16}
              color={item.isBlocked ? Colors.success : Colors.warning}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.dangerLight }]}
            onPress={() => handleDelete(item._id)}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const activeCount  = users.filter((u: any) => !u.isBlocked).length;
  const blockedCount = users.filter((u: any) => u.isBlocked).length;

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ───────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Users</Text>
          <Text style={styles.headerSub}>Manage your customer base</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchUsers}>
          <Ionicons name="refresh-outline" size={20} color={Colors.ink} />
        </TouchableOpacity>
      </View>

      {/* ── Stats ────────────────────────────────────── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{users.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: Colors.success }]}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: Colors.danger }]}>{blockedCount}</Text>
          <Text style={styles.statLabel}>Blocked</Text>
        </View>
      </View>

      {/* ── List ─────────────────────────────────────── */}
      <FlatList
        data={users}
        keyExtractor={(item: any) => item._id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 48 }}>👤</Text>
            <Text style={styles.emptyTitle}>No users yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.h2, color: Colors.ink },
  headerSub:   { ...Typography.caption, color: Colors.inkLight },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: "center",
    ...Shadow.sm,
  },
  statValue: { ...Typography.h2, color: Colors.ink },
  statLabel: { ...Typography.caption, color: Colors.inkLight, marginTop: 2 },

  /* List */
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 24 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },

  /* Avatar */
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  avatarText: { ...Typography.labelL, color: Colors.white },

  /* Info */
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  name: { ...Typography.labelL, color: Colors.ink, fontSize: 14 },
  rolePill: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleText: { ...Typography.labelS, textTransform: "capitalize" },
  email: { ...Typography.caption, color: Colors.inkMid, marginBottom: 6 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { ...Typography.labelS },

  /* Actions */
  actions: { flexDirection: "row", gap: Spacing.sm },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Loader */
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
    gap: 12,
  },
  loaderText: { ...Typography.bodyM, color: Colors.inkMid },

  /* Empty */
  emptyWrap: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { ...Typography.h3, color: Colors.inkMid },
});