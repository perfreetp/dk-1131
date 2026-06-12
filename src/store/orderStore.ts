import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';
import { mockAssets } from '@/data/mockData';

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

const createCartItem = (assetId: string, quantity: number = 1): CartItem => ({
  id: `${assetId}-${quantity}`,
  asset_id: assetId,
  asset: mockAssets.find(a => a.id === assetId) || mockAssets[0],
  quantity,
});

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: 'ORD-1',
          items: [createCartItem('1', 2), createCartItem('3', 1)],
          totalAmount: 128,
          paymentMethod: 'alipay',
          createdAt: '2024-01-15 10:30',
          status: 'completed',
        },
        {
          id: 'ORD-2',
          items: [createCartItem('2', 1)],
          totalAmount: 79,
          paymentMethod: 'wechat',
          createdAt: '2024-01-14 15:20',
          status: 'completed',
        },
        {
          id: 'ORD-3',
          items: [createCartItem('5', 1)],
          totalAmount: 59,
          paymentMethod: 'alipay',
          createdAt: '2024-01-13 09:45',
          status: 'refunded',
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