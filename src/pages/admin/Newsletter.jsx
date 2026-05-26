import { useState, useEffect } from 'react'
import { Mail, Trash2, Search, Loader2, BarChart3, Download, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminLayout from '../../layouts/AdminLayout'
import { newsletterAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminNewsletter = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    thisMonth: 0,
  })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await newsletterAPI.getAll()
      
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const thisMonthCount = (data || []).filter((sub) => 
        new Date(sub.subscribed_at) >= thisMonth
      ).length

      setSubscriptions(data || [])
      setStats({
        totalSubscriptions: (data || []).length,
        activeSubscriptions: (data || []).filter(s => s.is_active).length,
        thisMonth: thisMonthCount,
      })
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
      toast.error('Failed to load newsletter subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await newsletterAPI.delete(id)
      setSubscriptions(subscriptions.filter(sub => sub.id !== id))
      setDeleteConfirm(null)
      setStats({
        ...stats,
        totalSubscriptions: stats.totalSubscriptions - 1,
      })
    } catch (error) {
      console.error('Failed to delete subscription:', error)
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const exportToCSV = () => {
    const headers = ['Email', 'Subscribed Date', 'Status']
    const rows = subscriptions.map(sub => [
      sub.email,
      new Date(sub.subscribed_at).toLocaleDateString(),
      sub.is_active ? 'Active' : 'Inactive'
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter_subscriptions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout>
      <div className="space-y-6 font-display">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscriptions</h1>
            <p className="text-gray-600 mt-2">Manage customer newsletter subscriptions</p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={subscriptions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSubscriptions}</p>
              </div>
              <Mail className="w-12 h-12 text-blue-100 bg-blue-50 p-3 rounded-lg" />
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
                <p className="text-gray-600 text-sm mb-2">Active</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-100 bg-green-50 p-3 rounded-lg" />
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
                <p className="text-gray-600 text-sm mb-2">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
              <Filter className="w-12 h-12 text-purple-100 bg-purple-50 p-3 rounded-lg" />
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Subscriptions List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No newsletter subscriptions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subscribed Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubscriptions.map((sub) => (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{sub.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(sub.subscribed_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sub.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sub.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setDeleteConfirm(sub.id)}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this subscription? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminNewsletter
