import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Product } from "../assets/productsData";

interface ProductCardProps {
  product: Product;
  currency: string;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onPress,
  onEdit,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200" }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>
          {currency} {Number(product.price).toFixed(2)}
        </Text>
      </View>
      {onEdit && onDelete && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={onEdit}
          >
            <Text style={[styles.actionText, { color: "#4f46e5" }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={onDelete}
          >
            <Text style={[styles.actionText, { color: "#ef4444" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    margin: 6,
    flex: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  image: {
    width: "100%",
    height: 100,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 10,
  },
  category: {
    fontSize: 10,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4f46e5",
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    backgroundColor: "#f5f3ff",
    borderRightWidth: 1,
    borderRightColor: "#f1f5f9",
  },
  deleteBtn: {
    backgroundColor: "#fef2f2",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
