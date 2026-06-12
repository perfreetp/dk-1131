import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Asset } from '@/types';
import { mockAssets as initialAssets } from '@/data/mockData';

interface AssetStore {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: initialAssets,
      addAsset: (asset) => set({ assets: [...get().assets, asset] }),
      updateAsset: (id, updates) => set({
        assets: get().assets.map(asset => 
          asset.id === id ? { ...asset, ...updates } : asset
        )
      }),
      removeAsset: (id) => set({
        assets: get().assets.filter(asset => asset.id !== id)
      }),
    }),
    {
      name: 'iconmarket-assets',
    }
  )
);