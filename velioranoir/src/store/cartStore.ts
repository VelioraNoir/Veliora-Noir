// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../lib/shopify';

interface CartItem {
  id: string;
  product: Product;
  variantId: string;
  quantity: number;
  selectedMaterial?: string;
  addedAt: Date;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variantId: string, material?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, variantId, material) => {
        const existingItemIndex = get().items.findIndex(
          item => item.product.id === product.id && item.variantId === variantId && item.selectedMaterial === material
        );

        if (existingItemIndex > -1) {
          set(state => ({
            items: state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }));
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${variantId}-${material || 'default'}-${Date.now()}`,
            product,
            variantId,
            quantity: 1,
            selectedMaterial: material,
            addedAt: new Date(),
          };
          
          set(state => ({
            items: [...state.items, newItem]
          }));
        }
      },

      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const variant = item.product.variants.find(v => v.id === item.variantId);
          return total + (variant ? parseFloat(variant.price) * item.quantity : 0);
        }, 0);
      },
    }),
    {
      name: 'veliora-noir-cart',
    }
  )
);