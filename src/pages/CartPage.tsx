import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">购物车</h1>
          <span className="text-gray-500">({items.length} 件商品)</span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">购物车是空的</h2>
            <p className="text-gray-500 mb-6">快去挑选心仪的素材吧</p>
            <Link
              to="/categories"
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              去购物
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                  <img
                    src={item.asset.preview_url}
                    alt={item.asset.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.asset.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{item.asset.creator?.username}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.asset_id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.asset_id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-accent-500 font-bold">¥{item.asset.price * item.quantity}</span>
                        <button
                          onClick={() => removeItem(item.asset_id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="w-full py-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                清空购物车
              </button>
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

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                去结算
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                <Link to="/categories" className="text-primary-600 hover:text-primary-700">继续购物</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
