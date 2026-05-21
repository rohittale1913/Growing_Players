import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { formatPrice, calculateDiscount } from '../utils/helpers'
import { useWishlistStore, useCartStore } from '../store'

const ProductCard = ({ product, showQuickView }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isInWishlist, addItem, removeItem } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const inWishlist = isInWishlist(product.id)

  const discount = product.original_price
    ? calculateDiscount(product.original_price, product.price)
    : 0

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}

        {/* Overlay Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
        >
          <button
            onClick={() =>
              inWishlist
                ? removeItem(product.id)
                : addItem(product)
            }
            className={`p-3 rounded-full transition-all ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white text-gray-800 hover:bg-rose-500 hover:text-white'
            }`}
          >
            <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => showQuickView && showQuickView(product)}
            className="p-3 bg-white text-gray-800 rounded-full hover:bg-primary-500 hover:text-white transition-all"
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={() => {
              addToCart({ ...product, quantity: 1 })
              toast.success('Added to cart!')
            }}
            className="p-3 bg-white text-gray-800 rounded-full hover:bg-primary-500 hover:text-white transition-all"
          >
            <ShoppingCart size={20} />
          </button>
        </motion.div>
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

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews || 0})</span>
        </div>

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
        <p className="text-xs mt-2 text-green-600 font-medium">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        {/* Add to Cart Button */}
        <motion.button
          onClick={() => {
            if (product.stock > 0) {
              addToCart({ ...product, quantity: 1 })
              toast.success('Added to cart!')
            } else {
              toast.error('Out of stock')
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={product.stock === 0}
          className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ProductCard
