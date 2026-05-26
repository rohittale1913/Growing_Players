import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X, Loader2, FolderOpen, Upload } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { categoryAPI } from '../../services/api'
import { supabase } from '../../lib/supabase'
import { uploadCategoryImage } from '../../services/imageUpload'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryAPI.getAll()
      setCategories(data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openModal = (mode, category = null) => {
    setModalMode(mode)
    setImageFile(null)
    setImagePreview('')

    if (mode === 'edit' && category) {
      setSelectedCategory(category)
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
      })
      setImagePreview(category.image || '')
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCategory(null)
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
      let imageUrl = formData.image

      // Upload image if file selected
      if (imageFile) {
        setImageUploading(true)
        imageUrl = await uploadCategoryImage(imageFile)
        setImageUploading(false)
      }

      const categoryData = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
      }

      if (modalMode === 'add') {
        const { error } = await supabase.from('categories').insert([categoryData])
        if (error) throw error
        toast.success('Category created successfully!')
      } else {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', selectedCategory.id)
        if (error) throw error
        toast.success('Category updated successfully!')
      }
      closeModal()
      fetchCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error('Failed to save category')
    } finally {
      setSubmitting(false)
      setImageUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      toast.success('Category deleted successfully!')
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 font-display">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">Manage product categories</p>
          </div>
          <button
            onClick={() => openModal('add')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No categories found</p>
            <button
              onClick={() => openModal('add')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FolderOpen size={20} className="text-primary-600" />
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('edit', category)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalMode === 'add' ? 'Add Category' : 'Edit Category'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter category name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter category description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-w-xs h-40 object-cover rounded-lg border-2 border-primary-200"
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
                        id="category-image-input"
                      />
                      <label
                        htmlFor="category-image-input"
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-500 cursor-pointer transition-colors bg-primary-50 hover:bg-primary-100"
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

                  <div className="flex gap-4 pt-4">
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
                      {submitting || imageUploading ? 'Saving...' : (modalMode === 'add' ? 'Create' : 'Update')}
                    </button>
                  </div>
                </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminCategories
