import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;
const BANNER_HEIGHT = 160;

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

const getDiscount = (product: Product): number => {
  const seed = product._id
    ? product._id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    : product.price;
  const discounts = [10, 15, 20, 25, 30, 35, 40];
  return discounts[seed % discounts.length];
};

// ─── Banner Carousel ──────────────────────────────────────────────────────────

const BANNER_GRADIENTS: [string, string][] = [
  ["#1A1A2E", "#E94560"],
  ["#0F3460", "#533483"],
  ["#16213E", "#0F3460"],
  ["#1A1A2E", "#4F46E5"],
  ["#0D1117", "#2D1B69"],
];

const BANNER_LABELS = [
  { eyebrow: "🔥 Top Rated", cta: "Shop Now" },
  { eyebrow: "⭐ Bestseller", cta: "Explore" },
  { eyebrow: "✨ Editor's Pick", cta: "View Deal" },
  { eyebrow: "🏆 Fan Favourite", cta: "Buy Now" },
  { eyebrow: "💫 Trending", cta: "Grab It" },
];

type BannerCarouselProps = {
  products: Product[];
  onPress: (p: Product) => void;
};

const BannerCarousel = React.memo(
  ({ products, onPress }: BannerCarouselProps) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const bannerItems = [...products]
      .sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
      .slice(0, 5);

    useEffect(() => {
      if (bannerItems.length < 2) return;
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % bannerItems.length;
          flatListRef.current?.scrollToIndex({ index: next, animated: true });
          return next;
        });
      }, 3500);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [bannerItems.length]);

    if (bannerItems.length === 0) return null;

    const imageUrl = (item: Product) =>
      item.image?.startsWith("http")
        ? item.image
        : `${API_BASE_URL}/uploads/${item.image}`;

    return (
      <View style={bannerStyles.wrapper}>
        <Animated.FlatList
          ref={flatListRef}
          data={bannerItems}
          horizontal
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / BANNER_WIDTH,
            );
            setActiveIndex(index);
          }}
          getItemLayout={(_, index) => ({
            length: BANNER_WIDTH,
            offset: BANNER_WIDTH * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const grad = BANNER_GRADIENTS[index % BANNER_GRADIENTS.length];
            const label = BANNER_LABELS[index % BANNER_LABELS.length];
            const discount = getDiscount(item);
            return (
              <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => onPress(item)}
                style={bannerStyles.slide}
              >
                <LinearGradient
                  colors={[grad[0], grad[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={bannerStyles.gradient}
                >
                  <View style={bannerStyles.blob1} />
                  <View style={bannerStyles.blob2} />
                  <View style={bannerStyles.textBlock}>
                    <Text style={bannerStyles.eyebrow}>{label.eyebrow}</Text>
                    <Text numberOfLines={2} style={bannerStyles.bannerTitle}>
                      {item.title}
                    </Text>
                    <View style={bannerStyles.priceBadge}>
                      <Text style={bannerStyles.bannerPrice}>
                        ${item.price.toFixed(2)}
                      </Text>
                      <View style={bannerStyles.offPill}>
                        <Text style={bannerStyles.offText}>
                          {discount}% OFF
                        </Text>
                      </View>
                    </View>
                    <View style={bannerStyles.ctaBtn}>
                      <Text style={bannerStyles.ctaText}>{label.cta}</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={12}
                        color={Colors.white}
                      />
                    </View>
                  </View>
                  <View style={bannerStyles.imageBox}>
                    <Image
                      source={{ uri: imageUrl(item) }}
                      style={bannerStyles.bannerImage}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          }}
        />
        <View style={bannerStyles.dots}>
          {bannerItems.map((_, i) => (
            <View
              key={i}
              style={[
                bannerStyles.dot,
                i === activeIndex && bannerStyles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  },
);

const bannerStyles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  slide: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: Radius.xl,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    position: "relative",
  },
  blob1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: 40,
  },
  blob2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -30,
    left: 20,
  },
  textBlock: { flex: 1, paddingRight: 8 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.white,
    lineHeight: 19,
    marginBottom: 8,
  },
  priceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  bannerPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: -0.5,
  },
  offPill: {
    backgroundColor: "#E94560",
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  offText: { fontSize: 9, fontWeight: "800", color: Colors.white },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  ctaText: { fontSize: 11, fontWeight: "700", color: Colors.white },
  imageBox: {
    width: 110,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: { width: 110, height: 110 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(26,26,46,0.2)",
  },
  dotActive: { width: 18, backgroundColor: Colors.primary ?? "#1A1A2E" },
});

// ─── Flash Deals ─────────────────────────────────────────────────────────────

type FlashDealsProps = { products: Product[]; onPress: (p: Product) => void };

const FlashDeals = React.memo(({ products, onPress }: FlashDealsProps) => {
  const deals = [...products].sort((a, b) => a.price - b.price).slice(0, 6);
  if (deals.length === 0) return null;

  const imageUrl = (item: Product) =>
    item.image?.startsWith("http")
      ? item.image
      : `${API_BASE_URL}/uploads/${item.image}`;

  return (
    <View style={dealStyles.section}>
      <View style={dealStyles.sectionHeader}>
        <View style={dealStyles.flashLabel}>
          <Text style={dealStyles.flashIcon}>⚡</Text>
          <Text style={dealStyles.sectionTitle}>Flash Deals</Text>
        </View>
        <View style={dealStyles.timerPill}>
          <Ionicons name="time-outline" size={11} color="#E94560" />
          <Text style={dealStyles.timerText}>Limited time</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={dealStyles.scroll}
      >
        {deals.map((item) => {
          const discount = getDiscount(item);
          const original = +(item.price / (1 - discount / 100)).toFixed(2);
          return (
            <TouchableOpacity
              key={item._id}
              style={dealStyles.card}
              onPress={() => onPress(item)}
              activeOpacity={0.88}
            >
              <View style={dealStyles.ribbon}>
                <Text style={dealStyles.ribbonText}>
                  {discount}%{"\n"}OFF
                </Text>
              </View>
              <View style={dealStyles.imgBox}>
                <Image
                  source={{ uri: imageUrl(item) }}
                  style={dealStyles.img}
                  resizeMode="contain"
                />
              </View>
              <View style={dealStyles.info}>
                <Text numberOfLines={1} style={dealStyles.dealTitle}>
                  {item.title}
                </Text>
                <Text style={dealStyles.dealPrice}>
                  ${item.price.toFixed(2)}
                </Text>
                <Text style={dealStyles.dealOriginal}>
                  ${original.toFixed(2)}
                </Text>
                {item.rating && (
                  <View style={dealStyles.ratingRow}>
                    <Ionicons name="star" size={9} color="#FFC940" />
                    <Text style={dealStyles.ratingVal}>{item.rating.rate}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

const dealStyles = StyleSheet.create({
  section: { marginTop: Spacing.sm, marginBottom: 4 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginBottom: 10,
  },
  flashLabel: { flexDirection: "row", alignItems: "center", gap: 5 },
  flashIcon: { fontSize: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.ink,
    letterSpacing: -0.3,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(233,69,96,0.1)",
    borderRadius: Radius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(233,69,96,0.2)",
  },
  timerText: { fontSize: 10, fontWeight: "700", color: "#E94560" },
  scroll: { paddingHorizontal: Spacing.lg, gap: 10 },
  card: {
    width: 120,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    position: "relative",
    ...Shadow.sm,
  },
  ribbon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#E94560",
    borderBottomLeftRadius: Radius.md,
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 2,
    alignItems: "center",
  },
  ribbonText: {
    fontSize: 8,
    fontWeight: "900",
    color: Colors.white,
    textAlign: "center",
    lineHeight: 10,
  },
  imgBox: {
    backgroundColor: Colors.surfaceAlt,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  img: { width: 80, height: 80 },
  info: { padding: 8 },
  dealTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.ink,
    marginBottom: 4,
  },
  dealPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.ink,
    letterSpacing: -0.3,
  },
  dealOriginal: {
    fontSize: 10,
    color: Colors.inkLight,
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingVal: { fontSize: 10, fontWeight: "600", color: Colors.inkMid },
});

// ─── Scrollable List Header (carousel + deals + results count only) ───────────

type ListHeaderProps = {
  products: Product[];
  filtered: Product[];
  selectedCategory: string;
  onProductPress: (p: Product) => void;
  onClearFilter: () => void;
};

const ListHeaderComponent = React.memo(
  ({
    products,
    filtered,
    selectedCategory,
    onProductPress,
    onClearFilter,
  }: ListHeaderProps) => (
    <>
      {products.length > 0 && (
        <BannerCarousel products={products} onPress={onProductPress} />
      )}
      {products.length > 0 && (
        <FlashDeals products={products} onPress={onProductPress} />
      )}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsLabel}>
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </Text>
        {selectedCategory !== "all" && (
          <TouchableOpacity onPress={onClearFilter}>
            <Text style={styles.clearFilter}>Clear filter</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  ),
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const UserScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const { wishlistIds, toggleWishlist, fetchWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchInputRef = useRef<TextInput>(null);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-20)).current;

  console.log("wishlistIds in UserScreen:", wishlistIds);

  useEffect(() => {
    if (user) fetchWishlist();
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

  const filterData = useCallback(
    (text: string, cat: string, base: Product[]) => {
      let data = [...base];
      if (cat !== "all")
        data = data.filter(
          (p) => p.category?.toLowerCase() === cat.toLowerCase(),
        );
      if (text)
        data = data.filter((p) =>
          p.title?.toLowerCase().includes(text.toLowerCase()),
        );
      setFiltered(data);
    },
    [],
  );

  const onSearch = useCallback(
    (text: string) => {
      setSearch(text);
      filterData(text, selectedCategory, products);
    },
    [selectedCategory, products, filterData],
  );

  const onSelectCategory = useCallback(
    (cat: string) => {
      setSelectedCategory(cat);
      filterData(search, cat, products);
    },
    [search, products, filterData],
  );

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

  const handleProductPress = useCallback(
    (item: Product) => navigation.navigate("ProductDetails", { product: item }),
    [navigation],
  );

  const handleClearFilter = useCallback(
    () => onSelectCategory("all"),
    [onSelectCategory],
  );

  const cartCount = cart.reduce(
    (n: number, i: any) => n + (i.quantity || 1),
    0,
  );

  // Stable list header data — passed as props so ListHeaderComponent never
  // remounts and never causes keyboard dismiss
  const listHeaderData = {
    products,
    filtered,
    selectedCategory,
    onProductPress: handleProductPress,
    onClearFilter: handleClearFilter,
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Fixed Header (gradient brand bar) ── */}
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
                Good day{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
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
        </LinearGradient>
      </Animated.View>

      {/* ── Fixed Search Bar (outside FlatList — keyboard never dismisses) ── */}
      <View style={styles.searchContainer}>
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
            ref={searchInputRef}
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
      </View>

      {/* ── Guest Banner (fixed) ── */}
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

      {/* ── Fixed Category Chips (never scrolls away) ── */}
      <View style={styles.chipContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContent}
          keyboardShouldPersistTaps="handled"
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
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Scrollable Content: carousel + deals + product grid ── */}
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(i) => i.toString()}
          renderItem={() => <ProductCardSkeleton />}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          renderItem={({ item, index }) => (
            <ProductCard
              item={item}
              index={index}
              isWishlisted={wishlistIds.includes(item._id)}
              onPress={() => handleProductPress(item)}
              onAddToCart={() => handleAddToCart(item)}
              onBuyNow={() => handleBuyNow(item)}
              onToggleWishlist={() => handleToggleWishlist(item)}
            />
          )}
          ListHeaderComponent={
            <ListHeaderComponent
              products={listHeaderData.products}
              filtered={listHeaderData.filtered}
              selectedCategory={listHeaderData.selectedCategory}
              onProductPress={listHeaderData.onProductPress}
              onClearFilter={listHeaderData.onClearFilter}
            />
          }
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
      )}
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  // Header (brand bar — no search bar inside anymore)
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
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

  // Search bar — lives outside FlatList so keyboard never dismisses on re-render
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    ...Shadow.xs,
  },
  searchWrapFocused: {
    borderColor: Colors.indigo,
    backgroundColor: Colors.surface,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.ink },

  // Guest banner
  guestBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.indigoLight,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
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

  // Category chips — fixed row, never scrolls with content
  chipContainer: {
    backgroundColor: Colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chipContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: 8,
  },
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

  // Results row
  resultsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: 8,
    paddingTop: Spacing.md,
  },
  resultsLabel: { fontSize: 12, color: Colors.inkLight, fontWeight: "500" },
  clearFilter: { fontSize: 12, color: Colors.accent, fontWeight: "600" },

  // Grid
  grid: { paddingHorizontal: Spacing.md, paddingBottom: 32 },
  row: { justifyContent: "space-between", marginBottom: Spacing.md },

  // Empty state
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
