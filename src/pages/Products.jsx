import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import ProductCard from '../components/ProductCard'
import { SkeletonLoader, EmptyState } from '../components/Loaders'
import { productAPI } from '../services/api'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewType, setViewType] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll()
        setProducts(data || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let result = products

    // Filter by search
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Filter by price
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    setFilteredProducts(result)
  }, [searchQuery, selectedCategory, priceRange, products])

  return (
    <Layout>
      <div className="font-display responsive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <section className="font-display py-10 px-4 bg-gradient-to-r from-amber-600 to-rose-500">
            <div className="max-w-6xl mx-auto text-center text-white">
              <h1 className="text-5xl font-bold mb-2">Our Products</h1>
              <p className=" text-amber-100 mb-6">
                Explore our complete collection of premium cake ingredients and decorations.
              </p>
            </div>
          </section>
          {/* <h1 className="heading-h1 text-gray-900 mb-4 ">Our Products</h1>
            <p className="text-gray-600 text-lg">
              Explore our complete collection of premium cake ingredients and decorations
            </p> */}
        </motion.div>
      </div>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="font-display  container-responsive">
          {/* Header */}


          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Filter size={20} />
                    Filters
                  </h3>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Crushes">Crushes</option>
                    <option value="Jellies">Jellies</option>
                    <option value="Toppings">Toppings</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setPriceRange([0, 1000])
                  }}
                  className="w-full btn-secondary"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3"
            >
              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} products
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewType === 'grid'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 rounded-lg transition-colors ${viewType === 'list'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>

              {loading ? (
                <SkeletonLoader count={8} />
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  title="No products found"
                  description="Try adjusting your filters or search query"
                  icon={Search}
                />
              ) : (
                <div
                  className={
                    viewType === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-6'
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Products
