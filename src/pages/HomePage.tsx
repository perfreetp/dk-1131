import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star, Sparkles, Download, Heart } from 'lucide-react';
import { AssetCard } from '@/components/AssetCard';
import { mockAssets, categories, mockUsers } from '@/data/mockData';

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: '发现优质可商用素材',
      description: '海量图标、插图、图片素材，助力您的设计创作',
      cta: '立即探索',
      gradient: 'from-primary-600 to-blue-500',
    },
    {
      title: '成为创作者',
      description: '上传您的作品，开启创作者之旅',
      cta: '立即加入',
      gradient: 'from-accent-500 to-orange-500',
    },
    {
      title: '限时特惠',
      description: '精选素材低至5折起',
      cta: '查看优惠',
      gradient: 'from-purple-600 to-pink-500',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const featuredAssets = mockAssets.slice(0, 6);
  const trendingAssets = [...mockAssets].sort((a, b) => b.downloads - a.downloads).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`bg-gradient-to-br ${slide.gradient} h-full`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{slides[currentSlide].title}</h1>
            <p className="text-xl text-white/80 mb-8">{slides[currentSlide].description}</p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              {slides[currentSlide].cta}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">热门分类</h2>
            <p className="text-gray-600">探索不同类别的优质素材</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.filter(c => c !== '全部').map((category) => (
              <Link
                key={category}
                to={`/categories?category=${category}`}
                className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-700">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">精选素材</h2>
              <p className="text-gray-600">每周精选优质素材推荐</p>
            </div>
            <Link
              to="/categories"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
            >
              查看更多
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-accent-500" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">热门下载</h2>
                <p className="text-gray-600">最受欢迎的素材</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingAssets.map((asset, index) => (
              <div key={asset.id} className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-accent-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{asset.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {asset.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {asset.likes}
                    </span>
                  </div>
                </div>
                <span className="text-accent-500 font-bold">¥{asset.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">推荐创作者</h2>
            <p className="text-gray-600">关注优秀创作者，获取最新作品动态</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockUsers.filter(u => u.is_creator).map((creator) => (
              <div key={creator.id} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <img
                  src={creator.avatar_url}
                  alt={creator.username}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="font-semibold text-gray-900 mb-1">{creator.username}</h3>
                <p className="text-sm text-gray-500 mb-4">创作者</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span>{mockAssets.filter(a => a.creator_id === creator.id).length} 作品</span>
                  <span>{mockAssets.filter(a => a.creator_id === creator.id).reduce((sum, a) => sum + a.downloads, 0)} 下载</span>
                </div>
                <button className="mt-4 w-full py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors flex items-center justify-center gap-1">
                  <Star className="w-4 h-4" />
                  关注
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-600 to-accent-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">开始您的创意之旅</h2>
          <p className="text-white/80 mb-8">加入超过100,000名设计师的行列，发现无限创意可能</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              免费注册
            </Link>
            <Link
              to="/creator/dashboard"
              className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              成为创作者
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
