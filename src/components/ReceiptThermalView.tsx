import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Invoice } from "../utils/generateInvoice";

interface ReceiptThermalViewProps {
  invoice: Invoice;
}

export const ReceiptThermalView: React.FC<ReceiptThermalViewProps> = ({
  invoice,
}) => {
  if (!invoice) return null;

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
    <View style={styles.receiptContainer}>
      <Text style={styles.separator}>================================</Text>
      <Text style={styles.storeName}>{invoice.storeName.toUpperCase()}</Text>
      {invoice.storeAddress ? (
        <Text style={styles.storeDetails}>{invoice.storeAddress}</Text>
      ) : null}
      {invoice.storePhone ? (
        <Text style={styles.storeDetails}>Phone: {invoice.storePhone}</Text>
      ) : null}
      <Text style={styles.separator}>================================</Text>

      <Text style={styles.invoiceMeta}>Invoice : {invoice.invoiceId}</Text>
      <Text style={styles.invoiceMeta}>Date    : {formatDate(invoice.date)}</Text>
      <Text style={styles.separator}>--------------------------------</Text>

      {invoice.items.map((item, index) => {
        const itemLine = `${item.name}`;
        const itemQtyPrice = `${item.quantity} x ${Number(item.price).toFixed(0)}`;
        const itemTotal = `${invoice.currency}${Number(
          item.price * item.quantity
        ).toFixed(0)}`;

        return (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemMain}>
              <Text style={styles.monoText}>{itemLine}</Text>
              <Text style={[styles.monoText, styles.qtyText]}>
                {itemQtyPrice}
              </Text>
            </View>
            <Text style={styles.monoText}>{itemTotal}</Text>
          </View>
        );
      })}

      <Text style={styles.separator}>--------------------------------</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.monoText}>Subtotal</Text>
        <Text style={styles.monoText}>
          {invoice.currency}
          {Number(invoice.summary.subtotal).toFixed(2)}
        </Text>
      </View>

      {invoice.summary.discount > 0 ? (
        <View style={styles.summaryRow}>
          <Text style={[styles.monoText, styles.discountText]}>Discount</Text>
          <Text style={[styles.monoText, styles.discountText]}>
            -{invoice.currency}
            {Number(invoice.summary.discount).toFixed(2)}
          </Text>
        </View>
      ) : null}

      {invoice.summary.gst > 0 ? (
        <View style={styles.summaryRow}>
          <Text style={styles.monoText}>GST</Text>
          <Text style={styles.monoText}>
            {invoice.currency}
            {Number(invoice.summary.gst).toFixed(2)}
          </Text>
        </View>
      ) : null}

      <Text style={styles.separator}>--------------------------------</Text>

      <View style={styles.summaryRow}>
        <Text style={[styles.monoText, styles.boldText]}>Total</Text>
        <Text style={[styles.monoText, styles.boldText]}>
          {invoice.currency}
          {Number(invoice.summary.total).toFixed(2)}
        </Text>
      </View>

      <Text style={styles.separator}>================================</Text>
      <Text style={styles.footer}>{invoice.footerMessage || "Thank You"}</Text>
      <Text style={styles.separator}>================================</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  receiptContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    width: "100%",
  },
  separator: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 14,
    textAlign: "center",
    color: "#475569",
    letterSpacing: -1,
  },
  storeName: {
    fontFamily: Platform.OS === "ios" ? "Courier-Bold" : "monospace",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
    color: "#0f172a",
  },
  storeDetails: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 12,
    textAlign: "center",
    color: "#64748b",
  },
  invoiceMeta: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 13,
    color: "#334155",
    marginVertical: 1,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 6,
  },
  itemMain: {
    flex: 1,
  },
  monoText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 14,
    color: "#1e293b",
  },
  qtyText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0f172a",
  },
  discountText: {
    color: "#dc2626",
  },
  footer: {
    fontFamily: Platform.OS === "ios" ? "Courier-Bold" : "monospace",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 6,
    color: "#1e293b",
  },
});
