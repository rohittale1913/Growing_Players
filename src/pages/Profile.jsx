import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Edit2, LogOut, Loader2, AlertCircle } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          navigate('/login')
          return
        }

        setUser(session.user)
        setFormData({
          fullName: session.user.user_metadata?.full_name || '',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || '',
          address: session.user.user_metadata?.address || '',
        })
      } catch (error) {
        console.error('Failed to fetch user:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Profile updated successfully!')
      setEditing(false)
      setUser({ ...user, user_metadata: formData })
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
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
            <p className="text-gray-600">Please log in to view your profile</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="heading-h2 text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-2">Manage your account information</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                    editing
                      ? 'focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      : 'bg-gray-50 text-gray-600'
                  } disabled:cursor-not-allowed`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                    editing
                      ? 'focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      : 'bg-gray-50 text-gray-600'
                  } disabled:cursor-not-allowed`}
                  placeholder="(+91) XXXXX XXXXX"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                    editing
                      ? 'focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      : 'bg-gray-50 text-gray-600'
                  } disabled:cursor-not-allowed`}
                  placeholder="Your address"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
