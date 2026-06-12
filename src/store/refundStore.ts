import { create } from 'zustand';
import { RefundRequest } from '@/types';

interface RefundStore {
  refundRequests: RefundRequest[];
  addRefundRequest: (request: RefundRequest) => void;
  updateRefundStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  getPendingCount: () => number;
}

export const useRefundStore = create<RefundStore>((set, get) => ({
  refundRequests: [
    { id: '1', order_id: '1', reason: '素材不符合预期', status: 'pending', created_at: '2024-01-15' },
    { id: '2', order_id: '2', reason: '重复购买', status: 'approved', created_at: '2024-01-14' },
  ],
  addRefundRequest: (request) => set({ refundRequests: [...get().refundRequests, request] }),
  updateRefundStatus: (id, status) => set({
    refundRequests: get().refundRequests.map(req => 
      req.id === id ? { ...req, status } : req
    )
  }),
  getPendingCount: () => get().refundRequests.filter(r => r.status === 'pending').length,
}));