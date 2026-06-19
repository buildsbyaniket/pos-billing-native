import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { store, persistor } from "./src/store";
import { BillingScreen } from "./src/screens/BillingScreen";
import { ReceiptPreviewScreen } from "./src/screens/ReceiptPreviewScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ProductManagementScreen } from "./src/screens/ProductManagementScreen";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Loading indicator while state is restoring from AsyncStorage
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4f46e5" />
  </View>
);

// Tab Navigation for inside the App
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "receipt";

          if (route.name === "Billing") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Products") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          backgroundColor: "#ffffff",
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        headerStyle: {
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
        },
        headerTitleStyle: {
          fontWeight: "800",
          color: "#1e293b",
          fontSize: 18,
        },
        headerTitleAlign: "center",
      })}
    >
      <Tab.Screen
        name="Billing"
        component={BillingScreen}
        options={{ title: "Billing POS" }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Invoice History" }}
      />
      <Tab.Screen
        name="Products"
        component={ProductManagementScreen}
        options={{ title: "Manage Products" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings Config" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="ReceiptPreview"
              component={ReceiptPreviewScreen}
              options={{ presentation: "modal" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});
