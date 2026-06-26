import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { requireAuth } from "../utils/requireAuth";
import { API_BASE_URL } from "../types/constants";
import { Colors, Radius, Shadow, Spacing, Typography } from "../types/theme";
import { ProductCardSkeleton } from "../utils/Shimmer";
import ProductCard, { Product } from "../utils/ProductCard";
import { useWishlist } from "../context/WishlistContext";

const CATEGORIES = [
  { key: "all", label: "All", emoji: "🏷️" },
  { key: "men's clothing", label: "Men", emoji: "👔" },
  { key: "women's clothing", label: "Women", emoji: "👗" },
  { key: "jewelery", label: "Jewellery", emoji: "💎" },
  { key: "electronics", label: "Electronics", emoji: "📱" },
  { key: "home", label: "Home", emoji: "🏠" },
  { key: "sports", label: "Sports", emoji: "🏀" },
  { key: "accessories", label: "Accessories", emoji: "👜" },
];

const UserScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const {
  wishlistIds,
  toggleWishlist,
  fetchWishlist,
} = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
 console.log("wishlistIds in UserScreen:", wishlistIds);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-20)).current;
useEffect(() => {
  if (user) {
    fetchWishlist();
  }
}, [user]);

useEffect(() => {
  console.log("Wishlist IDs:", wishlistIds);
}, [wishlistIds]);

  useEffect(() => {
    fetchProducts();
     
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(headerY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterData = (text: string, cat: string) => {
    let data = [...products];
    if (cat !== "all")
      data = data.filter(
        (p) => p.category?.toLowerCase() === cat.toLowerCase(),
      );
    if (text)
      data = data.filter((p) =>
        p.title?.toLowerCase().includes(text.toLowerCase()),
      );
    setFiltered(data);
  };

  const onSearch = (text: string) => setSearch(text);

  useEffect(() => {
    filterData(search, selectedCategory);
  }, [search, selectedCategory, products]);

  const onSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    filterData(search, cat);
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddToCart = useCallback(
    (item: Product) => requireAuth(user, navigation, () => addToCart(item)),
    [user, navigation, addToCart],
  );

  const handleBuyNow = useCallback(
    (item: Product) =>
      requireAuth(user, navigation, () => {
        addToCart(item);
        navigation.navigate("Cart");
      }),
    [user, navigation, addToCart],
  );

  const handleToggleWishlist = useCallback(
  (item: Product) =>
    requireAuth(user, navigation, async () => {
      await toggleWishlist(item);
    }),
  [user, navigation, toggleWishlist],
);

  const cartCount = cart.reduce(
    (n: number, i: any) => n + (i.quantity || 1),
    0,
  );

  const Header = React.memo(() => (
    <Animated.View
      style={{ opacity: headerOpacity, transform: [{ translateY: headerY }] }}
    >
      <LinearGradient
        colors={["#1A1A2E", "#16213E"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerBlob1} />
        <View style={styles.headerBlob2} />

        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>
              Good day{user?.name ? user.name.split(" ")[0] : ""} 👋
            </Text>
            <Text style={styles.brandName}>ShopEase</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.navigate(user ? "Profile" : "Login")}
            >
              <Ionicons
                name={user ? "person-circle-outline" : "log-in-outline"}
                size={22}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.navigate("Cart")}
            >
              <Ionicons name="bag-outline" size={22} color={Colors.white} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[styles.searchWrap, searchFocused && styles.searchWrapFocused]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={searchFocused ? Colors.indigo : Colors.inkLight}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands…"
            placeholderTextColor={Colors.inkLight}
            value={search}
            onChangeText={onSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            autoCorrect={false}
            autoCapitalize="none"
            blurOnSubmit={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => onSearch("")}>
              <Ionicons name="close-circle" size={18} color={Colors.inkLight} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  ));

  const ListHeader = React.memo(() => (
    <>
      {!user && (
        <View style={styles.guestBanner}>
          <Ionicons name="sparkles-outline" size={15} color={Colors.indigo} />
          <Text style={styles.guestBannerText}>
            Browsing as guest — sign in for faster checkout
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.guestBannerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          gap: 8,
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelectCategory(cat.key)}
              activeOpacity={0.75}
            >
              <Text style={styles.chipEmoji}>{cat.emoji}</Text>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsLabel}>
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </Text>
        {selectedCategory !== "all" && (
          <TouchableOpacity onPress={() => onSelectCategory("all")}>
            <Text style={styles.clearFilter}>Clear filter</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  ));

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <Header />
        <ListHeader />
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(i) => i.toString()}
          renderItem={() => <ProductCardSkeleton />}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header />
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
         <ProductCard
    item={item}
    index={index}
    isWishlisted={wishlistIds.includes(item._id)}
    onPress={() =>
      navigation.navigate("ProductDetails", {
        product: item,
      })
    }
    onAddToCart={() => handleAddToCart(item)}
    onBuyNow={() => handleBuyNow(item)}
    onToggleWishlist={() => handleToggleWishlist(item)}
/>
        )}
        ListHeaderComponent={<ListHeader />}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different search or category.
            </Text>
            {search.length > 0 && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => onSearch("")}
              >
                <Text style={styles.emptyBtnText}>Clear search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
    overflow: "hidden",
  },
  headerBlob1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(233,69,96,0.07)",
    top: -60,
    right: -40,
  },
  headerBlob2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(79,70,229,0.06)",
    bottom: 0,
    left: -20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  greeting: { fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 2 },
  brandName: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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
    borderWidth: 1.5,
    borderColor: Colors.primaryDark,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: Colors.white },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
  },
  searchWrapFocused: {
    backgroundColor: Colors.surface,
    borderColor: Colors.indigo,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.ink },
  guestBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.indigoLight,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  guestBannerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.indigo,
    fontWeight: "500",
  },
  guestBannerLink: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.indigo,
    textDecorationLine: "underline",
  },
  chipRow: { maxHeight: 56 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 4,
    ...Shadow.xs,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipEmoji: { fontSize: 13 },
  chipText: { fontSize: 13, fontWeight: "600", color: Colors.inkMid },
  chipTextActive: { color: Colors.white },
  resultsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: 8,
    paddingTop: 4,
  },
  resultsLabel: { fontSize: 12, color: Colors.inkLight, fontWeight: "500" },
  clearFilter: { fontSize: 12, color: Colors.accent, fontWeight: "600" },
  grid: { paddingHorizontal: Spacing.md, paddingBottom: 32 },
  row: { justifyContent: "space-between", marginBottom: Spacing.md },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: Spacing.xxl,
  },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.lg },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.ink,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.inkMid,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  emptyBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxl,
    height: 46,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.accent,
  },
  emptyBtnText: { ...Typography.labelM, color: Colors.white },
});
