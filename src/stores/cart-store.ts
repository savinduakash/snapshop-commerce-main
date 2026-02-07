import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  variant?: { name: string; value: string; priceAdjustment: number };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantValue?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantValue?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const getItemKey = (item: CartItem) =>
  `${item.productId}-${item.variant?.value ?? 'default'}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const key = getItemKey(item);
          const existing = state.items.find((i) => getItemKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                getItemKey(i) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, variantValue) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productId === productId &&
                (i.variant?.value ?? 'default') === (variantValue ?? 'default'))
          ),
        })),
      updateQuantity: (productId, quantity, variantValue) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter(
                (i) =>
                  !(i.productId === productId &&
                    (i.variant?.value ?? 'default') === (variantValue ?? 'default'))
              )
            : state.items.map((i) =>
                i.productId === productId &&
                (i.variant?.value ?? 'default') === (variantValue ?? 'default')
                  ? { ...i, quantity }
                  : i
              ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((t, i) => t + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (t, i) => t + (i.price + (i.variant?.priceAdjustment ?? 0)) * i.quantity,
          0
        ),
    }),
    { name: 'cart-storage' }
  )
);
