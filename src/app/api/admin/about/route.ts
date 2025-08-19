import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getTokenFromRequest, isAdmin } from '@/lib/auth'
import mongoose from 'mongoose'

const AboutSchema = new mongoose.Schema({
  companyName: String,
  tagline: String,
  description: String,
  mission: String,
  vision: String,
  address: String,
  phone: String,
  email: String,
  website: String,
  facebook: String,
  twitter: String,
  instagram: String,
  linkedin: String,
  foundedYear: Number,
  teamSize: Number,
  customersServed: Number,
  logo: String,
  heroImage: String,
}, { timestamps: true })

const About = mongoose.models.About || mongoose.model('About', AboutSchema)

export async function GET() {
  try {
    await dbConnect()
    const about = await About.findOne()
    if (!about) {
      return NextResponse.json({ about: null }, { status: 200 })
    }
    return NextResponse.json({ about })
  } catch (error) {
    console.error('Get about error:', error)
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
    let about = await About.findOne()
    if (about) {
      return NextResponse.json({ error: 'About already exists' }, { status: 400 })
    }
    about = await About.create(data)
    return NextResponse.json({ message: 'About created', about }, { status: 201 })
  } catch (error) {
    console.error('Create about error:', error)
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
    const about = await About.findOneAndUpdate({}, data, { new: true, upsert: true })
    return NextResponse.json({ message: 'About updated', about })
  } catch (error) {
    console.error('Update about error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


