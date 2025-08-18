import { NextRequest, NextResponse } from 'next/server'
import { isAdmin, getTokenFromRequest } from '@/lib/auth'
import { uploadImageToCloudinary, uploadGeneralImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const token = getTokenFromRequest(request)
    if (!token || !isAdmin(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'product', 'logo', 'avatar', 'hero'
    const productName = formData.get('productName') as string
    const fileName = formData.get('fileName') as string

    if (!file || !type || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: file, type, fileName' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let imageUrl: string

    // Upload based on type
    if (type === 'product') {
      if (!productName) {
        return NextResponse.json(
          { error: 'Product name is required for product images' },
          { status: 400 }
        )
      }
      imageUrl = await uploadImageToCloudinary(buffer, productName, fileName)
    } else {
      // For logo, avatar, hero images
      const folder = type === 'logo' ? 'logos' : type === 'avatar' ? 'avatars' : 'hero'
      const options = type === 'logo' ? { width: 200, height: 200 } : 
                     type === 'avatar' ? { width: 150, height: 150 } : 
                     { width: 1200, height: 600 }
      
      imageUrl = await uploadGeneralImage(buffer, folder, fileName, options)
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
