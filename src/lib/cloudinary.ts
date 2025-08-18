import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Utility function to create folder name from product name
export const createProductFolderName = (productName: string): string => {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length to 50 characters
}

// Upload image to Cloudinary with product folder
export const uploadImageToCloudinary = async (
  file: Buffer,
  productName: string,
  fileName: string
): Promise<string> => {
  const folderName = createProductFolderName(productName)
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `products/${folderName}`,
        public_id: fileName,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result!.secure_url)
        }
      }
    )

    uploadStream.end(file)
  })
}

// Upload general image (logo, avatar, etc.)
export const uploadGeneralImage = async (
  file: Buffer,
  folder: string,
  fileName: string,
  options: {
    width?: number
    height?: number
    crop?: string
  } = {}
): Promise<string> => {
  const { width = 400, height = 400, crop = 'limit' } = options
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: fileName,
        resource_type: 'image',
        transformation: [
          { width, height, crop },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result!.secure_url)
        }
      }
    )

    uploadStream.end(file)
  })
}

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// Extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/v\d+\/([^/]+)\.\w+$/)
  return match ? match[1] : null
}
