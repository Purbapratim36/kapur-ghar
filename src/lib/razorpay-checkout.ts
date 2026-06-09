"use client";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export interface LaunchPaymentArgs {
  keyId: string;
  razorpayOrderId: string;
  amountPaise: number;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (resp: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss?: () => void;
}

export async function launchRazorpayCheckout(args: LaunchPaymentArgs): Promise<boolean> {
  const ready = await loadRazorpayScript();
  if (!ready || !window.Razorpay) return false;

  const rzp = new window.Razorpay({
    key: args.keyId,
    amount: args.amountPaise,
    currency: "INR",
    order_id: args.razorpayOrderId,
    name: "Kapur Ghar",
    description: `Order ${args.orderNumber}`,
    prefill: {
      name: args.customerName,
      email: args.customerEmail,
      contact: args.customerPhone,
    },
    theme: { color: "#CC0000" },
    handler: args.onSuccess,
    modal: { ondismiss: args.onDismiss },
  });
  rzp.open();
  return true;
}
