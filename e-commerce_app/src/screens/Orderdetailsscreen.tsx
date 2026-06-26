import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../types/constants";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderProduct = {
  product: {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    description?: string;
  };
  quantity: number;
  _id: string;
};

type Order = {
  _id: string;
  user: { name: string; email: string } | string;
  products: OrderProduct[];
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
};

// ─── Status pipeline ──────────────────────────────────────────────────────────
const PIPELINE: Array<{
  key: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
}> = [
  { key: "Pending",   label: "Order Placed",  icon: "receipt-outline",          desc: "We received your order",           color: "#D97706" },
  { key: "Confirmed", label: "Confirmed",     icon: "checkmark-circle-outline",  desc: "Seller confirmed your order",      color: "#4F46E5" },
  { key: "Shipped",   label: "Shipped",       icon: "airplane-outline",          desc: "Your order is on the way",         color: "#0891B2" },
  { key: "Delivered", label: "Delivered",     icon: "bag-check-outline",         desc: "Order delivered successfully",     color: "#059669" },
];

const STATUS_GRADIENT: Record<string, [string, string]> = {
  Pending:   ["#92400E", "#D97706"],
  Confirmed: ["#3730A3", "#4F46E5"],
  Shipped:   ["#0E7490", "#0891B2"],
  Delivered: ["#065F46", "#059669"],
  Cancelled: ["#991B1B", "#DC2626"],
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Pending:   { color: "#D97706", bg: "#FEF3C7", icon: "time-outline" },
  Confirmed: { color: "#4F46E5", bg: "#EEF2FF", icon: "checkmark-circle-outline" },
  Shipped:   { color: "#0891B2", bg: "#E0F2FE", icon: "airplane-outline" },
  Delivered: { color: "#059669", bg: "#ECFDF5", icon: "bag-check-outline" },
  Cancelled: { color: "#DC2626", bg: "#FEF2F2", icon: "close-circle-outline" },
};

const getStepIndex = (status: string) =>
  PIPELINE.findIndex((s) => s.key === status);

