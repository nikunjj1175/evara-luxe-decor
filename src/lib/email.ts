// Simple email service - in production, you would use a proper email service
// For now, we'll just log the emails to console

const logEmail = (type: string, to: string, subject: string, content: string) => {
  console.log('=== EMAIL SENT ===')
  console.log('Type:', type)
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('Content:', content)
  console.log('==================')
}

export const sendOrderConfirmationEmail = async (
  userEmail: string,
  userName: string,
  orderNumber: string,
  orderDetails: any
) => {
  const subject = `Order Confirmation - ${orderNumber}`
  const content = `
    Dear ${userName},
    
    Thank you for your order! Your order has been successfully placed.
    
    Order Details:
    - Order Number: ${orderNumber}
    - Total Amount: $${orderDetails.total.toFixed(2)}
    - Order Date: ${new Date().toLocaleDateString()}
    
    We will notify you when your order is ready for pickup or delivery.
    
    Thank you for choosing our service!
  `

  logEmail('Order Confirmation', userEmail, subject, content)
}

export const sendOrderStatusUpdateEmail = async (
  userEmail: string,
  userName: string,
  orderNumber: string,
  status: string,
  trackingNumber?: string
) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being processed.',
    processing: 'Your order is being prepared for pickup/delivery.',
    shipped: 'Your order has been shipped and is on its way.',
    delivered: 'Your order has been delivered successfully!',
    picked: 'Your order is ready for pickup.',
  }

  const subject = `Order Update - ${orderNumber}`
  const content = `
    Dear ${userName},
    
    ${statusMessages[status as keyof typeof statusMessages] || 'Your order status has been updated.'}
    
    Order Details:
    - Order Number: ${orderNumber}
    - New Status: ${status.toUpperCase()}
    ${trackingNumber ? `- Tracking Number: ${trackingNumber}` : ''}
    
    Thank you for your patience!
  `

  logEmail('Order Status Update', userEmail, subject, content)
}

export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const subject = 'Welcome to Home Decor!'
  const content = `
    Dear ${userName},
    
    Thank you for registering with us! We're excited to have you as part of our community.
    
    You can now:
    - Browse our beautiful home decoration products
    - Place orders and track their status
    - Receive notifications about your orders
    - Manage your profile and preferences
    
    If you have any questions, feel free to contact our support team.
    
    Happy shopping!
  `

  logEmail('Welcome', userEmail, subject, content)
}
