import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RefundRequest } from '@/types';
import { useOrderStore } from './orderStore';

interface RefundStore {
  refundRequests: RefundRequest[];
  addRefundRequest: (request: RefundRequest) => void;
  updateRefundStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  getPendingCount: () => number;
  getRefundByOrderId: (orderId: string) => RefundRequest | undefined;
}

export const useRefundStore = create<RefundStore>()(
  persist(
    (set, get) => ({
      refundRequests: [
        { id: '1', order_id: 'ORD-1', reason: '素材不符合预期', status: 'pending', created_at: '2024-01-15' },
        { id: '2', order_id: 'ORD-2', reason: '重复购买', status: 'approved', created_at: '2024-01-14' },
      ],
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
      getPendingCount: () => get().refundRequests.filter(r => r.status === 'pending').length,
      getRefundByOrderId: (orderId) => get().refundRequests.find(r => r.order_id === orderId),
    }),
    {
      name: 'iconmarket-refunds',
    }
  )
);