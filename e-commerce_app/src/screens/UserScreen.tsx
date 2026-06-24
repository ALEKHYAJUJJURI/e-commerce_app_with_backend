import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../types/constants";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";

type Product = {
  id: number;
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

const CATEGORIES = [
  { key: "all",              label: "All",           emoji: "🏷️" },
  { key: "men's clothing",   label: "Men",           emoji: "👔" },
  { key: "women's clothing", label: "Women",         emoji: "👗" },
  { key: "jewelery",         label: "Jewellery",     emoji: "💎" },
  { key: "electronics",      label: "Electronics",   emoji: "📱" },
  { key: "home",             label: "Home & Living", emoji: "🏠" },
  { key: "sports",           label: "Sports",        emoji: "🏀" },
  { key: "accessories",      label: "Accessories",   emoji: "👜" },
];

/** Animated product card with press scale */
const ProductCard = ({
  item,
  onPress,
  onAddToCart,
}: {
  item: Product;
  onPress: () => void;
  onAddToCart: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const press   = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const release = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={press}
        onPressOut={release}
      >
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: `${API_BASE_URL}/uploads/${item.image}` }}
            style={styles.image}
          />
          {item.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {item.rating.rate}</Text>
            </View>
          )}
          {/* Category tag */}
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
          <View style={styles.cardFooter}>
            <Text style={styles.price}>₹{item.price}</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={onAddToCart}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons name="add" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

/** Skeleton card placeholder */
const SkeletonCard = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={[styles.imageWrap, { backgroundColor: Colors.border }]} />
      <View style={styles.cardBody}>
        <View style={[styles.skeletonLine, { width: "80%", marginBottom: 6 }]} />
        <View style={[styles.skeletonLine, { width: "55%" }]} />
      </View>
    </Animated.View>
  );
};

const UserScreen = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const { cart, addToCart } = useCart();

  const [products, setProducts]           = useState<Product[]>([]);
  const [filtered, setFiltered]           = useState<Product[]>([]);
  const [search, setSearch]               = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
      setFiltered(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (text: string, cat: string) => {
    let data = [...products];
    if (cat !== "all") data = data.filter((p) => p.category === cat);
    if (text) data = data.filter((p) => p.title.toLowerCase().includes(text.toLowerCase()));
    setFiltered(data);
  };

  const onSearch         = (text: string) => { setSearch(text); filterData(text, selectedCategory); };
  const onSelectCategory = (cat: string)  => { setSelectedCategory(cat); filterData(search, cat); };
  const onRefresh        = async ()       => { setRefreshing(true); await fetchProducts(); setRefreshing(false); };

  const cartCount = cart.reduce((n: number, i: any) => n + (i.quantity || 1), 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day 👋</Text>
            <Text style={styles.brandName}>ShopEase</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={[styles.headerBtn, { backgroundColor: Colors.surfaceAlt }]} />
            <View style={[styles.headerBtn, { backgroundColor: Colors.surfaceAlt }]} />
          </View>
        </View>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(i) => i.toString()}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ───────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.brandName}>ShopEase</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="bag-outline" size={22} color={Colors.ink} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Search ───────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.inkLight} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, brands…"
          placeholderTextColor={Colors.inkLight}
          value={search}
          onChangeText={onSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => onSearch("")}>
            <Ionicons name="close-circle" size={18} color={Colors.inkLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category chips ───────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm }}
      >
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelectCategory(cat.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipEmoji}>{cat.emoji}</Text>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Results count ─────────────────────────────── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </Text>
      </View>

      {/* ── Product grid ──────────────────────────────── */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item: any) => item._id || item.id?.toString()}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => navigation.navigate("ProductDetails", { product: item })}
            onAddToCart={() => addToCart(item)}
          />
        )}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or category.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    
  },
  greeting:  { fontSize: 12, color: Colors.inkLight, marginBottom: 2 },
  brandName: { fontSize: 22, fontWeight: "800", color: Colors.ink, letterSpacing: 0.3 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: Colors.white },

  /* Search */
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.ink },

  /* Chips */
  chipRow: { maxHeight: 58 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 4,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipEmoji:  { fontSize: 13 },
  chipText:   { fontSize: 13, fontWeight: "600", color: Colors.inkMid },
  chipTextActive: { color: Colors.white },

  /* Results */
  resultsRow: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  resultsText: { fontSize: 12, color: Colors.inkLight },

  /* Grid */
  grid: { paddingHorizontal: Spacing.md, paddingBottom: 24 },
  row:  { justifyContent: "space-between", marginBottom: Spacing.md },

  /* Product card */
  card: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  imageWrap: {
    backgroundColor: Colors.surfaceAlt,
    height: 160,
    position: "relative",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  ratingBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  ratingText: { fontSize: 11, fontWeight: "700", color: Colors.white },
  categoryBadge: {
    position: "absolute",
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: "80%",
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.white,
    textTransform: "capitalize",
  },

  cardBody: { padding: Spacing.md },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.ink,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price:  { fontSize: 16, fontWeight: "800", color: Colors.ink },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.sm,
  },

  /* Skeleton */
  skeletonLine: { height: 12, borderRadius: 6, backgroundColor: Colors.border },

  /* Empty */
  emptyWrap:     { alignItems: "center", paddingTop: 60 },
  emptyIcon:     { fontSize: 48, marginBottom: Spacing.lg },
  emptyTitle:    { fontSize: 18, fontWeight: "700", color: Colors.ink, marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: 14, color: Colors.inkMid, textAlign: "center" },
});