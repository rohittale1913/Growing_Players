import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, LinkedinIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <footer className="font-display bg-gray-900 text-gray-100">
      <div className="container-responsive">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-400">Get exclusive offers and updates delivered to your inbox</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button className="btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          </motion.div>
        </div>

        {/* Footer Content */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12"
        >
          {/* About */}
          <motion.div variants={item}>
            <h4 className="text-lg font-bold mb-4">Growing Player's</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Premium cake design ingredients and bakery decoration products for professional bakers and enthusiasts.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                <LinkedinIcon size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-500 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-primary-500 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Policies */}
          <motion.div variants={item}>
            <h4 className="text-lg font-bold mb-4">Policies</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-primary-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-primary-500 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-primary-500 transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item}>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Mail size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
                <a href="mailto:hello@growingplayers.com" className="hover:text-primary-500 transition-colors">
                  hello@growingplayers.com
                </a>
              </div>
              <div className="flex gap-3">
                <Phone size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
                <a href="tel:+919876543210" className="hover:text-primary-500 transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex gap-3">
                <MapPin size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/Pn6Fh8hwttrywoEs5" className="hover:text-primary-500 transition-colors">  <address className="not-italic">
                  Growing Player's <br />
                  Near Dr. Pathak House,<br />
                  Pannlal Nagar,<br />
                  Amravati - 444605
                </address></a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6 flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center">
            © 2026 Growing Player's Pvt Ltd. All rights reserved.
          </p>
          {/* <div className="flex gap-4">
            <img src="https://img.shields.io/badge/Visa-1434CB?style=flat&logo=visa&logoColor=white" alt="Visa" className="h-6" />
            <img src="https://img.shields.io/badge/Mastercard-EB001B?style=flat&logo=mastercard&logoColor=white" alt="Mastercard" className="h-6" />
            <img src="https://img.shields.io/badge/PayPal-003087?style=flat&logo=paypal&logoColor=white" alt="PayPal" className="h-6" />
          </div> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
