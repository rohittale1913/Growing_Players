import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../layouts/MainLayout'
import { useCartStore } from '../store'
import { formatPrice } from '../utils/helpers'
import { EmptyState } from '../components/Loaders'

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  return (
    <Layout>
      <div className="font-display min-h-screen bg-gray-50 py-12">
        <div className="container-responsive">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-h1 text-gray-900 mb-12"
          >
            Shopping Cart
          </motion.h1>

          {items.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <EmptyState
                title="Your cart is empty"
                description="Add some amazing ingredients to get started !"
                icon={ShoppingCart}
              />
              <div className="text-center mt-8">
                <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                  Continue Shopping
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:col-span-2"
              >
                <div className="card p-6 space-y-4">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                        <p className="text-lg font-bold text-primary-600 mt-2">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(0, item.quantity - 1))
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-24">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2">
                    ← Continue Shopping
                  </Link>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-1"
              >
                <div className="card-glass p-6 space-y-4 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(total)}</span>
                  </div>

                  {subtotal < 500 && (
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      💡 Add {formatPrice(500 - subtotal)} more to get FREE shipping!
                    </p>
                  )}

                  <Link to="/checkout" className="w-full btn-primary text-lg block text-center">
                    Proceed to Checkout
                  </Link>

                  <button
                    onClick={clearCart}
                    className="w-full btn-ghost text-red-600 hover:bg-red-50"
                  >
                    Clear Cart
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Cart
