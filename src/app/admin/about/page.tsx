'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

const aboutSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  tagline: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  mission: z.string().min(10, 'Mission must be at least 10 characters'),
  vision: z.string().min(10, 'Vision must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  foundedYear: z.number().min(1900).max(new Date().getFullYear()),
  teamSize: z.number().min(1),
  customersServed: z.number().min(0),
})

type AboutFormData = z.infer<typeof aboutSchema>

interface AboutData {
  _id: string
  companyName: string
  tagline?: string
  description: string
  mission: string
  vision: string
  address: string
  phone: string
  email: string
  website?: string
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  foundedYear: number
  teamSize: number
  customersServed: number
  logo?: string
  heroImage?: string
  updatedAt: string
}

export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [heroImageUrl, setHeroImageUrl] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema)
  })

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/admin/about')
      if (response.ok) {
        const data = await response.json()
        setAboutData(data.about)
        setLogoUrl(data.about.logo || '')
        setHeroImageUrl(data.about.heroImage || '')
        
        // Set form values
        Object.keys(data.about).forEach(key => {
          if (key !== '_id' && key !== 'logo' && key !== 'heroImage' && key !== 'updatedAt') {
            setValue(key as keyof AboutFormData, data.about[key])
          }
        })
      } else {
        // If no about data exists, set default values
        setValue('foundedYear', new Date().getFullYear())
        setValue('teamSize', 1)
        setValue('customersServed', 0)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
      toast.error('Failed to load about data')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: AboutFormData) => {
    try {
      setSaving(true)

      const payload = {
        ...data,
        logo: logoUrl || undefined,
        heroImage: heroImageUrl || undefined
      }

      const response = await fetch('/api/admin/about', {
        method: aboutData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save about data')
      }

      const result = await response.json()
      setAboutData(result.about)
      toast.success('About information saved successfully')

    } catch (error: any) {
      console.error('Error saving about data:', error)
      toast.error(error.message || 'Failed to save about data')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading about information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your company information and about page content
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Company Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    {...register('companyName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
                    Tagline
                  </label>
                  <input
                    type="text"
                    id="tagline"
                    {...register('tagline')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.tagline && (
                    <p className="mt-1 text-sm text-red-600">{errors.tagline.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Company Description *
                  </label>
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="mission" className="block text-sm font-medium text-gray-700">
                    Mission Statement *
                  </label>
                  <textarea
                    id="mission"
                    {...register('mission')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.mission && (
                    <p className="mt-1 text-sm text-red-600">{errors.mission.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="vision" className="block text-sm font-medium text-gray-700">
                    Vision Statement *
                  </label>
                  <textarea
                    id="vision"
                    {...register('vision')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.vision && (
                    <p className="mt-1 text-sm text-red-600">{errors.vision.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Company Stats */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Statistics</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                    Founded Year *
                  </label>
                  <input
                    type="number"
                    id="foundedYear"
                    {...register('foundedYear', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.foundedYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.foundedYear.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700">
                    Team Size *
                  </label>
                  <input
                    type="number"
                    id="teamSize"
                    {...register('teamSize', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.teamSize && (
                    <p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="customersServed" className="block text-sm font-medium text-gray-700">
                    Customers Served *
                  </label>
                  <input
                    type="number"
                    id="customersServed"
                    {...register('customersServed', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.customersServed && (
                    <p className="mt-1 text-sm text-red-600">{errors.customersServed.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    {...register('address')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      {...register('website')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    {...register('facebook')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.facebook && (
                    <p className="mt-1 text-sm text-red-600">{errors.facebook.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    {...register('twitter')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.twitter && (
                    <p className="mt-1 text-sm text-red-600">{errors.twitter.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    {...register('instagram')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.instagram && (
                    <p className="mt-1 text-sm text-red-600">{errors.instagram.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    {...register('linkedin')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.linkedin && (
                    <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <ImageUpload
                    onImageUploaded={(url) => setLogoUrl(url)}
                    onImageRemoved={() => setLogoUrl('')}
                    uploadedImages={logoUrl ? [logoUrl] : []}
                    type="logo"
                    single={true}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload your company logo. Recommended size: 200x200 pixels.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image
                  </label>
                  <ImageUpload
                    onImageUploaded={(url) => setHeroImageUrl(url)}
                    onImageRemoved={() => setHeroImageUrl('')}
                    uploadedImages={heroImageUrl ? [heroImageUrl] : []}
                    type="hero"
                    single={true}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload a hero image for the about page. Recommended size: 1200x600 pixels.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save About Information'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

