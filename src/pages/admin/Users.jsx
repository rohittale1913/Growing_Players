import { useState, useEffect } from 'react'
import { Mail, Users, Search, Loader2, BarChart3 } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newThisMonth: 0,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Fetch all orders to get user data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, user_id, created_at, status')
      
      if (ordersError) throw ordersError

      // Get unique users and their order info
      const userMap = {}
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      ;(orders || []).forEach((order) => {
        if (!userMap[order.user_id]) {
          const orderDate = new Date(order.created_at)
          userMap[order.user_id] = {
            id: order.user_id,
            user_id: order.user_id,
            email: order.user_id, // Will show user ID as placeholder
            status: order.status,
            created_at: order.created_at,
            isNew: orderDate >= thisMonth,
            orderCount: 1,
          }
        } else {
          userMap[order.user_id].orderCount += 1
        }
      })

      const userList = Object.values(userMap)
      const newThisMonth = userList.filter(u => u.isNew).length

      setUsers(userList)
      setStats({
        totalUsers: userList.length,
        activeUsers: userList.filter(u => u.status === 'completed').length,
        newThisMonth,
      })
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6 font-display">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage customer accounts and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-primary-100 bg-primary-50 p-3 rounded-lg" />
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-100 bg-green-50 p-3 rounded-lg" />
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">New This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.newThisMonth}</p>
              </div>
              <Users className="w-12 h-12 text-blue-100 bg-blue-50 p-3 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">First Order</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100"
                    >
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{user.user_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.orderCount || 0} orders
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
