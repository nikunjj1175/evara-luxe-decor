'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
  parentCategory: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
  parentCategory?: {
    _id: string
    name: string
    slug: string
  }
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

export default function CategoryManagementPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema)
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeInactive=true')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const categoryData = {
        ...data,
        image: imageUrl || undefined
      }

      const url = editingCategory 
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(categoryData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save category')
      }

      const result = await response.json()
      toast.success(result.message)
      
      // Reset form and refresh categories
      reset()
      setImageUrl('')
      setEditingCategory(null)
      setShowForm(false)
      fetchCategories()

    } catch (error: any) {
      console.error('Error saving category:', error)
      toast.error(error.message || 'Failed to save category')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setImageUrl(category.image || '')
    setValue('name', category.name)
    setValue('description', category.description || '')
    setValue('isActive', category.isActive)
    setValue('sortOrder', category.sortOrder)
    setValue('parentCategory', category.parentCategory?._id || '')
    setValue('metaTitle', category.metaTitle || '')
    setValue('metaDescription', category.metaDescription || '')
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete category')
      }

      toast.success('Category deleted successfully')
      fetchCategories()

    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast.error(error.message || 'Failed to delete category')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCancel = () => {
    reset()
    setImageUrl('')
    setEditingCategory(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
              <p className="mt-2 text-gray-600">
                Manage product categories and their organization
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      {...register('description')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700">
                      Parent Category
                    </label>
                    <select
                      id="parentCategory"
                      {...register('parentCategory')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">No Parent Category</option>
                      {categories
                        .filter(cat => cat._id !== editingCategory?._id)
                        .map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      id="sortOrder"
                      {...register('sortOrder', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.sortOrder && (
                      <p className="mt-1 text-sm text-red-600">{errors.sortOrder.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Category Image
                    </label>
                    <ImageUpload
                      onImageUploaded={(url) => setImageUrl(url)}
                      onImageRemoved={() => setImageUrl('')}
                      uploadedImages={imageUrl ? [imageUrl] : []}
                      type="logo"
                      single={true}
                    />
                  </div>

                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      id="metaTitle"
                      {...register('metaTitle')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                      Meta Description
                    </label>
                    <textarea
                      id="metaDescription"
                      {...register('metaDescription')}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      {...register('isActive')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {editingCategory ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Categories</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sort Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {category.image && (
                              <img
                                className="h-10 w-10 rounded-full object-cover mr-3"
                                src={category.image}
                                alt={category.name}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {category.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.parentCategory?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.sortOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              disabled={deletingId === category._id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {deletingId === category._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
