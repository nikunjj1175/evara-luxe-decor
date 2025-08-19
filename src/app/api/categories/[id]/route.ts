import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Category from '@/models/Category'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const category = await Category.findById(params.id)
      .populate('parentCategory', 'name slug')
      .lean()
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ category })
    
  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, image, isActive, sortOrder, parentCategory, metaTitle, metaDescription } = body

    // Check if category exists
    const existingCategory = await Category.findById(params.id)
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if name is being changed and if it conflicts with another category
    if (name && name !== existingCategory.name) {
      const nameConflict = await Category.findOne({ 
        name, 
        _id: { $ne: params.id } 
      })
      if (nameConflict) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        )
      }
    }

    // Check if parent category is being set to itself
    if (parentCategory === params.id) {
      return NextResponse.json(
        { error: 'Category cannot be its own parent' },
        { status: 400 }
      )
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        image,
        isActive,
        sortOrder,
        parentCategory: parentCategory || null,
        metaTitle,
        metaDescription
      },
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name slug')

    return NextResponse.json({
      message: 'Category updated successfully',
      category: updatedCategory
    })

  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Check if category exists
    const category = await Category.findById(params.id)
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has child categories
    const childCategories = await Category.find({ parentCategory: params.id })
    if (childCategories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with child categories. Please reassign or delete child categories first.' },
        { status: 400 }
      )
    }

    // TODO: Check if category has products
    // const products = await Product.find({ category: params.id })
    // if (products.length > 0) {
    //   return NextResponse.json(
    //     { error: 'Cannot delete category with products. Please reassign or delete products first.' },
    //     { status: 400 }
    //   )
    // }

    await Category.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: 'Category deleted successfully'
    })

  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

