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
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { requireAuth } from "../utils/requireAuth";
import { API_BASE_URL } from "../types/constants";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";
import { formatCurrency } from "../utils/formatCurrency";

const ProductDetailsScreen = ({ route }: any) => {
  const { product } = route.params;
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const navigation = useNavigation<any>();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${API_BASE_URL}/uploads/${product.image}`;

  const cartItem = cart.find((i: any) => i._id === product._id);

  const handleAddToCart = () => {
    requireAuth(user, navigation, () => {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  };

  const handleBuyNow = () => {
    requireAuth(user, navigation, () => {
      addToCart(product);
      navigation.navigate("MainTabs", {
        screen: "Cart",
      });
    });
  };

  // const handleWishlist = () => requireAuth(user, navigation, () => setWishlisted((p) => !p));

  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(product.rating?.rate || 0) ? "★" : "☆",
  );

  const description: string = product.description || "";
  const isLong = description.length > 120;
  const shownDescription =
    expanded || !isLong ? description : description.slice(0, 120) + "…";

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.ink} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          Product Details
        </Text>
        {/* <TouchableOpacity style={styles.navBtn} onPress={handleWishlist}>
          <Ionicons
            name={wishlisted ? "heart" : "heart-outline"}
            size={20}
            color={wishlisted ? Colors.accent : Colors.ink}
          />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{product.category}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            </View>
            {product.rating && (
              <View style={styles.ratingWrap}>
                <Text style={styles.stars}>{stars.join("")}</Text>
                <Text style={styles.ratingCount}>({product.rating.count})</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{product.title}</Text>

          {!user && (
            <View style={styles.guestNote}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={Colors.indigo}
              />
              <Text style={styles.guestNoteText}>
                Sign in required to add this to your bag
              </Text>
            </View>
          )}

          <View style={styles.stockRow}>
            <View
              style={[styles.stockDot, { backgroundColor: Colors.success }]}
            />
            <Text style={[styles.stockText, { color: Colors.success }]}>
              Available for Delivery
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>About this product</Text>
          <Text style={styles.description}>{shownDescription}</Text>
          {isLong && (
            <TouchableOpacity onPress={() => setExpanded((p) => !p)}>
              <Text style={styles.readMore}>
                {expanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.deliveryBadge}>
            <Ionicons name="flash-outline" size={16} color={Colors.indigo} />
            <Text style={styles.deliveryText}>
              Fast delivery available · Free returns within 30 days
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]}>
        <View style={styles.footer}>
          <View style={styles.footerInner}>
            <TouchableOpacity
              style={[styles.cartCta, added && styles.cartCtaSuccess]}
              onPress={handleAddToCart}
              activeOpacity={0.85}
            >
              <Ionicons
                name={added ? "checkmark" : "cart-outline"}
                size={19}
                color={added ? Colors.white : Colors.accent}
              />
              <Text
                style={[styles.cartCtaText, added && { color: Colors.white }]}
              >
                {added ? "Added!" : cartItem ? "Add Again" : "Add to Cart"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyNowCta}
              onPress={handleBuyNow}
              activeOpacity={0.85}
            >
              <Text style={styles.buyNowCtaText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

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
  navTitle: {
    ...Typography.h4,
    color: Colors.ink,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
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

  imageContainer: {
    height: 320,
    backgroundColor: Colors.surface,
    position: "relative",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
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

  guestNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.indigoLight,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  guestNoteText: { ...Typography.bodyS, color: Colors.indigo },

  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: Spacing.md,
  },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { ...Typography.labelM },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },

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

  footerPriceLabel: { ...Typography.caption, color: Colors.inkLight },
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
  readMore: {
    ...Typography.labelM,
    color: Colors.indigo,
    marginTop: -8,
    marginBottom: Spacing.xl,
  },
  footerInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  cartCta: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    gap: 8,
  },
  cartCtaSuccess: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  cartCtaText: { ...Typography.labelL, color: Colors.accent, fontSize: 15 },
  buyNowCta: {
    flex: 1,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.md,
  },
  buyNowCtaText: { ...Typography.labelL, color: Colors.white, fontSize: 15 },
});
