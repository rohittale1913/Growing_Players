import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../layouts/MainLayout'
import { SkeletonLoader, EmptyState } from '../components/Loaders'
import { categoryAPI } from '../services/api'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getAll()
        setCategories(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  return (
    <Layout>
      <div className='font-display responsive'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <section className="font-display py-10 px-4 bg-gradient-to-r from-amber-600 to-rose-500">
            <div className="max-w-6xl mx-auto text-center text-white">
              <h1 className="text-5xl font-bold mb-2">Product Categories</h1>
              <p className=" text-amber-100 mb-6">
                Browse our comprehensive collection of premium cake ingredients and decorations <br /> organized by category.
              </p>
            </div>
          </section>
          {/* <h1 className="heading-h1 text-gray-900 mb-2">Product Categories</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse our comprehensive collection of premium cake ingredients and decorations organized by category
            </p> */}
        </motion.div>

      </div>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="font-display container-responsive">
          {/* Header */}


          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <EmptyState
              title="No Categories Available"
              description="Categories will appear here soon"
            />
          ) : (
            /* Categories Grid */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group h-full"
                >
                  <Link
                    to={`/products?category=${category.id}`}
                    className="block h-full"
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                      {/* Image Section */}
                      {category.image ? (
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-primary-500 via-accent-400 to-rose-500 flex items-center justify-center">
                          <FolderOpen className="w-16 h-16 text-white/40" />
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
                          {category.description || 'Explore this collection'}
                        </p>

                        {/* CTA Button */}
                        <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                          <span>Browse Products</span>
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Help Section */}
          {!loading && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-20 bg-gradient-to-r from-primary-50 to-rose-50 rounded-xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-gray-600 mb-6">
                Use our search feature or contact us for personalized recommendations
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/products"
                  className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Products
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-white border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Categories
