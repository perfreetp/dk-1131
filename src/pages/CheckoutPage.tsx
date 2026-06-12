import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle, ChevronLeft, Download } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { saveOrder } = useOrderStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setIsProcessing(true);
    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      id: orderId,
      items: [...items],
      totalAmount: totalPrice,
      paymentMethod,
      createdAt: new Date().toLocaleString(),
      status: 'completed' as const,
    };
    saveOrder(orderData);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    const completedOrder = useOrderStore.getState().completedOrder;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">支付成功</h1>
            <p className="text-gray-600 mb-8">感谢您的购买，您的授权凭证已生成</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">订单信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">订单编号</span>
                  <span className="font-medium">{completedOrder?.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">订单金额</span>
                  <span className="font-medium">¥{completedOrder?.totalAmount.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">下单时间</span>
                  <span className="font-medium">{completedOrder?.createdAt || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">购买的素材</h3>
              <div className="space-y-3">
                {completedOrder?.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.asset.preview_url}
                        alt={item.asset.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.asset.title}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-accent-500 font-bold">¥{item.asset.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                if (completedOrder) {
                  const blob = new Blob([JSON.stringify({
                    orderId: completedOrder.id,
                    items: completedOrder.items.map(i => ({ 
                      title: i.asset.title, 
                      license: i.asset.license_info,
                      format: i.asset.format,
                      price: i.asset.price * i.quantity
                    })),
                    totalAmount: completedOrder.totalAmount,
                    purchaseDate: completedOrder.createdAt,
                    status: completedOrder.status,
                  }, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `license-${completedOrder.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors mb-4"
            >
              <Download className="w-5 h-5" />
              下载授权凭证
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                查看订单
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                继续购物
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回购物车</span>
        </button>

        <div className="flex items-center justify-center gap-8 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
              <span className={`ml-2 font-medium ${step >= s ? 'text-gray-900' : 'text-gray-500'}`}>
                {s === 1 ? '确认订单' : s === 2 ? '选择支付' : '完成'}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">订单信息</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.asset.preview_url}
                      alt={item.asset.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.asset.title}</h3>
                      <p className="text-sm text-gray-500">{item.asset.creator?.username}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">数量: {item.quantity}</span>
                        <span className="text-accent-500 font-bold">¥{item.asset.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {step >= 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">支付方式</h2>
                <div className="space-y-3">
                  {[
                    { id: 'alipay', name: '支付宝', icon: 'A' },
                    { id: 'wechat', name: '微信支付', icon: 'W' },
                    { id: 'card', name: '银行卡', icon: 'C' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'border-2 border-primary-600 bg-primary-50'
                          : 'border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                        paymentMethod === method.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {method.icon}
                      </div>
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">订单摘要</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>商品总数</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)} 件</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>运费</span>
                <span className="text-green-600">免费</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">总计</span>
                  <span className="text-2xl font-bold text-accent-500">¥{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">安全支付</p>
                  <p className="text-xs text-gray-500">您的支付信息将被加密保护</p>
                </div>
              </div>
            </div>

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                确认订单
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-colors disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5" />
                {isProcessing ? '处理中...' : `立即支付 ¥${totalPrice.toFixed(2)}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}