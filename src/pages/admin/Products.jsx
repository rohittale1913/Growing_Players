import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, X, Loader2, Image as ImageIcon, Upload } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { productAPI, categoryAPI } from '../../services/api'
import { uploadProductImage } from '../../services/imageUpload'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    stock: '',
    image: '',
    premium: false,
    manufactured_packed_by_name: '',
    manufactured_packed_by_address: '',
    manufactured_lic_no: '',
    marketed_by_name: '',
    marketed_by_address: '',
    marketed_lic_no: '',
    product_dimensions: '',
    date_first_available: '',
    item_weight: '',
    item_model_number: '',
    net_quantity: '',
    country_of_origin: '',
    included_components: '',
    generic_name: '',
    asin: '',
    sku: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll()
      const categoryList = Array.isArray(data) ? data : []
      setCategories(categoryList)
      console.log('Categories loaded:', categoryList)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productAPI.getAll()
      setProducts(data || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : 'Uncategorized'
  }

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openModal = (mode, product = null) => {
    setModalMode(mode)
    setImageFile(null)
    setImagePreview('')

    if (mode === 'edit' && product) {
      setSelectedProduct(product)
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        category_id: product.category_id || '',
        stock: product.stock || '',
        image: product.image || '',
        premium: product.premium || false,
        manufactured_packed_by_name: product.manufactured_packed_by_name || '',
        manufactured_packed_by_address: product.manufactured_packed_by_address || '',
        manufactured_lic_no: product.manufactured_lic_no || '',
        marketed_by_name: product.marketed_by_name || '',
        marketed_by_address: product.marketed_by_address || '',
        marketed_lic_no: product.marketed_lic_no || '',
        product_dimensions: product.product_dimensions || '',
        date_first_available: product.date_first_available || '',
        item_weight: product.item_weight || '',
        item_model_number: product.item_model_number || '',
        net_quantity: product.net_quantity || '',
        country_of_origin: product.country_of_origin || '',
        included_components: product.included_components || '',
        generic_name: product.generic_name || '',
        asin: product.asin || '',
        sku: product.sku || '',
      })
      setImagePreview(product.image || '')
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        category_id: '',
        stock: '',
        image: '',
        premium: false,
        manufactured_packed_by_name: '',
        manufactured_packed_by_address: '',
        manufactured_lic_no: '',
        marketed_by_name: '',
        marketed_by_address: '',
        marketed_lic_no: '',
        product_dimensions: '',
        date_first_available: '',
        item_weight: '',
        item_model_number: '',
        net_quantity: '',
        country_of_origin: '',
        included_components: '',
        generic_name: '',
        asin: '',
        sku: '',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    setImageFile(null)
    setImagePreview('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP, and GIF images are allowed')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB')
      return
    }

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name?.trim()) {
        toast.error('Product name is required')
        setSubmitting(false)
        return
      }

      if (!formData.price || formData.price <= 0) {
        toast.error('Valid price is required')
        setSubmitting(false)
        return
      }

      if (!formData.stock || formData.stock < 0) {
        toast.error('Valid stock quantity is required')
        setSubmitting(false)
        return
      }

      if (!formData.category_id) {
        toast.error('Please select a category')
        setSubmitting(false)
        return
      }

      let imageUrl = formData.image

      // Upload image if file selected
      if (imageFile) {
        setImageUploading(true)
        imageUrl = await uploadProductImage(imageFile)
        setImageUploading(false)
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock),
        image: imageUrl,
      }

      if (modalMode === 'add') {
        await productAPI.create(productData)
        toast.success('Product created successfully!')
      } else {
        await productAPI.update(selectedProduct.id, productData)
        toast.success('Product updated successfully!')
      }

      closeModal()
      fetchProducts()
    } catch (error) {
      console.error('Failed to save product:', error)
      const errorMessage = error?.message || 'Failed to save product'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
      setImageUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await productAPI.delete(id)
      toast.success('Product deleted successfully!')
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 font-display">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage your product catalog</p>
          </div>
          <button
            onClick={() => openModal('add')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No products found</p>
            <button
              onClick={() => openModal('add')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add First Product
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">₹{product.price?.toLocaleString('en-IN')}</p>
                        {product.original_price && (
                          <p className="text-sm text-gray-600 line-through">
                            ₹{product.original_price.toLocaleString('en-IN')}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 20
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getCategoryName(product.category_id)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal('edit', product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Product Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalMode === 'add' ? 'Add Product' : 'Edit Product'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Product Name and Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Price Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sale Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price
                      </label>
                      <input
                        type="number"
                        name="original_price"
                        value={formData.original_price}
                        onChange={handleChange}
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Stock & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white relative z-10"
                      >
                        <option value="">Select a Category</option>
                        {Array.isArray(categories) && categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No categories available</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Premium Checkbox */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-primary-50 to-rose-50 p-4 rounded-lg border border-primary-200">
                  <input
                    type="checkbox"
                    id="premium"
                    name="premium"
                    checked={formData.premium}
                    onChange={(e) => setFormData({ ...formData, premium: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  />
                  <label htmlFor="premium" className="text-sm font-medium text-gray-700 cursor-pointer">
                    ⭐ Mark as Premium Product (Featured on Home Page)
                  </label>
                </div>

                  {/* Manufacturer Details */}
                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Manufacturer & Marketing Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufactured & Packed By (Name)
                      </label>
                      <input
                        type="text"
                        name="manufactured_packed_by_name"
                        value={formData.manufactured_packed_by_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., ROSIER FOODS PVT. LTD."
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufactured Address
                      </label>
                      <textarea
                        name="manufactured_packed_by_address"
                        value={formData.manufactured_packed_by_address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter complete address"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufacturing License Number
                      </label>
                      <input
                        type="text"
                        name="manufactured_lic_no"
                        value={formData.manufactured_lic_no}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 12724051000040"
                      />
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marketed By (Name)
                      </label>
                      <input
                        type="text"
                        name="marketed_by_name"
                        value={formData.marketed_by_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., ROSIER FOODS PVT. LTD."
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marketed By Address
                      </label>
                      <textarea
                        name="marketed_by_address"
                        value={formData.marketed_by_address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter complete address"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marketing License Number
                      </label>
                      <input
                        type="text"
                        name="marketed_lic_no"
                        value={formData.marketed_lic_no}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 10021011000233"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ImageIcon size={16} className="inline mr-2" />
                      Product Image
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-w-xs h-48 object-cover rounded-lg border-2 border-primary-200"
                        />
                        {imageFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null)
                              setImagePreview(formData.image)
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    )}

                    {/* File Input */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={imageUploading}
                        className="hidden"
                        id="image-input"
                      />
                      <label
                        htmlFor="image-input"
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-500 cursor-pointer transition-colors bg-primary-50 hover:bg-primary-100 disabled:opacity-50"
                      >
                        <Upload size={20} className="text-primary-600" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {imageUploading ? 'Uploading...' : 'Click to upload image'}
                          </p>
                          <p className="text-xs text-gray-600">PNG, JPG, WebP, GIF (max 5MB)</p>
                        </div>
                      </label>
                    </div>

                    {/* Current Image Info */}
                    {formData.image && !imageFile && (
                      <p className="mt-2 text-xs text-gray-600">
                        Current image: {formData.image.split('/').pop()}
                      </p>
                    )}
                  </div>

                  {/* Additional Product Details */}
                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Additional Product Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ASIN / Identifier
                        </label>
                        <input
                          type="text"
                          name="asin"
                          value={formData.asin}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., B0BDVG99J5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU
                        </label>
                        <input
                          type="text"
                          name="sku"
                          value={formData.sku}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., CL1038M"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Dimensions
                        </label>
                        <input
                          type="text"
                          name="product_dimensions"
                          value={formData.product_dimensions}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., 4.9 x 3.9 x 15.99 cm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Weight
                        </label>
                        <input
                          type="text"
                          name="item_weight"
                          value={formData.item_weight}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., 120 g"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Model Number
                        </label>
                        <input
                          type="text"
                          name="item_model_number"
                          value={formData.item_model_number}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., CL1038M"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Net Quantity
                        </label>
                        <input
                          type="text"
                          name="net_quantity"
                          value={formData.net_quantity}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., 100.0 Grams"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country of Origin
                        </label>
                        <input
                          type="text"
                          name="country_of_origin"
                          value={formData.country_of_origin}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., India"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date First Available
                        </label>
                        <input
                          type="text"
                          name="date_first_available"
                          value={formData.date_first_available}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., 10 September 2022"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Generic Name / Product Type
                      </label>
                      <input
                        type="text"
                        name="generic_name"
                        value={formData.generic_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Face Moisturizer & Day Cream"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Included Components
                      </label>
                      <textarea
                        name="included_components"
                        value={formData.included_components}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Skin Moisturizer"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={submitting || imageUploading}
                      className="flex-1 btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || imageUploading}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {(submitting || imageUploading) && <Loader2 size={18} className="animate-spin" />}
                      {submitting || imageUploading ? 'Saving...' : (modalMode === 'add' ? 'Create Product' : 'Update Product')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminProducts
