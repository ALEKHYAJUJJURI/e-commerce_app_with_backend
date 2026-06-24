import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../types/constants";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";

const ProductDetailsScreen = ({ route }: any) => {
  const { product } = route.params;
  const { addToCart, cart } = useCart();
  const navigation = useNavigation<any>();
  const [added, setAdded] = useState(false);

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${API_BASE_URL}/uploads/${product.image}`;

  const cartItem = cart.find((i: any) => i._id === product._id);
  const cartCount = cart.reduce((n: number, i: any) => n + (i.quantity || 1), 0);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.round(product.rating?.rate || 0);
    return filled ? "★" : "☆";
  });

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Top nav ──────────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.ink} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>Product Details</Text>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="bag-outline" size={22} color={Colors.ink} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ── Image ────────────────────────────────────── */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />

          {/* Category pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{product.category}</Text>
          </View>
        </View>

        {/* ── Details ──────────────────────────────────── */}
        <View style={styles.detailsCard}>
          {/* Price + rating row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.rating && (
              <View style={styles.ratingWrap}>
                <Text style={styles.stars}>{stars.join("")}</Text>
                <Text style={styles.ratingCount}>({product.rating.count})</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Stock */}
          {product.stock !== undefined && (
            <View style={styles.stockRow}>
              <View style={[styles.stockDot, { backgroundColor: product.stock > 0 ? Colors.success : Colors.danger }]} />
              <Text style={[styles.stockText, { color: product.stock > 0 ? Colors.success : Colors.danger }]}>
                {product.stock > 0 ? `In stock (${product.stock} units)` : "Out of stock"}
              </Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Delivery note */}
          <View style={styles.deliveryBadge}>
            <Ionicons name="flash-outline" size={16} color={Colors.indigo} />
            <Text style={styles.deliveryText}>
              Fast delivery available · Free returns within 30 days
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky footer CTA ───────────────────────── */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View>
            <Text style={styles.footerPriceLabel}>Total price</Text>
            <Text style={styles.footerPrice}>₹{product.price}</Text>
          </View>
          <TouchableOpacity
            style={[styles.cta, added && styles.ctaSuccess]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Ionicons
              name={added ? "checkmark" : "bag-add-outline"}
              size={20}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.ctaText}>
              {added ? "Added!" : cartItem ? "Add Again" : "Add to Bag"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  /* Top nav */
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { ...Typography.h4, color: Colors.ink, flex: 1, textAlign: "center", marginHorizontal: 8 },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  badgeText: { ...Typography.labelS, color: Colors.white, fontSize: 9 },

  /* Image */
  imageContainer: {
    height: 320,
    backgroundColor: Colors.surface,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  categoryPill: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  categoryPillText: {
    ...Typography.labelS,
    color: Colors.white,
    textTransform: "capitalize",
  },

  /* Details card */
  detailsCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
    padding: Spacing.xxl,
    ...Shadow.md,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  price: { ...Typography.displayL, color: Colors.ink, fontSize: 28 },
  ratingWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  stars: { color: Colors.warning, fontSize: 16, letterSpacing: 1 },
  ratingCount: { ...Typography.caption, color: Colors.inkLight },

  title: {
    ...Typography.h2,
    color: Colors.ink,
    marginBottom: Spacing.md,
    lineHeight: 28,
  },

  stockRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: Spacing.md },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { ...Typography.labelM },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },

  sectionLabel: {
    ...Typography.labelM,
    color: Colors.inkLight,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.bodyM,
    color: Colors.inkMid,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },

  deliveryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.indigoLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 8,
  },
  deliveryText: { ...Typography.bodyS, color: Colors.indigo, flex: 1 },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: 28,
    ...Shadow.lg,
  },
  footerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerPriceLabel: { ...Typography.caption, color: Colors.inkLight, marginBottom: 2 },
  footerPrice: { ...Typography.h2, color: Colors.ink },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxl,
    height: 52,
    borderRadius: Radius.md,
    ...Shadow.md,
  },
  ctaSuccess: { backgroundColor: Colors.success },
  ctaText: { ...Typography.labelL, color: Colors.white, fontSize: 15 },
});