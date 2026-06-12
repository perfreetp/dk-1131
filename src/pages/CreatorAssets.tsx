import { useState } from 'react';
import { 
  Upload, Plus, X, Eye, Edit2, Trash2, Clock, CheckCircle, 
  XCircle, Image, FileText, Tag, DollarSign, FileCheck
} from 'lucide-react';
import { useAssetStore } from '@/store/assetStore';
import { categories, styles, formats, industries } from '@/data/mockData';
import { Asset } from '@/types';

export function CreatorAssets() {
  const { assets, addAsset } = useAssetStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
    style: styles[0],
    format: formats[0],
    color: '彩色',
    industry: industries[0],
    price: '',
    license: '',
  });

  const myAssets = assets.filter(a => a.authorId === '1');

  const handleSubmit = () => {
    if (!formData.title || !formData.price) {
      alert('请填写标题和价格');
      return;
    }

    const newAsset: Asset = {
      id: Date.now().toString(),
      creator_id: '1',
      title: formData.title,
      description: formData.description || '暂无描述',
      category: formData.category,
      style: formData.style,
      format: formData.format,
      color: formData.color,
      industry: formData.industry,
      price: parseFloat(formData.price),
      license_info: formData.license || '个人商业授权',
      license: formData.license || '个人商业授权',
      downloads: 0,
      likes: 0,
      authorId: '1',
      authorName: '创作者',
      thumbnail: `https://picsum.photos/seed/${Date.now()}/400/400`,
      preview_url: `https://picsum.photos/seed/${Date.now()}/400/400`,
      file_url: `https://picsum.photos/seed/${Date.now()}/400/400`,
      images: [],
      status: 'pending',
      created_at: new Date().toISOString(),
      createdAt: new Date().toLocaleString('zh-CN'),
      updated_at: new Date().toISOString(),
    };

    addAsset(newAsset);
    setShowUploadModal(false);
    setFormData({
      title: '',
      description: '',
      category: categories[0],
      style: styles[0],
      format: formats[0],
      color: '彩色',
      industry: industries[0],
      price: '',
      license: '',
    });
  };

  const handleCancel = () => {
    setShowUploadModal(false);
    setFormData({
      title: '',
      description: '',
      category: categories[0],
      style: styles[0],
      format: formats[0],
      color: '彩色',
      industry: industries[0],
      price: '',
      license: '',
    });
  };

  const statusConfig = {
    pending: { label: '审核中', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    approved: { label: '已通过', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    rejected: { label: '已拒绝', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">素材管理</h1>
            <p className="text-gray-500 mt-1">管理您上传的素材内容</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            上传新素材
          </button>
        </div>

        {myAssets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">暂无素材</h2>
            <p className="text-gray-500 mb-6">上传您的第一个素材开始创作之旅</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              立即上传
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative">
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.title}
                    className="w-full h-48 object-cover"
                  />
                  {(() => {
                    const StatusIcon = statusConfig[asset.status].icon;
                    return (
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig[asset.status].bg} ${statusConfig[asset.status].color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[asset.status].label}
                      </span>
                    );
                  })()}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{asset.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {asset.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {asset.format}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ¥{asset.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{asset.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{asset.downloads} 次下载</span>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">上传新素材</h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">素材标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="输入素材标题"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="描述您的素材"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">风格</label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {styles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">格式</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {formats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">行业</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">价格 (元) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="输入价格"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">授权说明</label>
                <textarea
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  placeholder="描述授权范围和使用限制"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileCheck className="w-5 h-5" />
                提交审核
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}