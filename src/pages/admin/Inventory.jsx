import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Package, Loader2, TrendingDown, Search, RefreshCw } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { productAPI } from '../../services/api'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const AdminInventory = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingProduct, setUpdatingProduct] = useState(null)
  const [stats, setStats] = useState({
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const data = await productAPI.getAll()
      setProducts(data || [])

      // Calculate stats
      const lowStock = (data || []).filter((p) => p.stock < 10 && p.stock > 0).length
      const outOfStock = (data || []).filter((p) => p.stock === 0).length
      const totalValue = (data || []).reduce((sum, p) => sum + (p.price * p.stock || 0), 0)

      setStats({
        lowStock,
        outOfStock,
        totalValue: Math.round(totalValue),
      })
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products
    .filter((p) => p.stock < 20) // Only show low stock items
    .filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.stock - b.stock) // Sort by stock ascending

  const handleRestock = async (productId, currentStock) => {
    const newStock = prompt('Enter new stock quantity:', currentStock.toString())
    if (newStock === null) return

    setUpdatingProduct(productId)
    try {
      await productAPI.update(productId, { stock: parseInt(newStock) })
      toast.success('Stock updated successfully!')
      fetchInventory()
    } catch (error) {
      console.error('Failed to update stock:', error)
      toast.error('Failed to update stock')
    } finally {
      setUpdatingProduct(null)
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: 'text-red-600' }
    if (stock < 5) return { label: 'Critical', color: 'bg-red-100 text-red-800', icon: 'text-red-600' }
    if (stock < 10) return { label: 'Low', color: 'bg-yellow-100 text-yellow-800', icon: 'text-yellow-600' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: 'text-green-600' }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 font-display">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600 mt-2">Track and manage product stock levels</p>
          </div>
          <button
            onClick={fetchInventory}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Low Stock Items</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-100 bg-yellow-50 p-3 rounded-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-100 bg-red-50 p-3 rounded-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Inventory Value</p>
                <p className="text-3xl font-bold text-primary-600">
                  ₹{(stats.totalValue / 1000).toFixed(1)}K
                </p>
              </div>
              <Package className="w-12 h-12 text-primary-100 bg-primary-50 p-3 rounded-lg" />
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products with low stock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Inventory Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No low stock items found</p>
            <p className="text-sm text-gray-500">All products are well stocked!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Current Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Unit Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product.stock)
                    const totalValue = product.price * product.stock
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <p className="font-medium text-gray-900 max-w-xs line-clamp-2">
                              {product.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-lg font-bold text-gray-900">{product.stock}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} flex w-fit`}>
                            <span className={`w-2 h-2 rounded-full ${status.icon} mr-2`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ₹{totalValue?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRestock(product.id, product.stock)}
                            disabled={updatingProduct === product.id}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {updatingProduct === product.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <RefreshCw size={16} />
                            )}
                            Restock
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminInventory
