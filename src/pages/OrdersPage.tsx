import { useState } from 'react';
import { Package, Download, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { mockOrders, mockAssets } from '@/data/mockData';

export function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(o => o.status === filterStatus);

  const orderItems = mockAssets.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
        </div>

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

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">订单编号: #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-500 mt-1">下单时间: {order.created_at}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-600' :
                    order.status === 'paid' ? 'bg-blue-100 text-blue-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                     order.status === 'paid' ? <Clock className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                    {order.status === 'completed' ? '已完成' :
                     order.status === 'paid' ? '已支付' : '待处理'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.preview_url}
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.creator?.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">¥{item.price}</p>
                        <p className="text-sm text-gray-500">x1</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div>
                    <p className="text-sm text-gray-500">订单金额</p>
                    <p className="text-xl font-bold text-gray-900">¥{order.total_amount}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="w-4 h-4" />
                      申请发票
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <Download className="w-4 h-4" />
                      下载素材
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button className="w-full flex items-center justify-between py-3 text-primary-600 hover:text-primary-700 font-medium">
                  <span>查看订单详情</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
