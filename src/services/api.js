import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// Products API
export const productAPI = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Failed to fetch products')
      throw error
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Failed to fetch product')
      throw error
    }
  },

  async getByCategory(categoryId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Failed to fetch products')
      throw error
    }
  },

  async search(query) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },

  async create(product) {
    try {
      // Validate required fields
      if (!product.name || !product.price || !product.stock || !product.category_id) {
        throw new Error('Missing required fields: name, price, stock, and category_id')
      }

      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()

      if (error) {
        console.error('Create product error details:', error)
        throw new Error(error.message || 'Failed to create product')
      }
      toast.success('Product created successfully')
      return data[0]
    } catch (error) {
      console.error('Product creation failed:', error.message)
      toast.error(error.message || 'Failed to create product')
      throw error
    }
  },

  async update(id, product) {
    try {
      // Validate required fields
      if (!product.name || !product.price || !product.stock || !product.category_id) {
        throw new Error('Missing required fields: name, price, stock, and category_id')
      }

      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()

      if (error) {
        console.error('Update product error details:', error)
        throw new Error(error.message || 'Failed to update product')
      }
      toast.success('Product updated successfully')
      return data[0]
    } catch (error) {
      console.error('Product update failed:', error.message)
      toast.error(error.message || 'Failed to update product')
      throw error
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)

      if (error) throw error
      toast.success('Product deleted successfully')
    } catch (error) {
      toast.error('Failed to delete product')
      throw error
    }
  },
}

// Categories API
export const categoryAPI = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Failed to fetch categories')
      throw error
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },
}

// Orders API
export const orderAPI = {
  async getAll(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Failed to fetch orders')
      throw error
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },

  async create(order) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()

      if (error) throw error
      toast.success('Order created successfully')
      return data[0]
    } catch (error) {
      toast.error('Failed to create order')
      throw error
    }
  },

  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date() })
        .eq('id', id)
        .select()

      if (error) throw error
      toast.success('Order status updated')
      return data[0]
    } catch (error) {
      toast.error('Failed to update order')
      throw error
    }
  },
}

// Cart API
export const cartAPI = {
  async addItem(userId, productId, quantity) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, quantity }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      throw error
    }
  },

  async removeItem(itemId) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
    } catch (error) {
      throw error
    }
  },

  async updateQuantity(itemId, quantity) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      throw error
    }
  },

  async getCart(userId) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:product_id(*)')
        .eq('user_id', userId)

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },
}

// Wishlist API
export const wishlistAPI = {
  async add(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .insert([{ user_id: userId, product_id: productId }])
        .select()

      if (error) throw error
      toast.success('Added to wishlist')
      return data[0]
    } catch (error) {
      throw error
    }
  },

  async remove(userId, productId) {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) throw error
      toast.success('Removed from wishlist')
    } catch (error) {
      throw error
    }
  },

  async getAll(userId) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, product:product_id(*)')
        .eq('user_id', userId)

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },
}

// File upload API
export const fileAPI = {
  async uploadImage(file, bucket = 'products') {
    try {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (error) throw error
      
      const publicUrl = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return publicUrl.data.publicUrl
    } catch (error) {
      toast.error('Failed to upload image')
      throw error
    }
  },

  async deleteImage(filePath, bucket = 'products') {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath])

      if (error) throw error
    } catch (error) {
      toast.error('Failed to delete image')
      throw error
    }
  },
}

// Newsletter API
export const newsletterAPI = {
  async subscribe(email) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email, subscribed_at: new Date() }])
        .select()

      if (error) throw error
      toast.success('Successfully subscribed to our newsletter!')
      return data[0]
    } catch (error) {
      if (error.code === '23505') {
        toast.error('Email already subscribed')
      } else {
        toast.error('Failed to subscribe. Please try again.')
      }
      throw error
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Subscription removed')
      return true
    } catch (error) {
      toast.error('Failed to remove subscription')
      throw error
    }
  },
}

// Contact Inquiry API
export const inquiryAPI = {
  async create(inquiry) {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert([{ ...inquiry, created_at: new Date() }])
        .select()

      if (error) throw error
      toast.success('Message sent successfully! We will contact you soon.')
      return data[0]
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      throw error
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },

  async markAsRead(id) {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update({ is_read: true })
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      throw error
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Inquiry deleted')
      return true
    } catch (error) {
      toast.error('Failed to delete inquiry')
      throw error
    }
  },
}
