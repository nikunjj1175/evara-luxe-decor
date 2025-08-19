import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getTokenFromRequest, isAdmin } from '@/lib/auth'
import mongoose from 'mongoose'

const ContactInfoSchema = new mongoose.Schema({
  address: String,
  phone: String,
  email: String,
  website: String,
  facebook: String,
  twitter: String,
  instagram: String,
  linkedin: String,
  businessHours: String,
  mapEmbed: String,
}, { timestamps: true })

const ContactInfo = mongoose.models.ContactInfo || mongoose.model('ContactInfo', ContactInfoSchema)

export async function GET() {
  try {
    await dbConnect()
    const contact = await ContactInfo.findOne()
    return NextResponse.json({ contact })
  } catch (error) {
    console.error('Get contact info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const token = getTokenFromRequest(req)
    if (!token || !isAdmin(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await req.json()
    let contact = await ContactInfo.findOne()
    if (contact) {
      return NextResponse.json({ error: 'Contact info already exists' }, { status: 400 })
    }
    contact = await ContactInfo.create(data)
    return NextResponse.json({ message: 'Contact info created', contact }, { status: 201 })
  } catch (error) {
    console.error('Create contact info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect()
    const token = getTokenFromRequest(req)
    if (!token || !isAdmin(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await req.json()
    const contact = await ContactInfo.findOneAndUpdate({}, data, { new: true, upsert: true })
    return NextResponse.json({ message: 'Contact info updated', contact })
  } catch (error) {
    console.error('Update contact info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


