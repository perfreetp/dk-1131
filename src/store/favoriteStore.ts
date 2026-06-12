import { create } from 'zustand';
import { Favorite, Asset } from '@/types';
import { mockFavorites } from '@/data/mockData';

interface FavoriteStore {
  favorites: Favorite[];
  addFavorite: (asset: Asset) => void;
  removeFavorite: (assetId: string) => void;
  isFavorite: (assetId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: mockFavorites,
  addFavorite: (asset) => {
    const favorites = get().favorites;
    if (!favorites.find(f => f.asset_id === asset.id)) {
      set({
        favorites: [...favorites, {
          id: Date.now().toString(),
          user_id: '2',
          asset_id: asset.id,
          asset,
          created_at: new Date().toISOString(),
        }],
      });
    }
  },
  removeFavorite: (assetId) => {
    set({
      favorites: get().favorites.filter(f => f.asset_id !== assetId),
    });
  },
  isFavorite: (assetId) => {
    return get().favorites.some(f => f.asset_id === assetId);
  },
}));
