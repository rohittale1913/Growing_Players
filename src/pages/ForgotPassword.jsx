import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email) {
        setError('Please enter your email address')
        setLoading(false)
        return
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        toast.error(resetError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Password reset error:', err)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="font-display min-h-screen bg-gradient-to-br from-primary-50 via-white to-rose-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Back Link */}
            <Link to="/login" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Login</span>
            </Link>

            {/* Header */}
            <h1 className="heading-h3 text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {!success ? (
              <>
                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setError('')
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Check Your Email</h2>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  The link will expire in 24 hours. If you don't see it, check your spam folder.
                </p>

                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="w-full btn-primary mt-6"
                >
                  Send Another Email
                </button>

                <Link to="/login" className="block text-primary-600 hover:text-primary-700 font-semibold">
                  Back to Login
                </Link>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-600">
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ForgotPassword
