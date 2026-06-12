import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useCartStore } from '@/store/cartStore';

export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoriteStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (asset: typeof favorites[0]['asset']) => {
    if (asset) {
      addItem(asset);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-accent-500" />
          <h1 className="text-2xl font-bold text-gray-900">我的收藏</h1>
          <span className="text-gray-500">({favorites.length} 个收藏)</span>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">还没有收藏任何素材</h2>
            <p className="text-gray-500 mb-6">去发现一些精彩的设计素材吧</p>
            <Link
              to="/categories"
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              去浏览
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={favorite.asset?.preview_url}
                    alt={favorite.asset?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  <button
                    onClick={() => removeFavorite(favorite.asset_id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-600" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(favorite.asset!)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/90 text-gray-700 py-2 rounded-lg hover:bg-white transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm font-medium">加入购物车</span>
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{favorite.asset?.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{favorite.asset?.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={favorite.asset?.creator?.avatar_url}
                        alt={favorite.asset?.creator?.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-500">{favorite.asset?.creator?.username}</span>
                    </div>
                    <span className="text-accent-500 font-bold">¥{favorite.asset?.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
