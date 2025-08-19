'use client'

import mongoose, { Schema, Model, Document } from 'mongoose'

export interface ContactMessageDocument extends Document {
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: Date
  updatedAt: Date
}

const ContactMessageSchema = new Schema<ContactMessageDocument>({
  name: { type: String },
  email: { type: String },
  subject: { type: String },
  message: { type: String },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
}, { timestamps: true })

const ContactMessage: Model<ContactMessageDocument> =
  mongoose.models.ContactMessage || mongoose.model<ContactMessageDocument>('ContactMessage', ContactMessageSchema)

export default ContactMessage



