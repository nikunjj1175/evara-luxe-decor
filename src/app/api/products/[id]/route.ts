import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import { getTokenFromRequest, isAdmin } from '@/lib/auth'
import { deleteImageFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const product = await Product.findById(params.id).populate('reviews.user', 'name avatar')
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const token = getTokenFromRequest(req)
    if (!token || !isAdmin(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const updateData = await req.json()

    // Get the current product to compare images
    const currentProduct = await Product.findById(params.id)
    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete removed images from Cloudinary
    if (currentProduct.images && updateData.images) {
      const removedImages = currentProduct.images.filter(
        (img: string) => !updateData.images.includes(img)
      )
      
      for (const imageUrl of removedImages) {
        try {
          const publicId = extractPublicIdFromUrl(imageUrl)
          if (publicId) {
            await deleteImageFromCloudinary(publicId)
          }
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error)
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      message: 'Product updated successfully',
      product
    })

  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const token = getTokenFromRequest(req)
    if (!token || !isAdmin(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        for (const imageUrl of product.images) {
          const publicId = extractPublicIdFromUrl(imageUrl)
          if (publicId) {
            await deleteImageFromCloudinary(publicId)
          }
        }
      } catch (error) {
        console.error('Error deleting images from Cloudinary:', error)
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product from database
    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
