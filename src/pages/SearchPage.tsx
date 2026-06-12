import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { AssetCard } from '@/components/AssetCard';
import { mockAssets } from '@/data/mockData';
import { useFilterStore } from '@/store/filterStore';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const [localQuery, setLocalQuery] = useState('');
  const { filters, setFilters, resetFilters } = useFilterStore();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      setLocalQuery(query);
    }
    return () => {
      resetFilters();
    };
  }, [query, resetFilters]);

  const searchResults = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return mockAssets.filter(asset => 
      asset.title.toLowerCase().includes(lowerQuery) ||
      asset.description.toLowerCase().includes(lowerQuery) ||
      asset.category.toLowerCase().includes(lowerQuery) ||
      asset.style.toLowerCase().includes(lowerQuery) ||
      asset.industry.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const popularSearches = ['图标', '商务图标', '社交媒体插图', '科技图标', '电商图片'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-8">
          <form className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="搜索图标、插图、图片..."
              className="w-full pl-12 pr-24 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {localQuery && (
              <button
                onClick={() => setLocalQuery('')}
                className="absolute right-20 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              搜索
            </button>
          </form>
        </div>

        {query && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                搜索结果: "{query}"
                <span className="ml-2 text-gray-500 font-normal">共 {searchResults.length} 个结果</span>
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">排序:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ sortBy: e.target.value as 'price' | 'sales' | 'date' })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date">最新发布</option>
                  <option value="sales">销量最高</option>
                  <option value="price">价格排序</option>
                </select>
                <button
                  onClick={() => setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {!query ? (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">热门搜索</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('q', term);
                    window.location.href = `/search?${newParams.toString()}`;
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">搜索历史</h2>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-gray-500 text-center py-8">暂无搜索历史</p>
              </div>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">未找到相关结果</h2>
            <p className="text-gray-500 mb-4">尝试使用其他关键词搜索</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('q', term);
                    window.location.href = `/search?${newParams.toString()}`;
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
