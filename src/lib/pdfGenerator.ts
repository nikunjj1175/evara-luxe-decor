import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface InvoiceData {
  orderNumber: string
  orderDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentMethod: string
  status: string
}

export const generateInvoicePDF = (data: InvoiceData): jsPDF => {
  const doc = new jsPDF()
  
  // Add company logo/header
  doc.setFontSize(24)
  doc.setTextColor(75, 85, 99)
  doc.text('Home Decor', 20, 30)
  
  doc.setFontSize(12)
  doc.setTextColor(107, 114, 128)
  doc.text('Beautiful Home Decoration Items', 20, 40)
  doc.text('123 Decor Street, Design City, DC 12345', 20, 50)
  doc.text('Phone: +1 (555) 123-4567 | Email: info@homedecor.com', 20, 60)
  
  // Invoice title
  doc.setFontSize(20)
  doc.setTextColor(31, 41, 55)
  doc.text('INVOICE', 150, 30)
  
  // Invoice details
  doc.setFontSize(10)
  doc.setTextColor(75, 85, 99)
  doc.text('Invoice Number:', 150, 45)
  doc.setTextColor(31, 41, 55)
  doc.text(data.orderNumber, 150, 52)
  
  doc.setTextColor(75, 85, 99)
  doc.text('Date:', 150, 62)
  doc.setTextColor(31, 41, 55)
  doc.text(data.orderDate, 150, 69)
  
  doc.setTextColor(75, 85, 99)
  doc.text('Status:', 150, 79)
  doc.setTextColor(31, 41, 55)
  doc.text(data.status.toUpperCase(), 150, 86)
  
  // Customer information
  doc.setFontSize(14)
  doc.setTextColor(31, 41, 55)
  doc.text('Bill To:', 20, 90)
  
  doc.setFontSize(10)
  doc.text(data.customerName, 20, 100)
  doc.text(data.shippingAddress.address, 20, 107)
  doc.text(`${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}`, 20, 114)
  doc.text(data.shippingAddress.country, 20, 121)
  doc.text(`Email: ${data.customerEmail}`, 20, 128)
  doc.text(`Phone: ${data.customerPhone}`, 20, 135)
  
  // Items table
  const tableBody = data.items.map(item => [
    item.name,
    item.quantity.toString(),
    `$${item.price.toFixed(2)}`,
    `$${item.total.toFixed(2)}`
  ])

  // Add summary rows
  tableBody.push(['', '', 'Subtotal:', `$${data.subtotal.toFixed(2)}`])
  tableBody.push(['', '', 'Tax:', `$${data.tax.toFixed(2)}`])
  tableBody.push(['', '', 'Shipping:', `$${data.shipping.toFixed(2)}`])
  tableBody.push(['', '', 'Total:', `$${data.total.toFixed(2)}`])

  autoTable(doc, {
    startY: 150,
    head: [['Item', 'Qty', 'Price', 'Total']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [75, 85, 99],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    styles: {
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    }
  })
  
  // Payment information
  const finalY = (doc as any).lastAutoTable.finalY + 20
  doc.setFontSize(12)
  doc.setTextColor(31, 41, 55)
  doc.text('Payment Information:', 20, finalY)
  
  doc.setFontSize(10)
  doc.setTextColor(75, 85, 99)
  doc.text(`Payment Method: ${data.paymentMethod.toUpperCase()}`, 20, finalY + 10)
  doc.text(`Order Status: ${data.status.toUpperCase()}`, 20, finalY + 17)
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('Thank you for your business!', 20, finalY + 40)
  doc.text('For any questions, please contact us at support@homedecor.com', 20, finalY + 47)
  
  return doc
}
