import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { FilterOptions } from '@/types';
import { useFilterStore } from '@/store/filterStore';
import { categories, styles, formats, colors, industries } from '@/data/mockData';

interface FilterPanelProps {
  onFiltersChange?: (filters: Partial<FilterOptions>) => void;
}

export function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilters, resetFilters } = useFilterStore();

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    const newFilters: Partial<FilterOptions> = {} as Partial<FilterOptions>;
    if (value === '全部' || value === undefined) {
      (newFilters as Record<string, unknown>)[key] = undefined;
    } else {
      (newFilters as Record<string, unknown>)[key] = value;
    }
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '全部' && v !== 'date' && v !== 'desc');

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-gray-700 font-medium"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          <span>筛选</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-accent-100 text-accent-600 text-xs rounded-full">
              已筛选
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', cat)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filters.category === cat && cat !== '全部'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">风格</label>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => handleFilterChange('style', style)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filters.style === style && style !== '全部'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">格式</label>
            <div className="flex flex-wrap gap-2">
              {formats.map((format) => (
                <button
                  key={format}
                  onClick={() => handleFilterChange('format', format)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filters.format === format && format !== '全部'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleFilterChange('color', color)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filters.color === color && color !== '全部'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">行业</label>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleFilterChange('industry', industry)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filters.industry === industry && industry !== '全部'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={resetFilters}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>重置筛选</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