// ─── Timeline step component ─────────────────────────────────────────────────
const TimelineStep = ({
  step,
  index,
  currentIndex,
  isLast,
}: {
  step: (typeof PIPELINE)[0];
  index: number;
  currentIndex: number;
  isLast: boolean;
}) => {
  const done    = index <= currentIndex;
  const active  = index === currentIndex;
  const cancelled = currentIndex < 0; // Cancelled order

  const scaleAnim = useRef(new Animated.Value(done ? 1 : 0.8)).current;

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [active]);

  const iconColor  = done ? Colors.white    : Colors.inkLight;
  const circleBg   = done ? step.color      : Colors.surfaceDim;
  const lineColor  = done && !isLast ? step.color : Colors.border;

  return (
    <View style={timeStyles.stepWrap}>
      {/* Icon circle + connector line */}
      <View style={timeStyles.leftCol}>
        <Animated.View
          style={[
            timeStyles.circle,
            { backgroundColor: circleBg, transform: [{ scale: scaleAnim }] },
            active && { shadowColor: step.color, shadowOpacity: 0.5, shadowRadius: 8, elevation: 6 },
          ]}
        >
          <Ionicons name={step.icon as any} size={18} color={iconColor} />
        </Animated.View>
        {!isLast && (
          <View style={[timeStyles.line, { backgroundColor: lineColor }]} />
        )}
      </View>

      {/* Text */}
      <View style={timeStyles.textCol}>
        <Text style={[timeStyles.stepLabel, done && { color: Colors.ink, fontWeight: "700" }]}>
          {step.label}
        </Text>
        <Text style={timeStyles.stepDesc}>{step.desc}</Text>
        {active && (
          <View style={[timeStyles.activePill, { backgroundColor: step.color + "22" }]}>
            <Text style={[timeStyles.activePillText, { color: step.color }]}>Current status</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Product Row ─────────────────────────────────────────────────────────────
const ProductRow = ({ item }: { item: OrderProduct }) => {
  const imageUri = item.product?.image?.startsWith("http")
    ? item.product.image
    : `${API_BASE_URL}/uploads/${item.product?.image}`;

  const lineTotal = (item.product?.price ?? 0) * item.quantity;

  return (
    <View style={prodStyles.row}>
      <View style={prodStyles.imgWrap}>
        <Image source={{ uri: imageUri }} style={prodStyles.img} />
      </View>
      <View style={prodStyles.info}>
        <Text numberOfLines={2} style={prodStyles.title}>{item.product?.title ?? "Product"}</Text>
        <View style={prodStyles.metaRow}>
          <View style={prodStyles.categoryChip}>
            <Text style={prodStyles.categoryText}>{item.product?.category ?? ""}</Text>
          </View>
        </View>
        <View style={prodStyles.priceRow}>
          <Text style={prodStyles.unitPrice}>₹{item.product?.price?.toLocaleString("en-IN") ?? 0}</Text>
          <Text style={prodStyles.qtyLabel}>× {item.quantity}</Text>
          <Text style={prodStyles.lineTotal}>₹{lineTotal.toLocaleString("en-IN")}</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const OrderDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId } = route.params;
  console.log("OrderDetailsScreen params:", route.params);

  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderRoot}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loaderText}>Loading order…</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.loaderRoot}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.inkLight} />
        <Text style={styles.loaderText}>Order not found</Text>
        <TouchableOpacity style={styles.backBtnText} onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.indigo, fontWeight: "700" }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const cfg          = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.Pending;
  const gradColors   = STATUS_GRADIENT[order.status] ?? STATUS_GRADIENT.Pending;
  const currentIndex = getStepIndex(order.status);
  const isCancelled  = order.status === "Cancelled";

  const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const subtotal  = order.products.reduce(
    (s, p) => s + (p.product?.price ?? 0) * p.quantity, 0
  );
  const shipping  = subtotal > 999 ? 0 : 49;
  const discount  = subtotal + shipping - order.totalAmount;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* ── Gradient header ── */}
      <LinearGradient colors={gradColors as any} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Order ID + status pill */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroOrderId}>#{order._id.slice(-8).toUpperCase()}</Text>
            <Text style={styles.heroDate}>{dateStr}</Text>
          </View>
          <View style={[styles.heroPill, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon as any} size={14} color={cfg.color} />
            <Text style={[styles.heroPillText, { color: cfg.color }]}>{order.status}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Tracking timeline ── */}
        {!isCancelled ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Tracking</Text>
            <View style={styles.timelineCard}>
              {PIPELINE.map((step, i) => (
                <TimelineStep
                  key={step.key}
                  step={step}
                  index={i}
                  currentIndex={currentIndex}
                  isLast={i === PIPELINE.length - 1}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.cancelledBanner}>
              <View style={styles.cancelledIconWrap}>
                <Ionicons name="close-circle" size={36} color={Colors.danger} />
              </View>
              <Text style={styles.cancelledTitle}>Order Cancelled</Text>
              <Text style={styles.cancelledSub}>
                This order was cancelled. If you were charged, a refund will be processed within 5–7 business days.
              </Text>
            </View>
          </View>
        )}

        {/* ── Products ordered ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Items Ordered ({order.products.length})
          </Text>
          <View style={styles.productCard}>
            {order.products.map((item, idx) => (
              <View key={item._id}>
                <ProductRow item={item} />
                {idx < order.products.length - 1 && (
                  <View style={styles.prodDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* ── Price breakdown ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Subtotal ({order.products.reduce((n, p) => n + p.quantity, 0)} items)
              </Text>
              <Text style={styles.priceVal}>₹{subtotal.toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery charges</Text>
              <Text style={[styles.priceVal, shipping === 0 && { color: Colors.success }]}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: Colors.success }]}>Discount</Text>
                <Text style={[styles.priceVal, { color: Colors.success }]}>− ₹{discount.toLocaleString("en-IN")}</Text>
              </View>
            )}
            <View style={styles.priceTotalRow}>
              <Text style={styles.priceTotalLabel}>Total Paid</Text>
              <Text style={styles.priceTotalVal}>₹{order.totalAmount.toLocaleString("en-IN")}</Text>
            </View>
          </View>
        </View>

        {/* ── Order info ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="receipt-outline"     label="Order ID"      value={`#${order._id.slice(-8).toUpperCase()}`} />
            <InfoRow icon="calendar-outline"    label="Placed on"     value={dateStr} />
            <InfoRow icon="refresh-outline"     label="Last updated"  value={new Date(order.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
            <InfoRow icon="cube-outline"        label="Total items"   value={`${order.products.length} products`} />
            <InfoRow icon="wallet-outline"      label="Payment"       value="Paid online" last />
          </View>
        </View>

        {/* ── Action buttons ── */}
        {order.status === "Delivered" && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="star-outline" size={18} color={Colors.indigo} />
              <Text style={styles.actionBtnText}>Write a Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnAccent]}>
              <Ionicons name="refresh-outline" size={18} color={Colors.white} />
              <Text style={[styles.actionBtnText, { color: Colors.white }]}>Reorder</Text>
            </TouchableOpacity>
          </View>
        )}

        {(order.status === "Pending" || order.status === "Confirmed") && (
          <View style={[styles.actionRow, { paddingBottom: 32 }]}>
            <TouchableOpacity style={[styles.actionBtn, { flex: 1, borderColor: Colors.danger }]}>
              <Ionicons name="close-circle-outline" size={18} color={Colors.danger} />
              <Text style={[styles.actionBtnText, { color: Colors.danger }]}>Cancel Order</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Info row helper ─────────────────────────────────────────────────────────
const InfoRow = ({
  icon, label, value, last,
}: { icon: string; label: string; value: string; last?: boolean }) => (
  <View style={[infoStyles.row, last && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
    <View style={infoStyles.iconWrap}>
      <Ionicons name={icon as any} size={16} color={Colors.indigo} />
    </View>
    <View style={infoStyles.texts}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  </View>
);

export default OrderDetailsScreen;

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: Colors.surfaceAlt },
  loaderRoot: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: Colors.surfaceAlt },
  loaderText: { fontSize: 15, color: Colors.inkMid, fontWeight: "600" },
  backBtnText: { marginTop: 8 },
  scroll:     { paddingBottom: 16 },

  /* Header */
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: Colors.white },

  /* Hero card inside header */
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  heroLeft:      {},
  heroOrderId:   { fontSize: 20, fontWeight: "800", color: Colors.white, marginBottom: 3 },
  heroDate:      { fontSize: 12, color: "rgba(255,255,255,0.65)" },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  heroPillText: { fontSize: 12, fontWeight: "700" },

  /* Sections */
  section: { marginHorizontal: Spacing.lg, marginTop: Spacing.xl },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.inkLight,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },

  /* Cards */
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  productCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  priceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },

  prodDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.lg },

  /* Price rows */
  priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.md },
  priceLabel: { fontSize: 14, color: Colors.inkMid },
  priceVal:   { fontSize: 14, fontWeight: "600", color: Colors.ink },
  priceTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.sm,
  },
  priceTotalLabel: { fontSize: 16, fontWeight: "700", color: Colors.ink },
  priceTotalVal:   { fontSize: 20, fontWeight: "800", color: Colors.ink },

  /* Cancelled banner */
  cancelledBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xxl,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    ...Shadow.sm,
  },
  cancelledIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.dangerLight,
    alignItems: "center", justifyContent: "center",
    marginBottom: Spacing.md,
  },
  cancelledTitle: { fontSize: 18, fontWeight: "800", color: Colors.danger, marginBottom: Spacing.sm },
  cancelledSub:   { fontSize: 13, color: Colors.inkMid, textAlign: "center", lineHeight: 20 },

  /* Actions */
  actionRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 50,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.indigo,
    backgroundColor: Colors.indigoLight,
  },
  actionBtnAccent: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.indigo,
  },
});

