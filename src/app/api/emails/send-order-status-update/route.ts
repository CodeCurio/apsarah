import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderOrderShippedEmailHtml, renderOrderPackedEmailHtml } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set. Status update email skipped.')
      return NextResponse.json({ success: false, message: 'RESEND_API_KEY missing' }, { status: 200 })
    }

    const body = await request.json()
    const {
      orderNumber,
      customerName,
      customerEmail,
      status, // 'processing' | 'shipped' | 'delivered'
      carrier,
      trackingNumber,
      trackingUrl,
      shippingAddress,
      note,
    } = body

    if (!orderNumber || !customerEmail) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 })
    }

    const resend = new Resend(apiKey)
    const fromSender = process.env.RESEND_FROM_EMAIL || 'Apsarah <contact@apsarah.in>'

    let html = ''
    let subject = ''

    if (status === 'shipped') {
      subject = `Your Order #${orderNumber} Has Shipped! 🚚 | Apsarah`
      html = renderOrderShippedEmailHtml({
        orderNumber,
        customerName: customerName || 'Valued Customer',
        carrier: carrier || 'Standard Express',
        trackingNumber: trackingNumber || 'N/A',
        trackingUrl,
        shippingAddress: shippingAddress || {},
      })
    } else {
      subject = `Order #${orderNumber} Update: Packed & Processing 🎁 | Apsarah`
      html = renderOrderPackedEmailHtml({
        orderNumber,
        customerName: customerName || 'Valued Customer',
        note,
      })
    }

    const result = await resend.emails.send({
      from: fromSender,
      to: customerEmail,
      subject,
      html,
    })

    return NextResponse.json({ success: true, emailId: result.data?.id })
  } catch (err: any) {
    console.error('Failed to send status update email via Resend:', err)
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 })
  }
}
