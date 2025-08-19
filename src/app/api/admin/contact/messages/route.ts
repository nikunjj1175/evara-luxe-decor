import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getTokenFromRequest, isAdmin } from '@/lib/auth'
import mongoose from 'mongoose'

const ContactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
}, { timestamps: true })

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema)

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const token = getTokenFromRequest(req)
    if (!token || !isAdmin(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export { ContactMessage }


