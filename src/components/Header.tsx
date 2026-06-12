import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900">IconMarket</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">首页</Link>
              <Link to="/categories" className="text-gray-600 hover:text-primary-600 transition-colors">分类浏览</Link>
              <Link to="/creator/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">创作者中心</Link>
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索图标、插图、图片..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/favorites" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Heart className="w-6 h-6" />
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.is_creator ? '创作者' : '普通用户'}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <User className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors">登录</Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">注册</Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <nav className="px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-gray-600">首页</Link>
            <Link to="/categories" className="block py-2 text-gray-600">分类浏览</Link>
            <Link to="/favorites" className="block py-2 text-gray-600">收藏夹</Link>
            <Link to="/cart" className="block py-2 text-gray-600">购物车</Link>
            {!user && (
              <>
                <Link to="/login" className="block py-2 text-gray-600">登录</Link>
                <Link to="/register" className="block py-2 text-primary-600">注册</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
