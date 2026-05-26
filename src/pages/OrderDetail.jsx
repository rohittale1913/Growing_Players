import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Download, ArrowLeft, Loader2, AlertCircle, Printer } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/helpers'

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // Check if user is authenticated
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          navigate('/login')
          return
        }

        setUser(session.user)

        // Fetch order details
        const orderData = await orderAPI.getById(orderId)
        if (!orderData) {
          toast.error('Order not found')
          navigate('/orders')
          return
        }

        // Check if order belongs to current user
        if (orderData.user_id !== session.user.id) {
          toast.error('Unauthorized access')
          navigate('/orders')
          return
        }

        setOrder(orderData)
      } catch (error) {
        console.error('Failed to fetch order:', error)
        toast.error('Failed to load order details')
        navigate('/orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetail()
  }, [orderId, navigate])

  const handlePrintBill = () => {
    window.print()
  }

  const handleDownloadBill = () => {
    const billHTML = generateBillHTML()
    const element = document.createElement('a')
    element.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(billHTML)
    element.download = `bill-${order.id}.html`
    element.click()
    toast.success('Bill downloaded successfully!')
  }

  const generateBillHTML = () => {
    if (!order) return ''

    // Parse items from JSON if string, otherwise use as-is
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || [])
    // Parse shipping address from JSON if string, otherwise use as-is
    const shippingAddr = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : (order.shipping_address || {})
    const itemsHTML = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${parseFloat(item.price).toLocaleString('en-IN')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(parseFloat(item.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
    `
      )
      .join('')

    const subtotal = order.subtotal || 0
    const shipping = order.shipping || 0
    const tax = order.tax || 0
    const total = subtotal + shipping + tax // Calculate from components

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Order Bill - ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .container { max-width: 900px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #e08a4a; padding-bottom: 20px; }
          .header h1 { color: #e08a4a; margin: 0; font-size: 28px; }
          .header p { margin: 5px 0; color: #666; }
          .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-section { background: #f9f9f9; padding: 15px; border-radius: 5px; }
          .info-section h3 { margin-top: 0; color: #e08a4a; font-size: 14px; text-transform: uppercase; }
          .info-section p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #e08a4a; color: white; padding: 12px; text-align: left; font-weight: bold; }
          .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .summary-section { background: #f9f9f9; padding: 15px; border-radius: 5px; }
          .summary-section h3 { margin-top: 0; color: #e08a4a; font-size: 14px; text-transform: uppercase; }
          .summary-line { display: flex; justify-content: space-between; margin: 8px 0; }
          .summary-line.total { border-top: 2px solid #e08a4a; padding-top: 10px; font-weight: bold; font-size: 18px; color: #e08a4a; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Growing Players</h1>
            <p>Premium Cake Design Ingredients & Bakery Decoration</p>
            <p>Order Invoice</p>
          </div>

          <div class="order-info">
            <div class="info-section">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Status:</strong> ${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}</p>
              <p><strong>Payment Status:</strong> ${order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'Pending'}</p>
            </div>

            <div class="info-section">
              <h3>Shipping Address</h3>
              <p><strong>${shippingAddr?.fullName || 'N/A'}</strong></p>
              <p>${shippingAddr?.address || ''}</p>
              <p>${shippingAddr?.city || ''}, ${shippingAddr?.state || ''} ${shippingAddr?.zipCode || ''}</p>
              <p>${shippingAddr?.country || 'India'}</p>
              <p>📞 ${shippingAddr?.phone || 'N/A'}</p>
              <p>📧 ${shippingAddr?.email || 'N/A'}</p>
            </div>
          </div>

          <h3 style="color: #e08a4a; text-transform: uppercase; font-size: 14px;">Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="summary">
            <div></div>
            <div class="summary-section">
              <h3>Order Summary</h3>
              <div class="summary-line">
                <span>Subtotal:</span>
                <span>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="summary-line">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'Free' : '₹' + shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="summary-line">
                <span>Tax (18% GST):</span>
                <span>₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="summary-line total">
                <span>Total Amount:</span>
                <span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase! For any queries, please contact us at support@growingplayers.com</p>
            <p>This is an electronically generated bill and is valid without a signature.</p>
            <p>Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </body>
      </html>
    `
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

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
      </Layout>
    )
  }

  const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || [])
  const shippingAddress = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : (order.shipping_address || {})
  const subtotal = order.subtotal || 0
  const shipping = order.shipping || 0
  const tax = order.tax || 0
  const total = subtotal + shipping + tax // Calculate from components

  return (
    <Layout>
      <div className="font-display min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="heading-h2 text-gray-900">Order Details</h1>
                <p className="text-gray-600 mt-2">Order ID: {order.id}</p>
              </div>
              <div className="no-print flex gap-2">
                <button
                  onClick={handlePrintBill}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Bill
                </button>
                <button
                  onClick={handleDownloadBill}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Bill
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bill Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Bill Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Growing Players</h2>
              <p className="text-primary-100">Premium Cake Design Ingredients & Bakery Decoration</p>
              <p className="text-primary-100 mt-2 font-semibold">Order Invoice</p>
            </div>

            <div className="p-8">
              {/* Order & Shipping Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Order Info */}
                <div>
                  <h3 className="heading-h3 text-gray-900 mb-4 border-b-2 border-primary-600 pb-2">Order Details</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Order Date:</span>{' '}
                      <span className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Order ID:</span>{' '}
                      <span className="font-semibold">{order.id}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Status:</span>{' '}
                      <span className={`font-semibold px-2 py-1 rounded ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Payment Status:</span>{' '}
                      <span className={`font-semibold px-2 py-1 rounded ${
                        order.payment_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="heading-h3 text-gray-900 mb-4 border-b-2 border-primary-600 pb-2">Shipping Address</h3>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-semibold">{shippingAddress?.fullName || 'N/A'}</p>
                    <p>{shippingAddress?.address || 'N/A'}</p>
                    <p>
                      {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}
                    </p>
                    <p>{shippingAddress?.country || 'India'}</p>
                    <p className="mt-3">
                      <span className="text-gray-600">📞 </span>
                      {shippingAddress?.phone}
                    </p>
                    <p>
                      <span className="text-gray-600">📧 </span>
                      {shippingAddress?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h3 className="heading-h3 text-gray-900 mb-4 border-b-2 border-primary-600 pb-2">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900">Product Name</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-900">Quantity</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-900">Unit Price</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{item.name}</td>
                          <td className="text-center px-4 py-3 text-gray-700">{item.quantity}</td>
                          <td className="text-right px-4 py-3 text-gray-700">
                            {formatPrice(parseFloat(item.price))}
                          </td>
                          <td className="text-right px-4 py-3 font-semibold text-gray-900">
                            {formatPrice(parseFloat(item.price) * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-3 gap-8">
                <div></div>
                <div></div>
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-primary-600">
                  <h3 className="heading-h3 text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping:</span>
                      <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (18% GST):</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-primary-600">
                      <span>Total Amount:</span>
                      <span className="text-primary-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Message */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-900">
                  ✓ Thank you for your purchase! Your order is being processed.
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  For any queries, please contact us at support@growingplayers.com
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default OrderDetail
