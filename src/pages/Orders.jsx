import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Calendar, DollarSign, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'
import { orderAPI } from '../services/api'
import { EmptyState } from '../components/Loaders'
import toast from 'react-hot-toast'

const Orders = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          navigate('/login')
          return
        }

        setUser(session.user)

        // Fetch user's orders
        const ordersData = await orderAPI.getAll(session.user.id)
        setOrders(ordersData || [])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndOrders()
  }, [navigate])

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="heading-h2 text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Please log in to view your orders</p>
          </div>
        </div>
      </Layout>
    )
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
            <div className="mb-8">
              <h1 className="heading-h2 text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track your orders and manage returns</p>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No Orders Yet"
                description="You haven't placed any orders yet. Start shopping now!"
                action={
                  <Link to="/products" className="btn-primary">
                    Continue Shopping
                  </Link>
                }
              />
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      {/* Order ID */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Order ID</p>
                        <p className="font-semibold text-gray-900">#{order.id?.slice(0, 8).toUpperCase()}</p>
                      </div>

                      {/* Date */}
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Date</p>
                          <p className="text-gray-700">{formatDate(order.created_at)}</p>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex items-start gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Total</p>
                          <p className="text-lg font-bold text-primary-600">
                            ₹{order.total?.toLocaleString('en-IN') || '0'}
                          </p>
                        </div>
                      </div>

                      {/* Status & Action */}
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          View Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase mb-2">Items</p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                              {item.name} x {item.quantity}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default Orders
