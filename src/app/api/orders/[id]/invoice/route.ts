import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { generateInvoicePDF } from '@/lib/pdfGenerator'

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

    const decoded = verifyToken(token)
    if (!decoded) {
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
    const orderUserId = (order as any).user && (order as any).user._id
      ? (order as any).user._id.toString()
      : (order as any).user.toString()
    if (decoded.role !== 'admin' && orderUserId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate PDF document
    const doc = generateInvoicePDF({
      orderNumber: (order as any).orderNumber,
      orderDate: new Date((order as any).createdAt).toLocaleDateString(),
      customerName: (order as any).user.name,
      customerEmail: (order as any).user.email,
      customerPhone: (order as any).user.phone || '',
      shippingAddress: {
        name: (order as any).shippingAddress?.name || (order as any).user.name,
        address: (order as any).shippingAddress?.address || '',
        city: (order as any).shippingAddress?.city || '',
        state: (order as any).shippingAddress?.state || '',
        zipCode: (order as any).shippingAddress?.zipCode || '',
        country: (order as any).shippingAddress?.country || '',
      },
      items: (order as any).items.map((it: any) => ({
        name: it.product?.name || 'Item',
        quantity: it.quantity,
        price: it.price,
        total: it.total,
      })),
      subtotal: (order as any).subtotal,
      tax: (order as any).tax,
      shipping: (order as any).shipping,
      total: (order as any).total,
      paymentMethod: (order as any).paymentMethod,
      status: (order as any).status,
    })

    const arrayBuffer = doc.output('arraybuffer') as ArrayBuffer
    const pdfBuffer = Buffer.from(arrayBuffer)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${(order as any).orderNumber}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
        'Cache-Control': 'no-store',
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
