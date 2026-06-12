import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ArrowUpDown, Trash2, SlidersHorizontal } from 'lucide-react';
import { AssetCard } from '@/components/AssetCard';
import { mockAssets, categories, styles, formats, colors, industries } from '@/data/mockData';
import { useSearchStore } from '@/store/searchStore';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localQuery, setLocalQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { searchHistory, currentFilters, setFilters, addToHistory, clearHistory, resetFilters } = useSearchStore();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    setLocalQuery(query);
    
    const category = searchParams.get('category');
    const style = searchParams.get('style');
    const format = searchParams.get('format');
    const color = searchParams.get('color');
    const industry = searchParams.get('industry');
    
    if (category || style || format || color || industry) {
      setFilters({
        ...(category && category !== '全部' ? { category } : {}),
        ...(style && style !== '全部' ? { style } : {}),
        ...(format && format !== '全部' ? { format } : {}),
        ...(color && color !== '全部' ? { color } : {}),
        ...(industry && industry !== '全部' ? { industry } : {}),
      });
    }
  }, [query, searchParams, setFilters]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const newParams: Record<string, string> = {};
    if (localQuery.trim()) {
      newParams.q = localQuery.trim();
      addToHistory(localQuery.trim());
    }
    
    if (currentFilters.category) {
      newParams.category = currentFilters.category;
    }
    if (currentFilters.style) {
      newParams.style = currentFilters.style;
    }
    if (currentFilters.format) {
      newParams.format = currentFilters.format;
    }
    if (currentFilters.color) {
      newParams.color = currentFilters.color;
    }
    if (currentFilters.industry) {
      newParams.industry = currentFilters.industry;
    }
    
    setSearchParams(newParams);
  };

  const handleClearAndSearch = () => {
    setLocalQuery('');
    resetFilters();
    setSearchParams({});
  };

  const handleFilterChange = (key: 'category' | 'style' | 'format' | 'color' | 'industry', value: string) => {
    if (value === '全部') {
      setFilters({ [key]: undefined });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key);
      setSearchParams(newParams);
    } else {
      setFilters({ [key]: value });
      setSearchParams({ ...Object.fromEntries(searchParams), [key]: value });
    }
  };

  const handleHistoryClick = (term: string) => {
    setLocalQuery(term);
    setSearchParams({ q: term });
  };

  const searchResults = useMemo(() => {
    let results = [...mockAssets];
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(asset => 
        asset.title.toLowerCase().includes(lowerQuery) ||
        asset.description.toLowerCase().includes(lowerQuery) ||
        asset.category.toLowerCase().includes(lowerQuery) ||
        asset.style.toLowerCase().includes(lowerQuery) ||
        asset.industry.toLowerCase().includes(lowerQuery)
      );
    }

    if (currentFilters.category) {
      results = results.filter(a => a.category === currentFilters.category);
    }
    if (currentFilters.style) {
      results = results.filter(a => a.style === currentFilters.style);
    }
    if (currentFilters.format) {
      results = results.filter(a => a.format === currentFilters.format);
    }
    if (currentFilters.color) {
      results = results.filter(a => a.color === currentFilters.color);
    }
    if (currentFilters.industry) {
      results = results.filter(a => a.industry === currentFilters.industry);
    }

    if (currentFilters.sortBy === 'price') {
      results = [...results].sort((a, b) => 
        currentFilters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
    } else if (currentFilters.sortBy === 'sales') {
      results = [...results].sort((a, b) => 
        currentFilters.sortOrder === 'asc' ? a.downloads - b.downloads : b.downloads - a.downloads
      );
    }

    return results;
  }, [query, currentFilters]);

  const popularSearches = ['图标', '商务图标', '社交媒体插图', '科技图标', '电商图片'];

  const hasActiveFilters = currentFilters.category || currentFilters.style || 
                          currentFilters.format || currentFilters.color || currentFilters.industry;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
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
                type="button"
                onClick={handleClearAndSearch}
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
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    hasActiveFilters || showFilters
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  筛选
                  {hasActiveFilters && (
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                      {[currentFilters.category, currentFilters.style, currentFilters.format, currentFilters.color, currentFilters.industry].filter(Boolean).length}
                    </span>
                  )}
                </button>
                <span className="text-sm">排序:</span>
                <select
                  value={currentFilters.sortBy}
                  onChange={(e) => setFilters({ sortBy: e.target.value as 'price' | 'sales' | 'date' })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date">最新发布</option>
                  <option value="sales">销量最高</option>
                  <option value="price">价格排序</option>
                </select>
                <button
                  onClick={() => setFilters({ sortOrder: currentFilters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <select
                  value={currentFilters.category || '全部'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">风格</label>
                <select
                  value={currentFilters.style || '全部'}
                  onChange={(e) => handleFilterChange('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">格式</label>
                <select
                  value={currentFilters.format || '全部'}
                  onChange={(e) => handleFilterChange('format', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                <select
                  value={currentFilters.color || '全部'}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">行业</label>
                <select
                  value={currentFilters.industry || '全部'}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  resetFilters();
                  const newParams = new URLSearchParams(searchParams);
                  ['category', 'style', 'format', 'color', 'industry'].forEach(key => newParams.delete(key));
                  setSearchParams(newParams);
                }}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                清除所有筛选
              </button>
            )}
          </div>
        )}

        {!query ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">搜索历史</h2>
                {searchHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    清空历史
                  </button>
                )}
              </div>
              {searchHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(term)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-gray-500 text-center py-8">暂无搜索历史</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">热门搜索</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setLocalQuery(term);
                      setSearchParams({ q: term });
                      addToHistory(term);
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
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
                    setLocalQuery(term);
                    setSearchParams({ q: term });
                    addToHistory(term);
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