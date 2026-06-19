import { CartItem, BillSummary } from "./calculateBill";

export interface Invoice {
  invoiceId: string;
  date: string;
  items: CartItem[];
  summary: {
    subtotal: number;
    gst: number;
    discount: number;
    total: number;
  };
  storeName: string;
  storeAddress: string;
  storePhone: string;
  footerMessage: string;
  currency: string;
}

export const generateInvoice = (
  cart: CartItem[],
  bill: BillSummary,
  storeDetails: {
    storeName: string;
    address: string;
    phone: string;
    footer: string;
    currency: string;
  }
): Invoice => {
  return {
    invoiceId: "INV-" + Date.now(),
    date: new Date().toISOString(),
    items: JSON.parse(JSON.stringify(cart)),
    summary: {
      subtotal: bill.subtotal,
      gst: bill.gst,
      discount: bill.discount,
      total: bill.total,
    },
    storeName: storeDetails.storeName,
    storeAddress: storeDetails.address,
    storePhone: storeDetails.phone,
    footerMessage: storeDetails.footer,
    currency: storeDetails.currency,
  };
};
