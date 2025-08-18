'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Globe, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import toast from 'react-hot-toast'

const footerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Valid email is required'),
  facebook: z.string().url('Valid URL is required').optional().or(z.literal('')),
  instagram: z.string().url('Valid URL is required').optional().or(z.literal('')),
  twitter: z.string().url('Valid URL is required').optional().or(z.literal('')),
  copyright: z.string().min(1, 'Copyright text is required'),
  quickLinks: z.array(z.object({
    title: z.string().min(1, 'Link title is required'),
    url: z.string().min(1, 'Link URL is required'),
  })),
  customerService: z.array(z.object({
    title: z.string().min(1, 'Link title is required'),
    url: z.string().min(1, 'Link URL is required'),
  })),
})

type FooterForm = z.infer<typeof footerSchema>

interface FooterSettings {
  _id: string
  companyName: string
  tagline: string
  description: string
  address: string
  phone: string
  email: string
  facebook?: string
  instagram?: string
  twitter?: string
  copyright: string
  quickLinks: Array<{ title: string; url: string }>
  customerService: Array<{ title: string; url: string }>
}

export default function FooterPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FooterForm>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      companyName: 'Home Decor',
      tagline: 'Beautiful Home Decoration Items',
      description: 'Transform your space with our curated collection of furniture, lighting, and accessories.',
      address: '123 Decor Street, Design City, DC 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@homedecor.com',
      copyright: '© 2024 Home Decor. All rights reserved.',
      quickLinks: [
        { title: 'Products', url: '/products' },
        { title: 'Categories', url: '/categories' },
        { title: 'About Us', url: '/about' },
        { title: 'Contact', url: '/contact' },
        { title: 'FAQ', url: '/faq' },
      ],
      customerService: [
        { title: 'Shipping Info', url: '/shipping' },
        { title: 'Returns & Exchanges', url: '/returns' },
        { title: 'Warranty', url: '/warranty' },
        { title: 'Support', url: '/support' },
        { title: 'Size Guide', url: '/size-guide' },
      ],
    },
  })

  const watchedQuickLinks = watch('quickLinks')
  const watchedCustomerService = watch('customerService')

  useEffect(() => {
    fetchFooterSettings()
  }, [])

  const fetchFooterSettings = async () => {
    try {
      const response = await fetch('/api/admin/footer', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        const settings = data.settings
        
        // Set form values
        setValue('companyName', settings.companyName || 'Home Decor')
        setValue('tagline', settings.tagline || 'Beautiful Home Decoration Items')
        setValue('description', settings.description || 'Transform your space with our curated collection.')
        setValue('address', settings.address || '123 Decor Street, Design City, DC 12345')
        setValue('phone', settings.phone || '+1 (555) 123-4567')
        setValue('email', settings.email || 'info@homedecor.com')
        setValue('facebook', settings.facebook || '')
        setValue('instagram', settings.instagram || '')
        setValue('twitter', settings.twitter || '')
        setValue('copyright', settings.copyright || '© 2024 Home Decor. All rights reserved.')
        setValue('quickLinks', settings.quickLinks || [])
        setValue('customerService', settings.customerService || [])
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error)
      toast.error('Failed to load footer settings')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FooterForm) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Footer settings updated successfully')
      } else {
        toast.error('Failed to update footer settings')
      }
    } catch (error) {
      toast.error('Error updating footer settings')
    } finally {
      setSaving(false)
    }
  }

  const addQuickLink = () => {
    const currentLinks = watch('quickLinks')
    setValue('quickLinks', [...currentLinks, { title: '', url: '' }])
  }

  const removeQuickLink = (index: number) => {
    const currentLinks = watch('quickLinks')
    setValue('quickLinks', currentLinks.filter((_, i) => i !== index))
  }

  const addCustomerServiceLink = () => {
    const currentLinks = watch('customerService')
    setValue('customerService', [...currentLinks, { title: '', url: '' }])
  }

  const removeCustomerServiceLink = (index: number) => {
    const currentLinks = watch('customerService')
    setValue('customerService', currentLinks.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Footer Management</h1>
          <p className="text-gray-600 mt-2">Customize your website footer content and links</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  {...register('companyName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  {...register('tagline')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.tagline && (
                  <p className="mt-1 text-sm text-red-600">{errors.tagline.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook URL
                </label>
                <input
                  {...register('facebook')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/yourpage"
                />
                {errors.facebook && (
                  <p className="mt-1 text-sm text-red-600">{errors.facebook.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  {...register('instagram')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/yourpage"
                />
                {errors.instagram && (
                  <p className="mt-1 text-sm text-red-600">{errors.instagram.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter URL
                </label>
                <input
                  {...register('twitter')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://twitter.com/yourpage"
                />
                {errors.twitter && (
                  <p className="mt-1 text-sm text-red-600">{errors.twitter.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Links</h2>
              <button
                type="button"
                onClick={addQuickLink}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Link
              </button>
            </div>
            
            <div className="space-y-4">
              {watchedQuickLinks.map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      {...register(`quickLinks.${index}.title`)}
                      type="text"
                      placeholder="Link Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      {...register(`quickLinks.${index}.url`)}
                      type="text"
                      placeholder="Link URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuickLink(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Service Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Customer Service Links</h2>
              <button
                type="button"
                onClick={addCustomerServiceLink}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Link
              </button>
            </div>
            
            <div className="space-y-4">
              {watchedCustomerService.map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      {...register(`customerService.${index}.title`)}
                      type="text"
                      placeholder="Link Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      {...register(`customerService.${index}.url`)}
                      type="text"
                      placeholder="Link URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomerServiceLink(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Copyright</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                {...register('copyright')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.copyright && (
                <p className="mt-1 text-sm text-red-600">{errors.copyright.message}</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Footer Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
