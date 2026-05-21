import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,
  userRole: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ loading }),
  setUserRole: (role) => set({ userRole: role }),
  logout: () => set({ user: null, isAuthenticated: false, userRole: null }),
}))

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => {
    const { items } = get()
    const existingItem = items.find((item) => item.id === product.id)

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        ),
      })
    } else {
      set({ items: [...items, { ...product, quantity: product.quantity || 1 }] })
    }
  },

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }))
  },

  clearCart: () => set({ items: [], total: 0 }),

  calculateTotal: () => {
    const { items } = get()
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    set({ total })
  },
}))

export const useWishlistStore = create((set, get) => ({
  items: [],

  addItem: (product) => {
    const { items } = get()
    if (!items.find((item) => item.id === product.id)) {
      set({ items: [...items, product] })
    }
  },

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  isInWishlist: (productId) => {
    const { items } = get()
    return items.some((item) => item.id === productId)
  },

  clearWishlist: () => set({ items: [] }),
}))

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
