import { create } from 'zustand';
import { CartItem } from '@/types';

export interface OrderData {
  id: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

interface OrderStore {
  completedOrder: OrderData | null;
  saveOrder: (order: OrderData) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  completedOrder: null,
  saveOrder: (order) => set({ completedOrder: order }),
  clearOrder: () => set({ completedOrder: null }),
}));