const timeStyles = StyleSheet.create({
  stepWrap: { flexDirection: "row", gap: Spacing.md, marginBottom: 4 },
  leftCol: { alignItems: "center", width: 44 },
  circle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    ...Shadow.sm,
  },
  line: { width: 2, flex: 1, marginVertical: 4, borderRadius: 1, minHeight: 20 },
  textCol: { flex: 1, paddingVertical: 10, paddingBottom: 20 },
  stepLabel: { fontSize: 14, fontWeight: "600", color: Colors.inkLight, marginBottom: 2 },
  stepDesc:  { fontSize: 12, color: Colors.inkLight, lineHeight: 17 },
  activePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 6,
  },
  activePillText: { fontSize: 11, fontWeight: "700" },
});

const prodStyles = StyleSheet.create({
  row: { flexDirection: "row", padding: Spacing.lg, gap: Spacing.md },
  imgWrap: {
    width: 80, height: 80, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt, overflow: "hidden",
  },
  img: { width: "100%", height: "100%", resizeMode: "contain" },
  info: { flex: 1, justifyContent: "space-between" },
  title: { fontSize: 14, fontWeight: "600", color: Colors.ink, lineHeight: 19, marginBottom: 6 },
  metaRow: { flexDirection: "row", marginBottom: 8 },
  categoryChip: {
    backgroundColor: Colors.indigoLight, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full,
  },
  categoryText: { fontSize: 11, fontWeight: "600", color: Colors.indigo, textTransform: "capitalize" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  unitPrice: { fontSize: 14, fontWeight: "700", color: Colors.ink },
  qtyLabel:  { fontSize: 13, color: Colors.inkMid },
  lineTotal: { fontSize: 14, fontWeight: "800", color: Colors.success, marginLeft: "auto" as any },
});

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: Radius.md,
    backgroundColor: Colors.indigoLight,
    alignItems: "center", justifyContent: "center",
    marginTop: 2,
  },
  texts: { flex: 1 },
  label: { fontSize: 11, color: Colors.inkLight, fontWeight: "600", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  value: { fontSize: 14, fontWeight: "600", color: Colors.ink, lineHeight: 20 },
});