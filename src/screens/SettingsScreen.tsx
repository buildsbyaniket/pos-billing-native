import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { updateSettings } from "../store/settingsSlice";
import { Ionicons } from "@expo/vector-icons";

export const SettingsScreen = () => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    ...settings,
    gstRate: settings.gstRate.toString(),
  });

  const handleSave = () => {
    // Validate GST Rate
    const gstRateNum = Number(form.gstRate);
    if (isNaN(gstRateNum) || gstRateNum < 0 || gstRateNum > 100) {
      Alert.alert("Invalid input", "GST percentage must be a number between 0 and 100.");
      return;
    }

    if (!form.storeName.trim()) {
      Alert.alert("Invalid input", "Store name cannot be empty.");
      return;
    }

    dispatch(
      updateSettings({
        ...form,
        gstRate: gstRateNum,
      })
    );

    Alert.alert("Success", "Settings updated successfully.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* STORE SETTINGS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Store Settings</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Store Name</Text>
              <TextInput
                style={styles.input}
                value={form.storeName}
                onChangeText={(val) => setForm({ ...form, storeName: val })}
                placeholder="Enter store name"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Store Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.address}
                onChangeText={(val) => setForm({ ...form, address: val })}
                placeholder="Enter store address"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(val) => setForm({ ...form, phone: val })}
                placeholder="Enter phone number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* BILLING SETTINGS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Billing Settings</Text>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Enable GST</Text>
                <Text style={styles.switchSubtext}>Apply tax to transactions</Text>
              </View>
              <Switch
                value={form.gstEnabled}
                onValueChange={(val) => setForm({ ...form, gstEnabled: val })}
                trackColor={{ false: "#cbd5e1", true: "#a5b4fc" }}
                thumbColor={form.gstEnabled ? "#4f46e5" : "#f1f5f9"}
              />
            </View>

            {form.gstEnabled ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>GST Percentage (%)</Text>
                <TextInput
                  style={styles.input}
                  value={form.gstRate.toString()}
                  onChangeText={(val) => setForm({ ...form, gstRate: val })}
                  placeholder="e.g. 5"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Currency Symbol</Text>
              <TextInput
                style={styles.input}
                value={form.currency}
                onChangeText={(val) => setForm({ ...form, currency: val })}
                placeholder="e.g. ₹ or $"
                placeholderTextColor="#94a3b8"
                maxLength={3}
              />
            </View>
          </View>

          {/* RECEIPT SETTINGS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Receipt Settings</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Footer Message</Text>
              <TextInput
                style={styles.input}
                value={form.footer}
                onChangeText={(val) => setForm({ ...form, footer: val })}
                placeholder="e.g. Thank you for your purchase"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Auto Print Receipt</Text>
                <Text style={styles.switchSubtext}>
                  Automatically print after checkout
                </Text>
              </View>
              <Switch
                value={form.autoPrint}
                onValueChange={(val) => setForm({ ...form, autoPrint: val })}
                trackColor={{ false: "#cbd5e1", true: "#a5b4fc" }}
                thumbColor={form.autoPrint ? "#4f46e5" : "#f1f5f9"}
              />
            </View>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.8}
            onPress={handleSave}
          >
            <Ionicons name="save-outline" size={20} color="#ffffff" />
            <Text style={styles.saveBtnText}>Save Configurations</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionCard: {
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  textArea: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  switchSubtext: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
