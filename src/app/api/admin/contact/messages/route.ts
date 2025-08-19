import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getTokenFromRequest, isAdmin } from '@/lib/auth'
import ContactMessage from '@/models/ContactMessage'

export const dynamic = 'force-dynamic'

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

