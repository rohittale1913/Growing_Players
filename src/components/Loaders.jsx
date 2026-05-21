import { motion } from 'framer-motion'

export const SkeletonLoader = ({ count = 4, variant = 'product' }) => {
  if (variant === 'product') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton h-48 md:h-56" />
            <div className="p-4">
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-5 w-full mb-2" />
              <div className="skeleton h-5 w-3/4 mb-4" />
              <div className="flex gap-2 mb-3">
                <div className="skeleton h-4 w-12" />
                <div className="skeleton h-4 w-12" />
              </div>
              <div className="skeleton h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'category') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton h-64 md:h-80 rounded-2xl" />
        ))}
      </div>
    )
  }
}

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size]

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClass} border-4 border-primary-200 border-t-primary-600 rounded-full`}
      />
    </div>
  )
}

export const EmptyState = ({ title = 'No items found', description = '', icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      {Icon && (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4 p-4 bg-gray-100 rounded-full"
        >
          <Icon size={32} className="text-gray-400" />
        </motion.div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </motion.div>
  )
}

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" />
    </div>
  )
}
