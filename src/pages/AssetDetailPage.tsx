import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Download, Star, Shield, Check, Eye, ChevronLeft, MessageCircle } from 'lucide-react';
import { mockAssets } from '@/data/mockData';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [transparentBg, setTransparentBg] = useState(false);
  const [selectedSize, setSelectedSize] = useState('128x128');

  const asset = mockAssets.find(a => a.id === id);
  const favorite = asset ? isFavorite(asset.id) : false;

  const sizes = ['64x64', '128x128', '256x256', '512x512'];

  const handleFavorite = () => {
    if (!user) return;
    if (favorite && asset) {
      removeFavorite(asset.id);
    } else if (asset) {
      addFavorite(asset);
    }
  };

  const handleAddToCart = () => {
    if (asset) {
      addItem(asset);
    }
  };

  const handleBuyNow = () => {
    if (asset) {
      addItem(asset);
      navigate('/cart');
    }
  };

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">素材不存在</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className={`relative aspect-square rounded-2xl overflow-hidden ${transparentBg ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <img
                src={asset.preview_url}
                alt={asset.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between bg-white rounded-xl p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTransparentBg(!transparentBg)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    transparentBg ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  {transparentBg ? '白色背景' : '透明背景'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">尺寸:</span>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      selectedSize === size ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  {asset.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  {asset.format}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{asset.title}</h1>
              <p className="text-gray-600">{asset.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={asset.creator?.avatar_url}
                alt={asset.creator?.username}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{asset.creator?.username}</p>
                <p className="text-sm text-gray-500">
                  {mockAssets.filter(a => a.creator_id === asset.creator_id).length} 个作品 · {asset.downloads} 下载
                </p>
              </div>
              <button className="flex items-center gap-1 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors">
                <Star className="w-4 h-4" />
                关注
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">授权信息</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>可用于商业项目</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>可用于个人项目</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>支持修改和再分发</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500">{asset.license_info}</p>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>{asset.downloads} 下载</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>{asset.likes} 喜欢</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>0 评论</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">价格</p>
                  <span className="text-4xl font-bold text-accent-500">¥{asset.price}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">安全支付</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleFavorite}
                  disabled={!user}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                    user
                      ? favorite
                        ? 'bg-accent-500 text-white hover:bg-accent-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                  {favorite ? '已收藏' : '收藏'}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  加入购物车
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent-500 text-white rounded-xl font-medium hover:bg-accent-600 transition-colors"
                >
                  立即购买
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">规格参数</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">风格:</span>
                  <span className="ml-2 text-gray-900">{asset.style}</span>
                </div>
                <div>
                  <span className="text-gray-500">格式:</span>
                  <span className="ml-2 text-gray-900">{asset.format}</span>
                </div>
                <div>
                  <span className="text-gray-500">颜色:</span>
                  <span className="ml-2 text-gray-900">{asset.color}</span>
                </div>
                <div>
                  <span className="text-gray-500">适用行业:</span>
                  <span className="ml-2 text-gray-900">{asset.industry}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">相关素材</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {mockAssets.filter(a => a.id !== asset.id && a.category === asset.category).slice(0, 6).map((related) => (
              <div key={related.id} className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={related.preview_url}
                  alt={related.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{related.title}</h3>
                  <p className="text-accent-500 font-bold text-sm mt-1">¥{related.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
