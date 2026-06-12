import { Link } from 'react-router-dom';
import { Heart, Download, ShoppingCart } from 'lucide-react';
import { Asset } from '@/types';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const favorite = isFavorite(asset.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      return;
    }
    if (favorite) {
      removeFavorite(asset.id);
    } else {
      addFavorite(asset);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(asset);
  };

  return (
    <Link to={`/assets/${asset.id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={asset.preview_url}
          alt={asset.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              favorite ? 'bg-accent-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">加入购物车</span>
          </button>
        </div>

        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 text-xs font-medium text-gray-700 rounded-full">
            {asset.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{asset.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{asset.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={asset.creator?.avatar_url}
              alt={asset.creator?.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-gray-500">{asset.creator?.username}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-accent-500 font-bold">¥{asset.price}</span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Download className="w-4 h-4" />
              <span>{asset.downloads}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
