import { useState } from 'react'
import Logo from "../assets/logoo.png";
import {
  Menu,
  X,
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronDown,
  Mail,
  MessageSquare,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: FolderOpen, label: 'Categories', href: '/admin/categories' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: AlertTriangle, label: 'Inventory', href: '/admin/inventory' },
    { icon: Mail, label: 'Newsletter', href: '/admin/newsletter' },
    { icon: MessageSquare, label: 'Inquiries', href: '/admin/inquiries' },
  ]

  const isActive = (href) => location.pathname === href

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 font-display">
      {/* Sidebar */}
      <aside
        className="w-64 bg-white fixed h-screen left-0 top-0 z-40 overflow-y-auto"
        style={{ display: sidebarOpen ? 'block' : 'none' }}
      >
        {/* <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-rose-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">GP</span>
            </div>
            Admin
          </h1>
        </div> */}

        <Link
                    to="/"
                    className="text-4xl font-bold font-display text-gradient flex items-center gap-2 pt-4">
                    <div className="w-14 h-12 bg-gradient-to-r rounded-full flex items-center justify-center ">
                      {/* <span className="text-white font-bold">GP</span> */}
                      <img
                        src={Logo}
                        alt="Premium cake ingredients"
                        className="w-14 h-12 rounded-full bg-white"
                      />
                    </div>
                    <div className="font-display heading-h4">
                      Growing Players
                    </div>
                  </Link>

        {/* Navigation */}
        <nav className="mt-6 space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  active
                    ? 'bg-primary-600 text-white shadow-lg'
                    : ' hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Settings */}
        <div className="mt-auto p-4  border-gray-800">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <span className="font-medium text-gray-700">Admin</span>
                  <ChevronDown size={18} />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
