import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Category from '@/models/Category'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    let query: any = {}
    
    // Filter by active status if specified
    if (isActive !== null) {
      query.isActive = isActive === 'true'
    } else if (!includeInactive) {
      // Default to only active categories unless explicitly requested
      query.isActive = true
    }
    
    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort({ sortOrder: 1, name: 1 })
      .lean()
    
    return NextResponse.json({ categories })
    
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    const category = new Category({
      name,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
      parentCategory: parentCategory || null,
      metaTitle,
      metaDescription
    })

    await category.save()
    
    const savedCategory = await Category.findById(category._id)
      .populate('parentCategory', 'name slug')
      .lean()

    return NextResponse.json({
      message: 'Category created successfully',
      category: savedCategory
    }, { status: 201 })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

