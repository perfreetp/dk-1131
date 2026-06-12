import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Upload, Edit2, Trash2, Eye, Plus } from 'lucide-react';
import { useAssetStore } from '@/store/assetStore';
import { Asset } from '@/types';
import { mockUsers } from '@/data/mockData';

const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'assets', label: '素材管理', icon: Package },
  { id: 'orders', label: '订单管理', icon: ShoppingBag },
  { id: 'earnings', label: '收益统计', icon: DollarSign },
];

export function CreatorAssets() {
  const [activeNav, setActiveNav] = useState('assets');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '图标',
    style: '扁平化',
    format: 'SVG',
    color: '多色',
    industry: '商务',
    price: '',
    license_info: '',
  });

  const { assets, addAsset } = useAssetStore();
  const creatorAssets = assets.filter(a => a.creator_id === '1');

  const filteredAssets = filterStatus === 'all' 
    ? creatorAssets 
    : creatorAssets.filter(a => a.status === filterStatus);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.price) {
      alert('请填写标题和价格');
      return;
    }

    const newAsset: Asset = {
      id: `new-${Date.now()}`,
      creator_id: '1',
      title: uploadForm.title,
      description: uploadForm.description || '暂无描述',
      category: uploadForm.category,
      style: uploadForm.style,
      format: uploadForm.format,
      color: uploadForm.color,
      industry: uploadForm.industry,
      price: parseFloat(uploadForm.price),
      license_info: uploadForm.license_info || '可商用授权',
      preview_url: `https://neeko-copilot.bytedance.net/api/text_to_image?prompt=${encodeURIComponent(uploadForm.title)}&image_size=square`,
      file_url: '#',
      downloads: 0,
      likes: 0,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creator: mockUsers[0],
    };

    addAsset(newAsset);
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      description: '',
      category: '图标',
      style: '扁平化',
      format: 'SVG',
      color: '多色',
      industry: '商务',
      price: '',
      license_info: '',
    });
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      description: '',
      category: '图标',
      style: '扁平化',
      format: 'SVG',
      color: '多色',
      industry: '商务',
      price: '',
      license_info: '',
    });
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
              <h2 className="text-2xl font-bold text-gray-900">素材管理</h2>
              <p className="text-gray-500">管理和上传您的设计素材</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              上传素材
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: '全部' },
              { id: 'approved', label: '已通过' },
              { id: 'pending', label: '审核中' },
              { id: 'rejected', label: '已拒绝' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === filter.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={asset.preview_url}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/90 text-gray-700 py-2 rounded-lg hover:bg-white transition-colors">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">预览</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/90 text-gray-700 py-2 rounded-lg hover:bg-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">编辑</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full ${
                    asset.status === 'approved' ? 'bg-green-500 text-white' :
                    asset.status === 'pending' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {asset.status === 'approved' ? '已通过' :
                     asset.status === 'pending' ? '审核中' : '已拒绝'}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{asset.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{asset.format}</span>
                      <span>·</span>
                      <span>{asset.downloads} 下载</span>
                    </div>
                    <span className="text-accent-500 font-bold">¥{asset.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">暂无素材</p>
            </div>
          )}
        </main>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">上传素材</h3>
              <button
                onClick={handleCancelUpload}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">素材标题 *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="输入素材标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="描述您的素材"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  >
                    <option>图标</option>
                    <option>插图</option>
                    <option>图片</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">风格</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={uploadForm.style}
                    onChange={(e) => setUploadForm({ ...uploadForm, style: e.target.value })}
                  >
                    <option>扁平化</option>
                    <option>线性</option>
                    <option>手绘</option>
                    <option>卡通</option>
                    <option>写实</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">格式</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={uploadForm.format}
                    onChange={(e) => setUploadForm({ ...uploadForm, format: e.target.value })}
                  >
                    <option>SVG</option>
                    <option>PNG</option>
                    <option>AI</option>
                    <option>JPG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">价格 *</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={uploadForm.price}
                    onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                    placeholder="¥"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={uploadForm.color}
                    onChange={(e) => setUploadForm({ ...uploadForm, color: e.target.value })}
                  >
                    <option>多色</option>
                    <option>彩色</option>
                    <option>单色</option>
                    <option>蓝色</option>
                    <option>绿色</option>
                    <option>橙色</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">行业</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={uploadForm.industry}
                    onChange={(e) => setUploadForm({ ...uploadForm, industry: e.target.value })}
                  >
                    <option>商务</option>
                    <option>科技</option>
                    <option>电商</option>
                    <option>金融</option>
                    <option>医疗</option>
                    <option>教育</option>
                    <option>餐饮</option>
                    <option>社交媒体</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">授权信息</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  value={uploadForm.license_info}
                  onChange={(e) => setUploadForm({ ...uploadForm, license_info: e.target.value })}
                  placeholder="描述授权范围"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">上传文件</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">点击或拖拽上传文件</p>
                  <p className="text-sm text-gray-400 mt-1">支持 SVG, PNG, AI, JPG 格式</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCancelUpload}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  提交审核
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}