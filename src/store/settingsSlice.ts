import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  storeName: string;
  address: string;
  phone: string;
  gstEnabled: boolean;
  gstRate: number;
  currency: string;
  footer: string;
  autoPrint: boolean;
}

const initialState: SettingsState = {
  storeName: "MY STORE",
  address: "123 Market St, Cityville",
  phone: "+91 98765 43210",
  gstEnabled: true,
  gstRate: 5,
  currency: "₹",
  footer: "Thank you for shopping with us!",
  autoPrint: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
