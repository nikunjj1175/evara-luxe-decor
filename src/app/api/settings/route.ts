import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Settings from '@/models/Settings'
import { getTokenFromRequest, isAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    
    let settings = await Settings.findOne()
    
    if (!settings) {
      settings = await Settings.create({})
    }

    return NextResponse.json(settings)

  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
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

    let settings = await Settings.findOne()
    
    if (!settings) {
      settings = await Settings.create(updateData)
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        updateData,
        { new: true, runValidators: true }
      )
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings
    })

  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
