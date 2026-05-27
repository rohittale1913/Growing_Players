import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Download, ArrowLeft, Loader2, AlertCircle, Printer } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/helpers'
import Logo from "../assets/logoo.png";

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
        <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₹${parseFloat(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₹${(parseFloat(item.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
    `
      )
      .join('')

    const subtotal = order.subtotal || 0
    const shipping = order.shipping || 0
    const tax = order.tax || 0
    const total = subtotal + shipping + tax // Calculate from components
    const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    const invoiceTime = new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - Growing Player's - ${order.order_number || order.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; color: #333; background: white; }
          .container { max-width: 900px; margin: 0 auto; padding: 20px; }
          
          /* Header Section */
          .invoice-header { border-bottom: 3px solid #e08a4a; padding-bottom: 20px; margin-bottom: 20px; }
          .company-title { text-align: center; margin-bottom: 10px; }
          .company-title h1 { color: #e08a4a; font-size: 32px; margin-bottom: 5px; }
          .company-subtitle { color: #666; font-size: 13px; text-align: center; margin-bottom: 15px; }
          
          /* Invoice Title */
          .invoice-title { text-align: center; font-size: 18px; font-weight: bold; color: #333; margin-bottom: 20px; text-transform: uppercase; }
          
          /* Seller & Customer Info */
          .seller-customer { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
          .section-box { background: #f9f9f9; padding: 15px; border: 1px solid #e0e0e0; border-radius: 4px; }
          .section-box h3 { color: #e08a4a; font-size: 12px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #e08a4a; padding-bottom: 8px; }
          .section-box p { font-size: 13px; line-height: 1.6; margin: 4px 0; }
          .section-box strong { color: #333; }
          
          /* Order & Shipping Details */
          .order-shipping { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
          
          /* Items Table */
          .items-section h3 { color: #e08a4a; font-size: 12px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          thead tr { background: #e08a4a; }
          th { color: white; padding: 12px; text-align: left; font-size: 13px; font-weight: bold; }
          td { padding: 12px; border-bottom: 1px solid #ddd; font-size: 13px; }
          tbody tr:hover { background: #f9f9f9; }
          
          /* Amount Breakdown */
          .amount-breakdown { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }
          .breakdown-table { background: #f9f9f9; padding: 15px; border: 1px solid #e0e0e0; border-radius: 4px; }
          .breakdown-table h3 { color: #e08a4a; font-size: 12px; text-transform: uppercase; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #e08a4a; padding-bottom: 8px; }
          .breakdown-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px; }
          .breakdown-row.total { border-top: 2px solid #e08a4a; padding-top: 10px; font-weight: bold; font-size: 16px; color: #e08a4a; }
          
          /* Shipping Box */
          .shipping-box { background: #f0f7ff; padding: 15px; border: 1px solid #b3d9ff; border-radius: 4px; }
          .shipping-box h3 { color: #0066cc; font-size: 12px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px; }
          .shipping-box p { font-size: 13px; line-height: 1.6; margin: 4px 0; }
          
          /* Footer */
          .invoice-footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999; }
          .footer-line { margin: 5px 0; }
          
          /* Print Styles */
          @media print {
            body { margin: 0; padding: 0; }
            .container { padding: 10px; }
            .no-print { display: none !important; }
            .section-box, .breakdown-table, .shipping-box { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="invoice-header">
            <div class="company-title">
              <h1>Growing Player's</h1>
              <p class="company-subtitle">Premium Cake Design Ingredients & Bakery Decoration Products</p>
            </div>
          </div>
          
          <div class="invoice-title">Tax Invoice / Bill of Supply</div>
          
          <!-- Seller & Customer Info -->
          <div class="seller-customer">
            <!-- Seller Details -->
            <div class="section-box">
              <h3>Seller Details</h3>
              <p><strong>Company Name:</strong> Growing Player's Pvt Ltd.</p>
              <p><strong>Address:</strong> Near Dr. Pathak House, Pannlal Nagar, Amravati - 444605, India</p>
              <p><strong>GST No:</strong> ___________________</p>
              <p><strong>FSSAI License:</strong> ___________________</p>
              <p><strong>Email:</strong> hello@growingplayers.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
            </div>
            
            <!-- Customer/Bill To -->
            <div class="section-box">
              <h3>Bill To (Customer)</h3>
              <p><strong>Name:</strong> ${shippingAddr?.fullName || 'N/A'}</p>
              <p><strong>Address:</strong> ${shippingAddr?.address || 'N/A'}</p>
              <p><strong>City:</strong> ${shippingAddr?.city || 'N/A'}</p>
              <p><strong>State:</strong> ${shippingAddr?.state || 'N/A'}</p>
              <p><strong>PIN Code:</strong> ${shippingAddr?.zipCode || 'N/A'}</p>
              <p><strong>Email:</strong> ${shippingAddr?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${shippingAddr?.phone || 'N/A'}</p>
            </div>
          </div>
          
          <!-- Order & Shipping Details -->
          <div class="order-shipping">
            <!-- Order Details -->
            <div class="section-box">
              <h3>Order Details</h3>
              <p><strong>Invoice Number:</strong> #${order.order_number || order.id}</p>
              <p><strong>Order Date:</strong> ${invoiceDate}</p>
              <p><strong>Order Time:</strong> ${invoiceTime}</p>
              <p><strong>Order Status:</strong> ${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}</p>
              <p><strong>Payment Status:</strong> ${order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'Pending'}</p>
            </div>
            
            <!-- Shipping Details -->
            <div class="shipping-box">
              <h3>Shipping Details</h3>
              <p><strong>Shipping Address:</strong> ${shippingAddr?.address || 'N/A'}, ${shippingAddr?.city || ''}, ${shippingAddr?.state || ''} ${shippingAddr?.zipCode || ''}</p>
              <p><strong>Country:</strong> ${shippingAddr?.country || 'India'}</p>
              <p><strong>Contact:</strong> ${shippingAddr?.phone || 'N/A'}</p>
            </div>
          </div>
          
          <!-- Items Section -->
          <div class="items-section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th style="text-align: center; width: 80px;">Qty</th>
                  <th style="text-align: right; width: 100px;">Unit Price</th>
                  <th style="text-align: right; width: 100px;">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>
          
          <!-- Amount Breakdown -->
          <div class="amount-breakdown">
            <div></div>
            <div class="breakdown-table">
              <h3>Amount Breakdown</h3>
              <div class="breakdown-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="breakdown-row">
                <span>Shipping Charge:</span>
                <span>${shipping === 0 ? 'Free' : '₹' + shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="breakdown-row">
                <span>Tax (18% GST):</span>
                <span>₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="breakdown-row total">
                <span>Total Amount:</span>
                <span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="invoice-footer">
            <div class="footer-line"><strong>Terms & Conditions:</strong> Goods once sold cannot be returned or exchanged.</div>
            <div class="footer-line">Thank you for your purchase! We appreciate your business.</div>
            <div class="footer-line">For queries, contact us at hello@growingplayers.com or +91 98765 43210</div>
            <div class="footer-line">This is an electronically generated invoice and is valid without signature.</div>
            <div class="footer-line" style="margin-top: 15px; font-size: 11px;">Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
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
                <h1 className="heading-h2 text-gradient">Order Details</h1>
                <p className="text-gray-600 mt-2">Order ID: #{order.order_number || order.id}</p>
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
            <div className="bg-gradient-to-r from-white-600 to-primary-600 text-primary p-4 ">

              <div className='flex p-4 border-b-2 border-primary-200'>
                <div className='w-14 h-12 rounded-full bg-primary-600 '>
                  <img
                    src={Logo}
                    alt="Premium cake ingredients"
                    className="w-14 h-12 rounded-full bg-white "
                  />
                </div>
                <h2 className="text-4xl font-bold px-1 pt-1 text-gradient">Growing Player's</h2>
              </div>
              <p className="text-primary-600 pt-4 text-center uppercase font-semibold ">Tax Invoice / Bill of Supply</p>

              {/* <p className="text-primary-100">Premium Cake Design Ingredients & Bakery Decoration</p> */}

            </div>

            <div className="p-8">
              {/* Seller & Customer Info */}
              <div className="grid grid-cols-2 gap-6 mb-1">
                {/* Seller Details */}
                <div className=" rounded-lg p-3">
                  <h3 className="text-sm font-bold text-primary-600 uppercase mb-1 border-primary-600">Seller Details</h3>
                  <div className=" text-sm">
                    <p><span className="font-semibold">Company Name:</span> Growing Player's Pvt Ltd.</p>
                    <p><span className="font-semibold">Address:</span> Near Dr. Pathak House, Pannlal Nagar, Amravati - 444605, India</p>
                    <p><span className="font-semibold">GST No:</span> <span className="text-gray-500 border-b border-dashed border-gray-400 inline-block w-40">___________________</span></p>
                    <p><span className="font-semibold">FSSAI License:</span> <span className="text-gray-500 border-b border-dashed border-gray-400 inline-block w-40">___________________</span></p>
                    <p><span className="font-semibold">Email:</span> hello@growingplayers.com</p>
                    <p><span className="font-semibold">Phone:</span> +91 98765 43210</p>
                  </div>
                </div>

                {/* Customer/Bill To */}
                <div className="rounded-lg p-3">
                  <h3 className="text-sm font-bold text-primary-600 uppercase mb-1 border-primary-600">Bill To (Customer)</h3>
                  <div className=" text-sm">
                    <p><span className="font-semibold">Name:</span> {shippingAddress?.fullName || 'N/A'}</p>
                    <p><span className="font-semibold">Address:</span> {shippingAddress?.address || 'N/A'}</p>
                    <p><span className="font-semibold">City:</span> {shippingAddress?.city || 'N/A'}</p>
                    <p><span className="font-semibold">State:</span> {shippingAddress?.state || 'N/A'}</p>
                    <p><span className="font-semibold">PIN Code:</span> {shippingAddress?.zipCode || 'N/A'}</p>
                    <p><span className="font-semibold">Email:</span> {shippingAddress?.email || 'N/A'}</p>
                    <p><span className="font-semibold">Phone:</span> {shippingAddress?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order & Shipping Details */}
              <div className="grid grid-cols-2 gap-6 mb-1">
                {/* Order Details */}
                <div className="rounded-lg p-3">
                  <h3 className="text-sm font-bold text-primary-600 uppercase mb-1  border-primary-600 ">Order Details</h3>
                  <div className=" text-sm">
                    <p>
                      <span className="font-semibold">Invoice Number:</span>{' '}
                      <span className="">#{order.order_number || order.id}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Order Date:</span>{' '}
                      <span className="">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Order Time:</span>{' '}
                      <span className="">
                        {new Date(order.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{' '}
                      <span className={`px-2 py-1 rounded text-xs ${order.status === 'delivered'
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
                      <span className="font-semibold">Payment Status:</span>{' '}
                      <span className={` px-2 py-1 rounded text-xs ${order.payment_status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className=" rounded-lg p-3">
                  <h3 className="text-sm font-bold text-primary-600 uppercase mb-1">Shipping Details</h3>
                  <div className=" text-sm">
                    <p>
                      <span className="font-semibold">Shipping Address:</span>{' '}
                      <span className="">{shippingAddress?.address || 'N/A'}, {shippingAddress?.city || ''}, {shippingAddress?.state || ''} {shippingAddress?.zipCode || ''}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Country:</span>{' '}
                      <span className="">{shippingAddress?.country || 'India'}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Contact Number:</span>{' '}
                      <span className="">{shippingAddress?.phone || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="">
                <h3 className=" text-primary-600 p-2 uppercase font-bold">Order Items</h3>
                <div className="overflow-x-auto px-2">
                  <table className="w-full ">
                    <thead className="bg-gray-50 text-black">
                      <tr>
                        <th className="text-left px-2 py-3 font-semibold">Product Name</th>
                        <th className="text-center px-2 py-3 font-semibold w-20">Qty</th>
                        <th className="text-right px-2 py-3 font-semibold w-28">Unit Price</th>
                        <th className="text-right px-2 py-3 font-semibold w-28">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-2 py-2 text-gray-900">{item.name}</td>
                          <td className="text-center px-2 py-2 text-gray-700">{item.quantity}</td>
                          <td className="text-right px-2 py-2 text-gray-700">
                            {formatPrice(parseFloat(item.price))}
                          </td>
                          <td className="text-right px-2 py-2 font-semibold text-gray-900">
                            {formatPrice(parseFloat(item.price) * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div></div>
                <div></div>
                <div className=" border-2 border-primary-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-primary-600 uppercase mb-1 border-b-2 border-primary-200 pb-1">Amount Breakdown</h3>
                  <div className="text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping Charge:</span>
                      <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (18% GST):</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t-2 border-primary-200">
                      <span>Total Amount:</span>
                      <span className="text-primary-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className=" text-center pt-4 border-t border-gray-300">
                <p className="text-xs font-semibold text-gray-700 uppercase">Growing Player's PVT LTD.</p>
                {/* <p className="text-xs text-gray-600">Goods once sold cannot be returned or exchanged.</p> */}
                <p className="text-xs text-gray-600 mt-3">Thank you for your purchase! We appreciate your business.</p>
                <p className="text-xs text-gray-600">For queries, contact us at hello@growingplayers.com or +91 98765 43210</p>
                <p className="text-xs text-gray-500 italic mt-2">This is an electronically generated invoice and is valid without signature.</p>
                <p className="text-xs text-gray-500">Generated on: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default OrderDetail
