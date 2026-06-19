import { Product } from "../assets/productsData";

export interface CartItem extends Product {
  quantity: number;
}

export interface BillSummary {
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
}

export const calculateBill = (
  cart: CartItem[],
  gstRate: number = 5,
  discountPercent: number = 0,
  gstEnabled: boolean = true
): BillSummary => {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const taxable = subtotal - discountAmount;

  const gst = gstEnabled ? (taxable * gstRate) / 100 : 0;

  const total = taxable + gst;

  return {
    subtotal,
    gst,
    discount: discountAmount,
    total,
  };
};
