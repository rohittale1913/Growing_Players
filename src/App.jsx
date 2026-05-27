import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Categories from './pages/Categories'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Checkout from './pages/Checkout'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import ShippingPolicy from './pages/ShippingPolicy'
import ReturnPolicy from './pages/ReturnPolicy'
import FAQ from './pages/FAQ'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminCategories from './pages/admin/Categories'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import AdminInventory from './pages/admin/Inventory'
import AdminNewsletter from './pages/admin/Newsletter'
import AdminInquiries from './pages/admin/Inquiries'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Info Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<AdminProducts />} />} />
        <Route path="/admin/categories" element={<ProtectedRoute element={<AdminCategories />} />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<AdminOrders />} />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsers />} />} />
        <Route path="/admin/inventory" element={<ProtectedRoute element={<AdminInventory />} />} />
        <Route path="/admin/newsletter" element={<ProtectedRoute element={<AdminNewsletter />} />} />
        <Route path="/admin/inquiries" element={<ProtectedRoute element={<AdminInquiries />} />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
