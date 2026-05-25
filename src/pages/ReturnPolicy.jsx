import Layout from '../layouts/MainLayout'
import { RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const ReturnPolicy = () => {
  const [activeTab, setActiveTab] = useState(0)

  const returnProcess = [
    {
      step: '1',
      title: 'Initiate Return',
      description: 'Contact support@growingplayers.com within 7 days of purchase with your order number and reason for return.'
    },
    {
      step: '2',
      title: 'Receive Authorization',
      description: 'We\'ll email you a Return Merchandise Authorization (RMA) number and shipping instructions within 24 hours.'
    },
    {
      step: '3',
      title: 'Ship Item Back',
      description: 'Pack the item securely and ship it to us using the provided label (we cover return shipping for defective items).'
    },
    {
      step: '4',
      title: 'Item Inspection',
      description: 'Upon receipt, we\'ll inspect the item to verify the condition and reason for return (usually 3-5 business days).'
    },
    {
      step: '5',
      title: 'Process Refund',
      description: 'After approval, we\'ll process your refund to the original payment method within 7 business days.'
    },
  ]

  const nonReturnableItems = [
    'Food items and edible decorations (health/safety)',
    'Perishable items or custom cakes',
    'Items damaged due to misuse or negligence',
    'Items without original packaging or seals',
    'Items purchased more than 30 days ago',
    'Clearance or final sale items (clearly marked)',
    'Gift cards and digital products',
    'Custom or made-to-order items (unless defective)',
    'Items with evidence of use beyond inspection',
  ]

  const tabs = [
    {
      title: 'Standard Returns',
      content: {
        heading: 'Standard Return Policy',
        description: 'Our standard return window and conditions:',
        details: [
          'Return Period: 7 days from delivery date.',
          'Condition: Item must be unused and in original packaging.',
          'Refund Amount: Full refund minus original shipping (non-refundable).',
          'Return Shipping: Paid by customer unless item is defective.',
          'Restocking Fee: No restocking fee applied.',
          'Original Receipt: Not required but helpful.',
        ],
      },
    },
    {
      title: 'Defective Items',
      content: {
        heading: 'Defective or Damaged Items',
        description: 'Items received damaged or with defects:',
        details: [
          'Report Within: 48 hours of delivery.',
          'Required: Photos showing damage and packaging.',
          'Refund/Replacement: Full refund or free replacement at your choice.',
          'Return Shipping: We pay return shipping.',
          'Expedited Replacement: Available for defective items.',
          'No Questions Asked: We believe you about damage/defects.',
        ],
      },
    },
    {
      title: 'Exchanges',
      content: {
        heading: 'Item Exchanges',
        description: 'Swap your item for a different size, color, or product:',
        details: [
          'Exchange Window: 7 days from delivery.',
          'Condition: Item must be unused.',
          'Shipping: Free standard shipping on exchanges.',
          'Process: Same as return but with new item shipped.',
          'Size/Color Changes: Often processed within 5 business days.',
        ],
      },
    },
    {
      title: 'Refund Status',
      content: {
        heading: 'Refund Processing Timeline',
        description: 'After your return is approved:',
        details: [
          'Refund Issued: Within 7 business days of approval.',
          'Credit Time: 1-2 additional billing cycles to appear.',
          'Method: Refunded to original payment method.',
          'Refund Status: Check your account or email us.',
          'Issues: Contact support if refund doesn\'t appear in 14 days.',
        ],
      },
    },
  ]

  return (
    <Layout>
      <div className="font-display bg-gradient-to-br from-primary-50 via-white to-rose-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Return Policy</h1>
            {/* <p className="text-lg text-gray-600 mb-2">
              Last Updated: January 2024
            </p> */}
            <p className="text-gray-600">
              We stand behind the quality of our products. <br /> If you're not satisfied, we make returns easy and hassle-free.
            </p>
          </div>

          {/* Quick Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">7 - Day Returns</h3>
              <p className="text-gray-700">Return most items within 30 days for a refund.</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Free Replacements</h3>
              <p className="text-gray-700">Defective items replaced free, including shipping.</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Easy Process</h3>
              <p className="text-gray-700">Simple steps to request a return or exchange.</p>
            </div>
          </div>

          {/* Return Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Return an Item ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {returnProcess.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 text-center relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {idx < returnProcess.length - 1 && (
                    <div className="hidden md:block absolute top-1/4 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary-300 transform rotate-45"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === idx
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {tabs[activeTab].content.heading}
              </h3>
              {/* <p className="text-gray-600 mb-4">{tabs[activeTab].content.description}</p> */}
              <ul className="space-y-1">
                {tabs[activeTab].content.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Non-Returnable Items */}
          {/* <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg mb-12">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
                <p className="text-gray-700 mb-4">
                  The following items cannot be returned due to health, safety, or policy reasons:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nonReturnableItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div> */}

          {/* Return Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                Returnable Condition
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Unused and in original condition.</li>
                <li>✓ Original packaging intact and undamaged.</li>
                <li>✓ All original seals and labels present.</li>
                <li>✓ No signs of use or testing.</li>
                <li>✓ Purchased within 7 days.</li>
                <li>✓ Original receipt or order confirmation.</li>
                <li>✓ No visible damage from customer.</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                Non-Returnable Condition
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>✗ Opened, used, or tested.</li>
                <li>✗ Original packaging damaged or missing.</li>
                <li>✗ Seals or labels removed or tampered.</li>
                <li>✗ More than 7 days since purchase.</li>
                <li>✗ Customer-inflicted damage.</li>
                <li>✗ No proof of purchase available.</li>
                <li>✗ Clearance or final sale items.</li>
              </ul>
            </div>
          </div>

          {/* FAQs */}
          {/* <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Return FAQs</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-2">Can I return an item after 30 days?</h3>
                <p className="text-gray-700">No, our return window is strictly 30 days from delivery. After 30 days, items cannot be returned for refund, though you may contact us about defects if discovered later.</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-2">Who pays for return shipping?</h3>
                <p className="text-gray-700">For non-defective items, you pay return shipping. For defective or damaged items, we provide a prepaid shipping label. Return shipping costs for standard returns range from $5-20 depending on item weight and distance.</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-2">How long does a refund take?</h3>
                <p className="text-gray-700">After we receive and inspect your return (typically 3-5 business days), we process the refund within 7 business days. It may take 1-2 additional billing cycles for the credit to appear on your account.</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-2">What if I receive a damaged item?</h3>
                <p className="text-gray-700">Contact us within 48 hours with photos of the damage and original packaging. We'll replace the item free of charge with prepaid return shipping, or issue a full refund including original shipping costs.</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-2">Can I exchange an item for a different size or color?</h3>
                <p className="text-gray-700">Yes! Exchanges are available within 7 days for a different size, color, or product. Return your item, and we'll ship the new item with free standard shipping. If there's a price difference, we'll adjust accordingly.</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-2">What about custom or made-to-order items?</h3>
                <p className="text-gray-700">Custom items are made specifically for you and cannot be returned unless defective. If you have concerns about a custom order, contact us before completing the order to discuss options.</p>
              </div>
            </div>
          </div> */}

          {/* Contact */}
          <div className="bg-primary-600 text-white rounded-lg p-8 text-center">
            <RotateCcw className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Need Help with a Return?</h2>
            <p className="mb-2">Our customer service team is here to help make your return easy.</p>
            <div className="space-y-2 mb-4">
              Email: returns@growingplayers.com <br />
              Phone: 1800-1234-5678 <br />
              Hours: Mon - Sat, 10 AM - 8 PM IST
            </div>
            <button className="bg-white text-primary-600 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Start a Return
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReturnPolicy
