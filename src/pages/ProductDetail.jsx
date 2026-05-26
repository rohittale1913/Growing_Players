import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Share2, Star, Truck, Shield, RotateCcw, AlertCircle, ChevronDown } from 'lucide-react'
import Layout from '../layouts/MainLayout'
import { productAPI } from '../services/api'
import { useCartStore, useWishlistStore } from '../store'
import toast from 'react-hot-toast'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [expandedSection, setExpandedSection] = useState(null)
    const addItem = useCartStore((state) => state.addItem)
    const isInWishlist = useWishlistStore((state) => state.isInWishlist)
    const addWishlist = useWishlistStore((state) => state.addItem)
    const removeWishlist = useWishlistStore((state) => state.removeItem)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                const data = await productAPI.getById(id)
                if (data) {
                    setProduct(data)
                    setSelectedImage(0)
                } else {
                    toast.error('Product not found')
                    navigate('/products')
                }
            } catch (error) {
                console.error('Failed to fetch product:', error)
                toast.error('Failed to load product')
                navigate('/products')
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id, navigate])

    useEffect(() => {
        if (product) {
            console.log('Product data loaded:', product)
            console.log('Manufactured by:', product.manufactured_packed_by_name)
            console.log('Marketed by:', product.marketed_by_name)
        }
    }, [product])

    const handleAddToCart = () => {
        if (product) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
            })
            toast.success(`${product.name} added to cart!`)
        }
    }

    const handleWishlist = () => {
        if (product) {
            if (isInWishlist(product.id)) {
                removeWishlist(product.id)
                toast.success('Removed from wishlist')
            } else {
                addWishlist(product.id)
                toast.success('Added to wishlist')
            }
        }
    }

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section)
    }

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading product details...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!product) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <p className="text-gray-600">Product not found</p>
                    </div>
                </div>
            </Layout>
        )
    }

    const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0
    const images = [product.image]

    // Collapsible Section Component
    const CollapsibleSection = ({ title, sectionId, children }) => (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => toggleSection(sectionId)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <ChevronDown
                    size={20}
                    className={`text-gray-600 transition-transform ${expandedSection === sectionId ? 'rotate-180' : ''}`}
                />
            </button>
            {expandedSection === sectionId && <div className="px-6 pb-4 bg-gray-50">{children}</div>}
        </div>
    )

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8 font-display">
                <div className="container-responsive">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                        <button onClick={() => navigate('/products')} className="hover:text-primary-600">
                            Products
                        </button>
                        <span>/</span>
                        <span>{product.category_name || 'Category'}</span>
                        <span>/</span>
                        <span>{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left - Images */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center"
                            >
                                {images[selectedImage] ? (
                                    <img
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-400">No image available</div>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            <div className="flex gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImage === idx ? 'border-primary-600' : 'border-gray-200'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Middle & Right - Details */}
                        <div className="lg:col-span-2">
                            {/* Product Header */}
                            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                                {/* Rating */}
                                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={i < (product.rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-primary-600 hover:text-blue-800 cursor-pointer font-semibold">
                                        {product.reviews || 0} Reviews
                                    </span>
                                    {product.best_sellers_rank && (
                                        <span className="text-green-600 font-semibold">#{product.best_sellers_rank} Best Seller</span>
                                    )}
                                </div>

                                {/* Price Section */}
                                <div className="mb-2 pb-2 border-b border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
                                        {product.original_price && (
                                            <>
                                                <span className="text-2xl text-gray-400 line-through">₹{product.original_price}</span>
                                                <span className="bg-green-600 text-white px-2 py-2 rounded-full font-bold">
                                                    - {discount}%
                                                </span>
                                            </>
                                        )}
                                        <p className="text-sm text-gray-600">Inclusive of all taxes.</p>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="mb-2 pb-2 border-b border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {/* <span className="font-bold text-lg">
                      {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </span> */}
                                        <p className="text-sm text-gray-600">Order now! Ships in 2-3 business days</p>
                                    </div>
                                </div>

                                {/* Quantity & Add to Cart */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-gray-900">Quantity:</span>
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-2 hover:bg-gray-100"
                                            >
                                                −
                                            </button>
                                            <span className="px-6 py-2 font-semibold">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                                                className="px-4 py-2 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                            className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                                        >
                                            <ShoppingCart size={24} />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleWishlist}
                                            className={`px-8 py-3 border-2 rounded-lg font-bold transition-colors text-lg ${isInWishlist(product.id)
                                                    ? 'border-rose-600 text-rose-600 bg-rose-50'
                                                    : 'border-gray-300 text-gray-700 hover:border-rose-600 hover:text-rose-600'
                                                }`}
                                        >
                                            <Heart size={24} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                                        </button>
                                        <button className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 text-gray-700 font-bold text-lg">
                                            <Share2 size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Delivery & Returns */}
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Truck className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900">Free Delivery</p>
                                            <p className="text-sm text-gray-600">On orders above ₹500</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <RotateCcw className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900">Easy Returns</p>
                                            <p className="text-sm text-gray-600">15-day return policy</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900">Secure Payment</p>
                                            <p className="text-sm text-gray-600">100% secure transactions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details Sections */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Product Description */}
                                {product.description && (
                                    <CollapsibleSection title="Product Information" sectionId="product-info">
                                        <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
                                    </CollapsibleSection>
                                )}

                                {/* Item Details */}
                                {product.item_details && (
                                    <CollapsibleSection title="Item Details" sectionId="item-details">
                                        <div className="space-y-2 text-gray-700">
                                            {typeof product.item_details === 'string' ? (
                                                <p>{product.item_details}</p>
                                            ) : (
                                                Object.entries(product.item_details).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b border-gray-200 pb-2">
                                                        <span className="font-semibold text-gray-900">{key}:</span>
                                                        <span>{value}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CollapsibleSection>
                                )}

                                {/* Measurements */}
                                {product.measurements && (
                                    <CollapsibleSection title="Measurements" sectionId="measurements">
                                        <div className="space-y-2 text-gray-700">
                                            {typeof product.measurements === 'string' ? (
                                                <p>{product.measurements}</p>
                                            ) : (
                                                Object.entries(product.measurements).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b border-gray-200 pb-2">
                                                        <span className="font-semibold text-gray-900">{key}:</span>
                                                        <span>{value}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CollapsibleSection>
                                )}

                                {/* Materials & Care */}
                                {product.materials_care && (
                                    <CollapsibleSection title="Materials & Care" sectionId="materials-care">
                                        <p className="text-gray-700">{product.materials_care}</p>
                                    </CollapsibleSection>
                                )}

                                {/* Features & Specs */}
                                {product.specifications && (
                                    <CollapsibleSection title="Features & Specs" sectionId="features-specs">
                                        <div className="grid grid-cols-2 gap-4">
                                            {Array.isArray(product.specifications) ? (
                                                product.specifications.map((spec, idx) => (
                                                    <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                                        <p className="text-xs text-gray-600 font-semibold">{spec.label}</p>
                                                        <p className="font-semibold text-gray-900">{spec.value}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                Object.entries(product.specifications).map(([key, value]) => (
                                                    <div key={key} className="bg-white p-3 rounded border border-gray-200">
                                                        <p className="text-xs text-gray-600 font-semibold">{key}</p>
                                                        <p className="font-semibold text-gray-900">{value}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CollapsibleSection>
                                )}

                                {/* Additional Details */}
                                <CollapsibleSection title="Additional Details" sectionId="additional-details">
                                    <div className="space-y-2 text-gray-700">
                                        {product.product_dimensions ? (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Product Dimensions:</span>
                                                <span>{product.product_dimensions}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Product Dimensions:</span>
                                                <span className="text-gray-400">Not available</span>
                                            </div>
                                        )}
                                        {product.date_first_available ? (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Date First Available:</span>
                                                <span>{product.date_first_available}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Date First Available:</span>
                                                <span className="text-gray-400">Not available</span>
                                            </div>
                                        )}
                                        {product.item_weight ? (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Item Weight:</span>
                                                <span>{product.item_weight}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Item Weight:</span>
                                                <span className="text-gray-400">Not available</span>
                                            </div>
                                        )}
                                        {product.item_model_number ? (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Item Model Number:</span>
                                                <span>{product.item_model_number}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Item Model Number:</span>
                                                <span className="text-gray-400">Not available</span>
                                            </div>
                                        )}
                                        {product.net_quantity ? (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Net Quantity:</span>
                                                <span>{product.net_quantity}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Net Quantity:</span>
                                                <span className="text-gray-400">Not available</span>
                                            </div>
                                        )}
                                        {product.country_of_origin ? (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Country of Origin:</span>
                                                <span>{product.country_of_origin}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Country of Origin:</span>
                                                <span className="text-gray-400">Not available</span>
                                            </div>
                                        )}
                                        {product.included_components ? (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Included Components:</span>
                                                <span>{product.included_components}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Included Components:</span>
                                                <span className="text-gray-400">Not available</span>
                                            </div>
                                        )}
                                        {product.generic_name ? (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Generic Name:</span>
                                                <span>{product.generic_name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="font-semibold text-gray-900">Generic Name:</span>
                                                <span className="text-gray-400">Not available</span>
                                            </div>
                                        )}
                                    </div>
                                </CollapsibleSection>

                                {/* Product Details (Manufacturer, Packer, ASIN, etc.) */}
                                <CollapsibleSection title="Product Details" sectionId="product-details">
                                    <div className="space-y-4 text-gray-700">
                                        {/* ASIN */}
                                        <div className="border-b border-gray-200 pb-3">
                                            <p className="font-semibold text-gray-900 mb-1">ASIN / SKU:</p>
                                            <p className="text-sm">{product.asin || product.sku || 'Not specified'}</p>
                                        </div>

                                        {/* Manufactured & Packed By */}
                                        <div className="border-b border-gray-200 pb-3">
                                            <p className="font-semibold text-gray-900 mb-2">Manufactured & Packed By:</p>
                                            {product.manufactured_packed_by_name || product.manufacturer ? (
                                                <div className="bg-gray-50 p-3 rounded">
                                                    <p className="font-semibold text-gray-900 text-sm mb-2">
                                                        {product.manufactured_packed_by_name || product.manufacturer || 'Company Name'}
                                                    </p>
                                                    {(product.manufactured_packed_by_address || product.manufacturer_address) && (
                                                        <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2">
                                                            {product.manufactured_packed_by_address || product.manufacturer_address}
                                                        </p>
                                                    )}
                                                    {(product.manufactured_lic_no || product.gstin) && (
                                                        <p className="text-sm text-gray-600">
                                                            Lic No.: {product.manufactured_lic_no || product.gstin}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 bg-gray-50 p-3 rounded">Not specified</p>
                                            )}
                                        </div>

                                        {/* Marketed By */}
                                        <div className="border-b border-gray-200 pb-3">
                                            <p className="font-semibold text-gray-900 mb-2">Marketed By:</p>
                                            {product.marketed_by_name ? (
                                                <div className="bg-gray-50 p-3 rounded">
                                                    <p className="font-semibold text-gray-900 text-sm mb-2">{product.marketed_by_name}</p>
                                                    {product.marketed_by_address && (
                                                        <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2">{product.marketed_by_address}</p>
                                                    )}
                                                    {product.marketed_lic_no && (
                                                        <p className="text-sm text-gray-600">Lic. No.: {product.marketed_lic_no}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 bg-gray-50 p-3 rounded">Same as manufacturer</p>
                                            )}
                                        </div>

                                        {/* Additional Manufacturer Info */}
                                        {product.manufacturer_address && (
                                            <div className="border-b border-gray-200 pb-3">
                                                <p className="font-semibold text-gray-900 mb-1">Manufacturer Address:</p>
                                                <p className="text-sm whitespace-pre-wrap text-gray-600">{product.manufacturer_address}</p>
                                            </div>
                                        )}

                                        {product.packer && (
                                            <div className="border-b border-gray-200 pb-3">
                                                <p className="font-semibold text-gray-900 mb-1">Packer:</p>
                                                <p className="text-sm whitespace-pre-wrap text-gray-600">{product.packer}</p>
                                            </div>
                                        )}

                                        {/* Debug Info */}
                                        {/* {process.env.NODE_ENV === 'development' && (
                                            <div className="border-t border-yellow-200 pt-3 mt-3">
                                                <p className="text-xs text-yellow-600 font-semibold mb-2">📋 Debug Info:</p>
                                                <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 max-h-32 overflow-y-auto font-mono">
                                                    <p>manufactured_by: {product.manufactured_packed_by_name ? '✓' : '✗'}</p>
                                                    <p>marketed_by: {product.marketed_by_name ? '✓' : '✗'}</p>
                                                    <p>manufacturer: {product.manufacturer ? '✓' : '✗'}</p>
                                                    <p>asin: {product.asin ? '✓' : '✗'}</p>
                                                </div>
                                            </div>
                                        )} */}
                                    </div>
                                </CollapsibleSection>

                                {/* Feedback */}
                                <CollapsibleSection title="Feedback" sectionId="feedback">
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                                            <p className="text-gray-900 font-semibold mb-2">Would you like to tell us about a lower price?</p>
                                            <p className="text-sm text-gray-600 mb-4">If you find a similar product being sold at a lower price elsewhere, we'd like to know. We may be able to match or beat the price.</p>
                                            <button className="px-6 py-2 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors">
                                                Report Incorrect Pricing
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="font-semibold text-gray-900 mb-3">Share your thoughts with other customers</h4>
                                            <p className="text-sm text-gray-600 mb-4">Have you used this product? Share your experience with others to help them make informed decisions.</p>
                                            <div className="space-y-3">
                                                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                                                    Write a Product Review
                                                </button>
                                                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                                                    Ask a Question
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="font-semibold text-gray-900 mb-3">Report an Issue</h4>
                                            <p className="text-sm text-gray-600 mb-4">If you found an issue with this product listing or have a problem with your order, please let us know.</p>
                                            <button className="px-6 py-2 border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors">
                                                Report an Issue
                                            </button>
                                        </div>
                                    </div>
                                </CollapsibleSection>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetail
