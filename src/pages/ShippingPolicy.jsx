import Layout from '../layouts/MainLayout'
import { Truck, Clock, Shield, DollarSign } from 'lucide-react'
import { useState } from 'react'

const ShippingPolicy = () => {
  const [expandedRegion, setExpandedRegion] = useState(0)

  const shippingRegions = [
    {
      title: 'Continental United States (48 States)',
      rates: [
        { method: 'Standard Shipping (5-7 business days)', cost: 'Free on orders over $100, otherwise $9.99' },
        { method: 'Express Shipping (2-3 business days)', cost: '$19.99' },
        { method: 'Overnight Shipping (Next business day)', cost: '$39.99' },
        { method: 'Priority Mail (1-2 business days)', cost: '$29.99' },
      ],
    },
    {
      title: 'Alaska & Hawaii',
      rates: [
        { method: 'Standard Shipping (7-10 business days)', cost: '$24.99' },
        { method: 'Express Shipping (3-5 business days)', cost: '$44.99' },
        { method: 'Overnight Shipping', cost: 'Not available' },
      ],
    },
    {
      title: 'International Shipping',
      rates: [
        { method: 'Canada (7-14 business days)', cost: 'Starting at $34.99' },
        { method: 'Mexico (10-21 business days)', cost: 'Starting at $44.99' },
        { method: 'Other Countries', cost: 'Contact support for quote' },
      ],
    },
  ]

  const faqs = [
    {
      question: 'What are your shipping timeframes?',
      answer: 'Shipping timeframes begin after your order is processed and confirmed. Orders are typically processed within 1-2 business days. Timeframes do not include weekends or holidays. Actual delivery may vary depending on carrier and weather conditions.',
    },
    {
      question: 'Can I ship to a PO Box?',
      answer: 'We can ship to PO Boxes for standard ground shipping only. Express and overnight services are not available for PO Boxes. Some items may be too large for PO Boxes; we will contact you if this applies.',
    },
    {
      question: 'Can I change my shipping address after ordering?',
      answer: 'You can change your shipping address if your order hasn\'t been shipped yet. Contact support@growingplayers.com immediately with your order number and new address. If your order has already shipped, you must accept the original delivery and arrange a return.',
    },
    {
      question: 'What if my package is damaged in transit?',
      answer: 'If you receive a damaged package, do not dispose of the packaging or contents. Take photos of the damage and contact us within 48 hours with your order number, photos, and description. We will arrange a replacement or refund at no cost to you.',
    },
    {
      question: 'Do you ship perishable items?',
      answer: 'Select perishable items (such as fresh frostings or certain decorative elements) ship with expedited methods and insulated packaging. These items have specific shipping restrictions and may not be available for all delivery addresses. Check during checkout for availability.',
    },
    {
      question: 'What is your international shipping policy?',
      answer: 'We ship to select international destinations. International orders may be subject to customs duties and taxes at the destination country. These additional charges are the responsibility of the recipient. Delivery times are estimates and may vary significantly.',
    },
    {
      question: 'Can I arrange a specific delivery date?',
      answer: 'We cannot guarantee specific delivery dates. We can provide estimated delivery windows based on the shipping method selected. For time-sensitive events, we recommend selecting Express or Overnight shipping and ordering at least 1 week in advance.',
    },
    {
      question: 'Do you offer local pickup?',
      answer: 'We do not currently offer local pickup. All orders must be shipped. We may consider local pickup in the future as we expand our operations.',
    },
  ]

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 via-white to-rose-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
            <p className="text-lg text-gray-600 mb-2">
              Last Updated: January 2024
            </p>
            <p className="text-gray-600">
              At Growing Players, we're committed to delivering your orders safely and promptly. Here's everything you need to know about our shipping policies.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Truck className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">5-7 days standard, 24hr overnight available</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Clock className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Real-time Tracking</h3>
              <p className="text-sm text-gray-600">Track your order every step of the way</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Shield className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Fully Insured</h3>
              <p className="text-sm text-gray-600">All packages insured against damage or loss</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <DollarSign className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $100</p>
            </div>
          </div>

          {/* Shipping Rates */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Rates & Methods</h2>
            <div className="space-y-4">
              {shippingRegions.map((region, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => setExpandedRegion(expandedRegion === idx ? -1 : idx)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <h3 className="text-xl font-bold text-gray-900">{region.title}</h3>
                    <span className={`transform transition-transform ${expandedRegion === idx ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedRegion === idx && (
                    <div className="px-6 py-4 bg-gray-50 border-t">
                      <div className="space-y-3">
                        {region.rates.map((rate, rIdx) => (
                          <div key={rIdx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span className="text-gray-700">{rate.method}</span>
                            <span className="font-semibold text-primary-600">{rate.cost}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Processing Time</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Orders are processed within 1-2 business days</li>
                  <li>• Rush processing available for select items (+$10)</li>
                  <li>• Orders placed on weekends are processed Monday</li>
                  <li>• Holiday orders may take slightly longer</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tracking & Notifications</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Tracking number emailed when order ships</li>
                  <li>• Real-time tracking updates via email/SMS</li>
                  <li>• Delivery confirmation sent upon arrival</li>
                  <li>• SMS alerts available (opt-in during checkout)</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Packaging</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Eco-friendly, recyclable packaging</li>
                  <li>• Bubble wrap and padding for protection</li>
                  <li>• Perishables ship in insulated boxes</li>
                  <li>• Fragile items clearly marked</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Signature</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• No signature required for standard shipping</li>
                  <li>• Signature required for orders over $500</li>
                  <li>• High-value items may require signature</li>
                  <li>• Contact carrier to arrange alternate delivery</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Risk & Liability */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Risk of Loss & Insurance</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Risk Transfer:</strong> Risk of loss transfers to you upon delivery to the carrier. You are responsible for inspecting packages upon receipt.
              </p>
              <p>
                <strong>Insurance Coverage:</strong> All orders are automatically insured at no additional cost. This includes protection against loss, theft, and damage during shipping.
              </p>
              <p>
                <strong>Claims Process:</strong> If your package arrives damaged or lost:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact us within 48 hours of delivery</li>
                <li>Provide photos of the damage and packaging</li>
                <li>Keep the damaged item and packaging</li>
                <li>We will file a claim or arrange replacement</li>
              </ul>
              <p>
                <strong>Liability Limit:</strong> Our liability is limited to the cost of the item, not including lost profits or consequential damages.
              </p>
            </div>
          </div>

          {/* Special Shipping Circumstances */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Circumstances</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-bold mb-2">Perishable Items</h3>
                <p>Food items and perishables are shipped via Express or Overnight mail with special insulation. Additional charges may apply. These items are non-refundable once delivered but will be replaced if damaged upon arrival.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Fragile Items</h3>
                <p>Delicate decorative items are packaged with extra care and padding. We recommend Express shipping to minimize handling time. Damage claims must be reported within 48 hours with photos.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Bulk Orders</h3>
                <p>Orders over 50 lbs may require commercial shipping. We'll contact you with shipping costs and options. Bulk orders may take 3-5 business days to process.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Weather Delays</h3>
                <p>We are not responsible for delays caused by severe weather, natural disasters, or carrier strikes. Shipping timeframes exclude these external factors.</p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-primary-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help with Your Shipment?</h2>
            <p className="mb-6">Contact our shipping support team for any questions or concerns.</p>
            <div className="space-y-2">
              <p>Email: shipping@growingplayers.com</p>
              <p>Phone: 1-800-GROWING (1-800-476-8946)</p>
              <p>Hours: Monday - Friday, 9 AM - 6 PM PT</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ShippingPolicy
