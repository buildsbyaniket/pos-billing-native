import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCurrentInvoice, deleteInvoice } from "../store/invoiceSlice";
import { Ionicons } from "@expo/vector-icons";

export const HistoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const invoices = useSelector((state: RootState) => state.invoice.invoices);

  const handleOpenInvoice = (invoice: any) => {
    dispatch(setCurrentInvoice(invoice));
    navigation.navigate("ReceiptPreview");
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    Alert.alert(
      "Delete Invoice",
      `Are you sure you want to delete invoice ${invoiceId}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteInvoice(invoiceId));
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return (
        d.toLocaleDateString() +
        " " +
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch {
      return dateString;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.invoiceId}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No invoices found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.invoiceId}>{item.invoiceId}</Text>
                  <Text style={styles.date}>{formatDate(item.date)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteInvoice(item.invoiceId)}
                  style={styles.deleteBtn}
                  activeOpacity={0.6}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.itemsLabel}>Items</Text>
                  <Text style={styles.itemsVal}>
                    {item.items.reduce((sum, i) => sum + i.quantity, 0)} items
                  </Text>
                </View>

                <View style={styles.totalWrapper}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalVal}>
                    {item.currency} {Number(item.summary.total).toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewBtn}
                activeOpacity={0.8}
                onPress={() => handleOpenInvoice(item)}
              >
                <Text style={styles.viewBtnText}>View Receipt Preview</Text>
                <Ionicons name="chevron-forward" size={16} color="#4f46e5" />
              </TouchableOpacity>
            </View>
          )}
        />
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
  listContent: {
    padding: 16,
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  invoiceId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  date: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#fef2f2",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  itemsVal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginTop: 2,
  },
  totalWrapper: {
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  totalVal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#10b981",
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: "#f5f3ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  viewBtnText: {
    color: "#4f46e5",
    fontSize: 13,
    fontWeight: "700",
  },
});
