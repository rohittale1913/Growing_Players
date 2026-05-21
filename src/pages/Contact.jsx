import { useState } from 'react'
import toast from 'react-hot-toast'
import Layout from '../layouts/MainLayout'
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle2, Loader2, Home, HomeIcon } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const offices = [
    {
      city: 'Amravati (Head Office)',
      address: 'Growing Players, 123 Bakery Lane, Amravati, Teh:- Amravati, Dist:- Amravati - 110001, India',
      phone: '+91-11-4567-8901',
      email: 'amravati@growingplayers.com',
      hours: 'Mon - Sat: 10 AM - 8 PM\nSunday: Closed',
      timing: 'IST',
    },
    // {
    //   city: 'Mumbai',
    //   address: 'Growing Players, 456 Sweet Street, Mumbai - 400001, India',
    //   phone: '+91-22-4567-8902',
    //   email: 'mumbai@growingplayers.com',
    //   hours: 'Mon - Sat: 10 AM - 9 PM\nSunday: 11 AM - 7 PM',
    //   timing: 'IST',
    // },
    // {
    //   city: 'Bangalore',
    //   address: 'Growing Players, 789 Cake Plaza, Bangalore - 560001, India',
    //   phone: '+91-80-4567-8903',
    //   email: 'bangalore@growingplayers.com',
    //   hours: 'Mon - Sat: 10 AM - 8 PM\nSunday: 11 AM - 6 PM',
    //   timing: 'IST',
    // },
    // {
    //   city: 'Hyderabad',
    //   address: 'Growing Players, 321 Decoration Lane, Hyderabad - 500001, India',
    //   phone: '+91-40-4567-8904',
    //   email: 'hyderabad@growingplayers.com',
    //   hours: 'Mon - Sat: 10 AM - 8 PM\nSunday: 11 AM - 6 PM',
    //   timing: 'IST',
    // },
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call our support team for immediate assistance',
      info: '(1800 476 8946)',
      highlight: '10 AM - 8 PM (Mon to Sat)',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email for detailed inquiries and feedback.',
      info: 'support@growingplayers.com',
      highlight: 'Response within 24 hours',
    },
    // {
    //   icon: MapPin,
    //   title: 'Visit Us',
    //   description: 'Visit any of our showrooms across India',
    //   info: '4 Showrooms\nPan-India Presence',
    //   highlight: 'Find nearest store',
    // },
    // {
    //   icon: Clock,
    //   title: 'Business Hours',
    //   description: 'We are available for your support needs',
    //   info: 'Mon-Sat: 10 AM - 8 PM\nSunday: 11 AM - 6 PM',
    //   highlight: 'Indian Standard Time (IST)',
    // },
  ]

  const faqs = [
    {
      q: 'What is your response time for inquiries?',
      a: 'We typically respond to emails within 24 hours during business hours. For urgent matters, please call our phone support line.',
    },
    {
      q: 'Do you have physical stores in India?',
      a: 'Yes! We have 4 showrooms across major Indian cities - Delhi, Mumbai, Bangalore, and Hyderabad. Visit us to see our full product range.',
    },
    {
      q: 'Can I order products outside India?',
      a: 'Currently, we primarily serve customers within India. We are expanding internationally and will launch global shipping soon.',
    },
    {
      q: 'How can I become a bulk supplier or distributor?',
      a: 'Contact our sales team at sales@growingplayers.com or call +91-11-4567-8901 for bulk inquiries and distributor opportunities.',
    },
    {
      q: 'Do you offer customized product solutions?',
      a: 'Yes! We offer customized solutions for corporate events and bulk orders. Please contact our sales team to discuss your requirements.',
    },
    {
      q: 'How do I report a product quality issue?',
      a: 'Contact our customer service team immediately at support@growingplayers.com or call us. We ensure 100% customer satisfaction.',
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      toast.success('Message sent successfully! We will contact you soon.')
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="font-display min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-rose-500">
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-amber-100">
              We'd love to hear from you. Contact Growing Players today!
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {contactMethods.map((method, idx) => {
                const Icon = method.icon
                return (
                  <div
                    key={idx}
                    className="card hover:shadow-lg transition-shadow text-center p-2"
                  >
                    <Icon className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800 ">{method.title}</h3>
                    <p className="text-sm text-gray-600 ">{method.description}</p>
                    <p className="text-gray-800 font-semibold whitespace-pre-line text-sm mb-2">
                      {method.info}
                    </p>
                    <span className="inline-block text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                      {method.highlight}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-4 bg-amber-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Send us a Message</h2>

            {submitted ? (
              <div className="card bg-green-50 border-2 border-green-200 text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">Thank You!</h3>
                <p className="text-green-600 mb-2">Your message has been sent successfully.</p>
                <p className="text-gray-600">
                  Our team will review your message and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="card bg-white p-8 lg:p-10 shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91-XXXXXXXXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="product_inquiry">Product Inquiry</option>
                      <option value="bulk_order">Bulk Order</option>
                      <option value="distributor">Distributor Partnership</option>
                      <option value="complaint">Complaint/Issue</option>
                      <option value="feedback">Feedback/Suggestion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>All fields marked with * are required. We respond within 24 hours.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Offices in India</h2>
            <div className="flex justify-center text-center">
              {offices.map((office, idx) => (
                <div
                  key={idx}
                  className="card bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-shadow "
                >
                  <h3 className="text-2xl font-bold text-gray-800 px-4 pb-0 pt-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-gray-600" />
                    {office.city}
                  </h3>

                  <div className="space-y-1 px-5 pt-2 pb-4">
                    <div className='flex'>
                      <p className="text-sm text-gray-600 font-semibold  flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Address:- <a href="/location"
                          className="text-amber-600 hover:text-amber-700 font-semibold"
                        >
                          {office.address}
                        </a> </p>
                    </div>

                    <div className='flex'>
                      <p className="text-sm text-gray-600 font-semibold  flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone:-
                        <a
                          href={`tel:${office.phone.replace(/\s+/g, '')}`}
                          className="text-amber-600 hover:text-amber-700 font-semibold"
                        >
                          {office.phone}
                        </a>
                      </p>
                    </div>

                    <div className='flex'>
                      <p className="text-sm text-gray-600 font-semibold  flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email:-
                        <a
                          href={`mailto:${office.email}`}
                          className="text-amber-600 hover:text-amber-700 font-semibold"
                        >
                          {office.email}
                        </a>
                      </p>
                    </div>

                    <div className='flex'>
                      <p className="text-sm text-gray-600 font-semibold  flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Business Hours:- <a href="/location"
                          className="text-amber-600 hover:text-amber-700 font-semibold"
                        >
                          {office.hours} {office.timing}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-amber-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="card cursor-pointer group hover:shadow-md transition-shadow"
                >
                  <summary className="flex items-start gap-3 p-4  text-gray-900 list-none">
                    <span className="text-amber-600 font-bold pt-1">+</span>
                    <span className="group-open:text-amber-600 transition-colors">{faq.q}</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 border-t border-gray-200 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-rose-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Baking Journey ?</h2>
            <p className="text-lg text-amber-100 mb-8">
              Explore our wide range of premium baking supplies and cake decoration products.
            </p>
            <a
              href="/products"
              className="btn bg-white text-amber-500 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Shop Our Products
            </a>
          </div>
        </section>
      </div>
    </Layout>
  )
}
