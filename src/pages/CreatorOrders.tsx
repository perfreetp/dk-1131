import { useState } from 'react';
import { 
  Package, Calendar, CreditCard, CheckCircle, XCircle, 
  AlertCircle
} from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { useRefundStore } from '@/store/refundStore';
import type { RefundRequest } from '@/types';

export function CreatorOrders() {
  const { orders } = useOrderStore();
  const { refundRequests, handleRefundRequest } = useRefundStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'refunds'>('orders');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refundStatus, setRefundStatus] = useState('all');

  const myOrders = orders.filter(order => 
    order.items.some(item => item.asset.authorId === '1')
  );

  const myRefunds = refundRequests.filter((refund: RefundRequest) => 
    refund.items?.some(item => item.asset.authorId === '1') ?? false
  );

  const pendingRefundsCount = myRefunds.filter((r: RefundRequest) => r.status === 'pending').length;

  const statusConfig = {
    pending: { label: '待支付', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    paid: { label: '已支付', color: 'text-blue-600', bg: 'bg-blue-100' },
    completed: { label: '已完成', color: 'text-green-600', bg: 'bg-green-100' },
    refunded: { label: '已退款', color: 'text-red-600', bg: 'bg-red-100' },
  };

  const refundStatusConfig = {
    pending: { label: '待处理', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    approved: { label: '已同意', color: 'text-green-600', bg: 'bg-green-100' },
    rejected: { label: '已拒绝', color: 'text-red-600', bg: 'bg-red-100' },
  };

  const handleApproveRefund = (refundId: string) => {
    handleRefundRequest(refundId, 'approved');
  };

  const handleRejectRefund = (refundId: string) => {
    handleRefundRequest(refundId, 'rejected');
  };

  const filteredOrders = myOrders.filter(order => {
    if (selectedStatus === 'all') return true;
    return order.status === selectedStatus;
  });

  const filteredRefunds = myRefunds.filter((refund: RefundRequest) => {
    if (refundStatus === 'all') return true;
    return refund.status === refundStatus;
  });

  const renderRefundItem = (refund: RefundRequest) => {
    const status = refund.status as 'pending' | 'approved' | 'rejected';
    return (
      <div key={refund.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${refundStatusConfig[status].bg} ${refundStatusConfig[status].color}`}>
                {refundStatusConfig[status].label}
              </span>
              <span className="text-gray-500 text-sm">退款号: {refund.id}</span>
            </div>
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              {refund.createdAt || refund.created_at}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {refund.items?.filter(item => item.asset.authorId === '1').slice(0, 3).map((item, index) => (
              <div key={index} className="relative">
                <img 
                  src={item.asset.thumbnail || item.asset.preview_url} 
                  alt={item.asset.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-gray-500">
              <span>订单号</span>
              <span className="font-medium text-gray-900">{refund.orderId || refund.order_id}</span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>退款金额</span>
              <span className="font-medium text-red-600">¥{refund.amount}</span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>退款原因</span>
              <span className="font-medium text-gray-900">{refund.reason}</span>
            </div>
          </div>

          {refund.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleRejectRefund(refund.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                拒绝退款
              </button>
              <button
                onClick={() => handleApproveRefund(refund.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                同意退款
              </button>
            </div>
          )}

          {refund.status === 'approved' && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              已同意退款，订单状态已同步更新为已退款
            </div>
          )}

          {status === 'rejected' && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-lg">
              <XCircle className="w-5 h-5" />
              已拒绝退款申请，订单状态保持不变
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
            <p className="text-gray-500 mt-1">管理您的订单和退款申请</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            订单列表
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'refunds'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            退款申请
            {pendingRefundsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingRefundsCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'orders' && (
          <>
            <div className="flex gap-2 mb-6">
              {[
                { key: 'all', label: '全部订单' },
                { key: 'pending', label: '待支付' },
                { key: 'paid', label: '已支付' },
                { key: 'completed', label: '已完成' },
                { key: 'refunded', label: '已退款' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedStatus === key
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h2>
                <p className="text-gray-500">暂无相关订单记录</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}>
                          {statusConfig[order.status].label}
                        </span>
                        <span className="text-gray-500 text-sm">订单号: {order.id}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {order.paymentMethod === 'alipay' ? '支付宝' : '微信支付'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      {order.items.filter(item => item.asset.authorId === '1').slice(0, 3).map((item, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={item.asset.thumbnail || item.asset.preview_url} 
                            alt={item.asset.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-gray-500 text-sm">
                          您的 {order.items.filter(item => item.asset.authorId === '1').length} 个素材
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 text-sm">收益:</span>
                        <span className="text-lg font-bold text-primary-600 ml-2">
                          ¥{order.items
                            .filter(item => item.asset.authorId === '1')
                            .reduce((sum, item) => sum + item.asset.price * item.quantity * 0.7, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'refunds' && (
          <>
            <div className="flex gap-2 mb-6">
              {[
                { key: 'all', label: '全部申请' },
                { key: 'pending', label: '待处理' },
                { key: 'approved', label: '已同意' },
                { key: 'rejected', label: '已拒绝' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setRefundStatus(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    refundStatus === key
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {filteredRefunds.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">暂无退款申请</h2>
                <p className="text-gray-500">暂无相关退款申请记录</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRefunds.map(renderRefundItem)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}