import Layout from '../layouts/MainLayout'
import { ArrowUp } from 'lucide-react'
import { useState } from 'react'

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(0)

  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, such as:
      
• Account Information: When you create an account, we collect your name, email address, phone number, and password.

• Payment Information: When you make a purchase, we collect billing address, shipping address, payment method details (processed securely through Stripe/PayPal), and order history.

• Communication Information: When you contact our customer support, subscribe to newsletters, or participate in surveys, we collect the information you provide.

• Device Information: We automatically collect information about your device, including IP address, browser type, operating system, referring URLs, and pages visited.

• Cookies and Tracking Technologies: We use cookies, pixels, and similar tracking technologies to enhance your browsing experience and understand user behavior.`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect for various purposes:

• Account Management: Creating and managing your account, processing transactions, and sending transactional emails.

• Order Fulfillment: Preparing, shipping, and delivering your orders, and providing customer support.

• Marketing & Communication: Sending promotional emails, newsletters, and marketing communications (you can opt out anytime).

• Personalization: Customizing your experience, recommending products, and displaying relevant content.

• Analytics: Understanding user behavior to improve our website, services, and customer experience.

• Security & Fraud Prevention: Protecting against fraudulent activity and ensuring platform security.

• Legal Compliance: Complying with legal obligations and enforcing our terms and agreements.`,
    },
    {
      title: '3. Information Sharing',
      content: `We may share your information with:

• Service Providers: Third-party vendors who assist us in operating our website and conducting business (hosting providers, payment processors, shipping companies, email services).

• Legal Requirements: If required by law, subpoena, or government request.

• Business Transfers: In the event of a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.

• With Your Consent: We may share your information when you explicitly consent to such sharing.

We do NOT sell or rent your personal information to third parties for their marketing purposes. We take data privacy seriously and maintain strict data protection standards.`,
    },
    {
      title: '4. Data Security',
      content: `We implement comprehensive security measures to protect your information:

• Encryption: All sensitive data is encrypted using SSL/TLS technology.

• Secure Servers: Our servers are protected by firewalls and security systems.

• Access Controls: Only authorized employees have access to personal information, and they are bound by confidentiality agreements.

• Regular Audits: We regularly audit and update our security practices.

• Compliance: We comply with industry standards and regulations such as GDPR and CCPA.

While we strive to maintain security, no method is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.`,
    },
    {
      title: '5. Your Privacy Rights',
      content: `Depending on your location, you may have the following rights:

• Access: You can request access to the personal information we hold about you.

• Correction: You can request correction of inaccurate or incomplete information.

• Deletion: You can request deletion of your information (subject to legal retention requirements).

• Portability: You can request a copy of your data in a portable format.

• Opt-Out: You can opt out of marketing communications and certain data processing activities.

• Object: You can object to certain processing of your data.

To exercise any of these rights, please contact us at privacy@growingplayers.com.`,
    },
    {
      title: '6. Cookies & Tracking',
      content: `We use cookies and similar technologies for:

• Session Management: Keeping you logged in during your visit.

• Preferences: Remembering your preferences and settings.

• Analytics: Understanding how you use our website.

• Marketing: Targeting ads and measuring campaign effectiveness.

You can control cookie settings in your browser. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, blocking cookies may affect functionality.

We respect Do Not Track (DNT) signals and do not collect behavioral data for third-party advertising when DNT is enabled.`,
    },
    {
      title: '7. Third-Party Links',
      content: `Our website may contain links to third-party websites. This Privacy Policy applies only to Growing Players. We are not responsible for the privacy practices of external websites. We encourage you to review the privacy policies of any third-party sites before providing your information.`,
    },
    {
      title: '8. Children\'s Privacy',
      content: `Growing Players is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete such information immediately. Parents who believe their child has provided information to us should contact us at privacy@growingplayers.com.`,
    },
    {
      title: '9. California Privacy Rights',
      content: `California residents have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):

• Right to Know: You can request what personal information we collect and how it's used.

• Right to Delete: You can request deletion of personal information we've collected.

• Right to Opt-Out: You can opt out of the sale or sharing of personal information.

• Right to Correct: You can request correction of inaccurate personal information.

• Right to Non-Discrimination: We will not discriminate against you for exercising your CCPA/CPRA rights.

To make a request, contact privacy@growingplayers.com or use our data request portal on our website.`,
    },
    {
      title: '10. European Privacy Rights',
      content: `For residents of the European Economic Area, we comply with the General Data Protection Regulation (GDPR):

• Legal Basis: We process your information based on consent, contract performance, legal obligations, or legitimate interests.

• Data Protection Officer: You can contact our DPO at dpo@growingplayers.com.

• International Transfers: We implement appropriate safeguards for data transfers outside the EEA.

• Withdrawal of Consent: You can withdraw consent for processing at any time.

• Complaints: You have the right to lodge a complaint with your local data protection authority.`,
    },
    {
      title: '11. Policy Changes',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated policy on our website and updating the "Effective Date" at the top. Your continued use of our website following the posting of changes constitutes your acceptance of the updated Privacy Policy.`,
    },
    {
      title: '12. Contact Us',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:

Email: privacy@growingplayers.com
Phone: 1-800-GROWING (1-800-476-8946)
Mailing Address:
Growing Players
Privacy Department
123 Bakery Lane
San Francisco, CA 94103
USA

We will respond to your inquiry within 30 days.`,
    },
  ]

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 via-white to-rose-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Last Updated: January 2024
            </p>
            <p className="text-gray-600 mt-4">
              At Growing Players, we are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSection(idx)
                    document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`text-left p-3 rounded-lg transition-all ${
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
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

export default PrivacyPolicy
