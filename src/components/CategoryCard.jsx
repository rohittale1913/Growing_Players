import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const CategoryCard = ({ category, index }) => {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative h-64 md:h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
    >
      {/* Background Image */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-colors" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <Link to={`/products?category=${category.id}`}>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
            {category.name}
          </h3>
        </Link>
        <p className="text-gray-200 text-sm mb-4 line-clamp-2">
          {category.description}
        </p>
        <Link
          to={`/products?category=${category.id}`}
          className="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors w-fit"
        >
          <span className="font-semibold">Browse Products</span>
          <motion.span
            group-hover={{ x: 4 }}
          >
            <ArrowRight size={18} />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  )
}

export default CategoryCard
