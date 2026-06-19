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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  setDiscount,
  clearCart,
} from "../store/billingSlice";
import { saveInvoice, setCurrentInvoice } from "../store/invoiceSlice";
import { ProductCard } from "../components/ProductCard";
import { CartItemRow } from "../components/CartItemRow";
import { calculateBill } from "../utils/calculateBill";
import { generateInvoice } from "../utils/generateInvoice";
import { Ionicons } from "@expo/vector-icons";

export const BillingScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const cart = useSelector((state: RootState) => state.billing.cart);
  const discount = useSelector((state: RootState) => state.billing.discount);
  const settings = useSelector((state: RootState) => state.settings);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Dynamic Categories from products list
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // Filtering products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate bill totals
  const bill = calculateBill(
    cart,
    settings.gstRate,
    discount,
    settings.gstEnabled
  );

  const handleGenerateBill = () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Please add items to the cart before generating a bill.");
      return;
    }

    const invoice = generateInvoice(cart, bill, settings);

    // Save to history & set current for preview
    dispatch(saveInvoice(invoice));
    dispatch(setCurrentInvoice(invoice));

    // Clear active cart
    dispatch(clearCart());
    setIsCartVisible(false);

    // Navigate to receipt preview
    navigation.navigate("ReceiptPreview");
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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

        {/* Category Selector */}
        <View style={styles.categoriesWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryBtn,
                  selectedCategory === item && styles.categoryBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item && styles.categoryTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoriesContent}
          />
        </View>

        {/* Products Grid */}
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              currency={settings.currency}
              onPress={() => {
                dispatch(addToCart(item));
              }}
            />
          )}
          contentContainerStyle={styles.productsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />

        {/* Cart Bar Trigger */}
        {cart.length > 0 ? (
          <TouchableOpacity
            style={styles.cartBar}
            activeOpacity={0.9}
            onPress={() => setIsCartVisible(true)}
          >
            <View style={styles.cartBarLeft}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItemsCount}</Text>
              </View>
              <Text style={styles.cartBarText}>View Cart & Checkout</Text>
            </View>
            <View style={styles.cartBarRight}>
              <Text style={styles.cartBarPrice}>
                {settings.currency} {bill.total.toFixed(2)}
              </Text>
              <Ionicons name="chevron-up" size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Cart Details Drawer (Modal) */}
        <Modal
          visible={isCartVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsCartVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Cart Items ({cart.length})</Text>
                <TouchableOpacity onPress={() => setIsCartVisible(false)}>
                  <Ionicons name="close" size={24} color="#334155" />
                </TouchableOpacity>
              </View>

              {/* Cart List */}
              <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <CartItemRow
                    item={item}
                    currency={settings.currency}
                    onIncrease={() => dispatch(increaseQty(item.id))}
                    onDecrease={() => dispatch(decreaseQty(item.id))}
                    onRemove={() => dispatch(removeFromCart(item.id))}
                  />
                )}
                contentContainerStyle={styles.modalList}
              />

              {/* Calculations and Actions */}
              <View style={styles.checkoutPanel}>
                {/* Discount input */}
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Apply Discount (%):</Text>
                  <TextInput
                    style={styles.discountInput}
                    keyboardType="numeric"
                    maxLength={3}
                    placeholder="0"
                    placeholderTextColor="#94a3b8"
                    value={discount === 0 ? "" : discount.toString()}
                    onChangeText={(val) => {
                      const num = Number(val);
                      if (isNaN(num) || num < 0) {
                        dispatch(setDiscount(0));
                      } else if (num > 100) {
                        dispatch(setDiscount(100));
                      } else {
                        dispatch(setDiscount(num));
                      }
                    }}
                  />
                </View>

                {/* Subtotal */}
                <View style={styles.billRow}>
                  <Text style={styles.billRowLabel}>Subtotal</Text>
                  <Text style={styles.billRowVal}>
                    {settings.currency} {bill.subtotal.toFixed(2)}
                  </Text>
                </View>

                {/* Discount value if active */}
                {bill.discount > 0 ? (
                  <View style={styles.billRow}>
                    <Text style={[styles.billRowLabel, { color: "#ef4444" }]}>
                      Discount (-{discount}%)
                    </Text>
                    <Text style={[styles.billRowVal, { color: "#ef4444" }]}>
                      -{settings.currency} {bill.discount.toFixed(2)}
                    </Text>
                  </View>
                ) : null}

                {/* GST */}
                {settings.gstEnabled ? (
                  <View style={styles.billRow}>
                    <Text style={styles.billRowLabel}>
                      GST ({settings.gstRate}%)
                    </Text>
                    <Text style={styles.billRowVal}>
                      {settings.currency} {bill.gst.toFixed(2)}
                    </Text>
                  </View>
                ) : null}

                {/* Grand Total */}
                <View style={[styles.billRow, styles.grandTotalRow]}>
                  <Text style={styles.grandTotalLabel}>Grand Total</Text>
                  <Text style={styles.grandTotalVal}>
                    {settings.currency} {bill.total.toFixed(2)}
                  </Text>
                </View>

                {/* Checkout Buttons */}
                <View style={styles.actionBtnRow}>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => {
                      Alert.alert(
                        "Clear Cart",
                        "Are you sure you want to remove all items?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Yes, Clear",
                            style: "destructive",
                            onPress: () => {
                              dispatch(clearCart());
                              setIsCartVisible(false);
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.clearBtnText}>Clear</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={handleGenerateBill}
                  >
                    <Text style={styles.checkoutBtnText}>Generate Bill</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  categoriesWrapper: {
    height: 50,
  },
  categoriesContent: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryBtnActive: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  productsList: {
    padding: 6,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 12,
  },
  cartBar: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cartBarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#ffffff",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  badgeText: {
    color: "#4f46e5",
    fontSize: 12,
    fontWeight: "800",
  },
  cartBarText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  cartBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartBarPrice: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
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
  modalList: {
    padding: 16,
  },
  checkoutPanel: {
    borderTopWidth: 1,
    borderColor: "#f1f5f9",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  discountInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    padding: 0,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  billRowLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  billRowVal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 8,
    paddingTop: 8,
    marginBottom: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
  },
  grandTotalVal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4f46e5",
  },
  actionBtnRow: {
    flexDirection: "row",
    gap: 10,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  clearBtnText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "700",
  },
  checkoutBtn: {
    flex: 2,
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
