import Layout from '../layouts/MainLayout'
import { ArrowUp } from 'lucide-react'
import { useState } from 'react'

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState(0)

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the Growing Players website (the "Site") and services, you agree to be bound by these Terms & Conditions. If you do not agree to any part of these terms, please do not use our Site or services. These terms apply to all users, including but not limited to browsers, customers, vendors, and contributors of content. If you do not accept our terms, please stop using the Site immediately.`,
    },
    {
      title: '2. User Accounts',
      content: `Account Creation:
• You are responsible for providing accurate and complete information during registration.
• You are responsible for maintaining the confidentiality of your password and account.
• You agree to accept responsibility for all activity under your account.

Account Termination:
• We reserve the right to suspend or terminate accounts that violate these terms.
• You can delete your account at any time by contacting support@growingplayers.com.
• Upon termination, we will retain your data as required by law but will not use it for marketing purposes.`,
    },
    {
      title: '3. Product Information & Availability',
      content: `Product Descriptions:
• We strive to provide accurate product descriptions, images, and pricing.
• However, we do not warrant that descriptions, images, or other content are accurate, complete, or error-free.
• We reserve the right to correct any errors in product information or pricing.

Availability:
• All products are subject to availability.
• We reserve the right to limit quantities per order.
• We reserve the right to discontinue any product at any time.
• We will notify you if an item is out of stock before charging your payment method.

Pricing:
• All prices are in Indian Currency unless otherwise specified.
• Prices are subject to change without notice.
• We reserve the right to refuse orders at our discretion.`,
    },
    {
      title: '4. Ordering & Payment',
      content: `Order Placement:
• When you place an order, you are making an offer to purchase products at the displayed price.
• We reserve the right to accept or reject any order at our discretion.
• Order confirmation will be sent to your email address.

Payment:
• We accept major credit cards, debit cards, UPI and other payment methods as displayed.
• You authorize us to charge your payment method for the full order amount.
• All payment information is processed securely through third-party payment processors.
• You are responsible for all charges associated with your account.
• Fraudulent or unauthorized transactions must be reported within 48 hours.

Taxes & Fees:
• Sales tax is calculated based on your shipping address.
• Shipping fees are calculated during checkout.
• Additional fees may apply for expedited shipping or special handling.`,
    },
    {
      title: '5. Shipping & Delivery',
      content: `Shipping:
• We ship to addresses within the India.
• Shipping timeframes are estimates and not guarantees.
• We are not responsible for delays caused by carriers or weather.
• International shipping may be available for select items (see Shipping Policy).

Risk of Loss:
• Risk of loss passes to you upon delivery to the carrier.
• For lost or damaged shipments, contact us within 48 hours of delivery.
• Insurance is included on select items; damaged items can be returned for replacement.

Delivery Address:
• You are responsible for providing a correct delivery address.
• We will not be liable for deliveries to incorrect addresses provided by you.
• You must be present or arrange for someone to accept delivery.`,
    },
    {
      title: '6. Returns & Refunds',
      content: `Return Policy:
• Most items can be returned within 7 days of purchase in original, unused condition.
• Food items and perishables are non-returnable due to health and safety regulations.
• Custom or made-to-order items may have different return policies.
• Return shipping cost is the responsibility of the customer unless the item is defective.

Defective Items:
• If you receive a defective or damaged item, contact us within 48 hours.
• We will replace the item or issue a full refund at our discretion.
• Return shipping will be provided for defective items.

Refund Processing:
• Refunds will be issued to your original payment method within 7-10 business days.
• In some cases, it may take 1-2 billing cycles for the refund to appear.
• Shipping charges are generally non-refundable except for our error or defective items.

See our full Return Policy for detailed information.`,
    },
    {
      title: '7. User-Generated Content',
      content: `By submitting content to our Site (reviews, comments, photos, etc.), you grant us a worldwide, royalty-free, perpetual license to use, reproduce, modify, and display that content.

