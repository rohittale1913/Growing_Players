import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, MapPin, CreditCard, AlertCircle, Loader2, ArrowRight, X, LogIn, UserPlus } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { useCartStore, useAuthStore } from '../store'
import { formatPrice } from '../utils/helpers'
import { supabase } from '../lib/supabase'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('address') // address, payment, confirmation
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  })

  // Calculate shipping based on subtotal
  const calculateShipping = () => {
    // Free shipping for orders over ₹1000
    // ₹100 flat rate for orders under ₹1000
    return total >= 1000 ? 0 : 100
  }

  const subtotal = total
  const shipping = calculateShipping()
  const tax = (subtotal + shipping) * 0.18 // 18% GST on subtotal + shipping
  const grandTotal = subtotal + shipping + tax

  // Check authentication on mount and on auth state change
  useEffect(() => {
    // Also listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, 'User:', session?.user?.id)
        if (session?.user) {
          // User is logged in, update store
          const { setUser } = useAuthStore.getState()
          setUser(session.user)
        }
      }
    )

    if (items.length > 0 && !isAuthenticated) {
      setShowAuthModal(true)
    } else if (isAuthenticated && showAuthModal) {
      // User just signed in, close modal and proceed
      setShowAuthModal(false)
      toast.success('Successfully signed in! Proceeding to checkout.')
    }

    return () => {
      subscription?.unsubscribe()
    }
  }, [isAuthenticated, items.length, showAuthModal])

  if (items.length === 0 && step === 'address') {
    return (
      <Layout>
        <div className="font-display min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="heading-h2 text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add items to proceed with checkout</p>
            <Link to="/products" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateAddress = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      toast.error('Please fill in all address fields')
      return false
    }
    return true
  }

  const handleAddressSubmit = async () => {
    if (validateAddress()) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = async () => {
    console.log('🎯 Place Order clicked')
    console.log('📋 Current formData state:', formData)
    
    // Double-check user is authenticated before payment
    if (!isAuthenticated || !user?.id) {
      console.warn('❌ User not authenticated', { isAuthenticated, userId: user?.id })
      toast.error('Please sign in to complete your order')
      setShowAuthModal(true)
      return
    }

    console.log('✅ User authenticated:', user.id)
    setLoading(true)
    
    try {
      // Validate customer name
      console.log('📋 Form data:', formData)
      console.log('📋 Full name value:', formData.fullName, 'Type:', typeof formData.fullName, 'Length:', formData.fullName?.length)
      
      if (!formData.fullName || formData.fullName.trim() === '') {
        console.error('❌ Full name is empty:', { fullName: formData.fullName })
        toast.error('Please go back and provide your full name')
        setLoading(false)
        return
      }

      // Generate a unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      
      // Create order with authenticated user ID
      const customerNameValue = formData.fullName.trim()
      console.log('✅ Using customer name:', customerNameValue)
      console.log('✅ All form fields:', {
        fullName: customerNameValue,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      })
      
      const orderData = {
        order_number: orderNumber,
        customer_name: customerNameValue, // Customer name from form
        customer_email: formData.email, // Customer email from form
        user_id: user.id,
        items: JSON.stringify(items), // Convert items to JSON string
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total_price: grandTotal, // Grand total: subtotal + shipping + tax
        status: 'pending',
        shipping_address: JSON.stringify(formData), // Convert address to JSON string
        payment_status: 'pending',
      }

      console.log('📦 Creating order with data:', orderData)
      const order = await orderAPI.create(orderData)
      console.log('✅ Order created:', order)

      // Clear cart
      clearCart()
      console.log('🧹 Cart cleared')

      toast.success('Order placed successfully!')
      setStep('confirmation')
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        console.log('🚀 Redirecting to /orders')
        navigate('/orders')
      }, 2000)
    } catch (error) {
      console.error('❌ Failed to create order:', error)
      console.error('Error details:', error.message || error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="font-display min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-8">
                  <div className={`flex items-center ${step === 'address' ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step === 'address' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="ml-2 font-medium">Shipping</span>
                  </div>

                  <div className="flex-1 h-1 mx-4 bg-gray-300" />

                  <div className={`flex items-center ${step === 'payment' || step === 'confirmation' ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step === 'payment' || step === 'confirmation' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'
                    }`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="ml-2 font-medium">Payment</span>
                  </div>
                </div>

                {/* Address Step */}
                {step === 'address' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h2 className="heading-h3 text-gradient mb-6">Shipping Address</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="country"
                          placeholder="Country"
                          value={formData.country}
                          disabled
                          className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="ZIP Code"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        onClick={handleAddressSubmit}
                        className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
                      >
                        Continue to Payment
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Payment Step */}
                {step === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h2 className="heading-h3 text-gray-900 mb-6">Payment Method</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900">Payment Coming Soon</h3>
                        <p className="text-blue-800 text-sm mt-1">
                          For now, we've set your payment status as "Pending". Our team will contact you to complete the payment process.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <button
                        disabled
                        className="w-full p-4 border-2 border-gray-300 rounded-lg cursor-not-allowed opacity-50 text-left"
                      >
                        <CreditCard className="inline w-5 h-5 mr-2" />
                        Credit/Debit Card (Coming Soon)
                      </button>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep('address')}
                        className="flex-1 btn-secondary"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePaymentSubmit}
                        disabled={loading}
                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                      >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Place Order
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Confirmation Step */}
                {step === 'confirmation' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h2 className="heading-h2 text-gray-900 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-8">
                      You will be redirected to your orders page shortly...
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-6 sticky top-4"
              >
                <h3 className="heading-h3 text-gradient mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-semibold text-primary-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-gray-900 font-medium'}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18% GST)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                  {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium mb-2">📦 Shipping Information</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>✓ Free shipping for orders above ₹1000</li>
                      <li>✓ Flat ₹100 shipping for orders below ₹1000</li>
                      <li>✓ Delivery within 7-8 business days</li>
                    </ul>
                  </div> */}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Authentication Modal */}
        <AnimatePresence>
          {showAuthModal && (
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
                className="bg-white rounded-lg shadow-lg max-w-sm w-full"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Sign In to Checkout</h2>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        // Can't close modal if not authenticated
                        toast.error('You must sign in to proceed with checkout')
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${isAuthenticated ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 text-center">
                    To complete your order, please sign in or create a new account. This helps us track your orders and provide better support.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        sessionStorage.setItem('checkoutRedirect', 'true')
                        navigate('/login')
                      }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <LogIn size={20} />
                      Sign In
                    </button>

                    <button
                      onClick={() => {
                        sessionStorage.setItem('checkoutRedirect', 'true')
                        navigate('/register')
                      }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                    >
                      <UserPlus size={20} />
                      Create Account
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

export default Checkout
