import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { SearchPage } from '@/pages/SearchPage';
import { AssetDetailPage } from '@/pages/AssetDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { CreatorDashboard } from '@/pages/CreatorDashboard';
import { CreatorAssets } from '@/pages/CreatorAssets';
import { CreatorOrders } from '@/pages/CreatorOrders';
import { CreatorEarnings } from '@/pages/CreatorEarnings';
import { OrdersPage } from '@/pages/OrdersPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/assets/:id" element={<AssetDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/creator/assets" element={<CreatorAssets />} />
            <Route path="/creator/orders" element={<CreatorOrders />} />
            <Route path="/creator/earnings" element={<CreatorEarnings />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;