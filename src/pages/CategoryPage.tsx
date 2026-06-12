import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Grid, LayoutList } from 'lucide-react';
import { AssetCard } from '@/components/AssetCard';
import { FilterPanel } from '@/components/FilterPanel';
import { mockAssets } from '@/data/mockData';
import { useFilterStore } from '@/store/filterStore';

export function CategoryPage() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { filters, setFilters } = useFilterStore();

  const initialCategory = searchParams.get('category');
  if (initialCategory && !filters.category) {
    setFilters({ category: initialCategory });
  }

  const filteredAssets = useMemo(() => {
    let result = [...mockAssets];

    if (filters.category && filters.category !== '全部') {
      result = result.filter(a => a.category === filters.category);
    }
    if (filters.style && filters.style !== '全部') {
      result = result.filter(a => a.style === filters.style);
    }
    if (filters.format && filters.format !== '全部') {
      result = result.filter(a => a.format === filters.format);
    }
    if (filters.color && filters.color !== '全部') {
      result = result.filter(a => a.color === filters.color);
    }
    if (filters.industry && filters.industry !== '全部') {
      result = result.filter(a => a.industry === filters.industry);
    }

    if (filters.sortBy === 'price') {
      result.sort((a, b) => filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
    } else if (filters.sortBy === 'sales') {
      result.sort((a, b) => filters.sortOrder === 'asc' ? a.downloads - b.downloads : b.downloads - a.downloads);
    } else if (filters.sortBy === 'date') {
      result.sort((a, b) => filters.sortOrder === 'asc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [filters]);

  const sortOptions = [
    { value: 'date', label: '最新发布' },
    { value: 'sales', label: '销量最高' },
    { value: 'price', label: '价格排序' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.category && filters.category !== '全部' ? filters.category : '全部素材'}
          </h1>
          <p className="text-gray-600">共 {filteredAssets.length} 个素材</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0">
            <FilterPanel />
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm font-medium">排序:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ sortBy: e.target.value as 'price' | 'sales' | 'date' })}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow">
                    <img
                      src={asset.preview_url}
                      alt={asset.title}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{asset.title}</h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{asset.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{asset.category}</span>
                        <span>{asset.style}</span>
                        <span>{asset.format}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-accent-500 font-bold">¥{asset.price}</span>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{asset.downloads} 下载</span>
                        <span>{asset.likes} 喜欢</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredAssets.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">没有找到符合条件的素材</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
