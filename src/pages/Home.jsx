import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Heart, Truck, Award, Star, Eye, Mail } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import { SkeletonLoader } from '../components/Loaders'
import { productAPI, categoryAPI, newsletterAPI } from '../services/api'
import { useState, useEffect } from 'react'
import homePicture from "../assets/homePicture.png"
import toast from 'react-hot-toast'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newsletter, setNewsletter] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
        ])

        // Get first 4 products as featured
        setFeaturedProducts((productsData || []).slice(0, 4))
        // Get first 3 categories
        setCategories((categoriesData || []).slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch data:', error)
        // Keep loading state false even if error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    if (!newsletter.trim()) {
      toast.error('Please enter your email')
      return
    }

    setSubscribing(true)
    try {
      await newsletterAPI.subscribe(newsletter)
      setNewsletter('')
    } catch (error) {
      console.error('Newsletter subscription error:', error)
    } finally {
      setSubscribing(false)
    }
  }

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Baker',
      role: 'Professional Pastry Chef',
      // image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      quote: 'Growing Players provides the highest quality ingredients. My clients love the premium finishing!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Priya Singh',
      role: 'Cake Designer',
      // image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      quote: 'The variety and quality of products are unmatched. Highly recommended for serious bakers.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Rahul Patel',
      role: 'Bakery Owner',
      // image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      quote: 'Consistent quality and fast delivery. Growing Players is my go-to supplier.',
      rating: 5,
    },
  ]

  const features = [
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Highest grade ingredients for professional results',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick delivery across India within 7-8 days',
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing without compromising quality',
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Join 1000+ happy bakers and pastry chefs',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-rose-50" />

        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 right-10 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [5, 0, 5],
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-10 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"
        />

        <div className="container-responsive relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(10vh-80px)]">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-primary-100/50 backdrop-blur-sm rounded-full border border-primary-200"
              > */}
              {/* <Sparkles size={18} className="text-primary-600" /> */}
              {/* <span className="text-primary-700 font-semibold">Welcome to Growing Players</span> */}
              {/* </motion.div> */}

              <h1 className="heading-h1 text-gray-900">
                Premium Cake Ingredients for{' '}
                <span className="text-gradient">Professional Bakers</span>
              </h1>

              <p className="text-x2 font-display text-start text-md text-black leading-relaxed max-w-lg ">
                Discover premium cake decoration ingredients crafted to elevate every creation. 
                Explore our collection of crushes, jellies, toppings, and bakery essentials 
                designed for bakers who value quality, creativity, and taste.
              </p>

              <div className="font-display flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  Shop Now
                  <ArrowRight size={20} />
                </Link>
                <Link to="/about" className="btn-secondary">
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-3xl font-bold text-primary-600">1K+</p>
                  <p className="font-display text-md text-black">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">10+</p>
                  <p className="font-display text-md text-black">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">4.5★</p>
                  <p className="font-display text-md text-black">Average Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={homePicture}
                  alt="Premium cake ingredients"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-8 right-8 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg"
                >
                  <p className="text-sm font-semibold text-gray-900">Premium Quality ✓</p>
                  <p className="text-xs text-gray-600">Certified & Approved</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          {/* <span className="text-sm font-medium">Scroll to explore</span> */}
          {/* <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg> */}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="card p-8 text-center hover:shadow-xl transition-shadow"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex p-4 bg-gradient-to-br from-primary-100 to-rose-100 rounded-full mb-4"
                  >
                    <Icon size={32} className="text-primary-600" />
                  </motion.div>
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="font-display text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="font-display py-20 bg-gray-50">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="font-display heading-h2 mb-4">Featured Products</h2>
            <p className="font-display text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our best-selling premium ingredients loved by bakers worldwide
            </p>
          </motion.div>

          {loading ? (
            <SkeletonLoader count={4} />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              className="grid font-display grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              View All Products
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="heading-h2 font-display text-gray-900 mb-4">Shop by Category</h2>
            <p className="font-display text-gray-600 text-lg max-w-2xl mx-auto">
              Organized collection of premium baking and decoration products
            </p>
          </motion.div>

          <div className="font-display grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <CategoryCard key={category.id} category={category} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="heading-h2 font-display text-gray-900 mb-4">What Our Customers Say</h2>
            <p className=" font-display text-gray-600 text-lg max-w-2xl mx-auto">
              Join thousands of satisfied bakers and pastry chefs
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                className="card-glass p-8"
              >
                <div className=" font-display flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{testimonial.quote}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-rose-500">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <h2 className="font-display heading-h2 mb-4">Join Our Newsletter</h2>
            <p className="font-display text-white/90 text-lg mb-8">
              Get exclusive deals, new product launches, and baking tips delivered to your inbox
            </p>
            <form className="font-display flex flex-col sm:flex-row gap-3" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none"
                disabled={subscribing}
              />
              <button
                type="submit"
                disabled={subscribing}
                className="px-8 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Creations Gallery */}
      <section className="font-display py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="heading-h2 text-gray-900 mb-4">Gallery of Excellence</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover stunning creations crafted with Growing Players premium ingredients. 
              From elegant wedding cakes to playful desserts, our products make magic happen.
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {[
              { title: 'Royal Velvet', category: 'Wedding', rating: 5 },
              { title: 'Choco Paradise', category: 'Chocolate', rating: 5 },
              { title: 'Berry Bliss', category: 'Fruits', rating: 5 },
              { title: 'Golden Sparkle', category: 'Glaze', rating: 5 },
              { title: 'Pink Perfection', category: 'Wedding', rating: 5 },
              { title: 'Mint Fantasy', category: 'Flavors', rating: 5 },
              { title: 'Caramel Dreams', category: 'Premium', rating: 5 },
              { title: 'Rainbow Joy', category: 'Colorful', rating: 5 },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Placeholder Image with Gradient */}
                <div className="aspect-square bg-gradient-to-br from-primary-500 via-accent-400 to-rose-500 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Eye className="text-white/40 w-12 h-12" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-white text-center">
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        {[...Array(item.rating)].map((_, j) => (
                          <Star key={j} size={14} fill="white" className="text-white" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-200 mb-3">{item.category}</p>
                      <button className="px-4 py-1 bg-white text-primary-600 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-white">
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Heart size={14} className="text-rose-500 group-hover:fill-rose-500 transition-all" />
                      <span className="text-xs text-gray-600">Loved</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gallery CTA */}
          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Eye size={18} />
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="font-display py-20 bg-gradient-to-r from-accent-500 to-primary-500 relative overflow-hidden">
        <motion.div
          animate={{
            x: [0, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />

        <div className="container-responsive relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-center text-white"
          >
            <h2 className="heading-h2 mb-6">Ready to Elevate Your Baking ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Start creating stunning cakes with our premium ingredients today.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Explore Premium Collection
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}

export default Home
