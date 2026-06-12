import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

export interface OrderData {
  id: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  status: 'pending' | 'paid' | 'completed' | 'refunded';
}

interface OrderStore {
  orders: OrderData[];
  completedOrder: OrderData | null;
  saveOrder: (order: OrderData) => void;
  clearCompletedOrder: () => void;
  getOrderById: (id: string) => OrderData | undefined;
  updateOrderStatus: (id: string, status: OrderData['status']) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: 'ORD-1',
          items: [],
          totalAmount: 199,
          paymentMethod: 'alipay',
          createdAt: '2024-01-15 10:30',
          status: 'completed',
        },
        {
          id: 'ORD-2',
          items: [],
          totalAmount: 49,
          paymentMethod: 'wechat',
          createdAt: '2024-01-14 15:20',
          status: 'completed',
        },
      ],
      completedOrder: null,
      saveOrder: (order) => {
        set({ 
          orders: [...get().orders, order],
          completedOrder: order 
        });
      },
      clearCompletedOrder: () => set({ completedOrder: null }),
      getOrderById: (id) => get().orders.find(order => order.id === id),
      updateOrderStatus: (id, status) => set({
        orders: get().orders.map(order => 
          order.id === id ? { ...order, status } : order
        ),
        completedOrder: get().completedOrder?.id === id 
          ? { ...get().completedOrder!, status } 
          : get().completedOrder
      }),
    }),
    {
      name: 'iconmarket-orders',
    }
  )
);