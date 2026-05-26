import { useState, useEffect } from 'react'
import { Mail, Trash2, Search, Loader2, BarChart3, Eye, MessageSquare, Reply } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../layouts/AdminLayout'
import { inquiryAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, read, unread
  const [stats, setStats] = useState({
    totalInquiries: 0,
    unreadInquiries: 0,
    thisMonth: 0,
  })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selectedInquiry, setSelectedInquiry] = useState(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const data = await inquiryAPI.getAll()
      
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const unreadCount = (data || []).filter(inq => !inq.is_read).length
      const thisMonthCount = (data || []).filter((inq) => 
        new Date(inq.created_at) >= thisMonth
      ).length

      setInquiries(data || [])
      setStats({
        totalInquiries: (data || []).length,
        unreadInquiries: unreadCount,
        thisMonth: thisMonthCount,
      })
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
      toast.error('Failed to load contact inquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (inquiry) => {
    try {
      if (!inquiry.is_read) {
        await inquiryAPI.markAsRead(inquiry.id)
        setInquiries(inquiries.map(inq => 
          inq.id === inquiry.id ? { ...inq, is_read: true } : inq
        ))
        setStats({
          ...stats,
          unreadInquiries: Math.max(0, stats.unreadInquiries - 1),
        })
      }
      setSelectedInquiry(inquiry)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await inquiryAPI.delete(id)
      setInquiries(inquiries.filter(inq => inq.id !== id))
      setDeleteConfirm(null)
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null)
      }
      setStats({
        ...stats,
        totalInquiries: stats.totalInquiries - 1,
      })
    } catch (error) {
      console.error('Failed to delete inquiry:', error)
    }
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterStatus === 'unread') return matchesSearch && !inq.is_read
    if (filterStatus === 'read') return matchesSearch && inq.is_read
    return matchesSearch
  })

  return (
    <AdminLayout>
      <div className="space-y-6 font-display">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Inquiries</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries and messages</p>
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
                <p className="text-gray-600 text-sm mb-2">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalInquiries}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-100 bg-blue-50 p-3 rounded-lg" />
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
                <p className="text-gray-600 text-sm mb-2">Unread</p>
                <p className="text-3xl font-bold text-red-600">{stats.unreadInquiries}</p>
              </div>
              <Eye className="w-12 h-12 text-red-100 bg-red-50 p-3 rounded-lg" />
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
              <BarChart3 className="w-12 h-12 text-purple-100 bg-purple-50 p-3 rounded-lg" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        {/* Inquiries List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary-600" size={32} />
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No inquiries found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <motion.div
                    key={inquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleMarkAsRead(inquiry)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedInquiry?.id === inquiry.id
                        ? 'border-primary-600 bg-primary-50'
                        : inquiry.is_read
                        ? 'border-gray-200'
                        : 'border-red-600 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{inquiry.name}</h3>
                          {!inquiry.is_read && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{inquiry.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Detail View */}
          <AnimatePresence>
            {selectedInquiry && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Inquiry Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
                    <p className="text-gray-900">{selectedInquiry.name}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                    <p className="text-gray-900 break-all">{selectedInquiry.email}</p>
                  </div>

                  {selectedInquiry.phone && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                      <p className="text-gray-900">{selectedInquiry.phone}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                    <p className="text-gray-900">{selectedInquiry.subject}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap break-words">{selectedInquiry.message}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                    <p className="text-gray-900">
                      {new Date(selectedInquiry.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedInquiry.is_read
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedInquiry.is_read ? 'Read' : 'Unread'}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        const mailtoLink = `mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}&body=${encodeURIComponent(`Hi ${selectedInquiry.name},\n\nThank you for reaching out to us.\n\n---\nOriginal Message:\n${selectedInquiry.message}`)}`
                        window.location.href = mailtoLink
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Reply size={18} />
                      Reply
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(selectedInquiry.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                Are you sure you want to delete this inquiry? This action cannot be undone.
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

export default AdminInquiries
