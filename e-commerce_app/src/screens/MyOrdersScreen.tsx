import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../types/constants";
import { Colors, Radius, Shadow, Spacing } from "../types/theme";

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderProduct = {
  product: {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
  quantity: number;
  _id: string;
};

type Order = {
  _id: string;
  user: string;
  products: OrderProduct[];
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: string; label: string }
> = {
  Pending: {
    color: "#D97706",
    bg: "#FEF3C7",
    icon: "time-outline",
    label: "Pending",
  },
  Confirmed: {
    color: "#4F46E5",
    bg: "#EEF2FF",
    icon: "checkmark-circle-outline",
    label: "Confirmed",
  },
  Shipped: {
    color: "#0891B2",
    bg: "#E0F2FE",
    icon: "airplane-outline",
    label: "Shipped",
  },
  Delivered: {
    color: "#059669",
    bg: "#ECFDF5",
    icon: "bag-check-outline",
    label: "Delivered",
  },
  Cancelled: {
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: "close-circle-outline",
    label: "Cancelled",
  },
};

// ─── Filter tabs ─────────────────────────────────────────────────────────────
const FILTERS = [
  "All",
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonOrder = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View style={[styles.skeletonLine, { width: 100 }]} />
        <View
          style={[
            styles.skeletonLine,
            { width: 70, borderRadius: Radius.full },
          ]}
        />
      </View>
      <View style={[styles.skeletonLine, { width: "60%", marginBottom: 8 }]} />
      <View style={styles.skeletonImages}>
        {[1, 2, 3].map((k) => (
          <View key={k} style={styles.skeletonImg} />
        ))}
      </View>
    </Animated.View>
  );
};

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) => {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalQty = order.products.reduce((s, p) => s + p.quantity, 0);

  // Show up to 3 product images as a stack
  const visibleProducts = order.products.slice(0, 3);
  const extraCount = order.products.length - 3;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* ── Row 1: Order ID + Status ── */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>
            Order #{order._id.slice(-8).toUpperCase()}
          </Text>
          <Text style={styles.orderDate}>
            {dateStr} · {timeStr}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon as any} size={12} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}>
            {cfg.label}
          </Text>
        </View>
      </View>

      {/* ── Product image stack ── */}
      <View style={styles.productRow}>
        <View style={styles.imageStack}>
          {visibleProducts.map((p, idx) => {
            const uri = p.product?.image?.startsWith("http")
              ? p.product.image
              : `${API_BASE_URL}/uploads/${p.product?.image}`;
            return (
              <View
                key={p._id}
                style={[
                  styles.stackImgWrap,
                  { marginLeft: idx === 0 ? 0 : -14, zIndex: 3 - idx },
                ]}
              >
                <Image source={{ uri }} style={styles.stackImg} />
              </View>
            );
          })}
          {extraCount > 0 && (
            <View
              style={[
                styles.stackImgWrap,
                { marginLeft: -14, backgroundColor: Colors.surfaceDim },
              ]}
            >
              <Text style={styles.extraCount}>+{extraCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.productMeta}>
          <Text style={styles.productCount}>
            {order.products.length}{" "}
            {order.products.length === 1 ? "item" : "items"} · {totalQty} qty
          </Text>
          {/* First product name */}
          {order.products[0]?.product?.title && (
            <Text numberOfLines={1} style={styles.firstProductName}>
              {order.products[0].product.title}
              {order.products.length > 1
                ? ` +${order.products.length - 1} more`
                : ""}
            </Text>
          )}
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Row 3: Total + CTA ── */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.totalLabel}>Total paid</Text>
          <Text style={styles.totalAmount}>
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </Text>
        </View>
        <TouchableOpacity style={styles.detailsBtn} onPress={onPress}>
          <Text style={styles.detailsBtnText}>View Details</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.indigo} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MyOrdersScreen = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filtered =
    activeFilter === "All"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  // Summary counts
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const pending = orders.filter(
    (o) =>
      o.status === "Pending" ||
      o.status === "Confirmed" ||
      o.status === "Shipped",
  ).length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* ── Header ── */}
      <LinearGradient
        colors={[Colors.primary, "#16213E"]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSub}>{orders.length} orders placed</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      {/* ── Summary stats ── */}
      {!loading && orders.length > 0 && (
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: Colors.success }]}>
            <Text style={[styles.statNum, { color: Colors.success }]}>
              {delivered}
            </Text>
            <Text style={styles.statLbl}>Delivered</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: Colors.indigo }]}>
            <Text style={[styles.statNum, { color: Colors.indigo }]}>
              {pending}
            </Text>
            <Text style={styles.statLbl}>In Progress</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: Colors.danger }]}>
            <Text style={[styles.statNum, { color: Colors.danger }]}>
              {cancelled}
            </Text>
            <Text style={styles.statLbl}>Cancelled</Text>
          </View>
        </View>
      )}

      {/* ── Filter tabs ── */}
      {!loading && (
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(f) => f}
          contentContainerStyle={styles.filterRow}
          style={{ flexGrow: 0 }}
          renderItem={({ item: f }) => {
            const active = activeFilter === f;
            const cfg = STATUS_CONFIG[f];
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  active && {
                    backgroundColor: cfg?.color ?? Colors.primary,
                    borderColor: cfg?.color ?? Colors.primary,
                  },
                ]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.8}
              >
                {cfg && (
                  <Ionicons
                    name={cfg.icon as any}
                    size={12}
                    color={active ? Colors.white : cfg.color}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  style={[
                    styles.filterChipText,
                    active && { color: Colors.white },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* ── List ── */}
      {loading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(i) => i.toString()}
          renderItem={() => <SkeletonOrder />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() =>
                navigation.navigate("OrderDetails", { orderId: item._id })
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accent}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="bag-outline"
                  size={48}
                  color={Colors.inkLight}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {activeFilter === "All"
                  ? "No orders yet"
                  : `No ${activeFilter} orders`}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === "All"
                  ? "Start shopping to see your orders here."
                  : "Try a different filter above."}
              </Text>
              {activeFilter === "All" && (
                <TouchableOpacity
                  style={styles.shopBtn}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.shopBtnText}>Browse Products</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: Colors.white },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 1 },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderTopWidth: 3,
    ...Shadow.sm,
  },
  statNum: { fontSize: 22, fontWeight: "800" },
  statLbl: {
    fontSize: 11,
    color: Colors.inkLight,
    marginTop: 2,
    fontWeight: "600",
  },

  /* Filters */
  filterRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipText: { fontSize: 12, fontWeight: "600", color: Colors.inkMid },

  /* List */
  list: { padding: Spacing.lg, paddingBottom: 32 },

  /* Card */
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  orderId: { fontSize: 14, fontWeight: "800", color: Colors.ink },
  orderDate: { fontSize: 11, color: Colors.inkLight, marginTop: 2 },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: 11, fontWeight: "700" },

  /* Product images */
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  imageStack: { flexDirection: "row", alignItems: "center" },
  stackImgWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: Colors.surface,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  stackImg: { width: "100%", height: "100%", resizeMode: "contain" },
  extraCount: { fontSize: 12, fontWeight: "700", color: Colors.inkMid },

  productMeta: { flex: 1 },
  productCount: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.inkMid,
    marginBottom: 3,
  },
  firstProductName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.ink,
    lineHeight: 17,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 11, color: Colors.inkLight, marginBottom: 2 },
  totalAmount: { fontSize: 18, fontWeight: "800", color: Colors.ink },

  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.indigoLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  detailsBtnText: { fontSize: 13, fontWeight: "700", color: Colors.indigo },

  /* Skeleton */
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    marginBottom: 6,
  },
  skeletonImages: { flexDirection: "row", gap: 8, marginTop: 8 },
  skeletonImg: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.border,
  },

  /* Empty */
  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: Spacing.xxl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.ink,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.inkMid,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: Spacing.xxl,
  },
  shopBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxl,
    height: 50,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.md,
  },
  shopBtnText: { fontSize: 15, fontWeight: "700", color: Colors.white },
});
