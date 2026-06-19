import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Invoice } from "../utils/generateInvoice";

export interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
}

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    saveInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.unshift(action.payload);
    },

    setCurrentInvoice: (state, action: PayloadAction<Invoice>) => {
      state.currentInvoice = action.payload;
    },

    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },

    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(
        (inv) => inv.invoiceId !== action.payload
      );
      if (state.currentInvoice?.invoiceId === action.payload) {
        state.currentInvoice = null;
      }
    },
  },
});

export const {
  saveInvoice,
  setCurrentInvoice,
  clearCurrentInvoice,
  deleteInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
