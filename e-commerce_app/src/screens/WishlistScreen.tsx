import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";

import { useWishlist } from "../context/WishlistContext";
import { API_BASE_URL } from "../types/constants";
import {
  Colors,
  Radius,
  Shadow,
  Spacing,
  Typography,
} from "../types/theme";
import { formatCurrency } from "../utils/formatCurrency";

const WishlistScreen = () => {
  const navigation = useNavigation<any>();

  const {
    wishlist,
    fetchWishlist,
    removeFromWishlist,
  } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const renderItem = ({ item }: any) => {
    const product = item.product;

    const imageUrl = product.image?.startsWith("http")
      ? product.image
      : `${API_BASE_URL}/uploads/${product.image}`;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            product,
          })
        }
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.info}>
          <Text
            numberOfLines={2}
            style={styles.title}
          >
            {product.title}
          </Text>

          <Text style={styles.category}>
            {product.category}
          </Text>

          <Text style={styles.price}>
            {formatCurrency(product.price)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() =>
            Alert.alert(
              "Remove",
              "Remove from wishlist?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Remove",
                  style: "destructive",
                  onPress: () =>
                    removeFromWishlist(item._id),
                },
              ]
            )
          }
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={Colors.danger}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={["#1A1A2E", "#16213E"]}
        style={styles.header}
      >
        <Text style={styles.heading}>
          ❤️ My Wishlist
        </Text>

        <Text style={styles.subHeading}>
          {wishlist.length} saved items
        </Text>
      </LinearGradient>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: Spacing.md,
          flexGrow: 1,
        }}
        onRefresh={fetchWishlist}
        refreshing={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="heart-outline"
              size={70}
              color={Colors.inkLight}
            />

            <Text style={styles.emptyTitle}>
              Wishlist is Empty
            </Text>

            <Text style={styles.emptyText}>
              Save products you love to buy later.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
  },

  header: {
    padding: Spacing.lg,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
    marginBottom: Spacing.md,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.white,
  },

  subHeading: {
    marginTop: 4,
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },

  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
    alignItems: "center",
  },

  image: {
    width: 90,
    height: 90,
  },

  info: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.ink,
  },

  category: {
    marginTop: 4,
    color: Colors.inkLight,
    textTransform: "capitalize",
  },

  price: {
    marginTop: 8,
    color: Colors.accent,
    fontWeight: "800",
    fontSize: 17,
  },

  removeBtn: {
    padding: 8,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.ink,
    marginTop: 20,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 10,
    color: Colors.inkLight,
    ...Typography.bodyM,
  },
});