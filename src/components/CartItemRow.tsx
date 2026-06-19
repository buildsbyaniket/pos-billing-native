import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartItem } from "../store/billingSlice";

interface CartItemRowProps {
  item: CartItem;
  currency: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  currency,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.subtext}>
          {currency} {Number(item.price).toFixed(2)} each
        </Text>
      </View>

      <View style={styles.qtyContainer}>
        <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease} activeOpacity={0.6}>
          <Ionicons name="remove-circle-outline" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease} activeOpacity={0.6}>
          <Ionicons name="add-circle-outline" size={24} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        <Text style={styles.totalPrice}>
          {currency} {(item.price * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove} activeOpacity={0.6}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  info: {
    flex: 2,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  subtext: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1.5,
  },
  qtyBtn: {
    padding: 4,
  },
  qty: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginHorizontal: 10,
    minWidth: 16,
    textAlign: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1.8,
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginRight: 12,
  },
  removeBtn: {
    padding: 6,
  },
});
