import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-bold">IconMarket</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              专业的图标图片素材市场，为设计师和企业提供高质量可商用视觉素材。
            </p>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>contact@iconmarket.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>400-123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>北京市朝阳区创意设计中心</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">首页</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">分类浏览</Link></li>
              <li><Link to="/creator/dashboard" className="hover:text-white transition-colors">创作者中心</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">我的订单</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">帮助支持</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
              <li><a href="#" className="hover:text-white transition-colors">授权说明</a></li>
              <li><a href="#" className="hover:text-white transition-colors">退款政策</a></li>
              <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 IconMarket. All rights reserved.</p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
            <a href="#" className="hover:text-white transition-colors">Cookie设置</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
