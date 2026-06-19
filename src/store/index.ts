import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import settingsReducer from "./settingsSlice";
import productReducer from "./productSlice";
import billingReducer from "./billingSlice";
import invoiceReducer from "./invoiceSlice";

const rootReducer = combineReducers({
  products: productReducer,
  billing: billingReducer,
  invoice: invoiceReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["invoice", "settings", "products"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
