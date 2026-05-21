import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight } from 'lucide-react'
import Layout from '../layouts/MainLayout'

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6 inline-flex p-6 bg-red-100 rounded-full"
          >
            <AlertCircle size={48} className="text-red-600" />
          </motion.div>

          <h1 className="heading-h1 text-gray-900 mb-4">404 - Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              Go Home
              <ArrowRight size={20} />
            </Link>
            <Link to="/products" className="btn-secondary">
              Shop Products
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default NotFound
