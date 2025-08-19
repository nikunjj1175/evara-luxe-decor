'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Heart, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  rating: number
  isFeatured: boolean
  isNewArrival: boolean
}

interface Settings {
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  showFeaturedProducts: boolean
  showCategories: boolean
  showTestimonials: boolean
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const MotionDiv = motion.div as any
  const MotionH1 = motion.h1 as any
  const MotionP = motion.p as any
  const MotionButton = motion.button as any

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, newArrivalsRes, settingsRes] = await Promise.all([
        fetch('/api/products?featured=true&limit=8'),
        fetch('/api/products?newArrivals=true&limit=8'),
        fetch('/api/settings')
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products)
      }

      if (newArrivalsRes.ok) {
        const newArrivalsData = await newArrivalsRes.json()
        setNewArrivals(newArrivalsData.products)
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { name: 'Furniture', icon: '🪑', href: '/categories/furniture' },
    { name: 'Lighting', icon: '💡', href: '/categories/lighting' },
    { name: 'Wall Decor', icon: '🖼️', href: '/categories/wall-decor' },
    { name: 'Textiles', icon: '🛏️', href: '/categories/textiles' },
    { name: 'Kitchen', icon: '🍽️', href: '/categories/kitchen' },
    { name: 'Bathroom', icon: '🛁', href: '/categories/bathroom' },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Interior Designer',
      content: 'The quality of these home decor items is exceptional. My clients love the unique pieces I find here.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Homeowner',
      content: 'Transformed my living room with just a few pieces from HomeDecor. The customer service is amazing!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Apartment Renter',
      content: 'Perfect for small spaces! The furniture is both beautiful and functional. Highly recommend!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: settings?.heroImage 
              ? `url(${settings.heroImage})`
              : 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
          }}
        ></div>
        
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <MotionH1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            {settings?.heroTitle || 'Transform Your Home'}
          </MotionH1>
          
          <MotionP
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            {settings?.heroSubtitle || 'Discover beautiful decor items for every room'}
          </MotionP>
          
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/products">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                Shop Now
                <ArrowRight size={20} />
              </MotionButton>
            </Link>
            
            <Link href="/categories">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-900 transition-colors"
              >
                Explore Categories
              </MotionButton>
            </Link>
          </MotionDiv>
        </div>
      </section>

      {/* Categories Section */}
      {settings?.showCategories && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find the perfect decor items for every room in your home
              </p>
            </MotionDiv>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <MotionDiv
                  key={category.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={category.href}>
                    <MotionDiv
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    </MotionDiv>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {settings?.showFeaturedProducts && products.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked items to elevate your home decor
              </p>
            </MotionDiv>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <MotionDiv
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/products/${product._id}`}>
                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative h-64 bg-gray-200">
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/300x300'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <MotionButton
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        >
                          <Heart size={20} className="text-gray-600" />
                        </MotionButton>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({product.rating})
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-purple-600">
                            {formatPrice(product.price)}
                          </span>
                          <MotionButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <ShoppingCart size={20} />
                          </MotionButton>
                        </div>
                      </div>
                    </MotionDiv>
                  </Link>
                </MotionDiv>
              ))}
            </div>

            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/products">
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors"
                >
                  View All Products
                </MotionButton>
              </Link>
            </MotionDiv>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <span className="animate-pulse">🆕</span>
                New Arrivals
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fresh & Trending
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the latest additions to our collection - perfect for festivals and special occasions
              </p>
            </MotionDiv>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product, index) => (
                <MotionDiv
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/products/${product._id}`}>
                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative"
                    >
                      {/* New Arrival Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                          NEW
                        </span>
                      </div>
                      
                      <div className="relative h-64 bg-gray-200">
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/300x300'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <MotionButton
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        >
                          <Heart size={20} className="text-gray-600" />
                        </MotionButton>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({product.rating})
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-purple-600">
                            {formatPrice(product.price)}
                          </span>
                          <MotionButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                          >
                            <ShoppingCart size={20} />
                          </MotionButton>
                        </div>
                      </div>
                    </MotionDiv>
                  </Link>
                </MotionDiv>
              ))}
            </div>

            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/products?newArrivals=true">
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  View All New Arrivals
                </MotionButton>
              </Link>
            </MotionDiv>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {settings?.showTestimonials && (
        <section className="py-20 bg-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it - hear from our satisfied customers
              </p>
            </MotionDiv>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <MotionDiv
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-xl p-8 shadow-lg">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get the latest decor trends and exclusive offers delivered to your inbox
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Subscribe
              </MotionButton>
            </div>
          </MotionDiv>
        </div>
      </section>
    </div>
  )
}
