import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['furniture', 'lighting', 'wall-decor', 'textiles', 'kitchen', 'bathroom', 'outdoor'],
  },
  images: [{
    type: String,
    required: true,
  }],
  colors: [{
    type: String,
  }],
  sizes: [{
    type: String,
  }],
  material: {
    type: String,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  weight: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)
