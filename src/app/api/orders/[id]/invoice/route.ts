import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

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

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const order = await Order.findById(params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price description')

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized to view this order
    if (user.role !== 'admin' && order.user.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate PDF content
    const pdfContent = generateInvoicePDFBuffer(order)

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Generate invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

function generateInvoicePDFBuffer(order: any): Buffer {
  // Simple text-based invoice for now (PDF generation will be implemented later)
  const invoiceContent = `
INVOICE

Order Number: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString()}

Customer Information:
${order.user.name}
${order.user.email}
${order.user.phone || ''}

Shipping Address:
${order.shippingAddress.name}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

Items:
${order.items.map((item: any) => `
${item.product.name}
Quantity: ${item.quantity}
Price: $${item.price}
Total: $${item.total}
`).join('')}

Subtotal: $${order.subtotal}
Tax: $${order.tax}
Shipping: $${order.shipping}
Total: $${order.total}

Payment Method: ${order.paymentMethod}
Status: ${order.status}

Thank you for your order!
  `.trim()

  return Buffer.from(invoiceContent, 'utf-8')
}
