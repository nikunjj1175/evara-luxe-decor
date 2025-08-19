import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import mongoose from 'mongoose'

const ContactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
}, { timestamps: true })

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema)

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = await req.json()
    const { name, email, subject, message } = body
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    await ContactMessage.create({ name, email, subject, message })
    return NextResponse.json({ message: 'Message received' }, { status: 201 })
  } catch (error) {
    console.error('Contact submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


