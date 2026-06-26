import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "../types/constants";
import { Colors, Radius, Shadow, Spacing, Animation } from "../types/theme";
import { formatCurrency } from "../utils/formatCurrency";

const { width } = Dimensions.get("window");
export const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md) / 2;

export type Product = {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
  discountPercent?: number;
};

type ProductCardProps = {
  item: Product;
  index?: number;
  isWishlisted: boolean;
  onPress: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void | Promise<void>;
};

const ProductCard = ({
  item,
  index = 0,
  isWishlisted,
  onPress,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
}: ProductCardProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(24)).current;
  const addScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const [added, setAdded] = useState(false);
 

  useEffect(() => {
  
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: Animation.slow,
        delay: Math.min(index * 60, 300),
        useNativeDriver: true,
      }),
      Animated.spring(cardY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        delay: Math.min(index * 60, 300),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      ...Animation.spring,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      ...Animation.bounce,
      useNativeDriver: true,
    }).start();

  const handleAdd = () => {
    Animated.sequence([
      Animated.spring(addScale, {
        toValue: 1.3,
        tension: 200,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(addScale, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    onAddToCart();
  };

  const handleWishlist = async () => {
    await onToggleWishlist();
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.4,
        tension: 250,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        tension: 180,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const imageUrl = item.image?.startsWith("http")
    ? item.image
    : `${API_BASE_URL}/uploads/${item.image}`;

  const discountPct = item.discountPercent;
  const originalPrice = discountPct
    ? Math.round(item.price / (1 - discountPct / 100))
    : null;

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: cardOpacity, transform: [{ translateY: cardY }, { scale }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />

          <Animated.View
            style={[styles.wishlistBtn, { transform: [{ scale: heartScale }] }]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleWishlist}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isWishlisted ? "heart" : "heart-outline"}
                size={18}
                color={isWishlisted ? "#EF4444" : Colors.white}
              />
            </TouchableOpacity>
          </Animated.View>

          {discountPct ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPct}% OFF</Text>
            </View>
          ) : null}

          {item.rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFC940" />
              <Text style={styles.ratingText}>{item.rating.rate}</Text>
            </View>
          )}

          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.6)"]}
            style={styles.imageGradient}
          />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {item.title}
          </Text>

          <View style={styles.priceLine}>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            {originalPrice && (
              <Text style={styles.strikePrice}>
                {formatCurrency(originalPrice)}
              </Text>
            )}
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.buyNowBtn}
              onPress={onBuyNow}
              activeOpacity={0.85}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: addScale }] }}>
              <TouchableOpacity
                style={[styles.addBtn, added && styles.addBtnSuccess]}
                onPress={handleAdd}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={added ? "checkmark" : "cart-outline"}
                  size={18}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  imageWrap: {
    backgroundColor: Colors.surfaceAlt,
    height: 168,
    position: "relative",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
  },
  ratingText: { fontSize: 10, fontWeight: "700", color: Colors.white },
  categoryBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(26,26,46,0.85)",
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: "78%",
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    textTransform: "capitalize",
    letterSpacing: 0.3,
  },
  cardBody: { padding: Spacing.md },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.ink,
    marginBottom: 8,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.ink,
    letterSpacing: -0.3,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.accent,
  },
  addBtnSuccess: { backgroundColor: Colors.success },
  wishlistBtn: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.danger,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: { fontSize: 9, fontWeight: "800", color: Colors.white },
  ratingBadge: {
    position: "absolute",
    bottom: 36,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  priceLine: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 10,
  },
  strikePrice: {
    fontSize: 12,
    color: Colors.inkLight,
    textDecorationLine: "line-through",
  },
  buyNowBtn: {
    flex: 1,
    height: 32,
    borderRadius: Radius.md,
    borderWidth: 1.3,
    borderColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  buyNowText: { fontSize: 11.5, fontWeight: "700", color: Colors.accent },
});
