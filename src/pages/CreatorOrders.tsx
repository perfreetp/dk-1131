import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import { useRefundStore } from '@/store/refundStore';
import { useOrderStore } from '@/store/orderStore';

const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'assets', label: '素材管理', icon: Package },
  { id: 'orders', label: '订单管理', icon: ShoppingBag },
  { id: 'earnings', label: '收益统计', icon: DollarSign },
];

export function CreatorOrders() {
  const [activeNav, setActiveNav] = useState('orders');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'refunds'>('orders');
  const { refundRequests, updateRefundStatus, getPendingCount, getRefundByOrderId } = useRefundStore();
  const { orders } = useOrderStore();

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  const handleApproveRefund = (id: string) => {
    updateRefundStatus(id, 'approved');
  };

  const handleRejectRefund = (id: string) => {
    updateRefundStatus(id, 'rejected');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen sticky top-0">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">I</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">创作者中心</h1>
                <p className="text-sm text-gray-500">管理您的作品</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeNav === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">订单管理</h2>
              <p className="text-gray-500">查看和处理订单</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索订单..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              订单列表
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                activeTab === 'refunds'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              退款申请
              {getPendingCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getPendingCount()}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'orders' && (
            <>
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'pending', label: '待处理' },
                  { id: 'paid', label: '已支付' },
                  { id: 'completed', label: '已完成' },
                  { id: 'refunded', label: '已退款' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterStatus(filter.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === filter.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">订单编号</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">金额</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">退款状态</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">时间</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => {
                      const relatedRefund = getRefundByOrderId(order.id);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">#{order.id.slice(-6)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-accent-500 font-bold">¥{order.totalAmount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-600' :
                              order.status === 'paid' ? 'bg-blue-100 text-blue-600' :
                              order.status === 'refunded' ? 'bg-red-100 text-red-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {order.status === 'completed' ? <CheckCircle className="w-3 h-3" /> :
                               order.status === 'paid' ? <Clock className="w-3 h-3" /> :
                               order.status === 'refunded' ? <AlertCircle className="w-3 h-3" /> :
                               <Clock className="w-3 h-3" />}
                              {order.status === 'completed' ? '已完成' :
                               order.status === 'paid' ? '已支付' :
                               order.status === 'refunded' ? '已退款' : '待处理'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {relatedRefund ? (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                relatedRefund.status === 'approved' ? 'bg-green-100 text-green-600' :
                                relatedRefund.status === 'rejected' ? 'bg-gray-100 text-gray-600' :
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {relatedRefund.status === 'approved' ? '已退款' :
                                 relatedRefund.status === 'rejected' ? '已拒绝' : '处理中'}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">无</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{order.createdAt}</td>
                          <td className="px-6 py-4">
                            <button className="text-primary-600 hover:text-primary-700 font-medium">查看详情</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'refunds' && (
            <div className="space-y-4">
              {refundRequests.map((request) => {
                const order = orders.find(o => o.id === request.order_id);
                return (
                  <div key={request.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">退款申请 #{request.id}</p>
                        <p className="text-sm text-gray-500 mt-1">订单: #{request.order_id.slice(-6)}</p>
                        {order && (
                          <p className="text-sm text-gray-400">订单金额: ¥{order.totalAmount}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-600' :
                        request.status === 'rejected' ? 'bg-gray-100 text-gray-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {request.status === 'approved' ? '已同意' :
                         request.status === 'rejected' ? '已拒绝' : '待处理'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">退款原因: {request.reason}</p>
                      <p className="text-sm text-gray-400 mt-1">申请时间: {request.created_at}</p>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-3 mt-4">
                        <button 
                          onClick={() => handleRejectRefund(request.id)}
                          className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          拒绝
                        </button>
                        <button 
                          onClick={() => handleApproveRefund(request.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          同意退款
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {refundRequests.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  暂无退款申请
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}