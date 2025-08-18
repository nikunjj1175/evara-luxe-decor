import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
import { getTokenFromRequest, isAdmin, verifyToken } from '@/lib/auth'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const order = await Order.findById(params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price description')
      .populate('cancelledBy', 'name')

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { status, trackingNumber, estimatedDelivery, notes } = updateData

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        ...updateData,
        ...(status === 'delivered' && { deliveredAt: new Date() }),
        ...(status === 'cancelled' && { cancelledAt: new Date() })
      },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price description')

    // Send email notification for status updates
    if (order && (status === 'delivered' || status === 'picked' || status === 'shipped')) {
      try {
        await sendOrderStatusUpdateEmail(
          order.user.email,
          order.user.name,
          order.orderNumber,
          status,
          order.trackingNumber
        )
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError)
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order
    })

  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const order = await Order.findByIdAndDelete(params.id)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Order deleted successfully'
    })

  } catch (error) {
    console.error('Delete order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
