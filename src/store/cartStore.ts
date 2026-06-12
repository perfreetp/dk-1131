import { create } from 'zustand';
import { CartItem, Asset } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (asset: Asset) => void;
  removeItem: (assetId: string) => void;
  updateQuantity: (assetId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (asset) => {
    const items = get().items;
    const existingItem = items.find(item => item.asset_id === asset.id);
    if (existingItem) {
      set({
        items: items.map(item =>
          item.asset_id === asset.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [...items, { id: Date.now().toString(), asset_id: asset.id, asset, quantity: 1 }],
      });
    }
  },
  removeItem: (assetId) => {
    set({
      items: get().items.filter(item => item.asset_id !== assetId),
    });
  },
  updateQuantity: (assetId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(assetId);
      return;
    }
    set({
      items: get().items.map(item =>
        item.asset_id === assetId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
  get totalPrice() {
    return get().items.reduce((sum, item) => sum + item.asset.price * item.quantity, 0);
  },
}));
