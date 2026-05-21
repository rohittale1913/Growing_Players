import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, MapPin, CreditCard, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { useCartStore } from '../store'
import { formatPrice } from '../utils/helpers'
import { supabase } from '../lib/supabase'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('address') // address, payment, confirmation
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

  if (items.length === 0 && step === 'address') {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
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

  const handleAddressSubmit = () => {
    if (validateAddress()) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        toast.error('Please log in to place an order')
        navigate('/login')
        return
      }

      // Create order
      const orderData = {
        user_id: session.user.id,
        items: items,
        total: total,
        status: 'pending',
        shipping_address: formData,
        payment_status: 'pending',
      }

      const order = await orderAPI.create(orderData)

      // Clear cart
      clearCart()

      toast.success('Order placed successfully!')
      setStep('confirmation')
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders')
      }, 2000)
    } catch (error) {
      console.error('Failed to create order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
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
                    <h2 className="heading-h3 text-gray-900 mb-6">Shipping Address</h2>
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
                <h3 className="heading-h3 text-gray-900 mb-6">Order Summary</h3>

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
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(total * 0.18)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(total * 1.18)}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Checkout
