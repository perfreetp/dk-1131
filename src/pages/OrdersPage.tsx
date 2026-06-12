import { useState } from 'react';
import { Package, Download, FileText, CheckCircle, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';

export function OrdersPage() {
  const { orders, getOrderById } = useOrderStore();
  const [filterStatus, setFilterStatus] = useState('all');
  const [downloadMessage, setDownloadMessage] = useState<{ orderId: string; message: string; type: 'success' | 'error' } | null>(null);

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const handleDownload = (orderId: string, status: string) => {
    if (status !== 'completed') {
      setDownloadMessage({ 
        orderId, 
        message: '仅已完成订单可下载素材', 
        type: 'error' 
      });
      setTimeout(() => setDownloadMessage(null), 3000);
      return;
    }

    const order = getOrderById(orderId);
    if (!order) return;
    
    setDownloadMessage({ 
      orderId, 
      message: `正在准备 ${order.items.length} 个素材文件...`, 
      type: 'success' 
    });

    setTimeout(() => {
      const downloadData = {
        orderId: order.id,
        items: order.items.map(item => ({
          title: item.asset.title,
          format: item.asset.format,
          fileUrl: item.asset.file_url,
          license: item.asset.license_info,
          price: item.asset.price * item.quantity,
        })),
        totalAmount: order.totalAmount,
        purchaseDate: order.createdAt,
        status: order.status,
      };

      const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-${order.id}-download-info.json`;
      a.click();
      URL.revokeObjectURL(url);

      setDownloadMessage({ 
        orderId, 
        message: `素材下载链接已生成 (${order.items.length} 个文件)`, 
        type: 'success' 
      });
      setTimeout(() => setDownloadMessage(null), 3000);
    }, 1000);
  };

  const downloadLicense = (orderId: string) => {
    const order = getOrderById(orderId);
    if (!order) return;

    const licenseData = {
      orderId: order.id,
      items: order.items.map(item => ({ 
        title: item.asset.title, 
        license: item.asset.license_info 
      })),
      totalAmount: order.totalAmount,
      purchaseDate: order.createdAt,
      status: order.status,
      licenseType: 'Commercial Use',
    };

    const blob = new Blob([JSON.stringify(licenseData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `license-${order.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">订单编号: #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-500 mt-1">下单时间: {order.createdAt}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-600' :
                    order.status === 'paid' ? 'bg-blue-100 text-blue-600' :
                    order.status === 'refunded' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                     order.status === 'paid' ? <Clock className="w-4 h-4" /> :
                     order.status === 'refunded' ? <AlertCircle className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                    {order.status === 'completed' ? '已完成' :
                     order.status === 'paid' ? '已支付' :
                     order.status === 'refunded' ? '已退款' : '待处理'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.asset.preview_url}
                        alt={item.asset.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.asset.title}</h3>
                        <p className="text-sm text-gray-500">{item.asset.creator?.username}</p>
                        <p className="text-xs text-gray-400">{item.asset.license_info}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">¥{item.asset.price}</p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {downloadMessage?.orderId === order.id && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    downloadMessage.type === 'success' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {downloadMessage.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm">{downloadMessage.message}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div>
                    <p className="text-sm text-gray-500">订单金额</p>
                    <p className="text-xl font-bold text-gray-900">¥{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => downloadLicense(order.id)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      下载凭证
                    </button>
                    <button 
                      onClick={() => handleDownload(order.id, order.status)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        order.status === 'completed'
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={order.status !== 'completed'}
                    >
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

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>暂无订单</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}