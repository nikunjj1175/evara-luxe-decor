'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  businessHours: z.string().min(5, 'Business hours must be at least 5 characters'),
  mapEmbed: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactData {
  _id: string
  address: string
  phone: string
  email: string
  website?: string
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  businessHours: string
  mapEmbed?: string
  updatedAt: string
}

interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
}

export default function AdminContactPage() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  useEffect(() => {
    fetchContactData()
    fetchMessages()
  }, [])

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/admin/contact')
      if (response.ok) {
        const data = await response.json()
        setContactData(data.contact)
        
        // Set form values
        Object.keys(data.contact).forEach(key => {
          if (key !== '_id' && key !== 'updatedAt') {
            setValue(key as keyof ContactFormData, data.contact[key])
          }
        })
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
      toast.error('Failed to load contact data')
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/contact/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSaving(true)

      const response = await fetch('/api/admin/contact', {
        method: contactData?._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save contact data')
      }

      const result = await response.json()
      setContactData(result.contact)
      toast.success('Contact information saved successfully')

    } catch (error: any) {
      console.error('Error saving contact data:', error)
      toast.error(error.message || 'Failed to save contact data')
    } finally {
      setSaving(false)
    }
  }

  const handleMessageStatusUpdate = async (messageId: string, status: 'read' | 'replied') => {
    try {
      const response = await fetch(`/api/admin/contact/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success('Message status updated')
        fetchMessages()
      }
    } catch (error) {
      console.error('Error updating message status:', error)
      toast.error('Failed to update message status')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/contact/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (response.ok) {
        toast.success('Message deleted successfully')
        fetchMessages()
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    }
  }

  const openMessageModal = (message: ContactMessage) => {
    setSelectedMessage(message)
    setShowMessageModal(true)
  }

  const closeMessageModal = () => {
    setSelectedMessage(null)
    setShowMessageModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information Form */}
          <div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your contact details and business information
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>
                  <div className="space-y-4">
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

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                    <div>
                      <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700">
                        Business Hours *
                      </label>
                      <input
                        type="text"
                        id="businessHours"
                        {...register('businessHours')}
                        placeholder="e.g., Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      {errors.businessHours && (
                        <p className="mt-1 text-sm text-red-600">{errors.businessHours.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                {/* Map Embed */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Map Embed</h3>
                  <div>
                    <label htmlFor="mapEmbed" className="block text-sm font-medium text-gray-700">
                      Google Maps Embed Code
                    </label>
                    <textarea
                      id="mapEmbed"
                      {...register('mapEmbed')}
                      rows={4}
                      placeholder="Paste your Google Maps embed code here"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Paste the embed code from Google Maps to display your location
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Contact Information'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Messages */}
          <div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Manage incoming contact form messages
                </p>
              </div>

              <div className="p-6">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          message.status === 'unread'
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => openMessageModal(message)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{message.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              From: {message.name} ({message.email})
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                message.status === 'unread'
                                  ? 'bg-blue-100 text-blue-800'
                                  : message.status === 'read'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {message.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message Modal */}
        {showMessageModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                <button
                  onClick={closeMessageModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">From:</h3>
                  <p className="text-gray-600">{selectedMessage.name} ({selectedMessage.email})</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Date:</h3>
                  <p className="text-gray-600">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Message:</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    {selectedMessage.status === 'unread' && (
                      <button
                        onClick={() => handleMessageStatusUpdate(selectedMessage._id, 'read')}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Mark as Read
                      </button>
                    )}
                    {selectedMessage.status !== 'replied' && (
                      <button
                        onClick={() => handleMessageStatusUpdate(selectedMessage._id, 'replied')}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark as Replied
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

