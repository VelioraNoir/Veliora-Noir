// src/store/wishlistStore.ts - FIXED FILE (renamed from .tsx to .ts)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../lib/shopify';

interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const isAlreadyInWishlist = get().items.some(item => item.product.id === product.id);
        
        if (!isAlreadyInWishlist) {
          const newItem: WishlistItem = {
            id: product.id,
            product,
            addedAt: new Date(),
          };
          
          set(state => ({
            items: [...state.items, newItem]
          }));
          
          console.log('Added to wishlist:', product.title);
        }
      },

      removeItem: (productId) => {
        const item = get().items.find(item => item.product.id === productId);
        
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId)
        }));
        
        if (item) {
          console.log('Removed from wishlist:', item.product.title);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.product.id === productId);
      },

      clearWishlist: () => {
        const itemCount = get().items.length;
        set({ items: [] });
        console.log('Cleared wishlist:', itemCount, 'items');
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: 'veliora-noir-wishlist',
    }
  )
);