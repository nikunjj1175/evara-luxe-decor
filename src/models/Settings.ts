import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Home Decor',
  },
  siteDescription: {
    type: String,
    default: 'Beautiful home decoration items',
  },
  logo: {
    type: String,
    default: '',
  },
  heroTitle: {
    type: String,
    default: 'Transform Your Home',
  },
  heroSubtitle: {
    type: String,
    default: 'Discover beautiful decor items for every room',
  },
  heroImage: {
    type: String,
    default: '',
  },
  showFeaturedProducts: {
    type: Boolean,
    default: true,
  },
  showCategories: {
    type: Boolean,
    default: true,
  },
  showTestimonials: {
    type: Boolean,
    default: true,
  },
  showNewsletter: {
    type: Boolean,
    default: true,
  },
  contactEmail: {
    type: String,
    default: 'contact@homedecor.com',
  },
  contactPhone: {
    type: String,
    default: '+1 (555) 123-4567',
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    pinterest: String,
  },
  footerText: {
    type: String,
    default: '© 2024 Home Decor. All rights reserved.',
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently under maintenance. Please check back soon.',
  },
}, {
  timestamps: true,
})

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema)
