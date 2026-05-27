import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Heart, ShoppingCart, User, Search, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store'
import Logo from "../assets/logoo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container-responsive">
        <div className="font-display flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-4xl font-bold font-display text-gradient flex items-center gap-2">
            <div className="w-18 h-14 bg-gradient-to-r rounded-full flex items-center justify-center ">
              {/* <span className="text-white font-bold">GP</span> */}
              <img
                src={Logo}
                alt="Premium cake ingredients"
                className="w-18 h-14 rounded-full bg-white"
              />
            </div>
            <div className="font-display heading-h3">
              Growing Player's
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-black hover:text-primary-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <Link
              to="/wishlist"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Heart size={20} />
            </Link>
            <Link
              to="/cart"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </Link>
            <Link
              to="/orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
              title="My Orders"
            >
              <Package size={20} />
            </Link>
            <Link
              to="/profile"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
            >
              <User size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-gray-100 py-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-primary-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/orders"
              className="block px-4 py-2 text-gray-700 hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <Package size={18} />
              My Orders
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <User size={18} />
              Profile
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
