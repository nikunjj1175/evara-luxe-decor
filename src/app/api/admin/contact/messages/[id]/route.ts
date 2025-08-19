import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getTokenFromRequest, isAdmin } from '@/lib/auth'
import ContactMessage from '@/models/ContactMessage'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const token = getTokenFromRequest(req)
    if (!token || !isAdmin(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { status } = await req.json()
    const allowed = ['unread', 'read', 'replied']
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const message = await ContactMessage.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Message updated', data: message })
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const token = getTokenFromRequest(req)
    if (!token || !isAdmin(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const deleted = await ContactMessage.findByIdAndDelete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Message deleted' })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


