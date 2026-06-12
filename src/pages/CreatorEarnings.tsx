import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Download, TrendingUp, Calendar } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { mockAssets } from '@/data/mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'assets', label: '素材管理', icon: Package },
  { id: 'orders', label: '订单管理', icon: ShoppingBag },
  { id: 'earnings', label: '收益统计', icon: DollarSign },
];

const monthlyEarnings = [
  { month: '1月', earnings: 2500, orders: 52 },
  { month: '2月', earnings: 3200, orders: 68 },
  { month: '3月', earnings: 2800, orders: 58 },
  { month: '4月', earnings: 4100, orders: 86 },
  { month: '5月', earnings: 3800, orders: 78 },
  { month: '6月', earnings: 4500, orders: 94 },
];

const topAssets = [
  { title: '科技图标包', downloads: 2341, earnings: 9129.9 },
  { title: '金融图标集', downloads: 1890, earnings: 11151 },
  { title: '教育图标包', downloads: 1567, earnings: 7051.5 },
  { title: '商务图标套装', downloads: 1234, earnings: 6046.6 },
  { title: '美食摄影图片', downloads: 789, earnings: 11756.1 },
];

export function CreatorEarnings() {
  const [activeNav, setActiveNav] = useState('earnings');
  const [timeRange, setTimeRange] = useState('month');

  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  const creatorAssets = mockAssets.filter(a => a.creator_id === '1');
  const totalEarnings = creatorAssets.reduce((sum, a) => sum + a.price * a.downloads * 0.7, 0);
  const totalOrders = creatorAssets.reduce((sum, a) => sum + a.downloads, 0);
  const totalAssets = creatorAssets.length;
  const averageEarning = totalEarnings / totalAssets;

  const lineChartData = {
    labels: monthlyEarnings.map(m => m.month),
    datasets: [
      {
        label: '收益 (¥)',
        data: monthlyEarnings.map(m => m.earnings),
        borderColor: '#1e3a5f',
        backgroundColor: 'rgba(30, 58, 95, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: monthlyEarnings.map(m => m.month),
    datasets: [
      {
        label: '订单数',
        data: monthlyEarnings.map(m => m.orders),
        backgroundColor: '#ff6b35',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
        </aside>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">收益统计</h2>
              <p className="text-gray-500">查看您的收益数据</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      timeRange === range
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range === 'week' ? '本周' : range === 'month' ? '本月' : '本年'}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                导出报表
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总收益</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">¥{totalEarnings.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% 较上月</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">订单总数</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+8.3% 较上月</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">作品数量</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalAssets}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-3">共 {creatorAssets.filter(a => a.status === 'approved').length} 个已上架</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">平均收益/作品</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">¥{averageEarning.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+5.2% 较上月</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">收益趋势</h3>
              <div className="h-64">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">订单趋势</h3>
              <div className="h-64">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">热门作品排行</h3>
            <div className="space-y-4">
              {topAssets.map((asset, index) => (
                <div key={asset.title} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-accent-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{asset.title}</p>
                    <p className="text-sm text-gray-500">{asset.downloads} 次下载</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">¥{asset.earnings.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">收益</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
