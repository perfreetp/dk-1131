import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Download, FileText, Package, Calendar, 
  CreditCard, XCircle, ChevronRight
} from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';

export function OrdersPage() {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, getOrderById } = useOrderStore();
  
  const [selectedStatus, setSelectedStatus] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('status') || 'all';
  });

  const currentOrder = orderId ? getOrderById(orderId) : null;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status && status !== selectedStatus) {
      setSelectedStatus(status);
    }
  }, [location.search, selectedStatus]);

  const filteredOrders = orders.filter(order => {
    if (selectedStatus === 'all') return true;
    return order.status === selectedStatus;
  });

  const statusConfig = {
    pending: { label: '待支付', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    paid: { label: '已支付', color: 'text-blue-600', bg: 'bg-blue-100' },
    completed: { label: '已完成', color: 'text-green-600', bg: 'bg-green-100' },
    refunded: { label: '已退款', color: 'text-red-600', bg: 'bg-red-100' },
  };

  const handleDownloadAssets = (order: typeof currentOrder) => {
    if (!order) return;
    const totalFiles = order.items.reduce((sum, item) => sum + item.quantity, 0);
    alert(`正在下载订单 ${order.id} 的素材文件...\n共 ${totalFiles} 个文件`);
  };

  const handleDownloadCertificate = (order: typeof currentOrder) => {
    if (!order) return;
    const certContent = `
授权凭证
订单号: ${order.id}
订单日期: ${order.createdAt}
总金额: ¥${order.totalAmount}
支付方式: ${order.paymentMethod === 'alipay' ? '支付宝' : '微信支付'}

素材清单:
${order.items.map(item => `  - ${item.asset.title} x ${item.quantity} (单价¥${item.asset.price}，小计¥${item.asset.price * item.quantity})`).join('\n')}

文件总数: ${order.items.reduce((sum, item) => sum + item.quantity, 0)} 个

授权说明:
本凭证证明您已合法购买上述素材的使用权，可用于商业用途。
授权期限: 永久
授权范围: 全球

感谢您的购买！
    `.trim();
    
    const blob = new Blob([certContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `授权凭证_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    navigate(`/orders?status=${status}`);
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}?status=${selectedStatus}`);
  };

  const handleBackToList = () => {
    navigate(`/orders?status=${selectedStatus}`);
  };

  const renderOrderDetail = () => {
    if (!currentOrder) {
      return (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            返回订单列表
          </button>
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">订单不存在</h2>
            <p className="text-gray-500">该订单可能已被删除</p>
          </div>
        </div>
      );
    }

    const totalItems = currentOrder.items.reduce((sum, item) => sum + item.quantity, 0);
    const calculatedTotal = currentOrder.items.reduce((sum, item) => sum + item.asset.price * item.quantity, 0);

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          返回订单列表
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">订单详情</h1>
                <p className="text-gray-500 mt-1">订单号: {currentOrder.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[currentOrder.status].bg} ${statusConfig[currentOrder.status].color}`}>
                {statusConfig[currentOrder.status].label}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">下单时间</span>
                </div>
                <p className="font-medium text-gray-900">{currentOrder.createdAt}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">支付方式</span>
                </div>
                <p className="font-medium text-gray-900">
                  {currentOrder.paymentMethod === 'alipay' ? '支付宝' : '微信支付'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                素材清单
              </h2>
              <div className="space-y-4">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={item.asset.thumbnail || item.asset.preview_url} 
                      alt={item.asset.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.asset.title}</h3>
                      <p className="text-sm text-gray-500">
                        {item.asset.category} · {item.asset.format} · {item.asset.style}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">单价 ¥{item.asset.price}</p>
                      <p className="text-sm text-gray-500">数量 x{item.quantity}</p>
                      <p className="font-medium text-gray-900">小计 ¥{item.asset.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">商品总数</span>
                <span className="font-medium">{totalItems} 件</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">计算总额</span>
                <span className="font-medium">¥{calculatedTotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">订单总价</span>
                <span className="text-2xl font-bold text-primary-600">¥{currentOrder.totalAmount}</span>
              </div>
            </div>
          </div>

          {(currentOrder.status === 'completed' || currentOrder.status === 'paid') && (
            <div className="px-6 pb-6">
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadAssets(currentOrder)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  下载素材 ({totalItems}个文件)
                </button>
                <button
                  onClick={() => handleDownloadCertificate(currentOrder)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  下载授权凭证
                </button>
              </div>
            </div>
          )}

          {currentOrder.status === 'pending' && (
            <div className="px-6 pb-6">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <CreditCard className="w-5 h-5" />
                去支付
              </button>
            </div>
          )}

          {currentOrder.status === 'refunded' && (
            <div className="px-6 pb-6">
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-500 rounded-lg">
                <XCircle className="w-5 h-5" />
                订单已退款
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOrderList = () => (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">我的订单</h1>

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
            onClick={() => handleStatusChange(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === key
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
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
          <p className="text-gray-500">快去挑选心仪的素材吧</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                  <span className="text-gray-500 text-sm">{order.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span>订单号: {order.id}</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={item.asset.thumbnail || item.asset.preview_url} 
                      alt={item.asset.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    {index >= 2 && order.items.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
                </span>
                <div className="text-right">
                  <span className="text-gray-500 text-sm">合计:</span>
                  <span className="text-lg font-bold text-primary-600 ml-2">¥{order.totalAmount}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                {(order.status === 'completed' || order.status === 'paid') && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadAssets(order);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载素材
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadCertificate(order);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      下载凭证
                    </button>
                  </>
                )}
                {order.status === 'pending' && (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    去支付
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        {orderId ? renderOrderDetail() : renderOrderList()}
      </div>
    </div>
  );
}