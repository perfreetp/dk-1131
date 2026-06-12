import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, FileText, Package, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { useCartStore } from '@/store/cartStore';

export function PaymentCompletePage() {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const { orders, completedOrder } = useOrderStore();
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState(completedOrder);

  useEffect(() => {
    if (!order) {
      if (orderId) {
        const found = orders.find(o => o.id === orderId);
        if (found) {
          setOrder(found);
        }
      } else if (completedOrder) {
        setOrder(completedOrder);
        clearCart();
      }
    } else {
      clearCart();
    }
  }, [order, orderId, orders, completedOrder, clearCart]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">订单信息加载中...</h2>
          <p className="text-gray-500">请稍候，正在获取订单详情</p>
        </div>
      </div>
    );
  }

  const handleDownloadAssets = () => {
    const totalFiles = order.items.reduce((sum, item) => sum + item.quantity, 0);
    alert(`正在下载订单 ${order.id} 的素材文件...\n共 ${totalFiles} 个文件`);
  };

  const handleDownloadCertificate = () => {
    const certContent = `
授权凭证
订单号: ${order.id}
订单日期: ${order.createdAt}
总金额: ¥${order.totalAmount}
支付方式: ${order.paymentMethod === 'alipay' ? '支付宝' : '微信支付'}

素材清单:
${order.items.map(item => `  - ${item.asset.title} x ${item.quantity} (¥${item.asset.price * item.quantity})`).join('\n')}

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-12 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">支付成功</h1>
            <p className="text-white/80">感谢您的购买，您的订单已完成</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-500 text-sm">订单号</p>
                <p className="font-bold text-gray-900">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">下单时间</p>
                <p className="font-medium text-gray-900">{order.createdAt}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                购买的素材
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img 
                      src={item.asset.thumbnail} 
                      alt={item.asset.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.asset.title}</h3>
                      <p className="text-sm text-gray-500">
                        {item.asset.category} · {item.asset.format}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">¥{item.asset.price * item.quantity}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">订单总价</span>
                <span className="text-2xl font-bold text-primary-600">¥{order.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleDownloadAssets}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                下载素材 ({order.items.reduce((sum, item) => sum + item.quantity, 0)}个文件)
              </button>
              <button
                onClick={handleDownloadCertificate}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-5 h-5" />
                下载授权凭证
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                继续购物
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                查看订单
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}