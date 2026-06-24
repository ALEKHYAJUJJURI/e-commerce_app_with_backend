import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radius, Shadow, Spacing, Typography } from "../../types/theme";
import { API_BASE_URL } from "@/src/types/constants";



const CATEGORIES = [
  { key: "men's clothing",   label: "Men",         emoji: "👔" },
  { key: "women's clothing", label: "Women",        emoji: "👗" },
  { key: "jewelery",         label: "Jewellery",    emoji: "💎" },
  { key: "electronics",      label: "Electronics",  emoji: "📱" },
  { key: "home",             label: "Home & Living", emoji: "🏠" },
  { key: "sports",           label: "Sports",       emoji: "🏀" },
  { key: "accessories",      label: "Accessories",  emoji: "👜" },
];

const ProductsScreen = () => {
  const [products, setProducts]         = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [title, setTitle]             = useState("");
  const [price, setPrice]             = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]       = useState("men's clothing");
  const [image, setImage]             = useState<any>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [focusedField, setFocusedField]     = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    (async () => { await ImagePicker.requestMediaLibraryPermissionsAsync(); })();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (e) { console.log(e); }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, quality: 0.8, mediaTypes: ["images"],
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const resetForm = () => {
    setTitle(""); setPrice(""); setDescription("");
    setCategory("men's clothing"); setImage(null);
    setEditingProduct(null);
  };

const handleEditPress = (product: any) => {
  setEditingProduct(product);

  setTitle(product.title);
  setPrice(product.price.toString());
  setDescription(product.description);
  setCategory(product.category);

  setImage({
    uri: `${API_BASE_URL}/uploads/${product.image}`,
  });

  setModalVisible(true);
};

  const handleDeleteProduct = async (id: string) => {
    Alert.alert("Delete product?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/api/products/${id}`);
            setProducts((p) => p.filter((i) => i._id !== id));
          } catch (e) { Alert.alert("Error", "Delete failed"); }
        },
      },
    ]);
  };

const handleUpdateProduct = async () => {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);

    // If user selected a new image
  if (
  image &&
  image.uri &&
  !image.uri.includes("/uploads/")
) {
  formData.append(
    "image",
    {
      uri: image.uri,
      name: image.fileName || "product.jpg",
      type: image.mimeType || "image/jpeg",
    } as any
  );
}

    await axios.put(
      `${API_BASE_URL}/api/products/${editingProduct._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    Alert.alert(
      "Success",
      "Product updated successfully"
    );

    fetchProducts();

    resetForm();
    setModalVisible(false);
  } catch (error) {
    console.log(error);
    Alert.alert(
      "Error",
      "Failed to update product"
    );
  }
};

  const handleAddProduct = async () => {
    if (!title || !price || !description || !category || !image) {
      Alert.alert("Missing fields", "Please fill all fields and pick an image.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("image", {
        uri: image.uri,
        name: image.fileName || "product.jpg",
        type: image.mimeType || "image/jpeg",
      } as any);

      const response = await axios.post(`${API_BASE_URL}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts((p) => [response.data, ...p]);
      resetForm();
      setModalVisible(false);
      Alert.alert("Product added", "The new product is now live in the store.");
    } catch (e) { Alert.alert("Error", "Failed to add product"); }
  };

  const inputStyle = (field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.image?.startsWith("http")
            ? item.image
            : `${API_BASE_URL}/uploads/${item.image}`,
        }}
        style={styles.productImage}
      />
      <View style={styles.cardInfo}>
        <Text numberOfLines={2} style={styles.productTitle}>{item.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.categoryChip}>{item.category}</Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEditPress(item)}>
          <Ionicons name="pencil-outline" size={16} color={Colors.indigo} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteProduct(item._id)}>
          <Ionicons name="trash-outline" size={16} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ─────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Products</Text>
          <Text style={styles.headerSub}>{products.length} items in store</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color={Colors.white} />
          <Text style={styles.addBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id || item.id?.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 48 }}>📦</Text>
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptySubtitle}>Add your first product to get started.</Text>
          </View>
        }
      />

      {/* ── Add / Edit Modal ───────────────────────── */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Modal header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingProduct ? "Edit Product" : "Add Product"}
                </Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => { resetForm(); setModalVisible(false); }}
                >
                  <Ionicons name="close" size={22} color={Colors.ink} />
                </TouchableOpacity>
              </View>

              {/* Image picker */}
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <Ionicons name="image-outline" size={36} color={Colors.inkLight} />
                    <Text style={styles.imagePickerText}>Tap to upload product image</Text>
                  </View>
                )}
              </TouchableOpacity>
              {image && (
                <TouchableOpacity style={styles.changeImageBtn} onPress={pickImage}>
                  <Text style={styles.changeImageText}>Change image</Text>
                </TouchableOpacity>
              )}

              {/* Fields */}
              <Text style={styles.label}>Product Title</Text>
              <TextInput
                style={inputStyle("title")}
                placeholder="e.g. Premium Slim Fit Shirt"
                placeholderTextColor={Colors.inkLight}
                value={title}
                onChangeText={setTitle}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
              />

              <Text style={styles.label}>Price (₹)</Text>
              <TextInput
                style={inputStyle("price")}
                placeholder="e.g. 1299"
                placeholderTextColor={Colors.inkLight}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                onFocus={() => setFocusedField("price")}
                onBlur={() => setFocusedField(null)}
              />

              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={[styles.dropdown, showCategories && styles.inputFocused]}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Text style={styles.dropdownValue}>
                  {CATEGORIES.find((c) => c.key === category)?.emoji} {" "}
                  {CATEGORIES.find((c) => c.key === category)?.label}
                </Text>
                <Ionicons
                  name={showCategories ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={Colors.inkMid}
                />
              </TouchableOpacity>
              {showCategories && (
                <View style={styles.dropdownList}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.dropdownItem,
                        category === cat.key && styles.dropdownItemActive,
                      ]}
                      onPress={() => { setCategory(cat.key); setShowCategories(false); }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {cat.emoji}  {cat.label}
                      </Text>
                      {category === cat.key && (
                        <Ionicons name="checkmark" size={18} color={Colors.indigo} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[inputStyle("desc"), styles.textarea]}
                placeholder="Describe the product…"
                placeholderTextColor={Colors.inkLight}
                multiline
                value={description}
                onChangeText={setDescription}
                onFocus={() => setFocusedField("desc")}
                onBlur={() => setFocusedField(null)}
              />

              {/* Save */}
              <TouchableOpacity
                style={styles.saveCta}
                onPress={editingProduct ? handleUpdateProduct : handleAddProduct}

                activeOpacity={0.85}
              >
                <Ionicons
                  name={editingProduct ? "checkmark-circle-outline" : "add-circle-outline"}
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.saveCtaText}>
                  {editingProduct ? "Save Changes" : "Add Product"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceAlt },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.h2, color: Colors.ink },
  headerSub:   { ...Typography.caption, color: Colors.inkLight },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    height: 40,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  addBtnText: { ...Typography.labelM, color: Colors.white },

  /* List */
  list: { padding: Spacing.lg },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    resizeMode: "contain",
    backgroundColor: Colors.surfaceAlt,
    marginRight: Spacing.md,
  },
  cardInfo: { flex: 1 },
  productTitle: { ...Typography.labelM, color: Colors.ink, lineHeight: 18, marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryChip: {
    ...Typography.labelS,
    color: Colors.indigo,
    backgroundColor: Colors.indigoLight,
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    textTransform: "capitalize",
  },
  productPrice: { ...Typography.labelM, color: Colors.success },
  cardActions: { flexDirection: "row", gap: 8, marginLeft: Spacing.sm },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.indigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Empty */
  emptyWrap: { alignItems: "center", paddingTop: 80 },
  emptyTitle: { ...Typography.h3, color: Colors.ink, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  emptySubtitle: { ...Typography.bodyM, color: Colors.inkMid, textAlign: "center" },

  /* Modal */
  modalContent: {
    padding: Spacing.xxl,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  modalTitle: { ...Typography.h2, color: Colors.ink },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  imagePicker: {
    height: 180,
    borderRadius: Radius.lg,
    overflow: "hidden",
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  imagePickerPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
    gap: Spacing.sm,
  },
  imagePickerText: { ...Typography.bodyS, color: Colors.inkLight },
  imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
  changeImageBtn: { alignSelf: "center", marginBottom: Spacing.xl },
  changeImageText: { ...Typography.labelM, color: Colors.indigo },

  label: {
    ...Typography.labelM,
    color: Colors.ink,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    ...Typography.bodyM,
    color: Colors.ink,
    backgroundColor: Colors.surfaceAlt,
  },
  inputFocused: {
    borderColor: Colors.indigo,
    backgroundColor: Colors.indigoLight,
  },
  textarea: {
    height: 110,
    paddingTop: Spacing.md,
    textAlignVertical: "top",
  },

  dropdown: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surfaceAlt,
  },
  dropdownValue: { ...Typography.bodyM, color: Colors.ink },
  dropdownList: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: "hidden",
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemActive: { backgroundColor: Colors.indigoLight },
  dropdownItemText: { ...Typography.bodyM, color: Colors.ink },

  saveCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accent,
    height: 56,
    borderRadius: Radius.md,
    marginTop: Spacing.xl,
    ...Shadow.md,
  },
  saveCtaText: { ...Typography.labelL, color: Colors.white, fontSize: 16 },
});