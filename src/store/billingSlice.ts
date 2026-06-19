import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../assets/productsData";

export interface CartItem extends Product {
  quantity: number;
}

export interface BillingState {
  cart: CartItem[];
  discount: number; // Discount percentage (e.g. 5 for 5%)
}

const initialState: BillingState = {
  cart: [],
  discount: 0,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    increaseQty: (state, action: PayloadAction<number>) => {
      const item = state.cart.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQty: (state, action: PayloadAction<number>) => {
      const item = state.cart.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },

    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },

    clearCart: (state) => {
      state.cart = [];
      state.discount = 0;
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  setDiscount,
  clearCart,
} = billingSlice.actions;

export default billingSlice.reducer;
