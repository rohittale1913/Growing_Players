import Layout from '../layouts/MainLayout'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const FAQ = () => {
  const [expandedId, setExpandedId] = useState(null)

  const faqs = [
    {
      category: 'Account & Login',
      questions: [
        {
          id: 1,
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" on our website, enter your email, create a password, and provide your full name. You can also sign up with Google. You\'ll receive a confirmation email to verify your address.'
        },
        {
          id: 2,
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Forgot Password?" on the login page. Enter your email address, and we\'ll send you a link to reset your password. Click the link in your email and create a new password. If you don\'t see the email, check your spam folder.'
        },
        {
          id: 3,
          question: 'Can I sign in with Google or social media?',
          answer: 'Yes! We offer Google OAuth sign-in and sign-up. Click "Sign In with Google" on the login page and authenticate with your Google account. This is a quick alternative to email/password login.'
        },
        {
          id: 4,
          question: 'How do I update my account information?',
          answer: 'Go to your account settings (Profile page) to update your name, email, phone number, and shipping addresses. Click "Edit" next to each field to make changes.'
        },
        {
          id: 5,
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account by contacting support@growingplayers.com with your request. We\'ll delete your personal information but retain order history as required by law.'
        },
      ]
    },
    {
      category: 'Products & Shopping',
      questions: [
        {
          id: 6,
          question: 'What products do you sell?',
          answer: 'We specialize in premium cake design ingredients and bakery decoration products, including food coloring, fondant, decorating tools, molds, edible glitter, piping tips, and much more for professional and home bakers.'
        },
        {
          id: 7,
          question: 'Are all products food-safe?',
          answer: 'Yes, all food items sold at Growing Player\'s meet food safety standards. However, non-food items like tools and equipment are not for consumption. Please check product descriptions for specific details.'
        },
        {
          id: 8,
          question: 'Do you sell discontinued or hard-to-find items?',
          answer: 'We occasionally feature discontinued or hard-to-find items on our website. Availability is limited and items may sell out quickly. Sign up for notifications to be alerted when specific items are in stock.'
        },
        {
          id: 9,
          question: 'Can I see product reviews before buying?',
          answer: 'Yes! Many products have customer reviews with ratings. Reviews help you make informed decisions. You can also submit your own review after purchase.'
        },
        {
          id: 10,
          question: 'Do you offer bulk discounts?',
          answer: 'For bulk orders (10+ items), contact our sales team at sales@growingplayers.com for a custom quote. We offer competitive bulk pricing for businesses.'
        },
      ]
    },
    {
      category: 'Orders & Checkout',
      questions: [
        {
          id: 11,
          question: 'How do I place an order?',
          answer: 'Browse our products, click "Add to Cart" for items you want, review your cart, click "Checkout," enter your shipping and payment information, and click "Place Order." You\'ll receive a confirmation email immediately.'
        },
        {
          id: 12,
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, UPI. All payments are processed securely through RazorPay.'
        },
        {
          id: 13,
          question: 'Is my payment information secure?',
          answer: 'Yes, absolutely. We use SSL encryption and PCI compliance to protect your data. Payment details are processed through secure third-party providers RazorPay and we never store full card numbers.'
        },
        {
          id: 14,
          question: 'Can I modify my order after placing it?',
          answer: 'If your order hasn\'t shipped yet, contact support@growingplayers.com within 24 hours to modify it. Once shipped, you cannot modify it, but you can return items per our return policy.'
        },
        {
          id: 15,
          question: 'Do you offer gift cards?',
          answer: 'Yes! Gift cards are available in amounts from ₹500 - ₹1000. Purchase them on our website, and recipients can use them toward any purchase. Gift cards never expire.'
        },
      ]
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          id: 16,
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days (free on orders over ₹500).'
        },
        // {
        //   id: 17,
        //   question: 'Do you ship internationally?',
        //   answer: 'We ship to select countries including Canada and Mexico. International orders may take 10-21 days and may be subject to customs duties. Check our Shipping Policy for full details and rates.'
        // },
        {
          id: 18,
          question: 'Can I track my order?',
          answer: 'Yes! When your order ships, you\'ll receive an email with a tracking number. Click the link to track your package in real-time with our carrier partners.'
        },
        {
          id: 19,
          question: 'Can I change my shipping address after ordering?',
          answer: 'If your order hasn\'t shipped yet, contact support@growingplayers.com immediately with your order number and new address. Once shipped, you cannot change it, but you can refuse delivery and reroute it.'
        },
        {
          id: 20,
          question: 'What if my package arrives damaged?',
          answer: 'Contact us within 48 hours with photos of the damage and packaging. We\'ll send a replacement free of charge with prepaid return shipping, or issue a full refund.'
        },
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          id: 21,
          question: 'What is your return policy?',
          answer: 'Most items can be returned within 7 days of purchase in unused, original condition. Food items are non-returnable. Defective items are replaced free. See our Return Policy page for full details.'
        },
        {
          id: 22,
          question: 'How do I start a return?',
          answer: 'Contact returns@growingplayers.com with your order number and reason for return. We\'ll email you a Return Merchandise Authorization (RMA) number and shipping instructions within 24 hours.'
        },
        {
          id: 23,
          question: 'Who pays for return shipping?',
          answer: 'For defective or damaged items, we provide a prepaid shipping label. For non-defective returns, you pay return shipping.'
        },
        {
          id: 24,
          question: 'How long does a refund take?',
          answer: 'After we receive and inspect your return (3-5 business days), we process the refund within 7 business days. It may take 1-2 additional billing cycles to appear in your account.'
        },
        {
          id: 25,
          question: 'Can I exchange items instead of returning them?',
          answer: 'Yes! Exchanges are available within 7 days for a different size, color, or product. We provide prepaid return shipping and free standard shipping on the new item.'
        },
      ]
    },
    // {
    //   category: 'Admin & Accounts (Business Users)',
    //   questions: [
    //     {
    //       id: 26,
    //       question: 'How do I access the admin dashboard?',
    //       answer: 'Admin users can access the dashboard at /admin after logging in with admin credentials. Contact support@growingplayers.com if you need admin access.'
    //     },
    //     {
    //       id: 27,
    //       question: 'What can I do in the admin dashboard?',
    //       answer: 'Admins can manage products, categories, orders, users, inventory, and view analytics. The dashboard provides complete business management tools.'
    //     },
    //     {
    //       id: 28,
    //       question: 'How do I upload product images?',
    //       answer: 'In the admin dashboard, go to Products, click "Add Product," and use the image upload field. Drag and drop or click to select JPEG, PNG, or WebP files up to 5MB.'
    //     },
    //     {
    //       id: 29,
    //       question: 'Can I set inventory limits?',
    //       answer: 'Yes! In the Inventory section of the admin dashboard, set maximum and minimum quantities for each product. The system alerts you when inventory runs low.'
    //     },
    //     {
    //       id: 30,
    //       question: 'How do I manage customer orders?',
    //       answer: 'Go to Orders in the admin dashboard. You can view all orders, update status, add notes, and filter by date, customer, or status. Customers receive email updates when status changes.'
    //     },
    //   ]
    // },
    {
      category: 'Promotions & Discounts',
      questions: [
        {
          id: 31,
          question: 'How do I get a discount code?',
          answer: 'Subscribe to our newsletter to receive exclusive discount codes. Follow us on social media for seasonal promotions. Contact our sales team for bulk order discounts.'
        },
        {
          id: 32,
          question: 'Do you have seasonal sales?',
          answer: 'Yes! We offer seasonal sales around holidays, baking season peaks, and special events. Subscribe to our newsletter to be notified of upcoming sales.'
        },
        {
          id: 33,
          question: 'Is the free shipping offer available to everyone?',
          answer: 'Free standard shipping (6-7 days) is available on all orders over ₹500. This applies to continental US addresses only.'
        },
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          id: 34,
          question: 'The website is loading slowly. What can I do?',
          answer: 'Try clearing your browser cache, disabling browser extensions, or using a different browser. If issues persist, contact support@growingplayers.com.'
        },
        {
          id: 35,
          question: 'I\'m having trouble checking out. What should I do?',
          answer: 'Try clearing browser cookies, using a different browser, or enabling JavaScript. Ensure your payment method is valid. If issues continue, email support@growingplayers.com.'
        },
        {
          id: 36,
          question: 'Can I use the website on my phone?',
          answer: 'Yes! Our website is fully mobile responsive. You can browse, shop, and manage your account on any smartphone or tablet.'
        },
        {
          id: 37,
          question: 'How do I report a bug or technical issue?',
          answer: 'Email support@growingplayers.com with a description of the issue, your browser type, and steps to reproduce. Include screenshots if possible.'
        },
      ]
    },
    {
      category: 'Contact & Support',
      questions: [
        {
          id: 38,
          question: 'How do I contact customer support?',
          answer: 'Email support@growingplayers.com anytime, or call 1800-1234-5678  Mon-Sat, 10 AM - 8 PM IST. Response time is typically within 24 hours.'
        },
        // {
        //   id: 39,
        //   question: 'What are your support hours?',
        //   answer: 'Email support is available 24/7. Phone support is available Monday-Friday, 9 AM-6 PM Pacific Time. We respond to emails within 24 business hours.'
        // },
        {
          id: 40,
          question: 'Do you have a physical store location?',
          answer: 'We currently operate online only. However, we may open physical showrooms in the future. Check our website for announcements.'
        },
      ]
    },
  ]

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <Layout>
      <div className="font-display bg-gradient-to-br from-primary-50 via-white to-rose-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gradient mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">
              Can't find the answer you're looking for? Email us at support@growingplayers.com
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqs.map((section, sectionIdx) => (
              <div key={sectionIdx} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Section Title */}
                <div className="bg-primary-600 text-white px-6 py-4">
                  <h2 className="text-2xl ">{section.category}</h2>
                </div>

                {/* Questions */}
                <div className="divide-y">
                  {section.questions.map((faq) => (
                    <div key={faq.id} className="border-b last:border-b-0">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex justify-between items-center group"
                      >
                        <h3 className=" text-gray-900 group-hover:text-primary-600 transition-colors">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 flex-shrink-0 transition-transform ${
                            expandedId === faq.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {expandedId === faq.id && (
                        <div className="px-6 py-4 bg-gray-50 border-t">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="mt-12 bg-primary-50 border-2 border-primary-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Still Need Help?</h2>
            <p className="text-gray-700 mb-2">
              We're here to help ! Reach out to our support team using any of these methods.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-2">
                <p className="font-bold text-gray-900 mb-2">Email</p>
                <p className="text-primary-600">support@growingplayers.com</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="font-bold text-gray-900 mb-2">Phone</p>
                <p className="text-primary-600">1800-1234-5678</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="font-bold text-gray-900 mb-2">Hours</p>
                <p className="text-primary-600">Mon - Sat,<br /> 10 AM - 8 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FAQ
