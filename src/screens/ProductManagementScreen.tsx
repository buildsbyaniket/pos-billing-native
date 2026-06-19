import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../store/productSlice";
import { ProductCard } from "../components/ProductCard";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../assets/productsData";

export const ProductManagementScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const settings = useSelector((state: RootState) => state.settings);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: "", price: "", category: "", image: "" });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteProduct(id));
          },
        },
      ]
    );
  };

  const handleSave = () => {
    const { name, price, category, image } = form;

    if (!name.trim() || !price.trim() || !category.trim()) {
      Alert.alert("Error", "Name, Price, and Category are required.");
      return;
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("Error", "Price must be a valid number greater than 0.");
      return;
    }

    const payload: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: name.trim(),
      price: parsedPrice,
      category: category.trim(),
      image: image.trim(),
    };

    if (editingProduct) {
      dispatch(updateProduct(payload));
    } else {
      dispatch(addProduct(payload));
    }

    resetForm();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Product Grid */}
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              currency={settings.currency}
              onPress={() => handleEdit(item)}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id, item.name)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No products available</Text>
            </View>
          }
        />

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => {
            setEditingProduct(null);
            setForm({ name: "", price: "", category: "", image: "" });
            setShowModal(true);
          }}
        >
          <Ionicons name="add" size={28} color="#ffffff" />
        </TouchableOpacity>

        {/* Product Form Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={resetForm}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </Text>
                <TouchableOpacity onPress={resetForm}>
                  <Ionicons name="close" size={24} color="#334155" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.name}
                    onChangeText={(val) => setForm({ ...form, name: val })}
                    placeholder="e.g. Cappuccino"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Price ({settings.currency}) *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.price}
                    onChangeText={(val) => setForm({ ...form, price: val })}
                    placeholder="e.g. 120"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Category *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.category}
                    onChangeText={(val) => setForm({ ...form, category: val })}
                    placeholder="e.g. Beverages"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Image URL (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.image}
                    onChangeText={(val) => setForm({ ...form, image: val })}
                    placeholder="https://..."
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.cancelBtn]}
                    onPress={resetForm}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.saveBtn]}
                    onPress={handleSave}
                  >
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    margin: 12,
    marginBottom: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
  },
  listContent: {
    padding: 6,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
  },
  emptyText: {
    fontSize: 15,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 12,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4f46e5",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 14,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 24,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: "#4f46e5",
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
