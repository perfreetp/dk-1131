import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Upload, CheckCircle, Clock, Search } from 'lucide-react';
import { mockAssets, mockOrders } from '@/data/mockData';

const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'assets', label: '素材管理', icon: Package },
  { id: 'orders', label: '订单管理', icon: ShoppingBag },
  { id: 'earnings', label: '收益统计', icon: DollarSign },
];

export function CreatorDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const creatorAssets = mockAssets.filter(a => a.creator_id === '1');
  const creatorOrders = mockOrders;
  const totalEarnings = creatorAssets.reduce((sum, a) => sum + a.price * a.downloads * 0.7, 0);
  const pendingAssets = creatorAssets.filter(a => a.status === 'pending').length;
  const completedOrders = creatorOrders.filter(o => o.status === 'completed').length;

  const stats = [
    { label: '总收益', value: `¥${totalEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: '作品数量', value: creatorAssets.length.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '待审核', value: pendingAssets.toString(), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: '已完成订单', value: completedOrders.toString(), icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentAssets = creatorAssets.slice(0, 5);
  const recentOrders = creatorOrders.slice(0, 5);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === 'assets') navigate('/creator/assets');
    if (id === 'orders') navigate('/creator/orders');
    if (id === 'earnings') navigate('/creator/earnings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen sticky top-0">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">I</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">创作者中心</h1>
                <p className="text-sm text-gray-500">管理您的作品</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeNav === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
              <Upload className="w-5 h-5" />
              上传素材
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">欢迎回来</h2>
              <p className="text-gray-500">这是您的创作者控制面板</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">最近作品</h3>
                <Link to="/creator/assets" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  查看全部
                </Link>
              </div>
              <div className="space-y-4">
                {recentAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-4">
                    <img
                      src={asset.preview_url}
                      alt={asset.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{asset.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{asset.format}</span>
                        <span>{asset.downloads} 下载</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      asset.status === 'approved' ? 'bg-green-100 text-green-600' :
                      asset.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {asset.status === 'approved' ? '已通过' :
                       asset.status === 'pending' ? '审核中' : '已拒绝'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">最近订单</h3>
                <Link to="/creator/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  查看全部
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">订单 #{order.id.slice(-6)}</p>
                      <p className="text-sm text-gray-500">{order.created_at}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">¥{order.total_amount}</p>
                      <span className={`text-xs ${
                        order.status === 'completed' ? 'text-green-600' :
                        order.status === 'paid' ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {order.status === 'completed' ? '已完成' :
                         order.status === 'paid' ? '已支付' : '待处理'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">热门关键词</h3>
            <div className="flex flex-wrap gap-2">
              {['图标', '商务', '科技', '社交媒体', '电商', '扁平化', '线性', '插画'].map((keyword) => (
                <span key={keyword} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
