import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../types/constants";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatCurrency } from "../utils/formatCurrency";


const CartScreen = () => {
  const { cart, addToCart, decreaseQuantity, clearCart,removeFromCart } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const subtotal = cart.reduce(
    (s: number, i: any) => s + i.price * i.quantity,
    0,
  );
  const shipping = subtotal > 0 ? (subtotal > 999 ? 0 : 49) : 0;
  const total = subtotal + shipping;
  const totalItems = cart.reduce((n: number, i: any) => n + i.quantity, 0);
const handleCheckout = async () => {
  try {
    if (!user) {
      Alert.alert(
        "Login required",
        "Please sign in to place your order."
      );
      return;
    }

    const token = await AsyncStorage.getItem("token");

    console.log("TOKEN:", token);

    const response = await axios.post(
      `${API_BASE_URL}/api/orders`,
      {
        products: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        totalAmount: total,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("ORDER SUCCESS", response.data);

    Alert.alert("Success", "Order placed successfully");

    clearCart();

    // navigation.navigate("MyOrders");
  } catch (error: any) {
    console.log(
      "ORDER ERROR:",
      error.response?.data || error.message
    );
  }
};

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyRoot}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.ink} />
        </TouchableOpacity>
        <View style={styles.emptyContent}>
          <View style={styles.emptyIllustration}>
            <Text style={{ fontSize: 64 }}>🛍️</Text>
          </View>
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items you love to start shopping. It only takes a moment!
          </Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.shopNowText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: any) => {
    const imageUrl = item.image?.startsWith("http")
      ? item.image
      : `${API_BASE_URL}/uploads/${item.image}`;
    return (
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
        <View style={styles.info}>
          <Text numberOfLines={2} style={styles.itemTitle}>
            {item.title}
          </Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
         <View style={styles.qtyRow}>
  <TouchableOpacity
    style={styles.qtyBtn}
    onPress={() => decreaseQuantity(item._id)}
  >
    <Ionicons name="remove" size={16} color={Colors.ink} />
  </TouchableOpacity>

  <Text style={styles.qtyValue}>{item.quantity}</Text>

  <TouchableOpacity
    style={styles.qtyBtn}
    onPress={() => addToCart(item)}
  >
    <Ionicons name="add" size={16} color={Colors.ink} />
  </TouchableOpacity>

  <View style={{ flex: 1 }} />

  <Text style={styles.lineTotal}>
    {formatCurrency(item.price * item.quantity)}
  </Text>
</View>

<TouchableOpacity
  style={styles.removeBtn}
  onPress={() => removeFromCart(item._id)}
>
  <Ionicons
    name="trash-outline"
    size={16}
    color={Colors.danger}
  />
  <Text style={styles.removeText}>Remove</Text>
</TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark ?? "#1A1A2E"]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn2}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Bag</Text>
          <Text style={styles.headerSub}>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={clearCart}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </LinearGradient>

      {!user && (
        <View style={styles.guestBanner}>
          <Ionicons
            name="lock-closed-outline"
            size={16}
            color={Colors.warning}
          />
          <Text style={styles.guestBannerText}>
            Sign in before checkout to complete your order
          </Text>
        </View>
      )}

      {shipping > 0 ? (
        <View style={styles.shippingBanner}>
          <Ionicons name="rocket-outline" size={16} color={Colors.indigo} />
          <Text style={styles.shippingBannerText}>
            Add {formatCurrency(999 - subtotal)} more for free delivery
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.shippingBanner,
            { backgroundColor: Colors.successLight },
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={16}
            color={Colors.success}
          />
          <Text style={[styles.shippingBannerText, { color: Colors.success }]}>
            You qualify for free delivery! 🎉
          </Text>
        </View>
      )}

      <FlatList
        data={cart}
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text
            style={[
              styles.summaryValue,
              shipping === 0 && { color: Colors.success },
            ]}
          >
            {shipping === 0 ? "FREE" : formatCurrency(shipping)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.cta}
          onPress={handleCheckout}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>
            {user ? "Place Order" : "Sign In to Checkout"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  backBtn2: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { ...Typography.h2, color: Colors.white },
  headerSub: { ...Typography.caption, color: "rgba(255,255,255,0.7)" },
  clearText: { ...Typography.labelM, color: Colors.accent },

  guestBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  guestBannerText: { ...Typography.bodyS, color: "#92400E", flex: 1 },

  shippingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.indigoLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  shippingBannerText: {
    ...Typography.bodyS,
    color: Colors.indigo,
    fontWeight: "600",
  },

  list: { padding: Spacing.lg, paddingBottom: 8 },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  imageWrap: {
    width: 100,
    height: 100,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    overflow: "hidden",
    marginRight: Spacing.md,
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  info: { flex: 1, justifyContent: "space-between" },
  itemTitle: {
    ...Typography.labelM,
    color: Colors.ink,
    lineHeight: 19,
    marginBottom: 4,
  },
  itemCategory: {
    ...Typography.labelS,
    color: Colors.indigo,
    backgroundColor: Colors.indigoLight,
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    textTransform: "capitalize",
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    ...Typography.h4,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
  },
  qtyValue: {
    ...Typography.labelL,
    color: Colors.ink,
    minWidth: 20,
    textAlign: "center",
  },
  lineTotal: { ...Typography.labelL, color: Colors.ink },

  footer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  summaryLabel: { ...Typography.bodyM, color: Colors.inkMid },
  summaryValue: { ...Typography.labelM, color: Colors.ink },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  totalLabel: { ...Typography.h3, color: Colors.ink },
  totalValue: { ...Typography.h2, color: Colors.ink },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accent,
    height: 56,
    borderRadius: Radius.md,
    ...Shadow.md,
  },
  ctaText: { ...Typography.labelL, color: Colors.white, fontSize: 16 },

  emptyRoot: { flex: 1, backgroundColor: Colors.surfaceAlt },
  backBtn: {
    margin: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.sm,
  },
  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xxxl,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    ...Shadow.md,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.ink,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    ...Typography.bodyM,
    color: Colors.inkMid,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.xxl,
  },
  shopNowBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxxl,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.md,
  },
  shopNowText: { ...Typography.labelL, color: Colors.white, fontSize: 15 },
  removeBtn: {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-start",
  marginTop: Spacing.sm,
  paddingVertical: 4,
},

removeText: {
  marginLeft: 4,
  color: Colors.danger,
  fontSize: 13,
  fontWeight: "600",
},
});
