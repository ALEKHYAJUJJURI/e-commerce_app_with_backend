import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Radius, Shadow, Spacing } from "../../types/theme";

const REVIEWS = [
  { id: 1, user: "John D.",  review: "Great app! Super easy to use and fast checkout.",       rating: 5, date: "Jun 12", product: "Electronics" },
  { id: 2, user: "Emma S.",  review: "Loved the UI! Very clean and modern. Will shop again.", rating: 5, date: "Jun 10", product: "Women's Clothing" },
  { id: 3, user: "Rohan M.", review: "Good selection of products. Delivery was quick too.",   rating: 4, date: "Jun 8",  product: "Men's Clothing" },
  { id: 4, user: "Priya K.", review: "The jewellery section is amazing. Loved my purchase!",  rating: 5, date: "Jun 7",  product: "Jewellery" },
  { id: 5, user: "Alex T.",  review: "App crashed once but overall experience was decent.",   rating: 3, date: "Jun 5",  product: "Electronics" },
  { id: 6, user: "Sneha R.", review: "Would love more filter options. Otherwise great!",      rating: 4, date: "Jun 3",  product: "Women's Clothing" },
  { id: 7, user: "Karan B.", review: "Average experience. Expected faster delivery.",         rating: 2, date: "Jun 1",  product: "Men's Clothing" },
];

const FILTER_OPTIONS = ["All", "5 ★", "4 ★", "3 ★", "≤2 ★"];

const AVATAR_COLORS = [Colors.primary, Colors.indigo, "#0F766E", "#9333EA", "#B45309"];

const ratingColor = (r: number) => {
  if (r >= 5) return Colors.success;
  if (r >= 4) return "#16A34A";
  if (r === 3) return Colors.warning;
  return Colors.danger;
};

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const ReviewsScreen = () => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = REVIEWS.filter((r) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "5 ★")  return r.rating === 5;
    if (activeFilter === "4 ★")  return r.rating === 4;
    if (activeFilter === "3 ★")  return r.rating === 3;
    if (activeFilter === "≤2 ★") return r.rating <= 2;
    return true;
  });

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
  const fiveStar  = REVIEWS.filter((r) => r.rating === 5).length;

  const renderStars = (rating: number, size = 14) =>
    Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={[styles.star, { fontSize: size, color: i < rating ? Colors.warning : Colors.border }]}>
        ★
      </Text>
    ));

  /* Rating bar distribution */
  const maxCount = 5;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: REVIEWS.filter((r) => r.rating === star).length,
    pct: REVIEWS.filter((r) => r.rating === star).length / REVIEWS.length,
  }));

  const renderReview = ({ item }: { item: typeof REVIEWS[0] }) => {
    const avatarColor = AVATAR_COLORS[item.id % AVATAR_COLORS.length];
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials(item.user)}</Text>
          </View>
          <View style={styles.cardMeta}>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
          <View style={[styles.ratingBadge, { backgroundColor: ratingColor(item.rating) + "22" }]}>
            <Text style={[styles.ratingBadgeText, { color: ratingColor(item.rating) }]}>
              ★ {item.rating}
            </Text>
          </View>
        </View>

        <View style={styles.starsRow}>{renderStars(item.rating)}</View>
        <Text style={styles.reviewText}>{item.review}</Text>

        <View style={styles.productTag}>
          <Ionicons name="bag-outline" size={11} color={Colors.indigo} />
          <Text style={styles.productTagText}>{item.product}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ───────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Reviews</Text>
          <Text style={styles.headerSub}>{REVIEWS.length} customer reviews</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReview}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* ── Summary banner ─────────────────── */}
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark ?? "#1A1A2E"]}
              style={styles.summaryBanner}
            >
              {/* Left: big rating */}
              <View style={styles.summaryLeft}>
                <Text style={styles.avgRating}>{avgRating}</Text>
                <View style={styles.avgStarsRow}>{renderStars(Math.round(Number(avgRating)), 16)}</View>
                <Text style={styles.avgLabel}>out of 5</Text>
              </View>

              <View style={styles.summaryDivider} />

              {/* Right: distribution bars */}
              <View style={styles.summaryRight}>
                {dist.map(({ star, count, pct }) => (
                  <View key={star} style={styles.distRow}>
                    <Text style={styles.distLabel}>{star}★</Text>
                    <View style={styles.distBarBg}>
                      <View style={[styles.distBarFill, { width: `${pct * 100}%` }]} />
                    </View>
                    <Text style={styles.distCount}>{count}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            {/* ── Stats chips ────────────────────── */}
            <View style={styles.statsRow}>
              <View style={styles.statChip}>
                <Ionicons name="happy-outline" size={16} color={Colors.success} />
                <Text style={styles.statChipText}>
                  <Text style={{ fontWeight: "800", color: Colors.success }}>{fiveStar}</Text>
                  {" "}5-star reviews
                </Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons name="people-outline" size={16} color={Colors.indigo} />
                <Text style={styles.statChipText}>
                  <Text style={{ fontWeight: "800", color: Colors.indigo }}>{REVIEWS.length}</Text>
                  {" "}total
                </Text>
              </View>
            </View>

            {/* ── Filter chips ───────────────────── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {FILTER_OPTIONS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.resultsLabel}>{filtered.length} reviews</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 48 }}>⭐</Text>
            <Text style={styles.emptyTitle}>No reviews here</Text>
            <Text style={styles.emptySubtitle}>Try a different filter.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: Colors.ink },
  headerSub:   { fontSize: 12, color: Colors.inkLight },

  /* Summary banner */
  summaryBanner: {
    flexDirection: "row",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    ...Shadow.md,
  },
  summaryLeft: { alignItems: "center", flex: 1 },
  avgRating: { fontSize: 52, fontWeight: "800", color: Colors.white, lineHeight: 56 },
  avgStarsRow: { flexDirection: "row", marginTop: 4, marginBottom: 6 },
  avgLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  summaryDivider: {
    width: 1,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: Spacing.lg,
  },
  summaryRight: { flex: 1.4, gap: 5 },
  distRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  distLabel: { fontSize: 10, color: "rgba(255,255,255,0.6)", width: 20, textAlign: "right" },
  distBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  distBarFill: { height: "100%", backgroundColor: Colors.warning, borderRadius: 3 },
  distCount: { fontSize: 10, color: "rgba(255,255,255,0.5)", width: 14, textAlign: "right" },

  /* Stats chips */
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  statChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  statChipText: { fontSize: 12, color: Colors.inkMid },

  /* Filters */
  filterRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 12, fontWeight: "600", color: Colors.inkMid },
  filterChipTextActive: { color: Colors.white },

  resultsLabel: {
    fontSize: 12,
    color: Colors.inkLight,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  /* List */
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 24 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  avatarText: { fontSize: 14, fontWeight: "700", color: Colors.white },
  cardMeta: { flex: 1 },
  userName:   { fontSize: 14, fontWeight: "700", color: Colors.ink },
  reviewDate: { fontSize: 11, color: Colors.inkLight },
  ratingBadge: {
    borderRadius: Radius.md,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  ratingBadgeText: { fontSize: 13, fontWeight: "700" },

  starsRow: { flexDirection: "row", marginBottom: Spacing.sm },
  star: { marginRight: 1 },

  reviewText: {
    fontSize: 14,
    color: Colors.inkMid,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },

  productTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: Colors.indigoLight,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  productTagText: { fontSize: 11, fontWeight: "600", color: Colors.indigo },

  emptyWrap: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: Colors.ink },
  emptySubtitle: { fontSize: 14, color: Colors.inkMid },
});