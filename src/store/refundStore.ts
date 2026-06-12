import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RefundRequest, CartItem } from '@/types';
import { useOrderStore } from './orderStore';
import { mockAssets } from '@/data/mockData';

interface RefundStore {
  refundRequests: RefundRequest[];
  refunds: RefundRequest[];
  addRefundRequest: (request: RefundRequest) => void;
  updateRefundStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  handleRefundRequest: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  getPendingCount: () => number;
  getRefundByOrderId: (orderId: string) => RefundRequest | undefined;
}

const createCartItem = (assetId: string, quantity: number = 1): CartItem => ({
  id: `${assetId}-${quantity}`,
  asset_id: assetId,
  asset: mockAssets.find(a => a.id === assetId) || mockAssets[0],
  quantity,
});

export const useRefundStore = create<RefundStore>()(
  persist(
    (set, get) => ({
      refundRequests: [
        { id: 'R-1', order_id: 'ORD-1', orderId: 'ORD-1', reason: '素材不符合预期', amount: 128, status: 'pending', created_at: '2024-01-15', createdAt: '2024-01-15', items: [createCartItem('1', 2), createCartItem('3', 1)] },
        { id: 'R-2', order_id: 'ORD-2', orderId: 'ORD-2', reason: '重复购买', amount: 79, status: 'approved', created_at: '2024-01-14', createdAt: '2024-01-14', items: [createCartItem('2', 1)] },
      ],
      refunds: [],
      addRefundRequest: (request) => set({ 
        refundRequests: [...get().refundRequests, request] 
      }),
      updateRefundStatus: (id, status) => {
        const requests = get().refundRequests;
        const request = requests.find(r => r.id === id);
        
        set({
          refundRequests: requests.map(req => 
            req.id === id ? { ...req, status } : req
          )
        });

        if (request && status === 'approved') {
          useOrderStore.getState().updateOrderStatus(request.order_id, 'refunded');
        }
      },
      handleRefundRequest: (id, status) => {
        const requests = get().refundRequests;
        const request = requests.find(r => r.id === id);
        
        set({
          refundRequests: requests.map(req => 
            req.id === id ? { ...req, status } : req
          ),
          refunds: requests.map(req => 
            req.id === id ? { ...req, status } : req
          )
        });

        if (request && status === 'approved') {
          useOrderStore.getState().updateOrderStatus(request.order_id, 'refunded');
        }
      },
      getPendingCount: () => get().refundRequests.filter(r => r.status === 'pending').length,
      getRefundByOrderId: (orderId) => get().refundRequests.find(r => r.order_id === orderId),
    }),
    {
      name: 'iconmarket-refunds',
    }
  )
);