// src/store/wishlistStore.ts - NEW FILE
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../lib/shopify';
import { analytics } from '../lib/analytics';

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
          
          // Track wishlist addition
          analytics.trackEvent('add_to_wishlist', {
            product_id: product.id,
            product_name: product.title,
            price: product.variants[0]?.price || '0',
            customer_intent: 'future_purchase'
          });
        }
      },

      removeItem: (productId) => {
        const item = get().items.find(item => item.product.id === productId);
        
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId)
        }));
        
        if (item) {
          // Track wishlist removal
          analytics.trackEvent('remove_from_wishlist', {
            product_id: productId,
            product_name: item.product.title,
            time_in_wishlist: Date.now() - item.addedAt.getTime()
          });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.product.id === productId);
      },

      clearWishlist: () => {
        const itemCount = get().items.length;
        set({ items: [] });
        
        // Track wishlist clear
        analytics.trackEvent('wishlist_clear', {
          items_count: itemCount,
          user_action: 'clear_all'
        });
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