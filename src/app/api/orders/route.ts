import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const orderData = await request.json()
    
    // Calculate totals
    const subtotal = orderData.items.reduce((sum: number, item: any) => sum + item.total, 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = orderData.shipping || 0
    const total = subtotal + tax + shipping

    const order = new Order({
      user: user.id,
      items: orderData.items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: orderData.paymentMethod || 'cod',
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      notes: orderData.notes,
    })

    await order.save()

    // Populate user and product details for email
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price description')

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(
        populatedOrder.user.email,
        populatedOrder.user.name,
        populatedOrder.orderNumber,
        populatedOrder
      )
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order: populatedOrder
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    let query: any = {}
    
    // If user is not admin, only show their orders
    if (user.role !== 'admin') {
      query.user = user.id
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Order.countDocuments(query)

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
