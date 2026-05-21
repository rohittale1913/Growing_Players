import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

/**
 * ProtectedRoute Component
 * Checks if user is authenticated and has admin role
 * Redirects to login if not authenticated
 * Redirects to home if authenticated but not admin
 */
const ProtectedRoute = ({ element }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        if (!session) {
          setIsAuthenticated(false)
          setIsAdmin(false)
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)

        // Check if user has admin role
        const userRole = session.user.user_metadata?.user_role || session.user.user_metadata?.role
        
        if (userRole === 'admin') {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        setIsAdmin(false)
        setIsLoading(false)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setIsAuthenticated(true)
        const userRole = session.user.user_metadata?.user_role || session.user.user_metadata?.role
        setIsAdmin(userRole === 'admin')
      } else {
        setIsAuthenticated(false)
        setIsAdmin(false)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Not admin - redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  // All checks passed - render the protected component
  return element
}

export default ProtectedRoute