You represent and warrant that:
• You own or have permission to use the content you submit.
• The content does not violate any third-party rights.
• The content is accurate and not misleading.
• You comply with applicable laws and regulations.

We reserve the right to:
• Remove any content that violates these terms or is inappropriate.
• Edit content for clarity or to remove offensive material.
• Use submitted content in marketing and promotional materials.`,
    },
    {
      title: '8. Intellectual Property Rights',
      content: `Ownership:
• All content on the Site, including text, graphics, logos, images, and software, is the property of Growing Players or our licensors.
• You may not reproduce, distribute, modify, or transmit any content without our prior written consent.

Limited License:
• We grant you a limited, non-exclusive, non-transferable license to view and use the Site for personal, non-commercial purposes.
• You may not use the Site for any illegal or unauthorized purpose.
• You may not scrape, crawl, or use automated tools to access our Site.

Trademarks:
• "Growing Players" and related logos are trademarks of Growing Players, Inc.
• You may not use our trademarks without prior written permission.`,
    },
    {
      title: '9. Prohibited Conduct',
      content: `You agree not to:
• Use the Site for illegal purposes or in violation of any laws.
• Harass, threaten, or defame any user or staff member.
• Upload or transmit viruses, malware, or harmful code.
• Attempt to gain unauthorized access to our systems.
• Scrape, crawl, or use automated tools without permission.
• Post spam, phishing attempts, or fraudulent content.
• Resell products obtained from us without authorization.
• Engage in any deceptive or fraudulent activity.
• Violate any intellectual property rights.
• Impersonate any person or entity.

Violations may result in account suspension or termination and legal action.`,
    },
    {
      title: '10. Third-Party Links',
      content: `Our Site may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of external sites. Your use of third-party sites is at your own risk and subject to their terms and privacy policies. We do not endorse any third-party websites or services unless explicitly stated. You should review the terms and privacy policies of any external site before providing your information.`,
    },
    {
      title: '11. Dispute Resolution',
      content: `Informal Resolution:
• In the event of a dispute, we encourage you to contact us at support@growingplayers.com.
• We will make good faith efforts to resolve disputes within 30 days.

Class Action Waiver:
• You agree that disputes will be resolved individually, not as part of any class action.
• You waive the right to bring claims against us in a class action format.

Exceptions:
• Intellectual property claims may be brought in court.
• We may pursue claims in small claims court if the amount is within small claims jurisdiction.`,
    },
    {
      title: '12. Modifications to Terms',
      content: `We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting to the Site. Your continued use of the Site following any changes constitutes your acceptance of the updated terms. We will notify you of material changes via email or prominent notice on our Site. If you do not agree to the changes, please stop using the Site immediately.`,
    },
    {
      title: '13. Governing Law',
      content: `These Terms & Conditions shall be governed by and construed in accordance with the laws, without regard to its conflict of law provisions. Any legal proceedings arising from or related to these terms shall be subject to the jurisdiction and venue of the state.`,
    },
    {
      title: '14. Contact Information',
      content: `If you have questions or concerns regarding these Terms & Conditions, please contact us:
Email: legal@growingplayers.com
Phone: 1800-1234-5678
Mailing Address:
Growing Players, 123 Bakery Lane, San Francisco, CA 94103, USA.

Response Time: We will respond to inquiries within 7 business days.`,
    },
  ]

  return (
    <Layout>
      <div className="font-display bg-gradient-to-br from-primary-50 via-white to-rose-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
            {/* <p className="text-lg text-gray-600">
              Last Updated: January 2024
            </p> */}
            <p className="text-gray-600 mt-2">
              Please read these Terms & Conditions carefully before using the Growing Players website and services.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSection(idx)
                    document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`text-left p-2 rounded-lg transition-all ${
                    activeSection === idx
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div
                key={idx}
                id={`section-${idx}`}
                className="bg-white rounded-lg shadow-md p-8 scroll-mt-20"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Back to Top */}
          <div className="mt-12 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 btn-primary"
            >
              <ArrowUp size={18} />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TermsConditions
