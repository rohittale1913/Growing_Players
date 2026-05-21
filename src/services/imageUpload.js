import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

/**
 * Upload image to Supabase Storage
 * @param {File} file - Image file to upload
 * @param {string} bucket - Bucket name (e.g., 'products', 'categories')
 * @param {string} folder - Optional folder name within bucket
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export const uploadImage = async (file, bucket = 'products', folder = '') => {
  try {
    if (!file) {
      throw new Error('No file selected')
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed')
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }

    // Create unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${random}.${ext}`

    // Build path
    const path = folder ? `${folder}/${filename}` : filename

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error('Image upload error:', error)
    toast.error(`Upload failed: ${error.message}`)
    throw error
  }
}

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - Public URL of image to delete
 * @param {string} bucket - Bucket name
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImage = async (imageUrl, bucket = 'products') => {
  try {
    if (!imageUrl) return false

    // Extract path from public URL
    const urlParts = imageUrl.split('/storage/v1/object/public/')
    if (urlParts.length < 2) return false

    const pathParts = urlParts[1].split('/')
    pathParts.shift() // Remove bucket name
    const path = pathParts.join('/')

    // Delete file
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Image delete error:', error)
    return false
  }
}

/**
 * Upload product image
 * @param {File} file - Image file
 * @returns {Promise<string>} - Public URL
 */
export const uploadProductImage = async (file) => {
  return uploadImage(file, 'products', 'product-images')
}

/**
 * Upload category image
 * @param {File} file - Image file
 * @returns {Promise<string>} - Public URL
 */
export const uploadCategoryImage = async (file) => {
  return uploadImage(file, 'products', 'category-images')
}

export default {
  uploadImage,
  deleteImage,
  uploadProductImage,
  uploadCategoryImage,
}
