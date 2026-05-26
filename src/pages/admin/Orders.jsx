import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, X, Loader2, Package, CheckCircle, Clock, Truck, Home, XCircle } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { orderAPI } from '../../services/api'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all') // Filter by status

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      console.log('📦 Admin: Fetching all orders from database...')
      
      // Fetch all orders from database
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('✅ Admin orders fetched:', data?.length || 0, 'orders')
      console.log('📋 Orders data:', data)
      console.log('❌ Fetch error:', error)
      
      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = (order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id?.toString().includes(searchQuery) ||
                          order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  
  // Count orders by status
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  const statusIcons = {
    pending: Clock,
    processing: Loader2,
    shipped: Truck,
    delivered: Home,
    cancelled: XCircle,
    all: Package,
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      toast.success('Order status updated!')
      fetchOrders()
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error('Failed to update order:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <AdminLayout>
      <div className="space-y-6 font-display">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders</p>
        </motion.div>

        {/* Status Filter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
            const Icon = statusIcons[status]
            const count = statusCounts[status]
            const isActive = filterStatus === status
            const bgColor = {
              all: 'bg-gray-100 hover:bg-gray-200',
              pending: 'bg-yellow-100 hover:bg-yellow-200',
              processing: 'bg-blue-100 hover:bg-blue-200',
              shipped: 'bg-purple-100 hover:bg-purple-200',
              delivered: 'bg-green-100 hover:bg-green-200',
              cancelled: 'bg-red-100 hover:bg-red-200',
            }
            const textColor = {
              all: 'text-gray-700',
              pending: 'text-yellow-700',
              processing: 'text-blue-700',
              shipped: 'text-purple-700',
              delivered: 'text-green-700',
              cancelled: 'text-red-700',
            }

            return (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`p-4 rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? `${bgColor[status]} ring-2 ring-offset-2 ring-primary-600 font-bold` 
                    : bgColor[status]
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${textColor[status]}`} />
                <p className={`text-sm font-semibold ${textColor[status]} capitalize`}>
                  {status}
                </p>
                <p className={`text-lg font-bold ${textColor[status]}`}>
                  {count}
                </p>
              </motion.button>
            )
          })}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by order ID, customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => fetchOrders()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No orders found</p>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">
                        #{order.order_number || order.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ₹{(order.total_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        {/* Quick Status Update Dropdown */}
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updatingStatus}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer transition-all ${getStatusColor(order.status)} disabled:opacity-50`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowDetailModal(true)
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Order Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.order_number || selectedOrder.id}
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="font-semibold text-primary-600 text-lg">
                        ₹{(selectedOrder.total_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">₹{(selectedOrder.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium text-gray-900">₹{(selectedOrder.shipping || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (18%):</span>
                        <span className="font-medium text-gray-900">₹{(selectedOrder.tax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-primary-600">₹{(selectedOrder.total_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="border-t border-gray-200 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Order Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(selectedOrder.id, status)}
                          disabled={updatingStatus}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            selectedOrder.status === status
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {selectedOrder.shipping_address && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {(() => {
                          try {
                            const addr = typeof selectedOrder.shipping_address === 'string' 
                              ? JSON.parse(selectedOrder.shipping_address) 
                              : selectedOrder.shipping_address
                            return (
                              <p className="text-sm text-gray-700">
                                {addr.fullName}<br />
                                {addr.address}<br />
                                {addr.city}, {addr.state} {addr.zipCode}<br />
                                {addr.phone}
                              </p>
                            )
                          } catch (e) {
                            return <p className="text-sm text-gray-700">Invalid address format</p>
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  {selectedOrder.items && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                      <div className="space-y-3">
                        {(() => {
                          try {
                            const items = typeof selectedOrder.items === 'string' 
                              ? JSON.parse(selectedOrder.items) 
                              : (selectedOrder.items || [])
                            return Array.isArray(items) ? items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  ₹{((item.price || 0) * (item.quantity || 1))?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                              </div>
                            )) : null
                          } catch (e) {
                            return <p className="text-sm text-gray-600">Error parsing items</p>
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
