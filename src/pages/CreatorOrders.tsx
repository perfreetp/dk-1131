import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import { mockOrders } from '@/data/mockData';

const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'assets', label: '素材管理', icon: Package },
  { id: 'orders', label: '订单管理', icon: ShoppingBag },
  { id: 'earnings', label: '收益统计', icon: DollarSign },
];

const refundRequests = [
  { id: '1', orderId: 'ORD-001', reason: '素材不符合预期', status: 'pending', createdAt: '2024-01-15' },
  { id: '2', orderId: 'ORD-002', reason: '重复购买', status: 'approved', createdAt: '2024-01-14' },
];

export function CreatorOrders() {
  const [activeNav, setActiveNav] = useState('orders');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'refunds'>('orders');

  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  const filteredOrders = filterStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(o => o.status === filterStatus);

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
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {refundRequests.filter(r => r.status === 'pending').length}
              </span>
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
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">时间</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">#{order.id.slice(-6)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-accent-500 font-bold">¥{order.total_amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-600' :
                            order.status === 'paid' ? 'bg-blue-100 text-blue-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {order.status === 'completed' ? <CheckCircle className="w-3 h-3" /> :
                             order.status === 'paid' ? <Clock className="w-3 h-3" /> :
                             <AlertCircle className="w-3 h-3" />}
                            {order.status === 'completed' ? '已完成' :
                             order.status === 'paid' ? '已支付' : '待处理'}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{order.created_at}</td>
                        <td className="px-6 py-4">
                          <button className="text-primary-600 hover:text-primary-700 font-medium">查看详情</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'refunds' && (
            <div className="space-y-4">
              {refundRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">退款申请 #{request.id}</p>
                      <p className="text-sm text-gray-500 mt-1">订单: {request.orderId}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-600' :
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {request.status === 'approved' ? '已同意' :
                       request.status === 'pending' ? '待处理' : '已拒绝'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">退款原因: {request.reason}</p>
                    <p className="text-sm text-gray-400 mt-1">申请时间: {request.createdAt}</p>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        拒绝
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        同意退款
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
