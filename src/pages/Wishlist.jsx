import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { useWishlistStore, useCartStore } from '../store'
import { EmptyState } from '../components/Loaders'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const { items, removeItem } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 })
    toast.success('Added to cart!')
  }

  const handleRemove = (productId) => {
    removeItem(productId)
    toast.success('Removed from wishlist')
  }

  return (
    <Layout>
      <div className="font-display min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="heading-h2 text-gradient">My Wishlist</h1>
              <p className="text-gray-600 mt-2">Your favorite products saved for later.</p>
            </div>

            {/* Wishlist Items */}
            {items.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Wishlist is Empty"
                description="You haven't added any products to your wishlist yet. Browse our premium collection!"
                action={
                  <Link to="/products" className="btn-primary">
                    Browse Products
                  </Link>
                }
              />
            ) : (
              <div className="space-y-4">
                {/* Items Count */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">{items.length}</span> product{items.length !== 1 ? 's' : ''} in your wishlist
                  </p>
                  <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    Continue Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.premium && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ⭐ Premium
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <Link
                          to={`/product/${product.id}`}
                          className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                        >
                          {product.category}
                        </Link>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2 hover:text-primary-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.original_price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <p className={`text-xs mt-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </p>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <motion.button
                            onClick={() => handleAddToCart(product)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={product.stock === 0}
                            className="flex items-center justify-center gap-2 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add</span>
                          </motion.button>
                          <motion.button
                            onClick={() => handleRemove(product.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 btn-secondary text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </motion.button>
                        </div>

                        {/* View Details Link */}
                        <Link
                          to={`/product/${product.id}`}
                          className="block mt-3 text-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recommended Products CTA */}
                <div className="mt-12 text-center">
                  <p className="text-gray-600 mb-4">Want to explore more?</p>
                  <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                    Browse All Products <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default Wishlist
