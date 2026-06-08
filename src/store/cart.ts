import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  stock: number;
}

interface CartItem {
  productId: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  product: CartProduct;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number, variantId?: string | null, variantName?: string | null) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variantId = null, variantName = null) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id && item.variantId === variantId
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id && item.variantId === variantId
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { productId: product.id, variantId, variantName, quantity, product }],
          };
        });
      },

      removeItem: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId = null) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: "kapur-ghar-cart" }
  )
);
