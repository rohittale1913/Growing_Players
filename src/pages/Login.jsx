import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle, Loader2, ShieldAlert } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import Layout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })

      if (error) {
        setError(error.message)
        toast.error(error.message)
      }
    } catch (err) {
      setError('Failed to sign in with Google')
      console.error('Google sign in error:', err)
      toast.error('Failed to sign in with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      // DEBUG: Log detailed error info
      if (error) {
        console.log('🔴 LOGIN ERROR DETAILS:')
        console.log('Error Status:', error.status)
        console.log('Error Message:', error.message)
        console.log('Full Error Object:', JSON.stringify(error, null, 2))
        
        setError(error.message)
        toast.error(error.message)
        setLoading(false)
        return
      }

      // Update auth store with user data
      console.log('✅ Login successful, updating auth store with user:', data.user?.id)
      setUser(data.user)

      // If admin login mode, verify admin role
      if (isAdminLogin) {
        const userRole = data.user?.user_metadata?.user_role
        if (userRole !== 'admin') {
          setError('⛔ Admin access only. Your account does not have admin permissions.')
          toast.error('You do not have admin access')
          
          // Sign out the user since they don't have admin role
          await supabase.auth.signOut()
          setUser(null)
          setLoading(false)
          return
        }
        toast.success('Admin login successful!')
        navigate('/admin')
      } else {
        toast.success('Login successful!')
        // If coming from checkout, go back to checkout; otherwise home
        const referrer = sessionStorage.getItem('checkoutRedirect')
        if (referrer) {
          sessionStorage.removeItem('checkoutRedirect')
          navigate('/checkout')
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="font-display min-h-screen bg-gradient-to-br from-primary-50 via-white to-rose-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div
            className="bg-white rounded-lg shadow-lg p-8"
          >
            {/* Header */}
            <h1 className="text-center heading-h2  mb-2 text-gradient">
              {isAdminLogin ? ' Admin Login' : 'Welcome Back'}
            </h1>
            <p className="text-center text-gray-600 mb-6">
              {isAdminLogin 
                ? 'Admin access only - verify your credentials' 
                : 'Sign in to your Growing Player\'s account'}
            </p>

            {/* Admin Login Toggle */}
            <div className="mb-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdminLogin(false)
                  setError('')
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-medium ${
                  !isAdminLogin
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Regular Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdminLogin(true)
                  setError('')
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1 ${
                  isAdminLogin
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <ShieldAlert size={16} />
                Admin Login
              </button>
            </div>

            {/* Admin Warning */}
            {isAdminLogin && (
              <div
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">
                  Only authorized admin accounts can access the admin panel
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  {!isAdminLogin && (
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary-600"
                    >
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 mt-6 ${
                  isAdminLogin ? 'btn-primary bg-red-600' : 'btn-primary'
                }`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Signing in...' : isAdminLogin ? 'Admin Sign In' : 'Sign In'}
              </button>
            </form>

            {/* Google Sign In */}
            {!isAdminLogin && (
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                <FcGoogle size={20} />
                <span className="font-medium text-gray-700">
                  {googleLoading ? 'Signing in...' : 'Sign In with Google'}
                </span>
              </button>
            )}

            {/* Divider - Hidden for Admin */}
            {!isAdminLogin && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">New to Growing Player's ?</span>
                  </div>
                </div>

                {/* Register Link - Hidden for Admin */}
                <p className="text-center text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 font-semibold">
                    Sign up
                  </Link>
                </p>
              </>
            )}


          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login
