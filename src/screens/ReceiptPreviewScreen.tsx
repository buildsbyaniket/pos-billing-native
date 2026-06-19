import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { clearCurrentInvoice } from "../store/invoiceSlice";
import { ReceiptThermalView } from "../components/ReceiptThermalView";
import { Ionicons } from "@expo/vector-icons";

export const ReceiptPreviewScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const currentInvoice = useSelector(
    (state: RootState) => state.invoice.currentInvoice
  );
  const settings = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    if (currentInvoice && settings.autoPrint) {
      // Simulate auto-printing delay
      const timer = setTimeout(() => {
        Alert.alert(
          "Auto Print",
          `Printing receipt for ${currentInvoice.invoiceId} automatically...`
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentInvoice, settings.autoPrint]);

  if (!currentInvoice) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No invoice selected</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      // Format plain text representation for sharing
      const itemLines = currentInvoice.items
        .map(
          (item) =>
            `${item.name} x ${item.quantity} = ${
              currentInvoice.currency
            }${Number(item.price * item.quantity).toFixed(0)}`
        )
        .join("\n");

      const gstText = settings.gstEnabled
        ? `GST (${settings.gstRate}%): ${currentInvoice.currency}${currentInvoice.summary.gst.toFixed(
            2
          )}\n`
        : "";

      const discountText =
        currentInvoice.summary.discount > 0
          ? `Discount: -${currentInvoice.currency}${currentInvoice.summary.discount.toFixed(
              2
            )}\n`
          : "";

      const receiptText = `
================================
${currentInvoice.storeName.toUpperCase()}
================================
Invoice : ${currentInvoice.invoiceId}
Date    : ${new Date(currentInvoice.date).toLocaleString()}
--------------------------------
${itemLines}
--------------------------------
Subtotal: ${currentInvoice.currency}${currentInvoice.summary.subtotal.toFixed(2)}
${discountText}${gstText}--------------------------------
Total   : ${currentInvoice.currency}${currentInvoice.summary.total.toFixed(2)}
================================
${currentInvoice.footerMessage || "Thank You"}
================================
      `;

      await Share.share({
        message: receiptText,
        title: `Receipt ${currentInvoice.invoiceId}`,
      });
    } catch (error: any) {
      Alert.alert("Error sharing", error.message);
    }
  };

  const handlePrint = () => {
    Alert.alert(
      "Print Receipt",
      `Sending invoice ${currentInvoice.invoiceId} to printer...`
    );
  };

  const handleNewBill = () => {
    dispatch(clearCurrentInvoice());
    // Navigate back to billing screen (which is at the tab stack)
    navigation.navigate("Billing");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBackBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receipt Preview</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Scrollable Receipt */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ReceiptThermalView invoice={currentInvoice} />
        </ScrollView>

        {/* Action Panel */}
        <View style={styles.actionPanel}>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.printBtn]}
              onPress={handlePrint}
            >
              <Ionicons name="print-outline" size={20} color="#ffffff" />
              <Text style={styles.btnText}>Print</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.shareBtn]}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={20} color="#ffffff" />
              <Text style={styles.btnText}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.newBillBtn}
            onPress={handleNewBill}
          >
            <Text style={styles.newBillBtnText}>Start New Bill</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  headerBackBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  actionPanel: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  printBtn: {
    backgroundColor: "#475569",
  },
  shareBtn: {
    backgroundColor: "#6366f1",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  newBillBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  newBillBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
